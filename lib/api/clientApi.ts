import { api } from "./api";
import type { Note } from "@/types/note";
import { User } from "@/types/user";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  tag = "",
  search = "",
}) => {
  const params: Record<string, string | number> = { page, perPage };
  if (search && search.trim() !== "") params.search = search;
  if (tag && tag !== "" && tag !== "all") params.tag = tag;

  const response = await api.get<FetchNotesResponse>("/notes", { params });
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
) => {
  const response = await api.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const checkSession = async () => {
  const response = await api.get("/auth/session");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateMe = async (userData: Record<string, unknown>) => {
  const response = await api.patch("/users/me", userData);
  return response.data;
};

interface SignUpRequest {
  email: string;
  password?: string;
}

interface SignUpResponse {
  user: User;
}

export const register = async (
  credentials: SignUpRequest
): Promise<SignUpResponse> => {
  const response = await api.post<SignUpResponse>(
    "/auth/register",
    credentials
  );
  return response.data;
};

interface SignInRequest {
  email: string;
  password?: string;
}

interface SignInResponse {
  user: User;
}

export const login = async (
  credentials: SignInRequest
): Promise<SignInResponse> => {
  const response = await api.post<SignInResponse>("/auth/login", credentials);
  return response.data;
};
