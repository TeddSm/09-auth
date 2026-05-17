import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

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
      const response = await checkSession();

      if (response && response.data && response.data.accessToken) {
        isAuthenticated = true;

        const redirectResponse = NextResponse.redirect(request.nextUrl);

        redirectResponse.cookies.set("accessToken", response.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        if (response.data.refreshToken) {
          redirectResponse.cookies.set(
            "refreshToken",
            response.data.refreshToken,
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            }
          );
        }

        return redirectResponse;
      }
    } catch (error) {
      console.error("Middleware token refresh failed via serverApi:", error);
      isAuthenticated = false;
    }
  }

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
