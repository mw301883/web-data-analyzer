import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { logout } from '../auth';

export default function Dashboard({ onLogout }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/netflix/titles')
      .then((res) => setMessage(res.data.message))
      .catch((err) => {
        console.error('Błąd pobierania danych z dashboard:', err);
        setError('Nie udało się pobrać danych. Upewnij się, że jesteś zalogowany.');
      });
  }, []);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Panel użytkownika</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {message && <p>{message}</p>}

      <button className="btn btn-secondary mt-3" onClick={handleLogout}>
        Wyloguj
      </button>
    </div>
  );
}
