import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <i className="fas fa-heartbeat" style={{ fontSize: '3rem', color: '#dc3545', animation: 'pulse 1.5s infinite' }}></i>
      </div>
    );
  }

  if (!user) {
    // Redirect to matching login page, preserving the intended destination
    if (allowedRoles && allowedRoles.includes('doctor')) {
      return <Navigate to={`/doctor-login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
    }
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
