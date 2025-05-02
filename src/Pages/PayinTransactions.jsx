import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Download,
  RefreshCw,
  Check,
  X,
  Clock,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ListFilter,
} from "lucide-react";

// Sample data as fallback
const sampleTransactions = [
  {
    merchantCode: "MC12345",
    merchantFirstName: "Acme",
    merchantLastName: "Corp",
    merchantTxnId: "MTXN9876",
    txnAmount: 1000.50,
    finalAmount: 950.00,
    txnStatus: "success",
    bankStatus: "approved",
    rrn: "123456789012",
    bankTxnId: "BTXN001",
    custMobileNo: "9876543210",
    custVpa: "john@upi",
    custName: "John Smith",
    payerVpa: "john@upi",
    upiRefId: "UTR123",
    txndate: "2025-03-15",
    time: "14:35:28",
    currencyType: "INR",
    paymentMode: "UPI",
  },
  {
    merchantCode: "MC67890",
    merchantFirstName: "Beta",
    merchantLastName: "Solutions",
    merchantTxnId: "MTXN5432",
    txnAmount: 500.75,
    finalAmount: 500.75,
    txnStatus: "failed",
    bankStatus: "rejected",
    rrn: "987654321012",
    bankTxnId: "BTXN002",
    custMobileNo: "9876543211",
    custVpa: "sarah@upi",
    custName: "Sarah Johnson",
    payerVpa: "sarah@upi",
    upiRefId: "UTR456",
    txndate: "2025-03-20",
    time: "12:22:18",
    currencyType: "INR",
    paymentMode: "IMPS",
  },
  {
    merchantCode: "MC11223",
    merchantFirstName: "Gamma",
    merchantLastName: "Tech",
    merchantTxnId: "MTXN1122",
    txnAmount: 2500.00,
    finalAmount: 2400.00,
    txnStatus: "pending",
    bankStatus: "processing",
    rrn: "112233445566",
    bankTxnId: "BTXN003",
    custMobileNo: "9876543212",
    custVpa: "mike@upi",
    custName: "Mike Brown",
    payerVpa: "mike@upi",
    upiRefId: "UTR789",
    txndate: "2025-03-25",
    time: "09:15:45",
    currencyType: "INR",
    paymentMode: "UPI",
  },
  {
    merchantCode: "MC44556",
    merchantFirstName: "Delta",
    merchantLastName: "Enterprises",
    merchantTxnId: "MTXN3344",
    txnAmount: 750.25,
    finalAmount: 750.25,
    txnStatus: "success",
    bankStatus: "approved",
    rrn: "445566778899",
    bankTxnId: "BTXN004",
    custMobileNo: "9876543213",
    custVpa: "emma@upi",
    custName: "Emma Wilson",
    payerVpa: "emma@upi",
    upiRefId: "UTR012",
    txndate: "2025-04-01",
    time: "16:50:12",
    currencyType: "INR",
    paymentMode: "NEFT",
  },
];

export default function PayinTransactions() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTxnStatus, setSelectedTxnStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    field: "txndate",
    direction: "desc",
  });
  const [transactions, setTransactions] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(100);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiPayinList",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add authentication header if required, e.g.:
              // "Authorization": "Bearer your-token"
            },
            body: JSON.stringify({
              merchantId: 1,
              startDate: dateRange.start || "2025-03-01",
              endDate: dateRange.end || "2025-04-01",
              txnStatus: selectedTxnStatus === "all" ? "All" : selectedTxnStatus,
              searchValue: searchQuery || "",
              pageNum: pageNum || 1,
              pageSize: pageSize || 100,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2)); // Log for debugging

        // Handle different possible response structures
        const transactionList = data?.data?.list || data?.list || data?.transactions || [];
        const total = data?.data?.totalRecords || data?.totalRecords || data?.total || 0;

        if (!Array.isArray(transactionList)) {
          throw new Error("Transaction list is not an array");
        }

        setTransactions(transactionList.length > 0 ? transactionList : sampleTransactions);
        setTotalRecords(transactionList.length > 0 ? total : sampleTransactions.length);
      } catch (err) {
        console.error("Fetch Error:", err); // Log error for debugging
        setError(err.message || "Failed to fetch transactions");
        setTransactions(sampleTransactions); // Fallback to sample data
        setTotalRecords(sampleTransactions.length);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [dateRange, selectedTxnStatus, searchQuery, pageNum, pageSize]);

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
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
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
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
      // Apply status filter
      if (
        selectedTxnStatus !== "all" &&
        transaction.txnStatus?.toLowerCase() !== selectedTxnStatus
      ) {
        return false;
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          (transaction.merchantCode?.toLowerCase() || "").includes(query) ||
          (transaction.merchantFirstName?.toLowerCase() || "").includes(query) ||
          (transaction.merchantLastName?.toLowerCase() || "").includes(query) ||
          (transaction.merchantTxnId?.toLowerCase() || "").includes(query) ||
          (transaction.txnAmount?.toString() || "").includes(query) ||
          (transaction.finalAmount?.toString() || "").includes(query) ||
          (transaction.txnStatus?.toLowerCase() || "").includes(query) ||
          (transaction.bankStatus?.toLowerCase() || "").includes(query) ||
          (transaction.rrn || "").includes(query) ||
          (transaction.bankTxnId?.toLowerCase() || "").includes(query) ||
          (transaction.custMobileNo || "").includes(query) ||
          (transaction.custVpa?.toLowerCase() || "").includes(query) ||
          (transaction.custName?.toLowerCase() || "").includes(query) ||
          (transaction.payerVpa?.toLowerCase() || "").includes(query) ||
          (transaction.upiRefId?.toLowerCase() || "").includes(query) ||
          (formatDate(transaction.txndate) || "").toLowerCase().includes(query) ||
          (transaction.time?.toLowerCase() || "").includes(query)
        );
      }

      // Apply date range filter
      if (dateRange.start && dateRange.end) {
        const txnDate = new Date(transaction.txndate);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return txnDate >= startDate && txnDate <= endDate;
      }

      return true;
    })
    .sort((a, b) => {
      const { field, direction } = sortConfig;
      const valA = a[field] || "";
      const valB = b[field] || "";
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-8xl">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all payment transactions
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setPageNum(1)}
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download size={16} className="mr-2" />
              Export
            </button>
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
                    <div className="pt-2 flex justify-end border-t border-gray-100 mt-3">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => setSelectedTxnStatus("all")}
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
                  placeholder="Search by Merchant Code, TXN ID, Mobile, VPA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading && (
            <div className="flex justify-center py-12">
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          )}
          {error && (
            <div className="flex justify-center py-12">
              <p className="text-red-500">Error: {error} (Using sample data)</p>
            </div>
          )}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("merchantCode")}
                      >
                        Merchant Code
                        {getSortIcon("merchantCode")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("merchantFirstName")}
                      >
                        Merchant First Name
                        {getSortIcon("merchantFirstName")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("merchantLastName")}
                      >
                        Merchant Last Name
                        {getSortIcon("merchantLastName")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("merchantTxnId")}
                      >
                        Merchant TXN ID
                        {getSortIcon("merchantTxnId")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("txnAmount")}
                      >
                        TXN Amount
                        {getSortIcon("txnAmount")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("finalAmount")}
                      >
                        Final Amount
                        {getSortIcon("finalAmount")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("txnStatus")}
                      >
                        TXN Status
                        {getSortIcon("txnStatus")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("bankStatus")}
                      >
                        Bank Status
                        {getSortIcon("bankStatus")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("rrn")}
                      >
                        RRN
                        {getSortIcon("rrn")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("bankTxnId")}
                      >
                        Bank TXN ID
                        {getSortIcon("bankTxnId")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("custMobileNo")}
                      >
                        Cust. Mobile No.
                        {getSortIcon("custMobileNo")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("custVpa")}
                      >
                        Cust. VPA
                        {getSortIcon("custVpa")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("custName")}
                      >
                        Cust. Name
                        {getSortIcon("custName")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("payerVpa")}
                      >
                        Payer VPA
                        {getSortIcon("payerVpa")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("upiRefId")}
                      >
                        UPI Ref ID
                        {getSortIcon("upiRefId")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("txndate")}
                      >
                        TXN Date
                        {getSortIcon("txndate")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("time")}
                      >
                        TXN Time
                        {getSortIcon("time")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr
                        key={`${transaction.merchantTxnId || "unknown"}-${transaction.txndate || "unknown"}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transaction.merchantCode || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.merchantFirstName || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.merchantLastName || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transaction.merchantTxnId || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatAmount(
                              transaction.txnAmount,
                              transaction.currencyType
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatAmount(
                              transaction.finalAmount,
                              transaction.currencyType
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              transaction.txnStatus
                            )}`}
                          >
                            {getStatusIcon(transaction.txnStatus)}
                            <span className="ml-1 capitalize">
                              {transaction.txnStatus || "Unknown"}
                            </span>
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.bankStatus || "N/A"}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.rrn || "N/A"}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.bankTxnId || "N/A"}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.custMobileNo || "N/A"}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.custVpa || "N/A"}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.custName || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.payerVpa || "N/A"}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.upiRefId || "N/A"}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(transaction.txndate)}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transaction.time || "N/A"}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="17" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Search size={40} className="text-gray-400 mb-3" />
                          <p className="text-gray-500 text-lg font-medium">
                            No transactions found
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          {filteredTransactions.length > 0 && !loading && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  disabled={pageNum === 1}
                  onClick={() => setPageNum(pageNum - 1)}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={pageNum * pageSize >= totalRecords}
                  onClick={() => setPageNum(pageNum + 1)}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{(pageNum - 1) * pageSize + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(pageNum * pageSize, totalRecords)}
                    </span>{" "}
                    of <span className="font-medium">{totalRecords}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      disabled={pageNum === 1}
                      onClick={() => setPageNum(pageNum - 1)}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown
                        className="h-5 w-5 transform rotate-90"
                        aria-hidden="true"
                      />
                    </button>
                    {Array.from({
                      length: Math.min(5, Math.ceil(totalRecords / pageSize)),
                    }).map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setPageNum(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pageNum
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      disabled={pageNum * pageSize >= totalRecords}
                      onClick={() => setPageNum(pageNum + 1)}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown
                        className="h-5 w-5 transform -rotate-90"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}