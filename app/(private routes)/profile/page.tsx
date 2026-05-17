import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getMe } from "@/lib/api/serverApi";
import css from "./Profile.module.css";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <div className={css.container}>
      <div className={css.profileCard}>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={150}
            height={150}
            priority
            className={css.avatar}
          />
        </div>
        <h1 className={css.username}>{user.username}</h1>
        <p className={css.email}>{user.email}</p>
      </div>
      <Link href="/profile/edit" className={css.editLink}>
        Edit Profile
      </Link>
    </div>
  );
}
