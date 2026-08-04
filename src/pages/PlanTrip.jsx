import { useState } from 'react';
import api from '../api/axios';
import '../styles/dashboard.css';

const INTERESTS = ['Nature', 'Tea Gardens', 'Adventure', 'Religious Sites', 'Lakes', 'Photography'];

export default function PlanTrip() {
  const [budget, setBudget] = useState('');
  const [numDays, setNumDays] = useState('');
  const [interests, setInterests] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleInterest(i) {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!budget || budget <= 0) return setError('Please enter a valid budget.');
    if (!numDays || numDays < 1 || numDays > 14) return setError('Days must be between 1 and 14.');
    if (interests.length === 0) return setError('Pick at least one interest.');

    setLoading(true);
    try {
      const { data } = await api.post('/itinerary/generate', { budget: Number(budget), numDays: Number(numDays), interests });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate a plan. Please log in as a tourist.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Smart Trip Planner</h1>
        <p>Tell us your budget, days and interests - we'll build a day-by-day plan.</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form className="inline-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Budget (BDT)</label>
          <input type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Number of Days</label>
          <input type="number" min="1" max="14" value={numDays} onChange={(e) => setNumDays(e.target.value)} required />
        </div>
        <div className="form-field full-row">
          <label>Interests</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {INTERESTS.map((i) => (
              <button type="button" key={i}
                className={`tab-btn ${interests.includes(i) ? 'active' : ''}`}
                style={{ border: '1.5px solid var(--color-border)', borderRadius: '999px' }}
                onClick={() => toggleInterest(i)}>
                {i}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-primary full-row" type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Itinerary'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '32px' }}>
          <h2>Your {result.plan.length}-Day Plan</h2>
          <p>Estimated cost: ৳{result.totalCost} {result.withinBudget ? '(within budget ✅)' : '(over budget ⚠️)'}</p>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Day</th><th>Destination</th><th>Category</th><th>Entry Fee</th></tr></thead>
              <tbody>
                {result.plan.map((p) => (
                  <tr key={p.day}>
                    <td>Day {p.day}</td><td>{p.name}</td><td>{p.category}</td><td>৳{p.entry_fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
