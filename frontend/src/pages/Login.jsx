import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await login(username, password);
        onLogin();
        navigate('/dashboard');
      } catch (error) {
        alert(error.message || 'Nie udało się zalogować');
      }
    };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#e9ecef' }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="card-title mb-4 text-center">Witaj w Data Analyzer!</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              Nazwa użytkownika
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Wpisz nazwę użytkownika"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">
              Hasło
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Wpisz hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Zaloguj się
          </button>
        </form>
        <div className="text-center mt-3 text-muted" style={{ fontSize: '0.9rem' }}>
          Nie masz konta? Skontaktuj się z administratorem.
        </div>
      </div>
    </div>
  );
}
