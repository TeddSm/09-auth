import axios from "axios";
import type { Note } from "../types/note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const API_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchNotes = async ({
  page = 1,
  perPage = 10,
  tag = "",
  search = "",
}: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };
  if (search && search.trim() !== "") {
    params.search = search;
  }

  if (tag && tag !== "" && tag !== "all") {
    params.tag = tag;
  }
  const response = await api.get<FetchNotesResponse>("/notes", { params });
  return response.data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const response = await api.post<Note>("notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};
