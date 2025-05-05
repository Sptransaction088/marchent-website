import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
// Import your page components
import PayinTransactions from "./Pages/PayinTransactions";
import PayouTransactions from "./Pages/PayouTransactions";
import AddBalance from "./Pages/AddBalance";
import Payment from "./Pages/Payment";
import PayinTransactionReport from "./Pages/PayinTransactionReport";
import PayoutTransactionReport from "./Pages/PayoutTransactionReport";
import Settlement from "./Pages/Settlement";
import TopUpReport from "./Pages/TopUpReport";
import DeveloperSettings from "./Pages/DeveloperSettings";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PrivateRoute from "./Pages/PrivateRoute";

function AppLayout() {
  // State to track authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for token on mount and when it changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };

    // Initial check
    checkAuth();

    // Add event listener for storage changes
    window.addEventListener("storage", checkAuth);
    
    // Clean up
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Check if the current path is login or register
  const isAuthPage =
    window.location.pathname === "/login" ||
    window.location.pathname === "/register";

  return (
    <Routes>
      {/* Public routes that don't require authentication */}
      <Route path="/login" element={
        <div className="h-screen">
          <Login />
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>© 2025 SP Transaction Hub. All rights reserved.</p>
          </div>
        </div>
      } />
      
      <Route path="/register" element={
        <div className="h-screen">
          <Register />
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>© 2025 SP Transaction Hub. All rights reserved.</p>
          </div>
        </div>
      } />

      {/* Root route redirects based on authentication status */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />

      {/* Protected routes that require authentication */}
      <Route path="/*" element={
        <PrivateRoute>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 overflow-auto flex flex-col">
              <div className="flex-1">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/payin-transactions" element={<PayinTransactions />} />
                  <Route path="/payout-transactions" element={<PayouTransactions />} />
                  <Route path="/add-balances" element={<AddBalance />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/payin-transaction-report" element={<PayinTransactionReport />} />
                  <Route path="/payout-transaction-report" element={<PayoutTransactionReport />} />
                  <Route path="/settlement" element={<Settlement />} />
                  <Route path="/top-up-report" element={<TopUpReport />} />
                  <Route path="/developer-setting" element={<DeveloperSettings />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>

              {/* Footer with copyright */}
              <div className="p-4 text-center text-sm text-slate-500 border-t border-slate-200">
                <p>
                  © 2025 SP Transaction Hub Technology Pvt. Ltd. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}