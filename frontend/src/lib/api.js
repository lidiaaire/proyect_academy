const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

async function request(endpoint, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.message ?? `Error ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get:    (endpoint, token)        => request(endpoint, { method: 'GET',    token }),
  post:   (endpoint, body, token)  => request(endpoint, { method: 'POST',   body, token }),
  put:    (endpoint, body, token)  => request(endpoint, { method: 'PUT',    body, token }),
  patch:  (endpoint, body, token)  => request(endpoint, { method: 'PATCH',  body, token }),
  delete: (endpoint, token)        => request(endpoint, { method: 'DELETE', token }),
};
