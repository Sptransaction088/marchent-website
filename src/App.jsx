import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function AppLayout() {
  // Check if the current path is login or register
  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

  return (
    <>
      {isAuthPage ? (
        // For login and register pages, only show the content without sidebar
        <div className="h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>© 2025 SP Transaction Hub. All rights reserved.</p>
          </div>
        </div>
      ) : (
        // For dashboard and other pages, show with sidebar
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content */}
          <div className="flex-1 overflow-auto flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
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
            
            {/* Footer with copyright - This will appear on all dashboard pages */}
            <div className="p-4 text-center text-sm text-slate-500 border-t border-slate-200">
              <p>© 2025 SP Transaction Hub Technology Pvt. Ltd. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}