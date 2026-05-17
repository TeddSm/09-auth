import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import { NoteList } from "@/components/NoteList/NoteList";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = slug && slug[0] === "tags" ? slug[1] : "all";

  const queryClient = new QueryClient();

  const fetchFilters = { tag, page: 1, perPage: 12, search: "" };

  // Виконуємо запит безпосередньо для пропсів NoteList
  const data = await fetchNotes(fetchFilters);

  // Паралельно робимо prefetch для гідрації React Query, як вимагає ментор
  await queryClient.prefetchQuery({
    queryKey: ["notes", fetchFilters],
    queryFn: () => fetchNotes(fetchFilters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <h1>Notes by tag: {tag}</h1>
        {/* Передаємо масив нотаток, який вимагає твій NoteList */}
        <NoteList notes={data.notes || data} />
      </div>
    </HydrationBoundary>
  );
}
