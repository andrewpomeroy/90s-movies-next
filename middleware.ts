// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // console.log(request)
    // if (request.nextUrl.pathname.startsWith('/')) {
    //     return NextResponse.rewrite(new URL('/about-2', request.url))
    // }
}