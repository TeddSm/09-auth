"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteNote } from "../../lib/api";
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
  onNoteClick?: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ notes, onNoteClick }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted!");
    },
    onError: () => toast.error("Failed to delete note"),
  });

  if (!notes.length) return <p>No notes found</p>;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li 
          key={note.id} 
          className={css.listItem}
          onClick={() => onNoteClick?.(note.id)}
          style={{ cursor: onNoteClick ? 'pointer' : 'default' }}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer} onClick={(e) => e.stopPropagation()}> 
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`}>View details</Link>
            <button
              className={css.button}
              onClick={() => mutation.mutate(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};