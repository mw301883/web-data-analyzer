import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { logout } from '../auth';

export default function Dashboard({ onLogout }) {
  const [message, setMessage] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Brak tokenu – zaloguj się ponownie.');
      return;
    }

    API.get('/netflix/search?q=dark&limit=5&offset=0', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        const count = res.data.count ?? 0;
        const results = res.data.results ?? [];
        setMessage(`Znaleziono ${count} wyników`);
        setResults(results);
      })
      .catch((err) => {
        console.error('Błąd pobierania danych z search:', err);
        setError('Nie udało się pobrać danych. Upewnij się, że jesteś zalogowany.');
      });
  }, []);

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
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

      {Array.isArray(results) && results.length > 0 && (
        <div className="mt-4">
          <h4>Wyniki wyszukiwania:</h4>
          <ul className="list-group">
            {results.map((item) => (
              <li key={item.show_id} className="list-group-item">
                <strong>{item.title}</strong> ({item.release_year}) – {item.type}
                <br />
                <em>{item.listed_in}</em>
                <br />
                <small>{item.description}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn btn-secondary mt-4" onClick={handleLogout}>
        Wyloguj
      </button>
    </div>
  );
}
