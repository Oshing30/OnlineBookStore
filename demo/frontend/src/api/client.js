// Central API helper. Reads the base URL from an env var (falls back to
// localhost:8080), attaches the JWT when present, and normalizes errors.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 204/empty responses have no JSON body.
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.fieldErrors = data?.fieldErrors;
    throw error;
  }
  return data;
}

export const api = {
  // Catalog (public)
  getBooks: () => request('/api/books'),
  getBook: (id) => request(`/api/books/${id}`),

  // Auth (public)
  register: (payload) =>
    request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) =>
    request('/api/auth/login', { method: 'POST', body: payload }),

  // Orders (protected -> auth: true)
  checkout: (items) =>
    request('/api/orders', { method: 'POST', body: { items }, auth: true }),
};
