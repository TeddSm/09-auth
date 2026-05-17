"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import { Modal } from "@/components/Modal/Modal";
import css from "./NotePreview.module.css"; 

export default function NotePreview() {
  const router = useRouter();
  const params = useParams();
  
  const id = params?.id as string;
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,             
    refetchOnMount: false,     
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        {isLoading && <p>Loading note details...</p>}
        {isError && <p>Error loading note. Please try again.</p>}
        {note && (
          <article className={css.contentWrapper}>
            <h2 className={css.title}>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
            <p className={css.text}>{note.content}</p>
            
            {note.createdAt && (
              <time className={css.date}>
                Created at: {new Date(note.createdAt).toLocaleDateString()}
              </time>
            )}
          </article>
        )}
      </div>
    </Modal>
  );
}