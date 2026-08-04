import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const ROLES = [
  { value: 'tourist', label: 'Tourist' },
  { value: 'guide', label: 'Guide' },
  { value: 'driver', label: 'Driver' }
];

export default function Register() {
  const [role, setRole] = useState('tourist');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  // Role-specific extra fields
  const [guideInfo, setGuideInfo] = useState({ experience: '', languages: '', description: '', dailyCharge: '' });
  const [driverInfo, setDriverInfo] = useState({ drivingLicense: '' });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  function updateField(setter) {
    return (e) => setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, role, guideInfo, driverInfo };
      const user = await register(payload);

      // Guides/drivers need admin approval, so send them to a
      // "pending approval" friendly landing spot instead of a full
      // dashboard until Part 2 builds the approval flow.
      if (user.role === 'tourist') navigate('/tourist/dashboard');
      else navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">Join Sylhet Trails</span>
        <h1>Create an account</h1>
        <p className="subtitle">Register as a Tourist, Guide, or Vehicle Driver.</p>

        <div className="role-tabs">
          {ROLES.map((r) => (
            <button
              type="button"
              key={r.value}
              className={`role-tab ${role === r.value ? 'active' : ''}`}
              onClick={() => setRole(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" value={form.name} onChange={updateField(setForm)} required />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={updateField(setForm)} required />
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={updateField(setForm)} />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={updateField(setForm)} required minLength={6} />
          </div>

          {/* ---- Guide-only fields ---- */}
          {role === 'guide' && (
            <>
              <div className="form-field">
                <label htmlFor="experience">Experience</label>
                <input id="experience" name="experience" placeholder="e.g. 3 years" value={guideInfo.experience} onChange={updateField(setGuideInfo)} />
              </div>
              <div className="form-field">
                <label htmlFor="languages">Languages Spoken</label>
                <input id="languages" name="languages" placeholder="e.g. Bangla, English" value={guideInfo.languages} onChange={updateField(setGuideInfo)} />
              </div>
              <div className="form-field">
                <label htmlFor="description">Short Description</label>
                <textarea id="description" name="description" rows={3} value={guideInfo.description} onChange={updateField(setGuideInfo)} />
              </div>
              <div className="form-field">
                <label htmlFor="dailyCharge">Daily Charge (BDT)</label>
                <input id="dailyCharge" name="dailyCharge" type="number" min="0" value={guideInfo.dailyCharge} onChange={updateField(setGuideInfo)} required />
              </div>
            </>
          )}

          {/* ---- Driver-only fields ---- */}
          {role === 'driver' && (
            <div className="form-field">
              <label htmlFor="drivingLicense">Driving License Number</label>
              <input id="drivingLicense" name="drivingLicense" value={driverInfo.drivingLicense} onChange={updateField(setDriverInfo)} required />
            </div>
          )}

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
