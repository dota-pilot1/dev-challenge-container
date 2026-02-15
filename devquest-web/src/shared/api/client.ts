const MAIN_API = "http://localhost:8080/api";
const PAYMENT_API = "http://localhost:3000/api";

const STORAGE_KEY = "devquest_auth";

function getToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw).token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(
  baseUrl: string,
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${baseUrl}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const mainApi = {
  get: <T>(path: string) => request<T>(MAIN_API, path),
  post: <T>(path: string, body: unknown) =>
    request<T>(MAIN_API, path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(MAIN_API, path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: async (path: string) => {
    const token = getToken();
    const res = await fetch(`${MAIN_API}${path}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
};

export const paymentApi = {
  get: <T>(path: string) => request<T>(PAYMENT_API, path),
  post: <T>(path: string, body: unknown) =>
    request<T>(PAYMENT_API, path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(PAYMENT_API, path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
};
