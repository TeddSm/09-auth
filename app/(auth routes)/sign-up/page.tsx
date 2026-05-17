"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clientApi";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import css from "./SignUp.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      router.push("/profile");
    } catch (err: unknown) {
      const errorWithResponse = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        errorWithResponse.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className={css.container}>
      <form onSubmit={handleSubmit} className={css.form}>
        <h1 className={css.title}>Sign Up</h1>

        {error && <p className={css.error}>{error}</p>}

        <label className={css.label}>
          Username
          <input
            type="text"
            name="username"
            required
            className={css.input}
            placeholder="Enter your username"
          />
        </label>

        <label className={css.label}>
          Email
          <input
            type="email"
            name="email"
            required
            className={css.input}
            placeholder="Enter your email"
          />
        </label>

        <label className={css.label}>
          Password
          <input
            type="password"
            name="password"
            required
            className={css.input}
            placeholder="Enter your password"
          />
        </label>

        <button type="submit" className={css.button}>
          Register
        </button>
      </form>
    </div>
  );
}
