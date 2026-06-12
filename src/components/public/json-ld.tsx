/** Renders a JSON-LD <script> tag. Server-safe. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe for ld+json embedding
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
