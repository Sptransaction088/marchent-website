import { useState, useEffect } from "react";
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
        const response = await fetch(
          "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiPayoutList",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result); // Debug: Log API response

        // Map API response to expected format
        const mappedTransactions = (result.data || []).map((item) => ({
          id: item.id || item.transactionId || `temp-${Math.random()}`, // Fallback ID
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

        console.log("Mapped Transactions:", mappedTransactions); // Debug: Log mapped data
        setTransactions(mappedTransactions.length > 0 ? mappedTransactions : transactions); // Fallback to sample data if empty
      } catch (err) {
        console.error("API Error:", err); // Debug: Log error
        setError(`Failed to fetch transactions: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
      // Apply date filter
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

      // Apply status filter
      if (
        selectedTxnStatus !== "all" &&
        transaction.status !== selectedTxnStatus
      ) {
        return false;
      }

      // Apply payment mode filter
      if (
        selectedPaymentMode !== "all" &&
        transaction.paymentMode !== selectedPaymentMode
      ) {
        return false;
      }

      // Apply search query
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

  // Debug: Log filtered transactions
  console.log("Filtered Transactions:", filteredTransactions);

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
        </div>

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-5 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Date filter */}
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

              {/* Filter button */}
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
                        {/* Add other payment modes if available in your data */}
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

              {/* Search input */}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.paymentMode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.AccNo}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.payerMobile}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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