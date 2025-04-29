import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";

export default function SettlementDashboard() {
  // State for settlements data
  const [settlements, setSettlements] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Mock data for demonstration
  const mockSettlements = [
    {
      id: "ST-7823",
      merchant: "Acme Corp",
      amount: 12879.45,
      status: "completed",
      date: "2025-04-25",
      items: 43,
    },
    {
      id: "ST-7822",
      merchant: "Globex Inc",
      amount: 8742.12,
      status: "pending",
      date: "2025-04-25",
      items: 27,
    },
  ];

  // Fetch settlements data
  useEffect(() => {
    // Set mock data directly
    try {
      setSettlements(mockSettlements);
    } catch (error) {
      console.error("Error setting settlements:", error);
    }
  }, []);

  // Filter settlements based on status and search query
  const filteredSettlements = settlements.filter((settlement) => {
    const matchesStatus =
      filterStatus === "all" || settlement.status === filterStatus;
    const matchesSearch =
      settlement.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      settlement.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch && settlement.status !== "failed";
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      completed: "bg-emerald-100 text-emerald-800",
      pending: "bg-amber-100 text-amber-800",
      processing: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle refresh
  const handleRefresh = () => {
    // Re-set mock data
    try {
      setSettlements(mockSettlements);
    } catch (error) {
      console.error("Error refreshing settlements:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settlement</h1>
          <p className="text-gray-500">
            Manage and track all your transaction settlements
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-6 py-8">
        {/* Filters and Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <h2 className="text-lg font-semibold">Recent Settlements</h2>

              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by ID or merchant"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={16} className="text-gray-400" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white w-full md:w-44 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>

                {/* Export Button */}
                <button className="px-4 py-2 bg-gray-800 rounded-lg text-white flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSettlements.length > 0 ? (
                  filteredSettlements.map((settlement) => (
                    <tr key={settlement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {settlement.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {settlement.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{settlement.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={settlement.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No settlements found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredSettlements.length}</span>{" "}
              of{" "}
              <span className="font-medium">{filteredSettlements.length}</span>{" "}
              results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}