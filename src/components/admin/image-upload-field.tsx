'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadImageToStorage } from '@/lib/actions/upload'
import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

interface ImageUploadFieldProps {
  /** react-hook-form field name that receives the final public URL */
  fieldName: string
  /** Supabase Storage bucket to upload into */
  bucket: string
  label: string
  description?: string
  /** Optional prefix for the storage path, e.g. "destinations/" */
  pathPrefix?: string
}

/**
 * Drop-in admin form field that combines:
 *  - A file picker (JPG/PNG/WebP, ≤5 MB)
 *  - Upload progress indicator
 *  - Image preview
 *  - Writes the resulting Supabase public URL into the form field
 *  - A manual URL override text input underneath
 */
export function ImageUploadField({
  fieldName,
  bucket,
  label,
  description,
  pathPrefix = '',
}: ImageUploadFieldProps) {
  const { setValue, watch } = useFormContext()
  const currentUrl: string = watch(fieldName) ?? ''

  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [previewSrc, setPreviewSrc] = React.useState<string | null>(
    currentUrl || null
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Keep preview in sync if the field URL is changed externally.
  React.useEffect(() => {
    if (currentUrl && !previewSrc) setPreviewSrc(currentUrl)
  }, [currentUrl, previewSrc])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP images are accepted.')
      return
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File too large — maximum is 5 MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)} MB.`)
      return
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreviewSrc(objectUrl)

    setUploading(true)
    setProgress(10)

    // Convert to base64 for the server action
    const reader = new FileReader()
    reader.onprogress = (evt) => {
      if (evt.lengthComputable) {
        setProgress(10 + Math.round((evt.loaded / evt.total) * 40))
      }
    }
    reader.onload = async () => {
      setProgress(55)
      const base64 = reader.result as string

      // Build a unique-ish path using timestamp + original filename
      const ext = file.name.split('.').pop() ?? 'jpg'
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
      const path = `${pathPrefix}${Date.now()}-${safeName}`

      const result = await uploadImageToStorage(bucket, path, base64, file.type)
      setProgress(95)

      if (result.success) {
        setValue(fieldName, result.url, { shouldDirty: true, shouldValidate: true })
        setPreviewSrc(result.url)
        setProgress(100)
        toast.success('Image uploaded successfully.')
      } else {
        toast.error(`Upload failed: ${result.error}`)
        setPreviewSrc(currentUrl || null)
      }

      setUploading(false)
      // Small delay so the 100% state is visible
      setTimeout(() => setProgress(0), 600)
    }
    reader.readAsDataURL(file)
  }

  function handleClear() {
    setPreviewSrc(null)
    setValue(fieldName, '', { shouldDirty: true })
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      {/* Drop zone / preview area */}
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border-2 border-dashed transition-colors',
          uploading
            ? 'border-primary/60 bg-primary/5'
            : previewSrc
              ? 'border-border bg-muted/30'
              : 'border-muted-foreground/25 bg-muted/30 hover:border-primary/40 hover:bg-primary/5'
        )}
      >
        {previewSrc ? (
          /* Preview */
          <div className="relative aspect-video w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={() => setPreviewSrc(null)}
            />
            {/* Overlay controls */}
            <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity hover:opacity-100">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-8 text-xs"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-8 text-xs"
                onClick={handleClear}
                disabled={uploading}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          /* Empty state */
          <button
            type="button"
            className="flex w-full cursor-pointer flex-col items-center gap-3 px-4 py-8 text-center"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium text-foreground">
                {uploading ? 'Uploading…' : 'Click to upload'}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                JPG, PNG, or WebP — max 5 MB
              </p>
            </div>
          </button>
        )}

        {/* Progress bar */}
        {uploading && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {/* Manual URL override */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          Or paste an image URL directly
        </label>
        <input
          type="url"
          value={currentUrl}
          onChange={(e) => {
            setValue(fieldName, e.target.value, { shouldDirty: true })
            if (e.target.value) setPreviewSrc(e.target.value)
            else setPreviewSrc(null)
          }}
          placeholder="https://… or /images/photo.jpg"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {description && (
          <p className="text-[0.8rem] text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
