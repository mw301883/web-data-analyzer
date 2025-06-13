import { useEffect, useState } from "react";
import API from "../api";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';

export default function CountriesChart() {
  const [data, setData] = useState([]);
  const [countryFilter, setCountryFilter] = useState('');

  useEffect(() => {
    API.get("/countries").then(res => {
      const countries = Object.entries(res.data).map(
        ([country, val]) => ({
          country,
          count: val.count,
          percentage: val.percentage,
        })
      );
      setData(countries);
    });
  }, []);

  const filtered = data.filter(
    item =>
      countryFilter === '' ||
      item.country.toLowerCase().includes(countryFilter.toLowerCase())
  );

  const chartData = {
    labels: filtered.map(item => item.country),
    datasets: [
      {
        label: "Liczba tytułów",
        data: filtered.map(item => item.count),
        backgroundColor: "rgba(220,53,69,0.6)" // Bootstrap red
      }
    ]
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <div className="card shadow p-4 mb-5">
        <h2 className="mb-4 display-6 fw-semibold text-primary">Top kraje produkcji</h2>
        <form className="mb-4">
          <input
            className="form-control"
            placeholder="Filtruj po kraju..."
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
          />
        </form>
        <Bar data={chartData} />
        <table className="table table-striped align-middle mt-4">
          <thead>
            <tr>
              <th>Kraj</th>
              <th>Liczba tytułów</th>
              <th>Procent całości</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ country, count, percentage }) => (
              <tr key={country}>
                <td>{country}</td>
                <td>{count}</td>
                <td>{percentage} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
