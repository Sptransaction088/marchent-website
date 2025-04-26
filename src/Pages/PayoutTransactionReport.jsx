import { useState } from "react";
import {
  Check,
  X,
  Clock,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  EyeIcon,
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
    field: "time", // Default sort by time
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
      txnDate: "2025-04-23", // Added txnDate for date filtering
    },
    // Add more transaction data here
  ]);

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
      currency: currencyType,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  const formatUtr = (utrStr) => {
    return utrStr;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
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
          String(transaction.id).toLowerCase().includes(query) ||
          transaction.txnId.toLowerCase().includes(query) ||
          transaction.mrchntId.toLowerCase().includes(query) ||
          transaction.utr.toLowerCase().includes(query) ||
          String(transaction.amount).includes(query) ||
          transaction.status.toLowerCase().includes(query) ||
          transaction.paymentMode.toLowerCase().includes(query) ||
          transaction.AccNo?.toLowerCase().includes(query) ||
          transaction.ifscCode?.toLowerCase().includes(query) ||
          transaction.payerMobile?.includes(query) ||
          transaction.payerEmail?.toLowerCase().includes(query) ||
          formatDate(transaction.txnDate).toLowerCase().includes(query) ||
          formatTime(transaction.time).toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      const { field, direction } = sortConfig;

      if (a[field] < b[field]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[field] > b[field]) {
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
                  Status
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
                        Transaction Report Status
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={selectedTxnStatus}
                        onChange={(e) => setSelectedTxnStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="inprogress">InProgress</option>
                        <option value="queued">Queued</option>
                        <option value="success">Success</option>
                        
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
                    "txnDate", // Added Date column
                    "time", // Added Time column
                  ].map((key) => (
                    <th
                      key={key}
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort(key)}
                      >
                        {key === "txnDate" ? "Date" : key === "time" ? "Time" : key}
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
                      colSpan="11" // Updated colspan to includeclassName="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }