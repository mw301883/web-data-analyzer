import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { logout } from '../auth';

export default function Dashboard({ onLogout }) {
  const [message, setMessage] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  // Pobieraj wyniki po wejściu i po zmianie tytułu
  useEffect(() => {
    let query = `/search?limit=10&offset=0`;
    if (title) query += `&q=${encodeURIComponent(title)}`;

    API.get(query)
      .then((res) => {
        const count = res.data.count ?? 0;
        const results = res.data.results ?? [];
        setMessage(`Znaleziono ${count} wyników`);
        setResults(results);
        setError('');
      })
      .catch(() => {
        setError('Nie udało się pobrać danych. Upewnij się, że jesteś zalogowany.');
      });
  }, [title]);

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
  };

  const handleTitleChange = e => setTitle(e.target.value);

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <div className="card shadow-sm p-4 mb-5">
        <h2 className="mb-2 display-4 fw-bold text-primary">Wyszukaj film</h2>
        <form className="mb-4">
          <label className="form-label fw-semibold">Tytuł</label>
          <input
            type="text"
            className="form-control"
            placeholder="Szukaj po tytule..."
            value={title}
            onChange={handleTitleChange}
          />
        </form>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-muted">{message}</div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setTitle('')}
            type="button"
          >
            Wyczyść filtr
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {Array.isArray(results) && results.length > 0 && (
          <ul className="list-group mb-3">
            {results.map((item) => (
              <li key={item.show_id} className="list-group-item mb-3 shadow-sm rounded">
                <div className="d-flex align-items-center mb-1">
                  <strong className="fs-5 me-2">{item.title}</strong>
                  <span className="badge bg-secondary me-2">{item.release_year}</span>
                  <span className={`badge ${item.type === "Movie" ? "bg-info" : "bg-warning text-dark"}`}>
                    {item.type}
                  </span>
                </div>
                <div className="fst-italic small text-primary mb-1">
                  {item.listed_in}
                </div>
                <div className="text-muted small">{item.description}</div>
              </li>
            ))}
          </ul>
        )}

        <div className="d-flex justify-content-end">
          <button
            className="btn btn-outline-danger px-4 fw-semibold"
            onClick={handleLogout}
          >
            Wyloguj
          </button>
        </div>
      </div>
    </div>
  );
}
