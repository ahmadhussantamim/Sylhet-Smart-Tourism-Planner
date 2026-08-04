import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import '../../styles/dashboard.css';

const EMPTY = { vehicle_name: '', vehicle_type: 'Private Car', passenger_capacity: '', price_per_day: '', vehicle_image: '' };
const TYPES = ['Private Car', 'Microbus', 'Hiace', 'Tourist Bus'];

export default function DriverDashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function loadVehicles() {
    api.get('/vehicles/mine').then((res) => setVehicles(res.data)).catch(() => {});
  }
  useEffect(loadVehicles, []);

  function updateField(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await api.put(`/vehicles/${editingId}`, form);
    } else {
      await api.post('/vehicles', form);
    }
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(false);
    loadVehicles();
  }

  function startEdit(v) {
    setForm({ vehicle_name: v.vehicle_name, vehicle_type: v.vehicle_type, passenger_capacity: v.passenger_capacity, price_per_day: v.price_per_day, vehicle_image: v.vehicle_image || '' });
    setEditingId(v.vehicle_id);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this vehicle?')) return;
    await api.delete(`/vehicles/${id}`);
    loadVehicles();
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <p>Manage your vehicles and upcoming bookings here.</p>
      </div>

      <div className={`status-banner status-${user.status}`}>
        {user.status === 'pending' && 'Your driver account is pending admin approval.'}
        {user.status === 'approved' && 'Your driver account is approved. Tourists can now find and book your vehicles.'}
        {user.status === 'rejected' && 'Your driver application was rejected. Please contact the admin.'}
      </div>

      <div className="tab-bar">
        <span className="tab-btn active">My Vehicles</span>
        <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => { setShowForm(!showForm); setForm(EMPTY); setEditingId(null); }}>
          {showForm ? 'Cancel' : '+ Add Vehicle'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Vehicle Name</label>
            <input name="vehicle_name" value={form.vehicle_name} onChange={updateField} required />
          </div>
          <div className="form-field">
            <label>Type</label>
            <select name="vehicle_type" value={form.vehicle_type} onChange={updateField}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Capacity</label>
            <input name="passenger_capacity" type="number" min="1" value={form.passenger_capacity} onChange={updateField} required />
          </div>
          <div className="form-field">
            <label>Price/Day (BDT)</label>
            <input name="price_per_day" type="number" min="0" value={form.price_per_day} onChange={updateField} required />
          </div>
          <div className="form-field full-row">
            <label>Image file name (see assets guide)</label>
            <input name="vehicle_image" placeholder="e.g. private-car.jpg" value={form.vehicle_image} onChange={updateField} />
          </div>
          <button className="btn btn-primary full-row" type="submit">{editingId ? 'Update Vehicle' : 'Save Vehicle'}</button>
        </form>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Type</th><th>Capacity</th><th>Price/Day</th><th>Actions</th></tr></thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.vehicle_id}>
                <td>{v.vehicle_name}</td>
                <td>{v.vehicle_type}</td>
                <td>{v.passenger_capacity}</td>
                <td>৳{v.price_per_day}</td>
                <td>
                  <button className="action-btn action-edit" onClick={() => startEdit(v)}>Edit</button>
                  <button className="action-btn action-reject" onClick={() => handleDelete(v.vehicle_id)}>Delete</button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && <tr><td colSpan="5">No vehicles added yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
