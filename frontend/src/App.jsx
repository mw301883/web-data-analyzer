import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NavBar from "./pages/NavBar";
import YearsChart from "./pages/YearsChart";
import CountriesChart from "./pages/CountriesChart";
import GenresChart from "./pages/GenresChart";

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
          element={auth ? <><NavBar /><Dashboard onLogout={() => setAuth(false)} /></> : <Navigate to="/" replace />}
        />

        <Route
          path="/years"
          element={auth ? <><NavBar /><YearsChart /></> : <Navigate to="/" replace />}
        />
        <Route
          path="/countries"
          element={auth ? <><NavBar /><CountriesChart /></> : <Navigate to="/" replace />}
        />
        <Route
          path="/genres"
          element={auth ? <><NavBar /><GenresChart /></> : <Navigate to="/" replace />}
        />


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
