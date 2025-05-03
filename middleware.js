import { NextResponse } from 'next/server'
import { decrypt } from './app/lib/session'
import { cookies } from 'next/headers'
 
const protectedRoutes = ['/dashboard','/api/products']

export default async function middleware(req) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if( session ){
    (await cookies()).set("username",session.userId,{
      httpOnly: false,
      expires: new Date(Date.now() + 60 * 60 * 1000),
      sameSite: 'lax'
    })
  }
  if( !session && protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) ){
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}