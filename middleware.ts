import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_CODES = process.env.NEXT_PUBLIC_ALLOWED_CODES?.split(',') || [];

// Add allowed file extensions
const ALLOWED_FILE_EXTENSIONS = ['.splat', '.glb', '.gltf', '.bin', '.jpg', '.png', '.svg'];

export function middleware(request: NextRequest) {
    const url = new URL(request.url);

    // Check if the request is for a static file
    const isStaticFile = ALLOWED_FILE_EXTENSIONS.some(ext => url.pathname.toLowerCase().endsWith(ext));

    // Allow static files to pass through without code check
    if (isStaticFile) {
        return NextResponse.next();
    }

    // For other routes, check the access code
    const code = url.searchParams.get('code');
    const hasAccess = code && ALLOWED_CODES.includes(code);

    if (!hasAccess) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all paths except specific ones
        '/((?!_next/static|_next/image|favicon.ico|unauthorized).*)',
    ],
};
