import { useEffect, useState } from 'react';
import api from '../../api/axios';
import '../../styles/dashboard.css';

const EMPTY_DEST = { name: '', category: 'Nature', description: '', image: '', entry_fee: 0 };
const CATEGORIES = ['Nature', 'Tea Gardens', 'Adventure', 'Religious Sites', 'Lakes', 'Photography'];
const TABS = ['Overview', 'Destinations', 'Guides', 'Drivers'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage destinations, and approve guides and drivers.</p>
      </div>

      <div className="tab-bar">
        {TABS.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && <OverviewTab />}
      {tab === 'Destinations' && <DestinationsTab />}
      {tab === 'Guides' && <ApprovalTab type="guides" />}
      {tab === 'Drivers' && <ApprovalTab type="drivers" />}
    </div>
  );
}

// ---- Overview: stat cards ----
function OverviewTab() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/stats').then((res) => setStats(res.data)); }, []);
  if (!stats) return <p>Loading stats...</p>;

  const cards = [
    ['Tourists', stats.tourists], ['Guides', stats.guides], ['Drivers', stats.drivers],
    ['Vehicles', stats.vehicles], ['Bookings', stats.bookings]
  ];
  return (
    <div className="stats-grid">
      {cards.map(([label, value]) => (
        <div className="stat-card" key={label}>
          <div className="value">{value}</div>
          <div className="label">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ---- Destinations: full CRUD ----
function DestinationsTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_DEST);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function load() { api.get('/destinations').then((res) => setItems(res.data)); }
  useEffect(load, []);

  function updateField(e) { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) await api.put(`/destinations/${editingId}`, form);
    else await api.post('/destinations', form);
    setForm(EMPTY_DEST); setEditingId(null); setShowForm(false); load();
  }

  function startEdit(d) {
    setForm({ name: d.name, category: d.category, description: d.description || '', image: d.image || '', entry_fee: d.entry_fee });
    setEditingId(d.destination_id); setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this destination?')) return;
    await api.delete(`/destinations/${id}`); load();
  }

  return (
    <div>
      <div className="tab-bar">
        <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => { setShowForm(!showForm); setForm(EMPTY_DEST); setEditingId(null); }}>
          {showForm ? 'Cancel' : '+ Add Destination'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <div className="form-field"><label>Name</label><input name="name" value={form.name} onChange={updateField} required /></div>
          <div className="form-field">
            <label>Category</label>
            <select name="category" value={form.category} onChange={updateField}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-field"><label>Entry Fee (BDT)</label><input name="entry_fee" type="number" min="0" value={form.entry_fee} onChange={updateField} /></div>
          <div className="form-field"><label>Image file name</label><input name="image" placeholder="e.g. jaflong.jpg" value={form.image} onChange={updateField} /></div>
          <div className="form-field full-row"><label>Description</label><textarea name="description" rows={2} value={form.description} onChange={updateField} /></div>
          <button className="btn btn-primary full-row" type="submit">{editingId ? 'Update' : 'Save'}</button>
        </form>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Category</th><th>Entry Fee</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.destination_id}>
                <td>{d.name}</td><td>{d.category}</td><td>৳{d.entry_fee}</td>
                <td>
                  <button className="action-btn action-edit" onClick={() => startEdit(d)}>Edit</button>
                  <button className="action-btn action-reject" onClick={() => handleDelete(d.destination_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Guides / Drivers: shared approval table ----
function ApprovalTab({ type }) {
  const [items, setItems] = useState([]);

  function load() { api.get(`/admin/${type}`).then((res) => setItems(res.data)); }
  useEffect(load, [type]);

  async function setStatus(id, status) {
    const idKey = type === 'guides' ? 'guide_id' : 'driver_id';
    await api.put(`/admin/${type}/${id}/status`, { status });
    setItems((prev) => prev.map((i) => (i[idKey] === id ? { ...i, status } : i)));
  }

  const idKey = type === 'guides' ? 'guide_id' : 'driver_id';

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((i) => (
            <tr key={i[idKey]}>
              <td>{i.name}</td><td>{i.email}</td><td>{i.phone}</td>
              <td><span className={`pill pill-${i.status}`}>{i.status}</span></td>
              <td>
                <button className="action-btn action-approve" onClick={() => setStatus(i[idKey], 'approved')}>Approve</button>
                <button className="action-btn action-reject" onClick={() => setStatus(i[idKey], 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan="5">No {type} yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
