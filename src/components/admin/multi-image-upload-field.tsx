'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Upload,
  X,
  ImageIcon,
  Loader2,
  Star,
  ArrowUp,
  ArrowDown,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { uploadImageToStorage } from '@/lib/actions/upload'
import { cn } from '@/lib/utils'
import type { AccommodationImageFormValue } from '@/lib/validations/admin'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const MAX_IMAGES_COUNT = 10

interface MultiImageUploadFieldProps {
  /** Field name for images array in react-hook-form (default: 'images') */
  fieldName?: string
  /** Field name for primary image_url to keep in sync (default: 'image_url') */
  primaryUrlFieldName?: string
  /** Supabase Storage bucket */
  bucket?: string
  label?: string
  description?: string
  pathPrefix?: string
}

export function MultiImageUploadField({
  fieldName = 'images',
  primaryUrlFieldName = 'image_url',
  bucket = 'site-assets',
  label = 'Accommodation Photos (Gallery)',
  description = 'Upload up to 10 photos (JPG, PNG, WebP ≤ 5MB). Designate one as Primary for listings.',
  pathPrefix = 'accommodations/',
}: MultiImageUploadFieldProps) {
  const { setValue, watch } = useFormContext()
  const images: AccommodationImageFormValue[] = watch(fieldName) ?? []

  const [uploading, setUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [manualUrl, setManualUrl] = React.useState('')
  const [manualCaption, setManualCaption] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Sync primary image_url whenever images change
  const syncPrimaryImageUrl = React.useCallback(
    (currentImages: AccommodationImageFormValue[]) => {
      if (currentImages.length === 0) {
        setValue(primaryUrlFieldName, '', { shouldDirty: true })
        return
      }
      const primary = currentImages.find((img) => img.is_primary) ?? currentImages[0]
      setValue(primaryUrlFieldName, primary.url, { shouldDirty: true })
    },
    [setValue, primaryUrlFieldName]
  )

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }))
    setValue(fieldName, updated, { shouldDirty: true, shouldValidate: true })
    syncPrimaryImageUrl(updated)
  }

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    // If we removed the primary image and have remaining images, make first one primary
    if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
      updated[0].is_primary = true
    }
    // Re-index sort orders
    const reordered = updated.map((img, i) => ({ ...img, sort_order: i }))
    setValue(fieldName, reordered, { shouldDirty: true, shouldValidate: true })
    syncPrimaryImageUrl(reordered)
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= images.length) return

    const updated = [...images]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    const reordered = updated.map((img, i) => ({ ...img, sort_order: i }))
    setValue(fieldName, reordered, { shouldDirty: true, shouldValidate: true })
    syncPrimaryImageUrl(reordered)
  }

  const handleCaptionChange = (index: number, caption: string) => {
    const updated = images.map((img, i) =>
      i === index ? { ...img, caption } : img
    )
    setValue(fieldName, updated, { shouldDirty: true })
  }

  const handleAddManualUrl = () => {
    const trimmed = manualUrl.trim()
    if (!trimmed) return

    if (images.length >= MAX_IMAGES_COUNT) {
      toast.error(`Maximum of ${MAX_IMAGES_COUNT} images reached.`)
      return
    }

    const isFirst = images.length === 0
    const newImage: AccommodationImageFormValue = {
      url: trimmed,
      caption: manualCaption.trim() || undefined,
      sort_order: images.length,
      is_primary: isFirst,
    }

    const updated = [...images, newImage]
    setValue(fieldName, updated, { shouldDirty: true, shouldValidate: true })
    syncPrimaryImageUrl(updated)
    setManualUrl('')
    setManualCaption('')
    toast.success('Image URL added to gallery.')
  }

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    if (images.length + files.length > MAX_IMAGES_COUNT) {
      toast.error(
        `Cannot add ${files.length} images. Gallery limit is ${MAX_IMAGES_COUNT} photos (currently has ${images.length}).`
      )
      return
    }

    // Validate files
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported format. Only JPG, PNG, WebP allowed.`)
        return
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(
          `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB (exceeds 5 MB limit).`
        )
        return
      }
    }

    setUploading(true)
    setUploadProgress(10)

    const newlyUploaded: AccommodationImageFormValue[] = []
    let completed = 0

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
        const path = `${pathPrefix}${Date.now()}-${safeName}`
        const res = await uploadImageToStorage(bucket, path, base64, file.type)

        if (res.success) {
          const isPrimary = images.length === 0 && newlyUploaded.length === 0
          newlyUploaded.push({
            url: res.url,
            caption: undefined,
            sort_order: images.length + newlyUploaded.length,
            is_primary: isPrimary,
          })
        } else {
          toast.error(`Failed to upload ${file.name}: ${res.error}`)
        }

        completed++
        setUploadProgress(10 + Math.round((completed / files.length) * 85))
      }

      if (newlyUploaded.length > 0) {
        const updated = [...images, ...newlyUploaded]
        setValue(fieldName, updated, { shouldDirty: true, shouldValidate: true })
        syncPrimaryImageUrl(updated)
        toast.success(`Added ${newlyUploaded.length} photo(s) to gallery.`)
      }
    } catch (err) {
      toast.error('An error occurred while uploading photos.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {images.length} / {MAX_IMAGES_COUNT}
        </span>
      </div>

      {/* Image Gallery Grid */}
      {images.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {images.map((img, idx) => (
            <div
              key={`${img.url}-${idx}`}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all shadow-xs',
                img.is_primary ? 'border-primary ring-2 ring-primary/20' : 'border-border/60'
              )}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption || `Photo ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
                  }}
                />

                {/* Primary Tag */}
                {img.is_primary && (
                  <Badge className="absolute top-2 left-2 gap-1 bg-amber-500 text-white shadow-sm hover:bg-amber-600">
                    <Star className="h-3 w-3 fill-white" /> Primary
                  </Badge>
                )}

                {/* Overlay Action Toolbar */}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 p-2">
                  {!img.is_primary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 px-2 text-[11px] gap-1 bg-white/90 text-foreground hover:bg-white"
                      onClick={() => handleSetPrimary(idx)}
                      title="Set as featured / primary photo"
                    >
                      <Star className="h-3 w-3 text-amber-500" /> Primary
                    </Button>
                  )}

                  <div className="flex items-center rounded-md bg-black/60 p-0.5 text-white">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7 text-white"
                    onClick={() => handleRemove(idx)}
                    title="Remove photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Caption Input */}
              <div className="p-2 bg-muted/20 border-t border-border/40">
                <input
                  type="text"
                  value={img.caption ?? ''}
                  onChange={(e) => handleCaptionChange(idx, e.target.value)}
                  placeholder="Optional caption (e.g. Deluxe Room)"
                  className="w-full rounded border border-input bg-background px-2 py-1 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone & Manual Add */}
      {images.length < MAX_IMAGES_COUNT && (
        <div className="grid gap-3 sm:grid-cols-2">
          {/* File Upload Drop Zone */}
          <div
            className={cn(
              'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-colors',
              uploading
                ? 'border-primary/60 bg-primary/5'
                : 'border-muted-foreground/25 bg-muted/20 hover:border-primary/40 hover:bg-primary/5'
            )}
          >
            {uploading ? (
              <div className="space-y-2 py-2">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                <p className="text-xs font-medium">Uploading photos ({uploadProgress}%)</p>
                <div className="h-1.5 w-36 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 py-1">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold gap-1.5"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="h-3.5 w-3.5" /> Select Photos (Batch)
                  </Button>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    JPG, PNG, WebP up to 5MB each
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_TYPES.join(',')}
              className="hidden"
              onChange={handleFilesSelected}
              disabled={uploading}
            />
          </div>

          {/* Manual URL Input */}
          <div className="flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-3.5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Or add via direct Image URL:
              </label>
              <Input
                type="url"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://... or /images/hotel.jpg"
                className="h-8 text-xs font-mono"
              />
              <Input
                type="text"
                value={manualCaption}
                onChange={(e) => setManualCaption(e.target.value)}
                placeholder="Optional caption (e.g. Garden View)"
                className="h-8 text-xs"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddManualUrl}
              disabled={!manualUrl.trim()}
              className="mt-2.5 h-8 text-xs font-semibold gap-1 self-end"
            >
              <Plus className="h-3.5 w-3.5" /> Add Photo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
