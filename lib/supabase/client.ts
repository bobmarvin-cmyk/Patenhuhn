import { createBrowserClient } from '@supabase/ssr'

/**
 * Vercel env vars occasionally get pasted as a full /auth/v1 URL.
 * Supabase expects the project base URL only. Keep only scheme + host.
 */
function normalizeSupabaseUrl(value: string) {
  const trimmed = value.trim()
  try {
    const parsed = new URL(trimmed)
    return parsed.origin
  } catch {
    return trimmed.replace(/\/+$/, '').replace(/\/auth\/v1.*$/i, '')
  }
}

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!rawUrl || !anonKey) {
    throw new Error('Supabase environment variables are missing.')
  }

  return createBrowserClient(normalizeSupabaseUrl(rawUrl), anonKey)
}
