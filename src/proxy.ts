import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { resolveProtectedRedirect } from "@/lib/auth/access";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const role = verifySessionToken(token)?.role ?? null;
  const redirectTarget = resolveProtectedRedirect(request.nextUrl.pathname, role);

  if (redirectTarget) {
    return NextResponse.redirect(new URL(redirectTarget, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/training/:path*",
    "/quizzes/:path*",
    "/assessment/:path*",
    "/results/:path*",
    "/manager/:path*",
    "/onboarding/sales-rep/:path*",
  ],
};
