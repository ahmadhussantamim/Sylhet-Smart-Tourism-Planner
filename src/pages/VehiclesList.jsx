import { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/home.css';

export default function VehiclesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vehicles').then((res) => setItems(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="section-header">
        <span className="eyebrow">Approved Drivers</span>
        <h2>Book a Vehicle</h2>
      </div>

      {loading ? <p style={{ textAlign: 'center' }}>Loading...</p> :
        items.length === 0 ? <p style={{ textAlign: 'center' }}>No vehicles available yet.</p> : (
        <div className="card-grid">
          {items.map((v) => (
            <div className="card" key={v.vehicle_id}>
              <div className="card-image">
                <img src={`/src/assets/images/${v.vehicle_image}`} alt={v.vehicle_name} />
              </div>
              <div className="card-body">
                <span className="card-tag">{v.vehicle_type}</span>
                <h3>{v.vehicle_name}</h3>
                <p><strong>Capacity:</strong> {v.passenger_capacity} passengers</p>
                <p><strong>Price/day:</strong> ৳{v.price_per_day}</p>
                <p><strong>Driver:</strong> {v.driver_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
