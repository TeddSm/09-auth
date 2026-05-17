import { api } from "./api";
import type { Note } from "@/types/note";
import { User } from "@/types/user";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

interface SignUpResponse {
  user: User;
}

interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  user: User;
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
  return await api.get("/auth/session");
};

export const getMe = async () => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (userData: { username: string }) => {
  const response = await api.patch<User>("/users/me", userData);
  return response.data;
};

export const register = async (
  credentials: SignUpRequest
): Promise<SignUpResponse> => {
  const response = await api.post<SignUpResponse>(
    "/auth/register",
    credentials
  );
  return response.data;
};

export const login = async (
  credentials: SignInRequest
): Promise<SignInResponse> => {
  const response = await api.post<SignInResponse>("/auth/login", credentials);
  return response.data;
};
