'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createPackageSchema,
  updatePackageSchema,
  type ActionResult,
  type CreatePackageFormValues,
  type UpdatePackageFormValues,
} from '@/lib/validations/admin'

export async function createPackage(
  input: CreatePackageFormValues
): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = createPackageSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('packages')
    .insert(parsed.data)
    .select('id, slug')
    .single()

  if (error) {
    if (error.code === '23505') {
      return {
        success: false,
        error: 'A package with this slug already exists.',
        fieldErrors: { slug: ['Slug already in use'] },
      }
    }
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('packages', 'max')
  revalidatePath('/admin/packages')
  revalidatePath(`/packages/${data.slug}`)
  revalidatePath('/')

  return { success: true, data, message: 'Package created.' }
}

export async function updatePackage(
  input: UpdatePackageFormValues
): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = updatePackageSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { id, ...fields } = parsed.data
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('packages')
    .update(fields)
    .eq('id', id)
    .select('id, slug')
    .single()

  if (error) {
    if (error.code === '23505') {
      return {
        success: false,
        error: 'A package with this slug already exists.',
        fieldErrors: { slug: ['Slug already in use'] },
      }
    }
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('packages', 'max')
  revalidatePath('/admin/packages')
  revalidatePath(`/packages/${data.slug}`)
  revalidatePath('/')

  return { success: true, data, message: 'Package updated.' }
}

export async function deletePackage(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: 'ID is required.' }

  const supabase = await createServerClient()
  const { data: existing } = await supabase
    .from('packages')
    .select('slug')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('packages').delete().eq('id', id)

  if (error) return { success: false, error: `Failed to delete: ${error.message}` }

  revalidateTag('packages', 'max')
  revalidatePath('/admin/packages')
  if (existing?.slug) revalidatePath(`/packages/${existing.slug}`)
  revalidatePath('/')

  return { success: true, data: undefined, message: 'Package deleted.' }
}

export async function togglePackageFeatured(
  id: string,
  featured: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('packages').update({ featured }).eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidateTag('packages', 'max')
  revalidatePath('/admin/packages')
  revalidatePath('/')

  return { success: true, data: undefined }
}
