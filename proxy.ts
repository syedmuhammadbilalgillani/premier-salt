import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // /api/storage/* stays unprotected — it serves image bytes to the public
  // site. /api/auth/* is handled by NextAuth itself, not gated here.
  matcher: [
    "/admin/:path*",
    "/api/file-manager/:path*",
    "/api/category/:path*",
    "/api/product/:path*",
    "/api/blog/:path*",
    "/api/admin/:path*",
  ],
};
