import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = await getToken({ req });
    const path = req.nextUrl.pathname;

    // Not logged in → redirect
    if (!token && path.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Admin protect
    if (path.startsWith('/dashboard/admin') && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Vendor protect
    if (path.startsWith('/dashboard/vendor') && token.role !== 'vendor') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
