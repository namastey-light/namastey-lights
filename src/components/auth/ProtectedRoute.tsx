import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAdmin, loading } = useAuth();

  // Check for tab-specific session validation
  useEffect(() => {
    const validateSession = () => {
      const currentTabId = sessionStorage.getItem('current_tab_id');
      const adminSession = currentTabId ? sessionStorage.getItem(`admin_session_${currentTabId}`) : null;
      
      // If no valid tab session exists, redirect to login
      if (user && (!currentTabId || adminSession !== 'true')) {
        console.log('Invalid session for this tab - redirecting to login');
        window.location.href = '/admin/login';
        return;
      }
    };

    // Validate session immediately
    validateSession();

    // Auto logout on tab change/window focus
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became hidden - start logout timer
        const logoutTimer = setTimeout(() => {
          if (user) {
            console.log('Auto logout due to tab change');
            sessionStorage.clear();
            window.location.href = '/admin/login';
          }
        }, 30000); // 30 seconds of inactivity
        
        // Store timer ID to clear it if tab becomes visible again
        (window as any).logoutTimer = logoutTimer;
      } else {
        // Tab became visible - clear logout timer and validate session
        if ((window as any).logoutTimer) {
          clearTimeout((window as any).logoutTimer);
          (window as any).logoutTimer = null;
        }
        
        // Re-validate session when tab becomes visible
        validateSession();
      }
    };

    const handleBeforeUnload = () => {
      // Clear session data when window is closing
      sessionStorage.clear();
    };

    const handleStorageChange = (e: StorageEvent) => {
      // If session storage is cleared in another tab, logout this tab too
      if (e.key?.startsWith('admin_session_') || e.key === 'current_tab_id') {
        if (!e.newValue && user) {
          window.location.href = '/admin/login';
        }
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('storage', handleStorageChange);
      
      // Clear timer on cleanup
      if ((window as any).logoutTimer) {
        clearTimeout((window as any).logoutTimer);
      }
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-pink mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Strict authentication check - no demo mode
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}