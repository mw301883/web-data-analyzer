import { useEffect, useState } from "react";
import API from "../api";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';

export default function GenresChart() {
  const [data, setData] = useState([]);
  const [genreFilter, setGenreFilter] = useState('');

  useEffect(() => {
    API.get("/stats").then(res => {
      const genres = Object.entries(res.data.top_genres).map(
        ([genre, count]) => ({
          genre,
          count,
        })
      );
      setData(genres);
    });
  }, []);

  const filtered = data.filter(
    item =>
      genreFilter === '' ||
      item.genre.toLowerCase().includes(genreFilter.toLowerCase())
  );

  const chartData = {
    labels: filtered.map(item => item.genre),
    datasets: [
      {
        label: "Liczba tytułów",
        data: filtered.map(item => item.count),
        backgroundColor: "rgba(40,167,69,0.6)" // Bootstrap green
      }
    ]
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <div className="card shadow p-4 mb-5">
        <h2 className="mb-4 display-6 fw-semibold text-primary">Top gatunki</h2>
        <form className="mb-4">
          <input
            className="form-control"
            placeholder="Filtruj po gatunku..."
            value={genreFilter}
            onChange={e => setGenreFilter(e.target.value)}
          />
        </form>
        <Bar data={chartData} />
        <table className="table table-striped align-middle mt-4">
          <thead>
            <tr>
              <th>Gatunek</th>
              <th>Liczba tytułów</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ genre, count }) => (
              <tr key={genre}>
                <td>{genre}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
