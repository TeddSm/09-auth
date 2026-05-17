import { api } from "./api";
import type { AxiosResponse } from "axios";
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
}): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search && search.trim() !== "") params.search = search;
  if (tag && tag !== "" && tag !== "all") params.tag = tag;

  const response = await api.get<FetchNotesResponse>("/notes", { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const response = await api.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const checkSession = async (): Promise<AxiosResponse> => {
  const response = await api.get("/auth/session");
  return response;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
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

export const refreshSession = async (refreshToken: string) => {
  const response = await api.post<{
    accessToken: string;
    refreshToken: string;
  }>("/auth/refresh", { refreshToken });
  return response.data;
};
