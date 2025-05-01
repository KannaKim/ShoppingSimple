import { NextResponse } from 'next/server'
import { decrypt } from './app/lib/session'
import { cookies } from 'next/headers'
 
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
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}