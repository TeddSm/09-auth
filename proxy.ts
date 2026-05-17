import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isPublicAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  let isAuthenticated = !!accessToken;
  if (!accessToken && refreshToken) {
    try {
      const apiRes = await fetch(
        "https://notehub-api.goit.study/auth/refresh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (apiRes.ok) {
        isAuthenticated = true;

        const redirectResponse = NextResponse.redirect(
          new URL(request.url, request.url)
        );

        const setCookieHeaders = apiRes.headers.getSetCookie();
        setCookieHeaders.forEach((cookieStr) => {
          redirectResponse.headers.append("set-cookie", cookieStr);
        });

        return redirectResponse;
      }
    } catch (error) {
      console.error("Middleware token refresh failed:", error);
      isAuthenticated = false;
    }
  }

  // 2. Логіка захисту роутів
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
