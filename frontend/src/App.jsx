import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

function App() {
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    function onStorageChange() {
      setAuth(isAuthenticated());
    }
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={auth ? <Navigate to="/dashboard" replace /> : <Login onLogin={() => setAuth(true)} />}
        />
        <Route
          path="/dashboard"
          element={auth ? <Dashboard onLogout={() => setAuth(false)} /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
