import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard.css';

export default function GuideDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <p>Manage your guide profile and upcoming bookings here.</p>
      </div>

      <div className={`status-banner status-${user.status}`}>
        {user.status === 'pending' && 'Your guide account is pending admin approval. You will be able to receive bookings once approved.'}
        {user.status === 'approved' && 'Your guide account is approved. Tourists can now find and book you.'}
        {user.status === 'rejected' && 'Your guide application was rejected. Please contact the admin for details.'}
      </div>

      {/* Booking requests table arrives in Part 3 once the guide booking system exists */}
      <p>No booking requests yet.</p>
    </div>
  );
}
