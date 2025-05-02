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

// Sample settlement data for apiSettlementList
const sampleSettlements = [
  {
    settlementId: "ST-7823",
    merchantName: "Acme Corp",
    amount: 12879.45,
    status: "completed",
    date: "2025-03-15",
    itemCount: 43,
  },
  {
    settlementId: "ST-7822",
    merchantName: "Globex Inc",
    amount: 8742.12,
    status: "pending",
    date: "2025-03-20",
    itemCount: 27,
  },
  {
    settlementId: "ST-7821",
    merchantName: "Initech Ltd",
    amount: 5432.89,
    status: "processing",
    date: "2025-03-25",
    itemCount: 15,
  },
  {
    settlementId: "ST-7820",
    merchantName: "Delta Enterprises",
    amount: 750.25,
    status: "completed",
    date: "2025-04-01",
    itemCount: 10,
  },
];

// Sample summary data for apiSettlementSummary
const sampleSummary = {
  totalSettlements: 4,
  totalAmount: 27804.71,
  completedCount: 2,
  pendingCount: 1,
  processingCount: 1,
  failedCount: 0,
  startDate: "2025-03-01",
  endDate: "2025-05-01",
};

export default function SettlementTransactions() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [settlements, setSettlements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch settlements and summary
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch settlement list
        const listResponse = await fetch(
          "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiSettlementList",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add token when available: "Authorization": "Bearer YOUR_API_TOKEN"
            },
            body: JSON.stringify({
              merchantId: 1,
              startDate: dateRange.start || "2025-03-01",
              endDate: dateRange.end || "2025-05-01",
              status: selectedStatus === "all" ? "All" : selectedStatus,
              searchValue: searchQuery || "",
              pageNum: pageNum || 1,
              pageSize: pageSize || 10,
            }),
          }
        );

        let settlementList = sampleSettlements;
        let total = sampleSettlements.length;

        if (listResponse.ok) {
          const listData = await listResponse.json();
          console.log("Settlement List Response:", JSON.stringify(listData, null, 2));
          settlementList = listData?.data || listData?.list || listData?.settlements || [];
          total = listData?.total || listData?.totalRecords || settlementList.length || 0;

          if (!Array.isArray(settlementList)) {
            throw new Error("Settlement list is not an array");
          }

          // Transform settlement list
          settlementList = settlementList.map((item) => ({
            settlementId: item.settlementId || item.id || "N/A",
            merchantName: item.merchantName || item.merchant?.name || "Unknown Merchant",
            amount: parseFloat(item.amount) || 0,
            status: item.status?.toLowerCase() || "unknown",
            date: item.date || item.createdAt || "N/A",
            itemCount: item.itemCount || item.items?.length || 0,
          }));
        }

        // Fetch settlement summary
        const summaryResponse = await fetch(
          "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiSettlementSummary",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add token when available: "Authorization": "Bearer YOUR_API_TOKEN"
            },
            body: JSON.stringify({
              merchantId: 1,
              startDate: dateRange.start || "2025-03-01",
              endDate: dateRange.end || "2025-05-01",
            }),
          }
        );

        let summaryData = sampleSummary;

        if (summaryResponse.ok) {
          const data = await summaryResponse.json();
          console.log("Settlement Summary Response:", JSON.stringify(data, null, 2));
          summaryData = data?.data || data?.summary || data || sampleSummary;
        }

        setSettlements(settlementList.length > 0 ? settlementList : sampleSettlements);
        setTotalRecords(settlementList.length > 0 ? total : sampleSettlements.length);
        setSummary(summaryData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to fetch data (using sample data)");
        setSettlements(sampleSettlements);
        setTotalRecords(sampleSettlements.length);
        setSummary(sampleSummary);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, selectedStatus, searchQuery, pageNum]);

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "completed":
        return <Check size={14} className="text-emerald-500" />;
      case "failed":
        return <X size={14} className="text-red-500" />;
      case "pending":
        return <Clock size={14} className="text-amber-500" />;
      case "processing":
        return <Clock size={14} className="text-blue-500" />;
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

  // Filter and sort settlements
  const filteredSettlements = settlements
    .filter((settlement) => {
      if (
        selectedStatus !== "all" &&
        settlement.status?.toLowerCase() !== selectedStatus
      ) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          (settlement.settlementId?.toLowerCase() || "").includes(query) ||
          (settlement.merchantName?.toLowerCase() || "").includes(query) ||
          (settlement.amount?.toString() || "").includes(query) ||
          (settlement.status?.toLowerCase() || "").includes(query) ||
          (settlement.date || "").toLowerCase().includes(query) ||
          (settlement.itemCount?.toString() || "").includes(query)
        );
      }
      if (dateRange.start && dateRange.end) {
        const settDate = new Date(settlement.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return settDate >= startDate && settDate <= endDate;
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
            <h1 className="text-2xl font-bold text-gray-900">Settlements</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all settlement transactions
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

        {/* Summary Card */}
        {summary && (
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settlement Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Total Settlements</p>
                <p className="text-xl font-bold text-gray-900">{summary.totalSettlements || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">{formatAmount(summary.totalAmount, "INR")}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-xl font-bold text-emerald-600">{summary.completedCount || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-xl font-bold text-amber-600">{summary.pendingCount || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Processing</p>
                <p className="text-xl font-bold text-blue-600">{summary.processingCount || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Failed</p>
                <p className="text-xl font-bold text-red-600">{summary.failedCount || 0}</p>
              </div>
            </div>
          </div>
        )}

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
                        Settlement Status
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div className="pt-2 flex justify-end border-t border-gray-100 mt-3">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => setSelectedStatus("all")}
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
                  placeholder="Search by Settlement ID, Merchant Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settlements table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading && (
            <div className="flex justify-center py-12">
              <p className="text-gray-500">Loading settlements...</p>
            </div>
          )}
          {error && (
            <div className="flex justify-center py-12">
              <p className="text-red-500">Error: {error}</p>
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
                        onClick={() => handleSort("settlementId")}
                      >
                        Settlement ID
                        {getSortIcon("settlementId")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("merchantName")}
                      >
                        Merchant Name
                        {getSortIcon("merchantName")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("amount")}
                      >
                        Amount
                        {getSortIcon("amount")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        {getSortIcon("status")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        Date
                        {getSortIcon("date")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("itemCount")}
                      >
                        Item Count
                        {getSortIcon("itemCount")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSettlements.length > 0 ? (
                    filteredSettlements.map((settlement) => (
                      <tr
                        key={settlement.settlementId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {settlement.settlementId}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {settlement.merchantName}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatAmount(settlement.amount, "INR")}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="px-3 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              settlement.status
                            )}`}
                          >
                            {getStatusIcon(settlement.status)}
                            <span className="ml-1 capitalize">
                              {settlement.status || "Unknown"}
                            </span> 
                          </span>
                         </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(settlement.date)}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {settlement.itemCount || "N/A"}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Search size={40} className="text-gray-400 mb-3" />
                          <p className="text-gray-500 text-lg font-medium">
                            No settlements found
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
          {filteredSettlements.length > 0 && !loading && (
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