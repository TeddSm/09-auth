import { cookies } from "next/headers";
import { api } from "./api"; // Переконайся, що імпорт твого екземпляра Axios правильний (дефолтний чи іменований)
import type { Note } from "@/types/note";
import { User } from "@/types/user";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
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

export const checkSession = async (): Promise<{ data: TokenResponse }> => {
  const headers = await getAuthHeaders();
  return await api.post<TokenResponse>("/auth/refresh", {}, { headers });
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
