import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import { User } from "@/types/user";
import { AxiosResponse } from "axios";

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  tag?: string;
  search?: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface SessionResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

const getAuthHeaders = async (): Promise<{ Cookie?: string }> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieArray: string[] = [];
  if (accessToken) cookieArray.push(`accessToken=${accessToken}`);
  if (refreshToken) cookieArray.push(`refreshToken=${refreshToken}`);

  if (cookieArray.length > 0) {
    return { Cookie: cookieArray.join("; ") };
  }
  return {};
};

export const checkSession = async (): Promise<
  AxiosResponse<SessionResponse>
> => {
  const headers = await getAuthHeaders();
  return await api.get<SessionResponse>("/auth/session", { headers });
};

export const getMe = async (): Promise<User> => {
  const headers = await getAuthHeaders();
  const response = await api.get<User>("/users/me", { headers });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, { headers });
  return response.data;
};

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const headers = await getAuthHeaders();
  const response = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers,
  });
  return response.data;
};
