import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JSX } from 'react';

const AdminRoute = ({ element }: { element: JSX.Element }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default AdminRoute;
