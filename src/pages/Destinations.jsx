import { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/home.css';

export default function Destinations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/destinations').then((res) => setItems(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="section-header">
        <span className="eyebrow">Explore</span>
        <h2>All Destinations</h2>
      </div>

      {loading ? <p style={{ textAlign: 'center' }}>Loading...</p> : (
        <div className="card-grid">
          {items.map((d) => (
            <div className="card" key={d.destination_id}>
              <div className="card-image">
                <img src={`/src/assets/images/${d.image}`} alt={d.name} />
              </div>
              <div className="card-body">
                <span className="card-tag">{d.category}</span>
                <h3>{d.name}</h3>
                <p>{d.description}</p>
                <p><strong>Entry fee:</strong> {d.entry_fee > 0 ? `৳${d.entry_fee}` : 'Free'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
