import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  const protectedPaths = ['/produtos']
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/entrar', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/produtos/:path*', '/entrar', '/cadastre-se'],
}