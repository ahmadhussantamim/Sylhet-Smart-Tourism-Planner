import { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/home.css';

export default function GuidesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/guides').then((res) => setItems(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="section-header">
        <span className="eyebrow">Approved Guides</span>
        <h2>Book a Local Guide</h2>
      </div>

      {loading ? <p style={{ textAlign: 'center' }}>Loading...</p> :
        items.length === 0 ? <p style={{ textAlign: 'center' }}>No approved guides yet.</p> : (
        <div className="card-grid">
          {items.map((g) => (
            <div className="card" key={g.guide_id}>
              <div className="card-image">
                <img src={`/src/assets/images/${g.profile_image}`} alt={g.name} />
              </div>
              <div className="card-body">
                <span className="card-tag">{g.experience || 'Guide'}</span>
                <h3>{g.name}</h3>
                <p>{g.description}</p>
                <p><strong>Languages:</strong> {g.languages}</p>
                <p><strong>Daily charge:</strong> ৳{g.daily_charge}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
