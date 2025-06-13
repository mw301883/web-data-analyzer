import { useEffect, useState } from "react";
import API from "../api";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function YearsChart() {
  const [data, setData] = useState([]);
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');

  useEffect(() => {
    API.get("/stats").then(res => {
      const years = Object.entries(res.data.releases_per_year)
        .map(([year, count]) => ({ year: parseInt(year), count }))
        .sort((a, b) => a.year - b.year);

      setData(years);
      setMinYear(years[0]?.year || '');
      setMaxYear(years[years.length - 1]?.year || '');
    });
  }, []);

  const filtered = data.filter(
    item =>
      (minYear === '' || item.year >= minYear) &&
      (maxYear === '' || item.year <= maxYear)
  );

  const chartData = {
    labels: filtered.map(item => item.year),
    datasets: [
      {
        label: "Liczba tytułów",
        data: filtered.map(item => item.count),
        backgroundColor: "rgba(13,110,253,0.6)", // Bootstrap blue
      }
    ]
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <div className="card shadow p-4 mb-5">
        <h2 className="mb-4 display-6 fw-semibold text-primary">Liczba tytułów na rok</h2>
        <form className="row mb-4 g-2">
          <div className="col">
            <label className="form-label">Od roku:</label>
            <input
              type="number"
              className="form-control"
              value={minYear}
              min={data[0]?.year}
              max={maxYear}
              onChange={e => setMinYear(Number(e.target.value))}
            />
          </div>
          <div className="col">
            <label className="form-label">Do roku:</label>
            <input
              type="number"
              className="form-control"
              value={maxYear}
              min={minYear}
              max={data[data.length - 1]?.year}
              onChange={e => setMaxYear(Number(e.target.value))}
            />
          </div>
        </form>
        <Bar data={chartData} />
        <table className="table table-striped align-middle mt-4">
          <thead>
            <tr>
              <th>Rok</th>
              <th>Liczba tytułów</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ year, count }) => (
              <tr key={year}>
                <td>{year}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
