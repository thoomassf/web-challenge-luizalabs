import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  const currentUrl = request.nextUrl.pathname

  if (currentUrl === '/entrar' && token) {
    const productsUrl = request.nextUrl.clone()
    productsUrl.pathname = '/produtos'
    return NextResponse.redirect(productsUrl)
  }

  if (!token && currentUrl.startsWith('/produtos')) {
    const url = request.nextUrl.clone()
    url.pathname = '/entrar'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/produtos/:path*', '/entrar', '/cadastre-se'],
}