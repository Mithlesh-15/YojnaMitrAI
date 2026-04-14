import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
});

export default api;

// ─── Toggle-save helper ───────────────────────────────────────────────────────

export type ToggleResponse = {
  success: boolean;
  saved: boolean;
};

export async function toggleSaveScheme(
  user_id: string,
  scheme_id: string,
): Promise<ToggleResponse> {
  const res = await api.post<ToggleResponse>("/api/schemes/toggle-save", {
    user_id,
    scheme_id,
  });
  return res.data;
}