"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { logout } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const { isAuthenticated, user, setUser, setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className={css.navigation}>
      {isAuthenticated ? (
        <div className={css.authorizedBlock}>
          <span className={css.userEmail}>{user?.email}</span>
          <Link href="/profile" className={css.navigationLink}>
            Profile
          </Link>
          <Link href="/notes" className={css.navigationLink}>
            Notes
          </Link>
          <button onClick={handleLogout} className={css.logoutButton}>
            Log Out
          </button>
        </div>
      ) : (
        <div className={css.unauthorizedBlock}>
          <Link href="/sign-in" className={css.navigationLink}>
            Sign In
          </Link>
          <Link href="/sign-up" className={css.navigationLink}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
