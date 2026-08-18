'use server'

import { createAdminClient } from '@/lib/supabase/server'

export type UploadImageResult =
  | { success: true; url: string }
  | { success: false; error: string }

/**
 * Uploads a single image file to Supabase Storage and returns the public URL.
 *
 * @param bucket  - Storage bucket name (must already exist with public read policy).
 * @param path    - Object path within the bucket, e.g. "destinations/pokhara-hero.jpg".
 * @param base64  - Base64-encoded file content (data URI format: "data:image/jpeg;base64,...").
 * @param mimeType - MIME type of the file.
 */
export async function uploadImageToStorage(
  bucket: string,
  path: string,
  base64: string,
  mimeType: string
): Promise<UploadImageResult> {
  try {
    // Strip the data URI prefix to get raw base64.
    const base64Data = base64.replace(/^data:[^;]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    const supabase = await createAdminClient()

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: mimeType,
        upsert: true, // Overwrite if same path exists (re-upload same file).
      })

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)

    return { success: true, url: data.publicUrl }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown upload error'
    return { success: false, error: message }
  }
}
