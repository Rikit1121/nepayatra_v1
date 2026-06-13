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
    throw new Error(
      'Missing Supabase env vars: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
        'in .env.local (local) or your host dashboard (Vercel → Settings → Environment Variables). ' +
        'Both are required at build time for static page generation.'
    )
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: fetchWithTimeout,
    },
  })
}
