import Link from 'next/link';
import css from './not-found.module.css';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  description: "This page does not exist",
  openGraph: {
    title: "Not Found",
    description: "This page does not exist",
    url: "/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/notes" style={{ marginTop: '20px', color: '#0070f3', textDecoration: 'underline' }}>
        Return to Notes
      </Link>
    </div>
  );
}