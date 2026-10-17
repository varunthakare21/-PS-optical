import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ allowedRoles, redirectTo = '/' }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to={redirectTo} replace />;
  if (!allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard
    const dashboardMap: Record<string, string> = {
      customer: '/customer/dashboard',
      worker: '/worker/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={dashboardMap[user.role] || '/'} replace />;
  }
  return <Outlet />;
}
