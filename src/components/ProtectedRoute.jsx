// components/ProtectedRoute.jsx
// -----------------------------------------------------------------------
// Wraps a page that should only be visible to logged-in users, and
// optionally only to specific roles (e.g. only 'admin').
// Not used by any page yet in Part 1 - Part 2 will wrap the dashboards
// with it, e.g.:
//   <Route path="/admin" element={
//     <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
//   } />
// -----------------------------------------------------------------------

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
