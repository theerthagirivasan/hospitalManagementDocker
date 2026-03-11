import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="page-wrapper container" style={{textAlign: 'center'}}><h2>Loading...</h2></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some(role => user.roles.includes(role))) {
    // If not authorized, redirect to their respective dashboard
    if (user.roles.includes('ROLE_ADMIN')) return <Navigate to="/admin" replace />;
    if (user.roles.includes('ROLE_DOCTOR')) return <Navigate to="/doctor" replace />;
    return <Navigate to="/patient" replace />;
  }

  return children;
};

export default ProtectedRoute;
