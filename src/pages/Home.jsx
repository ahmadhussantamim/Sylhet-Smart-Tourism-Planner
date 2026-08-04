import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HillDivider from '../components/HillDivider';
import api from '../api/axios';
import '../styles/home.css';

export default function Home() {
  const [featuredDestinations, setFeaturedDestinations] = useState([]);

  // Pull the first 3 destinations from the real backend now that
  // Part 2 has a working /api/destinations endpoint.
  useEffect(() => {
    api.get('/destinations').then((res) => setFeaturedDestinations(res.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <span className="hero-eyebrow">Sylhet, Bangladesh</span>
            <h1>Plan your Sylhet trip like a local.</h1>
            <p className="lead">
              Discover tea gardens, waterfalls and blue lakes, then book a
              trusted local guide and a comfortable vehicle - all from one
              simple planner.
            </p>
            <div className="hero-actions">
              <Link to="/plan-trip" className="btn btn-primary">Plan My Trip</Link>
              <Link to="/destinations" className="btn btn-outline">Browse Destinations</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/src/assets/images/hero-banner.jpg" alt="Tea gardens of Sylhet" />
          </div>
        </div>
      </section>

      <HillDivider />

      {/* ---- Travel Services ---- */}
      <section className="section">
        <div className="section-header">
          <span className="eyebrow">How it works</span>
          <h2>Three ways to start exploring</h2>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="icon">🗺️</div>
            <h3>Plan My Trip</h3>
            <p>Tell us your budget, days and interests - get a ready-made itinerary.</p>
            <Link to="/plan-trip" className="btn btn-primary">Start Planning</Link>
          </div>
          <div className="service-card">
            <div className="icon">👨‍💼</div>
            <h3>Book a Local Guide</h3>
            <p>Approved, experienced guides who know Sylhet inside out.</p>
            <Link to="/guides" className="btn btn-primary">View Guides</Link>
          </div>
          <div className="service-card">
            <div className="icon">🚗</div>
            <h3>Book a Vehicle</h3>
            <p>From private cars to tourist buses, for any group size.</p>
            <Link to="/vehicles" className="btn btn-primary">View Vehicles</Link>
          </div>
        </div>
      </section>

      <HillDivider />

      {/* ---- Featured Destinations ---- */}
      <section className="section">
        <div className="section-header">
          <span className="eyebrow">Featured</span>
          <h2>Places worth the journey</h2>
        </div>
        <div className="card-grid">
          {featuredDestinations.map((d) => (
            <div className="card" key={d.destination_id}>
              <div className="card-image">
                <img src={`/src/assets/images/${d.image}`} alt={d.name} />
              </div>
              <div className="card-body">
                <span className="card-tag">{d.category}</span>
                <h3>{d.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HillDivider />

      {/* ---- About Sylhet ---- */}
      <section className="section">
        <div className="about-section">
          <div>
            <span className="eyebrow">About Sylhet</span>
            <h2>The land of two leaves and a bud</h2>
            <p>
              Sylhet is Bangladesh's tea capital - a region of rolling green
              estates, swamp forests, and rivers that turn turquoise in the
              dry season. It's a place best explored slowly, with someone
              who knows the roads and the stories behind them.
            </p>
          </div>
          <div className="hero-image">
            <img src="/src/assets/images/tea-garden.jpg" alt="Sylhet tea garden" />
          </div>
        </div>
      </section>

      <HillDivider />

      {/* ---- Testimonials ---- */}
      <section className="section">
        <div className="section-header">
          <span className="eyebrow">Traveler notes</span>
          <h2>What visitors are saying</h2>
        </div>
        <div className="card-grid">
          <div className="testimonial-card">
            <p className="quote">"Our guide knew every corner of Jaflong. The trip felt effortless."</p>
            <p className="testimonial-author">— Akkas Ali, The UK</p>
          </div>
          <div className="testimonial-card">
            <p className="quote">"Booking the microbus for our family of six took five minutes."</p>
            <p className="testimonial-author">— Jorina, Chattogram</p>
          </div>
          <div className="testimonial-card">
            <p className="quote">"The trip planner suggested exactly the kind of quiet nature spots we wanted."</p>
            <p className="testimonial-author">— Modon, Sylhet</p>
          </div>
        </div>
      </section>
    </>
  );
}
