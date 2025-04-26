import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./pages/Dashboard"; // Import your page components
import PayinTransactions from "./Pages/PayinTransactions";
import PayouTransactions from "./Pages/PayouTransactions";
import AddBalance from "./Pages/AddBalance";
import Payment from "./Pages/Payment";
import CreateBulkPayout from "./Pages/CreateBulkPayout";
import BulkData from "./Pages/BulkData";
import PayinTransactionReport from "./Pages/PayinTransactionReport";
import PayoutTransactionReport from "./Pages/PayoutTransactionReport";
import Settlement from "./Pages/Settlement";
 
function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payin-transactions" element={<PayinTransactions />} />
          <Route path="/payout-transactions" element={<PayouTransactions />} />
          <Route path="/add-balances" element={<AddBalance />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/create-bulk-payout" element={<CreateBulkPayout />} />
          <Route path="/bulk-data" element={<BulkData />} />
          <Route path="/payin-transaction-report" element={<PayinTransactionReport />} />
          <Route path="/payout-transaction-report" element={<PayoutTransactionReport />} />
          <Route path="/settlement" element={<Settlement />} />
         
         

        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}