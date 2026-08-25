import { NextRequest, NextResponse } from 'next/server'
import { generateMarkdownForPath } from '@/lib/markdown-generator'
import { isHtmlAcceptable } from '@/lib/content-negotiation'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || '/'
  const acceptHeader = request.headers.get('accept')

  try {
    const markdown = await generateMarkdownForPath(path)

    if (markdown) {
      return new Response(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Vary': 'Accept',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
      })
    }

    // If path has no markdown representation:
    if (!isHtmlAcceptable(acceptHeader)) {
      return new Response('406 Not Acceptable: This resource cannot be served as markdown.', {
        status: 406,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Vary': 'Accept',
        },
      })
    }

    return new Response('404 Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Vary': 'Accept',
      },
    })
  } catch (error: any) {
    console.error(`[api/markdown] Error generating markdown for path ${path}:`, error)
    return new Response('500 Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Vary': 'Accept',
      },
    })
  }
}
