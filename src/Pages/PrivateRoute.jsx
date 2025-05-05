import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * PrivateRoute component that protects routes requiring authentication
 * Redirects to login if no valid auth token is found
 */
const PrivateRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check for authentication token
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      
      if (token) {
        // You could add additional token validation here
        // For example, check if token is expired or valid format
        setIsAuthenticated(true);
      } else {
        console.log("No auth token found, redirecting to login");
        setIsAuthenticated(false);
      }
      
      setIsChecking(false);
    };

    checkAuth();

    // Listen for storage events (in case token is removed in another tab)
    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-blue-600"></div>
          <p className="mt-2 text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the return URL in state
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If authenticated, render the protected component
  return children;
};

export default PrivateRoute;