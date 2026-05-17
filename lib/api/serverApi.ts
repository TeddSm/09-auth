import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const getServerHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  tag = "",
  search = "",
}) => {
  const params: Record<string, string | number> = { page, perPage };
  if (search && search.trim() !== "") params.search = search;
  if (tag && tag !== "" && tag !== "all") params.tag = tag;

  const config = await getServerHeaders();

  const response = await api.get<FetchNotesResponse>("/notes", {
    ...config,
    params,
  });
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const config = await getServerHeaders();
  const response = await api.get<Note>(`/notes/${id}`, config);
  return response.data;
};

export const getMe = async () => {
  const config = await getServerHeaders();
  const response = await api.get("/users/me", config);
  return response.data;
};

export const checkSession = async () => {
  const config = await getServerHeaders();
  const response = await api.get("/auth/session", config);
  return response.data;
};
