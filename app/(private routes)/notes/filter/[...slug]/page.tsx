import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

interface FilterPageProps {
  params: Promise<{ slug?: string[] }>;
}

interface MetaProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug[0];
  const title = `Notes - ${filter}`;
  const description = `Notes filtered by ${filter}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/notes/filter/${filter}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const currentTag = slug?.[0] === "all" ? "" : slug?.[0] || "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentTag],
    queryFn: () => fetchNotes({ tag: currentTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient currentTag={currentTag} />
    </HydrationBoundary>
  );
}