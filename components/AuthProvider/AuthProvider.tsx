"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession } from "@/lib/api/clientApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const isPrivateRoute =
        pathname.startsWith("/profile") || pathname.startsWith("/notes");

      try {
        const data = await checkSession();
        if (data && data.user) {
          setUser(data.user);
        } else if (isPrivateRoute) {
          clearIsAuthenticated();
          router.push("/sign-in");
        }
      } catch (error) {
        if (isPrivateRoute) {
          clearIsAuthenticated();
          router.push("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [pathname, setUser, clearIsAuthenticated, router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
