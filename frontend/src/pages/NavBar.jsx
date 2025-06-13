import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          Filmy Netflix
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Wyszukiwarka</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/years">Lata</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/genres">Gatunki</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/countries">Kraje</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
