/**
 * Automated Verification Suite for NepaYatra Agent Readiness & Machine-Readable Web
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

async function runTests() {
  console.log(`\n🚀 Starting Comprehensive Agent Readiness & Content Negotiation Test Suite against: ${BASE_URL}\n`)
  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`)
      passed++
    } else {
      console.error(`  ❌ FAIL: ${message}`)
      failed++
    }
  }

  // TEST A & C: Existing valid page → 200 HTML
  console.log('\n--- Test Group 1: Browser HTML Requests ---')
  {
    const res = await fetch(`${BASE_URL}/`, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    })
    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()
    assert(res.status === 200, `Homepage returns HTTP 200 (Got ${res.status})`)
    assert(contentType.includes('text/html'), `Homepage returns text/html (Got ${contentType})`)
    assert(body.includes('<h1'), 'Homepage contains server-rendered <h1>')
    assert(body.includes('Trip Planner'), 'Homepage contains Navigation links')
  }

  // TEST B: Nonexistent page → 404
  console.log('\n--- Test Group 2: Agent-Friendly 404 Recovery ---')
  {
    const res = await fetch(`${BASE_URL}/a-route-that-does-not-exist`)
    const body = await res.text()
    assert(res.status === 404, `Nonexistent route returns HTTP 404 (Got ${res.status})`)
    assert(body.includes('404'), '404 page indicates 404')
    assert(body.includes('Popular Sections to Explore') || body.includes('Trip Planner'), '404 page contains recovery links')
    assert(body.includes('/destinations') && body.includes('/calendar'), '404 page links to Destinations and Calendar')
  }

  // TEST D & E: Markdown request → text/markdown and Vary: Accept
  console.log('\n--- Test Group 3: Accept: text/markdown Content Negotiation Across Core Routes ---')
  {
    const res = await fetch(`${BASE_URL}/`, {
      headers: { Accept: 'text/markdown' },
    })
    const contentType = res.headers.get('content-type') || ''
    const vary = res.headers.get('vary') || ''
    const body = await res.text()
    assert(res.status === 200, `Homepage with Accept: text/markdown returns HTTP 200 (Got ${res.status})`)
    assert(contentType.includes('text/markdown'), `Returns Content-Type: text/markdown (Got ${contentType})`)
    assert(vary.toLowerCase().includes('accept'), `Returns Vary: Accept header (Got ${vary})`)
    assert(body.startsWith('# NepaYatra'), 'Returns clean semantic markdown content')
    assert(!body.includes('<html'), 'Does not return HTML layout shell')
  }

  // TEST Destination Markdown
  {
    const res = await fetch(`${BASE_URL}/destinations`, {
      headers: { Accept: 'text/markdown' },
    })
    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()
    assert(res.status === 200, `/destinations with Accept: text/markdown returns 200`)
    assert(contentType.includes('text/markdown'), `/destinations returns Content-Type: text/markdown`)
    assert(body.includes('# Destinations in Nepal'), '/destinations markdown contains title')
  }

  // TEST Destination Detail Markdown
  {
    const res = await fetch(`${BASE_URL}/destinations/kathmandu`, {
      headers: { Accept: 'text/markdown' },
    })
    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()
    assert(res.status === 200, `/destinations/kathmandu with Accept: text/markdown returns 200`)
    assert(contentType.includes('text/markdown'), `/destinations/kathmandu returns text/markdown`)
    assert(body.includes('# Kathmandu'), '/destinations/kathmandu markdown contains destination details')
  }

  // TEST Border Crossings Markdown
  {
    const res = await fetch(`${BASE_URL}/border-crossings`, {
      headers: { Accept: 'text/markdown' },
    })
    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()
    assert(res.status === 200, `/border-crossings with Accept: text/markdown returns 200`)
    assert(contentType.includes('text/markdown'), `/border-crossings returns text/markdown`)
    assert(body.includes('India–Nepal Border Crossings'), '/border-crossings markdown contains heading')
  }

  // TEST Border Crossing Detail Markdown
  {
    const res = await fetch(`${BASE_URL}/border-crossings/raxaul-birgunj`, {
      headers: { Accept: 'text/markdown' },
    })
    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()
    assert(res.status === 200, `/border-crossings/raxaul-birgunj with Accept: text/markdown returns 200`)
    assert(contentType.includes('text/markdown'), `/border-crossings/raxaul-birgunj returns text/markdown`)
    assert(body.includes('Raxaul'), '/border-crossings/raxaul-birgunj markdown contains border info')
  }

  // TEST Calendar Markdown
  {
    const res = await fetch(`${BASE_URL}/calendar`, {
      headers: { Accept: 'text/markdown' },
    })
    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()
    assert(res.status === 200, `/calendar with Accept: text/markdown returns 200`)
    assert(contentType.includes('text/markdown'), `/calendar returns text/markdown`)
    assert(body.includes('# Nepal Travel & Festival Calendar'), '/calendar markdown contains calendar info')
  }

  // TEST Travel Guides Markdown
  {
    const res = await fetch(`${BASE_URL}/guides`, {
      headers: { Accept: 'text/markdown' },
    })
    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()
    assert(res.status === 200, `/guides with Accept: text/markdown returns 200`)
    assert(contentType.includes('text/markdown'), `/guides returns text/markdown`)
    assert(body.includes('# Nepal Travel Guides'), '/guides markdown contains guide list')
  }

  // TEST Knowledge Base Markdown
  {
    const res = await fetch(`${BASE_URL}/knowledge-base`, {
      headers: { Accept: 'text/markdown' },
    })
    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()
    assert(res.status === 200, `/knowledge-base with Accept: text/markdown returns 200`)
    assert(contentType.includes('text/markdown'), `/knowledge-base returns text/markdown`)
    assert(body.includes('# NepaYatra Knowledge Base'), '/knowledge-base markdown contains KB hub')
  }

  // TEST Packages Markdown
  {
    const res = await fetch(`${BASE_URL}/packages`, {
      headers: { Accept: 'text/markdown' },
    })
    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()
    assert(res.status === 200, `/packages with Accept: text/markdown returns 200`)
    assert(contentType.includes('text/markdown'), `/packages returns text/markdown`)
    assert(body.includes('Suggested Nepal Trip Circuits'), '/packages markdown contains packages')
  }

  // TEST FAQ Markdown
  {
    const res = await fetch(`${BASE_URL}/faq`, {
      headers: { Accept: 'text/markdown' },
    })
    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()
    assert(res.status === 200, `/faq with Accept: text/markdown returns 200`)
    assert(contentType.includes('text/markdown'), `/faq returns text/markdown`)
    assert(body.includes('Frequently Asked Questions'), '/faq markdown contains FAQ list')
  }

  // TEST N: Quality Values (q) Evaluation
  console.log('\n--- Test Group 4: Accept Quality Factors (q) ---')
  {
    // Preferred Markdown: Accept: text/markdown, text/html;q=0.8
    const res = await fetch(`${BASE_URL}/`, {
      headers: {
        Accept: 'text/markdown, text/html;q=0.8',
      },
    })
    const contentType = res.headers.get('content-type') || ''
    assert(contentType.includes('text/markdown'), `Accept: text/markdown, text/html;q=0.8 returns markdown (Got ${contentType})`)
  }
  {
    // Preferred HTML: Accept: text/html, text/markdown;q=0.5
    const res = await fetch(`${BASE_URL}/`, {
      headers: {
        Accept: 'text/html, text/markdown;q=0.5',
      },
    })
    const contentType = res.headers.get('content-type') || ''
    assert(contentType.includes('text/html'), `Accept: text/html, text/markdown;q=0.5 returns text/html (Got ${contentType})`)
  }

  // TEST H: /llms.txt
  console.log('\n--- Test Group 5: /llms.txt Guidance File ---')
  {
    const res = await fetch(`${BASE_URL}/llms.txt`)
    const body = await res.text()
    assert(res.status === 200, `/llms.txt returns HTTP 200 (Got ${res.status})`)
    assert(body.includes('# NepaYatra'), '/llms.txt contains # NepaYatra')
    assert(body.includes('When to Use NepaYatra'), '/llms.txt contains When to Use NepaYatra')
    assert(body.includes('How to Use the Site'), '/llms.txt contains How to Use the Site')
    assert(body.includes('Important Limitations'), '/llms.txt contains Important Limitations')
    assert(!body.includes('/admin'), '/llms.txt does not expose admin paths')
  }

  // TEST I: Organization JSON-LD
  console.log('\n--- Test Group 6: Organization JSON-LD & Structured Data ---')
  {
    const res = await fetch(`${BASE_URL}/`)
    const html = await res.text()
    const scriptMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []
    assert(scriptMatches.length > 0, 'Homepage contains application/ld+json scripts')

    let orgFound = false
    for (const tag of scriptMatches) {
      try {
        const jsonText = tag.replace(/<\/?script[^>]*>/g, '')
        const data = JSON.parse(jsonText)
        const items = Array.isArray(data) ? data : [data]
        for (const item of items) {
          if (item['@type'] === 'Organization') {
            orgFound = true
            assert(item.name === 'NepaYatra', 'Organization name is NepaYatra')
            assert(item.url === 'https://nepayatra.com', 'Organization url is https://nepayatra.com')
            assert(Boolean(item.logo), `Organization schema contains logo: ${item.logo}`)
          }
        }
      } catch (e) {
        console.error('JSON parse error in JSON-LD', e)
      }
    }
    assert(orgFound, 'Organization schema discovered in HTML')
  }

  // TEST J & K: robots.txt and sitemap.xml
  console.log('\n--- Test Group 7: Robots and Sitemap ---')
  {
    const res = await fetch(`${BASE_URL}/robots.txt`)
    const body = await res.text()
    assert(res.status === 200, `/robots.txt returns HTTP 200 (Got ${res.status})`)
    assert(body.includes('User-Agent: *') || body.includes('user-agent: *'), '/robots.txt allows crawlers')
    assert(body.includes('sitemap.xml'), '/robots.txt links to sitemap.xml')
  }
  {
    const res = await fetch(`${BASE_URL}/sitemap.xml`)
    const body = await res.text()
    assert(res.status === 200, `/sitemap.xml returns HTTP 200 (Got ${res.status})`)
    assert(body.includes('<urlset') || body.includes('urlset'), '/sitemap.xml contains valid XML urlset')
    assert(body.includes('/destinations'), '/sitemap.xml lists destinations')
  }

  // TEST M: Admin Authentication Protection
  console.log('\n--- Test Group 8: Admin Authentication Protection ---')
  {
    const res = await fetch(`${BASE_URL}/admin`, { redirect: 'manual' })
    assert(res.status === 307 || res.status === 302 || res.status === 308, `/admin redirects unauthenticated user (Status: ${res.status})`)
    const location = res.headers.get('location') || ''
    assert(location.includes('/admin/login'), `/admin redirects to /admin/login (Location: ${location})`)
  }
  {
    const res = await fetch(`${BASE_URL}/admin/destinations`, { redirect: 'manual' })
    assert(res.status === 307 || res.status === 302 || res.status === 308, `/admin/destinations redirects unauthenticated user (Status: ${res.status})`)
  }

  console.log(`\n========================================`)
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`)
  console.log(`========================================\n`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Fatal error during test run:', err)
  process.exit(1)
})
