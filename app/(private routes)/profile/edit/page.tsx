"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";
import { updateMe } from "@/lib/api/clientApi";
import css from "./ProfileEdit.module.css";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [prevUserUsername, setPrevUserUsername] = useState(
    user?.username || ""
  );
  if (user?.username && user.username !== prevUserUsername) {
    setPrevUserUsername(user.username);
    setUsername(user.username);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedData = await updateMe({ username });
      if (user) {
        setUser({ ...user, username: updatedData.username || username });
      }
      router.push("/profile");
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  const avatarUrl =
    user?.avatar && user.avatar !== "avatar"
      ? user.avatar
      : "https://ac.goit.global/fullstack/react/avatar-mock.png";

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div
          style={{
            position: "relative",
            width: "120px",
            height: "120px",
            margin: "0 auto",
          }}
        >
          <Image
            src={avatarUrl}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p>Email: {user?.email || "user_email@example.com"}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
