import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";
import { NoteList } from "@/components/NoteList/NoteList";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] || "";
  return {
    title: `Notes - ${tag}`,
  };
}

export default async function NotesFilterPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0] || "";
  const page = Number(slug?.[1]) || 1;

  const queryClient = new QueryClient();

  const data = await queryClient.fetchQuery({
    queryKey: ["notes", { page, tag }],
    queryFn: () => fetchNotes({ page, tag }),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteList notes={data?.notes || []} />
      </HydrationBoundary>
    </div>
  );
}
