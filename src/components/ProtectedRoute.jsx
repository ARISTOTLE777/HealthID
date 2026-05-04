import { Navigate } from 'react-router-dom';
import { getAdminSession } from '../lib/storage';

export default function ProtectedRoute({ children }) {
  const session = getAdminSession();
  if (!session) return <Navigate to="/admin/login" replace />;
  return children;
}
