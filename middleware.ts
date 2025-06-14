import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

export default async function middleware(request: NextRequestWithAuth) {
  // Izinkan request ke NextAuth
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth/login") || 
                    request.nextUrl.pathname.startsWith("/auth/register");

  if (isAuthPage) {
    if (token) {
      // Redirect berdasarkan role
      if (token.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (token.role === "santri") {
        return NextResponse.redirect(new URL("/santri/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/auth/login?from=${encodeURIComponent(from)}`, request.url)
    );
  }

  // Cek akses berdasarkan role
  if (request.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/santri") && token.role !== "santri") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Izinkan akses ke halaman yang diminta jika sudah terautentikasi
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/santri/:path*",
    "/api/:path*",
    "/auth/:path*",
  ],
}; 