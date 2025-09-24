import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authUtils } from '../utils/auth';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true for dashboard routes, false for login route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const authStatus = await authUtils.checkAuthStatus();
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Subscribe to auth state changes
    const unsubscribe = authUtils.onAuthStateChange((authState) => {
      setIsAuthenticated(authState.isAuthenticated);
    });

    return unsubscribe;
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return <Loader />;
  }

  // If this is a protected route (dashboard) and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If this is the login route and user is already authenticated
  if (!requireAuth && isAuthenticated) {
    // Redirect to the page they were trying to access, or dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;