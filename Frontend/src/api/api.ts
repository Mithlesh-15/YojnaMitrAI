import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export default api;

// ─── Toggle-save helper ───────────────────────────────────────────────────────

export type ToggleResponse = {
  success: boolean;
  saved: boolean;
  message?: string;
};

function getAuthHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function toggleSaveScheme(
  schemeId: string,
  accessToken: string,
): Promise<ToggleResponse> {
  const res = await api.post<ToggleResponse>(
    "/api/schemes/toggle-save",
    { schemeId },
    { headers: getAuthHeaders(accessToken) },
  );
  return res.data;
}

export async function getSchemeSavedStatus(
  schemeId: string,
  accessToken: string,
): Promise<ToggleResponse> {
  const res = await api.get<ToggleResponse>(`/api/schemes/${schemeId}/saved-status`, {
    headers: getAuthHeaders(accessToken),
  });
  return res.data;
}