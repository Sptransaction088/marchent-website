import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowUpRight, Search, Calendar, Download, Filter, RefreshCw, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export default function SettlementDashboard() {
  // State for settlements data
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Mock data for demonstration
  const mockSettlements = [
    { id: "ST-7823", merchant: "Acme Corp", amount: 12879.45, status: "completed", date: "2025-04-25", items: 43 },
    { id: "ST-7822", merchant: "Globex Inc", amount: 8742.12, status: "pending", date: "2025-04-25", items: 27 },
    { id: "ST-7821", merchant: "Sirius Cybernetics", amount: 15438.90, status: "completed", date: "2025-04-24", items: 52 },
    { id: "ST-7820", merchant: "Initech", amount: 4321.76, status: "failed", date: "2025-04-24", items: 18 },
    { id: "ST-7819", merchant: "Wayne Enterprises", amount: 23456.78, status: "completed", date: "2025-04-23", items: 67 },
    { id: "ST-7818", merchant: "Stark Industries", amount: 19876.54, status: "processing", date: "2025-04-23", items: 59 },
    { id: "ST-7817", merchant: "Umbrella Corp", amount: 7654.32, status: "completed", date: "2025-04-22", items: 31 },
  ];
  
  // Chart data
  const chartData = [
    { name: "Mon", completed: 35, pending: 12, failed: 3 },
    { name: "Tue", completed: 42, pending: 8, failed: 2 },
    { name: "Wed", completed: 28, pending: 14, failed: 4 },
    { name: "Thu", completed: 37, pending: 10, failed: 1 },
    { name: "Fri", completed: 45, pending: 15, failed: 5 },
    { name: "Sat", completed: 21, pending: 7, failed: 2 },
    { name: "Sun", completed: 18, pending: 5, failed: 1 },
  ];
  
  // Stats summary data
  const statsSummary = [
    { title: "Total Settlements", value: "$82,319.87", change: "+12.3%", icon: <CheckCircle className="text-emerald-500" /> },
    { title: "Pending Amount", value: "$28,618.66", change: "-4.5%", icon: <Clock className="text-amber-500" /> },
    { title: "Failed Transactions", value: "$4,321.76", change: "-2.1%", icon: <AlertTriangle className="text-rose-500" /> },
    { title: "Settlement Rate", value: "94.8%", change: "+1.2%", icon: <ArrowUpRight className="text-blue-500" /> },
  ];
  
  // Fetch settlements data
  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, you'd fetch from an API
        // const response = await fetch('https://api.example.com/settlements');
        // const data = await response.json();
        
        // Using mock data for this example
        setTimeout(() => {
          setSettlements(mockSettlements);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching settlements:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter settlements based on status and search query
  const filteredSettlements = settlements.filter(settlement => {
    const matchesStatus = filterStatus === "all" || settlement.status === filterStatus;
    const matchesSearch = settlement.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          settlement.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      completed: "bg-emerald-100 text-emerald-800",
      pending: "bg-amber-100 text-amber-800",
      processing: "bg-blue-100 text-blue-800",
      failed: "bg-rose-100 text-rose-800"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settlement</h1>
          <p className="text-gray-500">Manage and track all your transaction settlements</p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsSummary.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs font-medium ${stat.change.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>
                      {stat.change}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">vs last period</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Settlements Overview</h2>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 flex items-center space-x-2 hover:bg-gray-50">
                <Calendar size={16} />
                <span>Last 7 days</span>
              </button>
              <button onClick={handleRefresh} className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                <Bar dataKey="failed" fill="#ef4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
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
                    <option value="failed">Failed</option>
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
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSettlements.length > 0 ? (
                    filteredSettlements.map((settlement) => (
                      <tr key={settlement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{settlement.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{settlement.merchant}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{settlement.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{settlement.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${settlement.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={settlement.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800">View</button>
                            <button className="p-1 text-gray-600 hover:text-gray-800">Export</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        No settlements found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredSettlements.length}</span> of <span className="font-medium">{filteredSettlements.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}