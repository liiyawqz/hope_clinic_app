//services\api
import { getAccessToken } from './authService';

export async function authorizedFetch(url, options = {}) {
  const token = getAccessToken();

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Пример обработки ошибок (например, 401 Unauthorized)
  if (response.status === 401) {
    // handle logout/refresh
    throw new Error('Unauthorized');
  }

  return await response.json();
}
