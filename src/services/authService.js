const baseUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:44341';

export async function login(email, password) {
  const loginUrl = `${baseUrl}/login`;
  console.log('Отправка запроса на:', loginUrl, { email, password });
  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Клонируем ответ, чтобы избежать повторного чтения
    const clonedResponse = response.clone();
    const text = await clonedResponse.text();
    console.log('Ответ /login:', response.status, response.statusText, text);

    if (!response.ok) {
      console.error('Ошибка /login:', response.status, text);
      throw new Error(JSON.parse(text)?.title || text || 'Ошибка входа');
    }

    const data = await response.json();
    console.log('Полученные данные:', data);

    if (!data.accessToken || !data.refreshToken) {
      console.error('Ошибка: accessToken или refreshToken отсутствуют', data);
      throw new Error('Неверный формат ответа сервера');
    }

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    console.log('Сохранен accessToken:', data.accessToken);
    console.log('Сохранен refreshToken:', data.refreshToken);

    return data;
  } catch (err) {
    console.error('Ошибка при запросе:', err);
    throw err;
  }
}

export async function logout() {
  try {
    const token = localStorage.getItem('accessToken');
    console.log('Отправка запроса на /logout, токен:', token);
    await fetch(`${baseUrl}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Ошибка при выходе:', err);
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}

export function getAccessToken() {
  const token = localStorage.getItem('accessToken');
  console.log('Получение accessToken:', token);
  return token;
}

export async function checkAdminRole() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('Токен отсутствует, не админ');
      return false;
    }

    const response = await fetch(`${baseUrl}/admin/check-role`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Ошибка проверки роли:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    console.log('Результат проверки роли:', data);
    return data.isAdmin === true;
  } catch (err) {
    console.error('Ошибка при проверке роли:', err);
    return false;
  }
}
