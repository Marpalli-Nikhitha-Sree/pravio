export const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return Boolean(
    getToken() &&
      localStorage.getItem("user")
  );
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(
    new CustomEvent("auth-logout")
  );
}

export async function apiFetch(
  path,
  options = {}
) {
  const token = getToken();
  const headers = {
    ...options.headers,
  };

  if (
    options.body &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (
    response.status === 401 &&
    token
  ) {
    clearAuth();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Request failed"
    );
  }

  return data;
}
