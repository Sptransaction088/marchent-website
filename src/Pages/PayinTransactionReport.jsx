import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  Check,
  X,
  Clock,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  EyeIcon,
  DownloadIcon,
  ListFilter,
  FileText,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

export default function Transactions() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTxnStatus, setSelectedTxnStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    field: "txndate",
    direction: "desc",
  });

  // Sample transaction data
  const [transactions, setTransactions] = useState([
    {
      merchantCode: "MC12345",
      merchantFirstName: "Acme",
      merchantLastName: "Corp",
      merchantTxnId: "MTXN9876",
      txnAmount: 100,
      finalAmount: 100,
      txnStatus: "success",
      bankStatus: "approved",
      rrn: "123456789012",
      bankTxnId: "BTXN001",
      custMobileNo: "9876543210",
      custVpa: "john@upi",
      custName: "John Smith",
      payerVpa: "john@upi",
      upiRefId: "UTR123",
      txndate: "2025-12-24",
      time: "14:35:28",
      currencyType: "INR",
      paymentMode: "UPI",
    },
    {
      merchantCode: "MC67890",
      merchantFirstName: "Beta",
      merchantLastName: "Solutions",
      merchantTxnId: "MTXN5432",
      txnAmount: 500,
      finalAmount: 500,
      txnStatus: "failed",
      bankStatus: "rejected",
      rrn: "987654321012",
      bankTxnId: "BTXN002",
      custMobileNo: "9876543211",
      custVpa: "sarah@upi",
      custName: "Sarah Johnson",
      payerVpa: "sarah@upi",
      upiRefId: "UTR456",
      txndate: "2025-12-24",
      time: "12:22:18",
      currencyType: "INR",
      paymentMode: "IMPS",
    },
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
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
        transaction.txnStatus !== selectedTxnStatus
      ) {
        return false;
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          transaction.merchantCode.toLowerCase().includes(query) ||
          transaction.merchantFirstName.toLowerCase().includes(query) ||
          transaction.merchantLastName.toLowerCase().includes(query) ||
          transaction.merchantTxnId.toLowerCase().includes(query) ||
          transaction.txnAmount.toString().includes(query) ||
          transaction.finalAmount.toString().includes(query) ||
          transaction.txnStatus.toLowerCase().includes(query) ||
          transaction.bankStatus?.toLowerCase().includes(query) ||
          transaction.rrn?.includes(query) ||
          transaction.bankTxnId?.toLowerCase().includes(query) ||
          transaction.custMobileNo?.includes(query) ||
          transaction.custVpa?.toLowerCase().includes(query) ||
          transaction.custName?.toLowerCase().includes(query) ||
          transaction.payerVpa?.toLowerCase().includes(query) ||
          transaction.upiRefId?.toLowerCase().includes(query) ||
          formatDate(transaction.txndate).toLowerCase().includes(query) ||
          transaction.time.toLowerCase().includes(query)
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
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all payment transactions
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div className="pt-2 flex justify-end border-t border-gray-100 mt-3">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setSelectedTxnStatus("all");
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
                    classNamescope="col"
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
                      key={`${transaction.merchantTxnId}-${transaction.txndate}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.merchantCode}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.merchantFirstName}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.merchantLastName}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.merchantTxnId}
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
                            {transaction.txnStatus}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.bankStatus}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.rrn}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.bankTxnId}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.custMobileNo}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.custVpa}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.custName}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.payerVpa}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.upiRefId}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(transaction.txndate)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.time}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="16" className="px-6 py-12 text-center">
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

          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">
                      {filteredTransactions.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredTransactions.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <ChevronDown
                        className="h-5 w-5 transform rotate-90"
                        aria-hidden="true"
                      />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 text-sm font-medium text-blue-600">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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
