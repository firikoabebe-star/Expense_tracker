import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/sign-in', '/sign-up', '/forgot-password', '/post-login', '/about', '/services', '/pricing', '/developers', '/privacy', '/terms', '/help', '/contact', '/api/auth']

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  if (isPublic) {
    return NextResponse.next()
  }

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')

  try {
    const response = await fetch(
      new URL('/api/auth/get-session', request.url),
      { headers: { cookie: request.headers.get('cookie') || '' } }
    )
    const data = await response.json()
    if (data.session) {
      if (isAdminRoute && data.user?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return NextResponse.next()
    }
  } catch {
    // fall through to redirect
  }

  return NextResponse.redirect(new URL('/sign-in', request.url))
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
