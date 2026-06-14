/**
 * Admin Form Field Components
 * NepaYatra Admin CMS
 *
 * Reusable form building blocks that wrap shadcn/ui form primitives.
 * All components are designed for non-technical users:
 *  - Clear labels
 *  - Inline error messages
 *  - Helper text
 *  - Accessible (aria attributes)
 *
 * Usage with React Hook Form:
 *
 *   const form = useForm<CreateDestinationFormValues>({
 *     resolver: zodResolver(createDestinationSchema),
 *   })
 *
 *   <FormProvider {...form}>
 *     <TextField name="name" label="Destination Name" required />
 *     <TextareaField name="short_description" label="Short Description" />
 *     <SelectField name="category" label="Category" options={CATEGORY_OPTIONS} />
 *   </FormProvider>
 */

'use client'

import * as React from 'react'
import { useFormContext, type FieldValues, type Path } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ─────────────────────────────────────────────────────────────
// Shared prop shape
// ─────────────────────────────────────────────────────────────

interface BaseFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

// ─────────────────────────────────────────────────────────────
// TextField
// ─────────────────────────────────────────────────────────────

interface TextFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string
  type?: 'text' | 'email' | 'url' | 'tel' | 'number' | 'datetime-local'
}

export function TextField<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  className,
}: TextFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value ?? ''}
              onChange={(e) => {
                if (type === 'number') {
                  field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)
                } else {
                  field.onChange(e.target.value)
                }
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// TextareaField
// ─────────────────────────────────────────────────────────────

interface TextareaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string
  rows?: number
}

export function TextareaField<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  className,
}: TextareaFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value ?? ''}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// SelectField
// ─────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string
  value: string
}

interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: SelectOption[]
  placeholder?: string
}

export function SelectField<T extends FieldValues>({
  name,
  label,
  description,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  className,
}: SelectFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// SwitchField — for boolean toggles (featured, active, etc.)
// ─────────────────────────────────────────────────────────────

export function SwitchField<T extends FieldValues>({
  name,
  label,
  description,
  disabled = false,
  className,
}: BaseFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex flex-row items-center justify-between rounded-lg border p-4 ${className ?? ''}`}>
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// TagInputField — for arrays like best_season, tags, highlights
// ─────────────────────────────────────────────────────────────

interface TagInputFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string
  /** Predefined options shown as clickable suggestions */
  suggestions?: string[]
  /** Max number of tags allowed */
  maxTags?: number
}

export function TagInputField<T extends FieldValues>({
  name,
  label,
  description,
  placeholder = 'Type and press Enter',
  suggestions = [],
  maxTags,
  required = false,
  className,
}: TagInputFieldProps<T>) {
  const { control } = useFormContext<T>()
  const [inputValue, setInputValue] = React.useState('')

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const tags: string[] = field.value ?? []

        const addTag = (tag: string) => {
          const parts = tag
            .split(',')
            .map((part) => part.trim())
            .filter(Boolean)
          if (parts.length === 0) return

          const next = [...tags]
          for (const trimmed of parts) {
            if (next.includes(trimmed)) continue
            if (maxTags && next.length >= maxTags) break
            next.push(trimmed)
          }
          field.onChange(next)
          setInputValue('')
        }

        const removeTag = (tag: string) => {
          field.onChange(tags.filter((t) => t !== tag))
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag(inputValue)
          } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1])
          }
        }

        return (
          <FormItem className={className}>
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                {/* Tags display */}
                <div className="min-h-10 flex flex-wrap gap-1.5 rounded-md border px-3 py-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive ml-1 text-xs"
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      if (inputValue.trim()) addTag(inputValue)
                    }}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions
                      .filter((s) => !tags.includes(s))
                      .map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => addTag(s)}
                        >
                          + {s}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            </FormControl>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : (
              <FormDescription>Type a value and press Enter, or separate multiple with commas.</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// ListInputField — for arrays like highlights, includes, excludes
// Each item is a single line input with add/remove controls
// ─────────────────────────────────────────────────────────────

interface ListInputFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string
  addLabel?: string
}

export function ListInputField<T extends FieldValues>({
  name,
  label,
  description,
  placeholder = 'Add item...',
  addLabel = 'Add',
  required = false,
  className,
}: ListInputFieldProps<T>) {
  const { control } = useFormContext<T>()
  const [inputValue, setInputValue] = React.useState('')

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const items: string[] = field.value ?? []

        const addItem = () => {
          const trimmed = inputValue.trim()
          if (!trimmed) return
          field.onChange([...items, trimmed])
          setInputValue('')
        }

        const removeItem = (index: number) => {
          field.onChange(items.filter((_, i) => i !== index))
        }

        const updateItem = (index: number, value: string) => {
          const updated = [...items]
          updated[index] = value
          field.onChange(updated)
        }

        return (
          <FormItem className={className}>
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                {/* Existing items */}
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateItem(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      aria-label={`Remove item ${index + 1}`}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                {/* Add new item */}
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addItem()
                      }
                    }}
                    onBlur={() => {
                      if (inputValue.trim()) addItem()
                    }}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    {addLabel}
                  </Button>
                </div>
              </div>
            </FormControl>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : (
              <FormDescription>Press Enter or click Add after each item.</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// CoordinateField — latitude + longitude as a pair
// ─────────────────────────────────────────────────────────────

interface CoordinateFieldProps<T extends FieldValues> {
  latName: Path<T>
  lngName: Path<T>
  /** Optional altitude field rendered alongside the coordinates. */
  altName?: Path<T>
  label?: string
  description?: string
  required?: boolean
}

export function CoordinateField<T extends FieldValues>({
  latName,
  lngName,
  altName,
  label = 'Location',
  description = 'Enter the GPS coordinates. You can find these on Google Maps.',
  required = false,
}: CoordinateFieldProps<T>) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className={`grid gap-3 ${altName ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <TextField<T>
          name={latName}
          label="Latitude"
          type="number"
          placeholder="e.g. 27.7172"
        />
        <TextField<T>
          name={lngName}
          label="Longitude"
          type="number"
          placeholder="e.g. 85.3240"
        />
        {altName && (
          <TextField<T>
            name={altName}
            label="Altitude (m)"
            type="number"
            placeholder="e.g. 1400"
          />
        )}
      </div>
    </div>
  )
}
