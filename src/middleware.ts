import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth"; // Đảm bảo đường dẫn đúng

export const middleware = async (request: NextRequest) => {
  const url = request.nextUrl;

  // CRITICAL: Bypass API routes và static files
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Optional: Redirect /dashboard từ main domain về vendor path
  if (url.pathname === "/dashboard") {
    const session = await auth();
    if (session?.user?.role === "VENDOR" && session?.user?.username) {
      return NextResponse.redirect(
        new URL(
          `/vendor/${session.user.username.toLowerCase()}/dashboard`,
          request.url
        )
      );
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ auth routes (để next-auth hoạt động)
     * 2. _next (system files)
     * 3. static files (images, fonts, ico)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
