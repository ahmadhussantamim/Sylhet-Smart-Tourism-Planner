import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Destinations from './pages/Destinations';
import GuidesList from './pages/GuidesList';
import VehiclesList from './pages/VehiclesList';
import ComingSoon from './pages/ComingSoon';
import TouristDashboard from './pages/dashboards/TouristDashboard';
import GuideDashboard from './pages/dashboards/GuideDashboard';
import DriverDashboard from './pages/dashboards/DriverDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/guides" element={<GuidesList />} />
          <Route path="/vehicles" element={<VehiclesList />} />

          {/* Placeholder routes - built in Part 3 */}
          <Route path="/plan-trip" element={<ComingSoon title="Smart Trip Planner" />} />
          <Route path="/about" element={<ComingSoon title="About Sylhet Trails" />} />
          <Route path="/contact" element={<ComingSoon title="Contact Us" />} />

          {/* Role-protected dashboards */}
          <Route path="/tourist/dashboard" element={
            <ProtectedRoute allowedRoles={['tourist']}><TouristDashboard /></ProtectedRoute>
          } />
          <Route path="/guide/dashboard" element={
            <ProtectedRoute allowedRoles={['guide']}><GuideDashboard /></ProtectedRoute>
          } />
          <Route path="/driver/dashboard" element={
            <ProtectedRoute allowedRoles={['driver']}><DriverDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={<ComingSoon title="Page Not Found" />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
