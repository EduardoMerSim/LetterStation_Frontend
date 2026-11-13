const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
  const token = sessionStorage.getItem('letterstation-token');

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

export default API_URL;