import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshSession } from "./lib/api/clientApi";
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isPublicAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  let isAuthenticated = !!accessToken;

  if (!accessToken && refreshToken) {
    try {
      const newTokens = await refreshSession(refreshToken);

      if (newTokens && newTokens.accessToken) {
        isAuthenticated = true;
        response.cookies.set("accessToken", newTokens.accessToken, {
          httpOnly: true,
        });
        if (newTokens.refreshToken) {
          response.cookies.set("refreshToken", newTokens.refreshToken, {
            httpOnly: true,
          });
        }
      }
    } catch (error) {
      console.error("Failed to refresh token in proxy:", error);
      isAuthenticated = false;
    }
  }
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (isPublicAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
