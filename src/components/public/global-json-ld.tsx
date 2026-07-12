import { JsonLd } from '@/components/public/json-ld'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'

/** Site-wide structured data for every public page. */
export function GlobalJsonLd() {
  return <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
}
