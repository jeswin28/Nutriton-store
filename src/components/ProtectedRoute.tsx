import { ReactNode, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  onUnauthorized: () => void;
}

export const ProtectedRoute = ({ children, requireAdmin = false, onUnauthorized }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        onUnauthorized();
      } else if (requireAdmin && !isAdmin) {
        onUnauthorized();
      }
    }
  }, [user, loading, requireAdmin, isAdmin, onUnauthorized]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896]"></div>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};