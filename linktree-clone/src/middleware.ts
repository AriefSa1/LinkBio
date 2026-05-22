import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const encodedKey = new TextEncoder().encode(process.env.AUTH_SECRET);

async function isValidSession(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const authed = await isValidSession(token);
  const { pathname } = req.nextUrl;

  // Halaman dashboard & admin butuh login
  if (
    (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) &&
    !authed
  ) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Kalau sudah login, jangan biarkan buka halaman login/register lagi
  if ((pathname === "/login" || pathname === "/register") && authed) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
