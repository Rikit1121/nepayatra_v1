import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { shouldServeMarkdown } from '@/lib/content-negotiation'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Content Negotiation for Agent / Crawler requests with Accept: text/markdown
  // NEVER intercept Next.js RSC requests, internal APIs, assets, or admin routes.
  const isRscRequest =
    request.headers.get('rsc') === '1' ||
    request.headers.has('next-router-state-tree') ||
    request.headers.has('next-action')

  if (
    request.method === 'GET' &&
    !isRscRequest &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/_next') &&
    !pathname.includes('.')
  ) {
    const acceptHeader = request.headers.get('accept')
    if (shouldServeMarkdown(acceptHeader)) {
      const markdownUrl = new URL(
        `/api/markdown?path=${encodeURIComponent(pathname)}`,
        request.url
      )
      const res = await fetch(markdownUrl.toString(), {
        headers: {
          accept: acceptHeader || 'text/markdown',
        },
      })
      const text = await res.text()
      return new NextResponse(text, {
        status: res.status,
        headers: {
          'Content-Type': res.headers.get('content-type') || 'text/markdown; charset=utf-8',
          'Vary': 'Accept',
          'Cache-Control':
            res.headers.get('cache-control') ||
            'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
      })
    }
  }

  // 2. Admin Authentication Handling (Only runs for /admin routes)
  if (pathname.startsWith('/admin')) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // /admin root — send to login or dashboard based on session
    if (pathname === '/admin') {
      const target = request.nextUrl.clone()
      target.pathname = user ? '/admin/dashboard' : '/admin/login'
      target.search = ''
      return NextResponse.redirect(target)
    }

    // Protect all /admin routes except /admin/login
    if (pathname !== '/admin/login') {
      if (!user) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/admin/login'
        loginUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // Redirect authenticated users away from login
    if (pathname === '/admin/login' && user) {
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = '/admin/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }

    return supabaseResponse
  }

  // Standard public requests proceed without modification
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin',
    '/',
    '/destinations/:path*',
    '/destinations',
    '/border-crossings/:path*',
    '/border-crossings',
    '/calendar/:path*',
    '/calendar',
    '/guides/:path*',
    '/guides',
    '/knowledge-base/:path*',
    '/knowledge-base',
    '/packages/:path*',
    '/packages',
    '/faq',
    '/about',
    '/contact',
    '/privacy',
    '/route-planner',
  ],
}
