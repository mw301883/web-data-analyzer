export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
}

export async function login(username, password) {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Błąd logowania');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('isAuthenticated', 'true');

    return true;
  } catch (error) {
    console.error('Błąd logowania:', error);
    throw error;
  }
}
