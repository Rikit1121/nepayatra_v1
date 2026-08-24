/**
 * Cryptographically secure, unguessable share ID generator for trips.
 * Uses an unambiguous base54 character set (no 0/O, 1/l/I) to ensure URLs are
 * clean, readable, and collision-resistant.
 */
export function generateShareId(length = 10): string {
  const chars = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ'
  const bytes = new Uint8Array(length)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    // Fallback if web crypto is somehow not present
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length]
  }
  return result
}
