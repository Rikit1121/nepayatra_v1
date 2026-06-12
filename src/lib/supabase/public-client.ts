import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Cookieless Supabase client for PUBLIC, anon-readable content.
 *
 * Public pages rely on RLS (anon SELECT) and never need the visitor's session,
 * so this client avoids `cookies()`. That makes it safe to use at build time in
 * `generateStaticParams` / `generateMetadata` and in ISR revalidation, where no
 * request scope exists.
 */

/** Hard cap on any single request so an unreachable backend can't hang a render/build. */
const REQUEST_TIMEOUT_MS = 10000

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  // Respect any caller-provided abort signal in addition to our timeout.
  if (init?.signal) {
    init.signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  )
}

export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    // Surfaces a clear, actionable message instead of an opaque fetch error.
    console.error(
      '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Public data queries will fail until these are set in .env.local.'
    )
  }

  return createClient<Database>(url!, anonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: fetchWithTimeout,
    },
  })
}
