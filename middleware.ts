import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const path = request.nextUrl.pathname;
  
  // Jika pengguna sudah login dan mencoba mengakses halaman login atau register
  if (token && (path === "/" || path === "/register")) {
    // Redirect ke dashboard berdasarkan role
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard2", request.url));
    } else if (token.role === "user") {
      return NextResponse.redirect(new URL("/customers/home", request.url));
    }
  }
  
  return NextResponse.next();
}

// Konfigurasi path yang akan diproses oleh middleware
export const config = {
  matcher: ["/", "/register"]
};