
import { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed
import {
  Check,
  X,
  Clock,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Calendar,
  ListFilter,
  Search,
  Plus,
} from "lucide-react";

export default function Transactions() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTxnStatus, setSelectedTxnStatus] = useState("all");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    field: "time",
    direction: "desc",
  });
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      txnId: "TXN1234",
      mrchntId: "MRCHNT5678",
      utr: "UTR9876",
      amount: 100,
      status: "success",
      paymentMode: "UPI",
      AccNo: "1234567890",
      ifscCode: "IFSC0012345",
      payerMobile: "9876543210",
      payerEmail: "payer@example.com",
      time: "2025-04-23T10:00:00Z",
      currencyType: "INR",
      txnDate: "2025-04-23",
    },
    {
      id: 2,
      txnId: "TXN5678",
      mrchntId: "MRCHNT9012",
      utr: "UTR5432",
      amount: 250.5,
      status: "pending",
      paymentMode: "UPI",
      AccNo: "0987654321",
      ifscCode: "IFSC0098765",
      payerMobile: "9123456789",
      payerEmail: "payer2@example.com",
      time: "2025-04-22T15:30:00Z",
      currencyType: "INR",
      txnDate: "2025-04-22",
    },
    {
      id: 3,
      txnId: "TXN9012",
      mrchntId: "MRCHNT3456",
      utr: "UTR1122",
      amount: 500,
      status: "failed",
      paymentMode: "UPI",
      AccNo: "1122334455",
      ifscCode: "IFSC0023456",
      payerMobile: "9234567890",
      payerEmail: "payer3@example.com",
      time: "2025-04-21T09:15:00Z",
      currencyType: "INR",
      txnDate: "2025-04-21",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payoutForm, setPayoutForm] = useState({
    merchantId: 1,
    merchantTxnId: "",
    custName: "",
    custBankName: "",
    custAcountNumber: "",
    custPhone: "",
    custIfscCode: "",
    amount: "",
  });
  const [payoutError, setPayoutError] = useState(null);
  const [payoutSuccess, setPayoutSuccess] = useState(null);
  const [showPayoutForm, setShowPayoutForm] = useState(false);

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      const payload = {
        merchantId: 1,
        startDate: "2025-03-01",
        endDate: "2025-04-01",
        txnStatus: "All",
        searchValue: "",
        pageNum: 2,
        pageSize: 100,
      };

      try {
        const response = await axios.post(
          "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiPayoutList",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success && response.data.code === 0) {
          const mappedTransactions = (response.data.data || []).map((item) => ({
            id: item.id || item.transactionId || `temp-${Math.random()}`,
            txnId: item.txnId || "Unknown",
            mrchntId: item.mrchntId || item.merchantId || "Unknown",
            utr: item.utr || "Unknown",
            amount: parseFloat(item.amount) || 0,
            status: (item.status || "unknown").toLowerCase(),
            paymentMode: item.paymentMode || "Unknown",
            AccNo: item.AccNo || item.accountNumber || "Unknown",
            ifscCode: item.ifscCode || "Unknown",
            payerMobile: item.payerMobile || "Unknown",
            payerEmail: item.payerEmail || "Unknown",
            time: item.time || item.txnTime || new Date().toISOString(),
            currencyType: item.currencyType || "INR",
            txnDate: item.txnDate || item.date || new Date().toISOString().split("T")[0],
          }));
          setTransactions(mappedTransactions.length > 0 ? mappedTransactions : transactions);
        } else {
          setError("Failed to fetch transactions from API");
        }
      } catch (err) {
        setError(`Failed to fetch transactions: ${err.message}`);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle payout creation
  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    setPayoutError(null);
    setPayoutSuccess(null);

    try {
      const response = await axios.post(
        "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiCreatePayout",
        payoutForm,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success && response.data.code === 0) {
        setPayoutSuccess("Payout created successfully!");
        setPayoutForm({
          merchantId: 1,
          merchantTxnId: "",
          custName: "",
          custBankName: "",
          custAcountNumber: "",
          custPhone: "",
          custIfscCode: "",
          amount: "",
        });
        setShowPayoutForm(false);
        // Refresh transactions
        const fetchResponse = await axios.post(
          "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiPayoutList",
          {
            merchantId: 1,
            startDate: "2025-03-01",
            endDate: "2025-04-01",
            txnStatus: "All",
            searchValue: "",
            pageNum: 2,
            pageSize: 100,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        if (fetchResponse.data.success && fetchResponse.data.code === 0) {
          const mappedTransactions = (fetchResponse.data.data || []).map((item) => ({
            id: item.id || item.transactionId || `temp-${Math.random()}`,
            txnId: item.txnId || "Unknown",
            mrchntId: item.mrchntId || item.merchantId || "Unknown",
            utr: item.utr || "Unknown",
            amount: parseFloat(item.amount) || 0,
            status: (item.status || "unknown").toLowerCase(),
            paymentMode: item.paymentMode || "Unknown",
            AccNo: item.AccNo || item.accountNumber || "Unknown",
            ifscCode: item.ifscCode || "Unknown",
            payerMobile: item.payerMobile || "Unknown",
            payerEmail: item.payerEmail || "Unknown",
            time: item.time || item.txnTime || new Date().toISOString(),
            currencyType: item.currencyType || "INR",
            txnDate: item.txnDate || item.date || new Date().toISOString().split("T")[0],
          }));
          setTransactions(mappedTransactions.length > 0 ? mappedTransactions : transactions);
        }
      } else {
        setPayoutError(`Failed to create payout: ${response.data.message || "Unknown error"}`);
      }
    } catch (err) {
      setPayoutError(`Error creating payout: ${err.message}`);
      console.error("Payout API Error:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <Check size={14} className="text-emerald-500" />;
      case "failed":
        return <X size={14} className="text-red-500" />;
      case "pending":
        return <Clock size={14} className="text-amber-500" />;
      default:
        return null;
    }
  };

  const formatAmount = (amount, currencyType) => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyType || "INR",
      minimumFractionDigits: 2,
    });
    return formatter.format(amount || 0);
  };

  const formatUtr = (utrStr) => {
    return utrStr || "N/A";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const date = new Date(timeStr);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleSort = (field) => {
    let direction = "asc";
    if (sortConfig.field === field && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ field, direction });
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return <ChevronDown size={14} className="text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="text-blue-600" />
    ) : (
      <ArrowDown size={14} className="text-blue-600" />
    );
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      if (dateRange.start && dateRange.end) {
        const txnDate = new Date(transaction.txnDate);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        if (txnDate < startDate || txnDate > endDate) {
          return false;
        }
      } else if (dateRange.start) {
        const txnDate = new Date(transaction.txnDate);
        const startDate = new Date(dateRange.start);
        if (txnDate < startDate) {
          return false;
        }
      } else if (dateRange.end) {
        const txnDate = new Date(transaction.txnDate);
        const endDate = new Date(dateRange.end);
        if (txnDate > endDate) {
          return false;
        }
      }
      if (
        selectedTxnStatus !== "all" &&
        transaction.status !== selectedTxnStatus
      ) {
        return false;
      }
      if (
        selectedPaymentMode !== "all" &&
        transaction.paymentMode !== selectedPaymentMode
      ) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          String(transaction.id || "").toLowerCase().includes(query) ||
          (transaction.txnId || "").toLowerCase().includes(query) ||
          (transaction.mrchntId || "").toLowerCase().includes(query) ||
          (transaction.utr || "").toLowerCase().includes(query) ||
          String(transaction.amount || "").includes(query) ||
          (transaction.status || "").toLowerCase().includes(query) ||
          (transaction.paymentMode || "").toLowerCase().includes(query) ||
          (transaction.AccNo || "").toLowerCase().includes(query) ||
          (transaction.ifscCode || "").toLowerCase().includes(query) ||
          (transaction.payerMobile || "").includes(query) ||
          (transaction.payerEmail || "").toLowerCase().includes(query) ||
          (formatDate(transaction.txnDate) || "").toLowerCase().includes(query) ||
          (formatTime(transaction.time) || "").toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const { field, direction } = sortConfig;
      const aValue = a[field] || "";
      const bValue = b[field] || "";
      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-8xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all payment transactions
            </p>
          </div>
          <button
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowPayoutForm(!showPayoutForm)}
          >
            <Plus size={16} className="mr-2" />
            {showPayoutForm ? "Hide Payout Form" : "Create Payout"}
          </button>
        </div>

        {/* Payout Form */}
        {showPayoutForm && (
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Payout</h2>
            {payoutError && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {payoutError}
              </div>
            )}
            {payoutSuccess && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                {payoutSuccess}
              </div>
            )}
            <form onSubmit={handlePayoutSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant Transaction ID
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={payoutForm.merchantTxnId}
                  onChange={(e) =>
                    setPayoutForm({ ...payoutForm, merchantTxnId: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={payoutForm.custName}
                  onChange={(e) =>
                    setPayoutForm({ ...payoutForm, custName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={payoutForm.custBankName}
                  onChange={(e) =>
                    setPayoutForm({ ...payoutForm, custBankName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={payoutForm.custAcountNumber}
                  onChange={(e) =>
                    setPayoutForm({ ...payoutForm, custAcountNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={payoutForm.custPhone}
                  onChange={(e) =>
                    setPayoutForm({ ...payoutForm, custPhone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={payoutForm.custIfscCode}
                  onChange={(e) =>
                    setPayoutForm({ ...payoutForm, custIfscCode: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={payoutForm.amount}
                  onChange={(e) =>
                    setPayoutForm({ ...payoutForm, amount: e.target.value })
                  }
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Payout
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-5 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />
                </div>
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  className="pl-4 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <button
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <ListFilter size={16} className="mr-2 text-gray-500" />
                  Filters
                  <ChevronDown
                    size={16}
                    className={`ml-2 text-gray-500 transition-transform ${
                      filterOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {filterOpen && (
                  <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-2 px-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Status
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={selectedTxnStatus}
                        onChange={(e) => setSelectedTxnStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="success">Success</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Mode
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={selectedPaymentMode}
                        onChange={(e) => setSelectedPaymentMode(e.target.value)}
                      >
                        <option value="all">All Modes</option>
                        <option value="UPI">UPI</option>
                      </select>
                    </div>
                    <div className="pt-2 flex justify-end border-t border-gray-100 mt-3">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setSelectedTxnStatus("all");
                          setSelectedPaymentMode("all");
                        }}
                      >
                        Reset filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative flex-grow md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by TXN ID, Merchant ID, UTR, Mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Transactions Table */}
        {!loading && !error && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "id",
                      "txnId",
                      "mrchntId",
                      "utr",
                      "amount",
                      "status",
                      "paymentMode",
                      "AccNo",
                      "ifscCode",
                      "txnDate",
                      "time",
                    ].map((key) => (
                      <th
                        key={key}
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort(key)}
                        >
                          {key === "txnDate"
                            ? "Date"
                            : key === "time"
                            ? "Time"
                            : key}
                          {getSortIcon(key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          {transaction.id}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.txnId}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.mrchntId}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatUtr(transaction.utr)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatAmount(
                            transaction.amount,
                            transaction.currencyType
                          )}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {getStatusIcon(transaction.status)}
                            <span className="ml-1 capitalize">
                              {transaction.status}
                            </span>
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.paymentMode}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.AccNo}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.payerMobile}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.ifscCode}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(transaction.txnDate)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(transaction.time)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}