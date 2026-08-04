import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard.css';

export default function TouristDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <p>Plan a trip, or browse guides and vehicles to book for your next visit.</p>
      </div>

      <div className="quick-links">
        <div className="quick-link-card">
          <h3>🗺️ Plan a Trip</h3>
          <p>Get a ready-made itinerary based on your budget and interests.</p>
          <Link to="/plan-trip" className="btn btn-primary">Plan Now</Link>
        </div>
        <div className="quick-link-card">
          <h3>👨‍💼 Find a Guide</h3>
          <p>Browse approved local guides and send a booking request.</p>
          <Link to="/guides" className="btn btn-outline">Browse Guides</Link>
        </div>
        <div className="quick-link-card">
          <h3>🚗 Find a Vehicle</h3>
          <p>Pick a vehicle that fits your group size and budget.</p>
          <Link to="/vehicles" className="btn btn-outline">Browse Vehicles</Link>
        </div>
      </div>

      {/* Booking history table arrives in Part 3 once the booking system exists */}
    </div>
  );
}
