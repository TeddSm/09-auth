"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchNotes } from "@/lib/api";
import { NoteList } from "@/components/NoteList/NoteList";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { Pagination } from "@/components/Pagination/Pagination";
import Link from "next/link"; 

interface NotesClientProps {
  currentTag: string;
}

export default function NotesClient({ currentTag }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { data, isLoading } = useQuery({
    queryKey: ["notes", currentTag, debouncedSearch, page],
    queryFn: () =>
      fetchNotes({
        tag: currentTag === "all" ? "" : currentTag,
        search: debouncedSearch,
        page: page,
      }),
  });
  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notes: {currentTag || "All"}</h1>
        
        <Link 
          href="/notes/action/create" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            borderRadius: '5px',
            textDecoration: 'none'
          }}
        >
          Create note +
        </Link>
      </div>

      <SearchBox value={searchQuery} onChange={(v) => { setSearchQuery(v); setPage(1); }} />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <NoteList notes={notes} onNoteClick={(id) => console.log('Navigate to note', id)} />
          
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}