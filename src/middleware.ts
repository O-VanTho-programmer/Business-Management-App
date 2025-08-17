import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(new URL('/', req.url));

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL('/', req.url));
    res.cookies.delete('token');
    return res;
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
