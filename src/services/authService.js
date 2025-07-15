//services\authService.js
const baseUrl = import.meta.env.VITE_APP_API_URL;

export async function login(email, password, twoFactorCode = '', twoFactorRecoveryCode = '') {
  const response = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      twoFactorCode,
      twoFactorRecoveryCode
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.title || 'Ошибка входа');
  }

  const data = await response.json();

  // Сохраняем токены в localStorage
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return data;
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}


/*
export function logout() {
  localStorage.removeItem('accessToken')
  window.location.href = '/login'
}*/
