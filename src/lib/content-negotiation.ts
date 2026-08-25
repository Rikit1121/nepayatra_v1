// RFC 7231 / RFC 9110 Content Negotiation helper for Accept headers.
// Safe and deterministic: defaults to HTML for standard browsers and wildcards.

export interface MediaTypeQuality {
  type: string
  subType: string
  q: number
}

// Parse an HTTP Accept header into sorted media types by quality factor (q).
export function parseAcceptHeader(acceptHeader: string | null): MediaTypeQuality[] {
  if (!acceptHeader || !acceptHeader.trim()) {
    return [{ type: '*', subType: '*', q: 1.0 }]
  }

  return acceptHeader
    .split(',')
    .map((item) => {
      const parts = item.trim().split(';')
      const mime = (parts[0] || '').trim().toLowerCase()
      const [type = '*', subType = '*'] = mime.split('/')
      let q = 1.0

      for (let i = 1; i < parts.length; i++) {
        const param = parts[i].trim().toLowerCase()
        if (param.startsWith('q=')) {
          const parsed = parseFloat(param.slice(2))
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            q = parsed
          }
        }
      }

      return { type, subType, q }
    })
    .filter((m) => m.q > 0)
    .sort((a, b) => b.q - a.q)
}

// Get the resolved quality value (q) for a target MIME type against parsed Accept rules.
export function getQualityForType(accepts: MediaTypeQuality[], mimeType: string): number {
  const [targetType, targetSubType] = mimeType.toLowerCase().split('/')

  // 1. Exact match (e.g. text/markdown)
  for (const a of accepts) {
    if (a.type === targetType && a.subType === targetSubType) {
      return a.q
    }
  }

  // 2. Subtype wildcard (e.g. text/*)
  for (const a of accepts) {
    if (a.type === targetType && a.subType === '*') {
      return a.q
    }
  }

  // 3. Full wildcard (*/*)
  for (const a of accepts) {
    if (a.type === '*' && a.subType === '*') {
      return a.q
    }
  }

  return 0
}

// Returns true only when text/markdown is explicitly requested and has a
// higher quality than text/html (or text/html is not accepted).
// Standard browsers sending text/html,application/xhtml+xml,... will evaluate to false.
export function shouldServeMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader || !acceptHeader.trim()) return false

  const parsed = parseAcceptHeader(acceptHeader)
  const markdownQ = getQualityForType(parsed, 'text/markdown')
  const htmlQ = getQualityForType(parsed, 'text/html')

  if (markdownQ <= 0) return false

  // If markdown quality is strictly greater than HTML quality:
  if (markdownQ > htmlQ) return true

  // If both have equal q, check if markdown was explicitly stated while html is only via wildcard:
  const hasExplicitMarkdown = parsed.some(
    (p) => p.type === 'text' && p.subType === 'markdown' && p.q > 0
  )
  const hasExplicitHtml = parsed.some(
    (p) => (p.type === 'text' && p.subType === 'html') && p.q > 0
  )

  if (hasExplicitMarkdown && !hasExplicitHtml && markdownQ >= htmlQ) {
    return true
  }

  return false
}

// Check if text/html is acceptable to the client (q > 0).
export function isHtmlAcceptable(acceptHeader: string | null): boolean {
  if (!acceptHeader || !acceptHeader.trim()) return true
  const parsed = parseAcceptHeader(acceptHeader)
  return getQualityForType(parsed, 'text/html') > 0
}
