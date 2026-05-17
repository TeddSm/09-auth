"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNote } from "@/lib/api";
import { Note } from "@/types/note";
import css from "./NoteForm.module.css";

type CreateNotePayload = Omit<Note, "id" | "createdAt" | "updatedAt">;

const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: (newNote: CreateNotePayload) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      
      clearDraft();
      
      router.back();
    },
    onError: (error) => {
      console.error("Помилка при створенні нотатки:", error);
      alert("Не вдалося створити нотатку. Спробуйте ще раз.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    mutation.mutate(draft as CreateNotePayload);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select 
          id="tag" 
          name="tag" 
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;