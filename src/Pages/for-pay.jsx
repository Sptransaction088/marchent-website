import { useState } from "react";
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for the charts
const transactionTrendData = [
  { name: "15 Apr", successful: 720, failed: 15, pending: 20 },
  { name: "16 Apr", successful: 650, failed: 10, pending: 15 },
  { name: "17 Apr", successful: 800, failed: 12, pending: 18 },
  { name: "18 Apr", successful: 950, failed: 8, pending: 12 },
  { name: "19 Apr", successful: 880, failed: 14, pending: 22 },
  { name: "20 Apr", successful: 765, failed: 9, pending: 16 },
  { name: "21 Apr", successful: 820, failed: 11, pending: 14 },
];

const hourlyAnalysisData = [
  { hour: "00:00", transactions: 65 },
  { hour: "02:00", transactions: 42 },
  { hour: "04:00", transactions: 28 },
  { hour: "06:00", transactions: 55 },
  { hour: "08:00", transactions: 180 },
  { hour: "10:00", transactions: 320 },
  { hour: "12:00", transactions: 420 },
  { hour: "14:00", transactions: 460 },
  { hour: "16:00", transactions: 380 },
  { hour: "18:00", transactions: 290 },
  { hour: "20:00", transactions: 210 },
  { hour: "22:00", transactions: 120 },
];
export default function FlipzikDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dateRange, setDateRange] = useState("18.04.25-18.04.25");
  const [statusFilter, setStatusFilter] = useState("Success");
  const [hourlyDate, setHourlyDate] = useState("18.04.25");
  const [hourlyStatus, setHourlyStatus] = useState("All");

  // Render the active page based on the tab
  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardPage
            dateRange={dateRange}
            statusFilter={statusFilter}
            hourlyDate={hourlyDate}
            hourlyStatus={hourlyStatus}
          />
        );
      case "payin":
        return <PayinPage />;
      case "payout":
        return <PayoutPage />;
      case "bulkPayout":
        return <BulkPayoutPage />;
      case "reports":
        return <ReportsPage />;
      case "transactionEnquiry":
        return <TransactionEnquiryPage />;
      case "developersSetting":
        return <DevelopersSettingPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className="w-30 bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
        style={{ borderRight: "4px double #fff" }}
      >
        <div className="p-3 bg-white rounded-lg m-5">
          <div className="flex items-center">
            <img
              src="./public/assets/logo.png"
              alt="shopping cart"
              className="ml-1"
            />
          </div>
        </div>

        <nav className="mt-6 px-2">
          <SidebarItem
            icon={<HomeIcon />}
            text="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarItem
            icon={<PayoutIcon />}
            text="Payin"
            expandable
            active={activeTab === "payin"}
            onClick={() => setActiveTab("payin")}
          />

          <SidebarItem
            icon={<PayoutIcon />}
            text="Payout"
            expandable
            active={activeTab === "payout"}
            onClick={() => setActiveTab("payout")}
          />
          <SidebarItem
            icon={<BulkIcon />}
            text="Bulk Payout"
            expandable
            active={activeTab === "bulkPayout"}
            onClick={() => setActiveTab("bulkPayout")}
          />
          <SidebarItem
            icon={<ReportsIcon />}
            text="Reports"
            expandable
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
          />

          <SidebarItem
            icon={<UserIcon />}
            text="Developers Setting"
            expandable
            active={activeTab === "developersSetting"}
            onClick={() => setActiveTab("developersSetting")}
          />
          <SidebarItem
            icon={<ProfileIcon />}
            text="Profile"
            expandable
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{renderActivePage()}</div>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({
  icon,
  text = false,
  expandable = false,
  active = false,
  onClick,
}) {
  return (
    <div
      className={`flex items-center p-3 rounded-lg mb-1 ${
        active ? "bg-indigo-600" : "hover:bg-indigo-600"
      }`}
      style={{ borderLeft: "2px double #fff" }}
      onClick={onClick}
    >
      <div className="mr-3">{icon}</div>
      <span className="flex-1">{text}</span>
      {expandable && <ChevronRight className="h-4 w-4" />}
    </div>
  );
}

// Dashboard Page
function DashboardPage({ dateRange, statusFilter, hourlyDate, hourlyStatus }) {
  const metrics = [
    { title: "Total Transactions", value: "4,592" },
    { title: "Success Rate", value: "98.4%" },
    { title: "Average Amount", value: "₹2,145" },
    { title: "Total Value", value: "₹9.85M" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Date & Filter Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center bg-white rounded p-2 shadow-sm">
          <Calendar size={18} className="text-gray-500 mr-2" />
          <span>{dateRange}</span>
        </div>
        <div className="flex items-center bg-white rounded p-2 shadow-sm">
          <span className="mr-2">Status:</span>
          <span className="font-medium">{statusFilter}</span>
          <ChevronDown size={18} className="ml-2 text-gray-500" />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} title={metric.title} value={metric.value} />
        ))}
      </div>

      {/* Transaction Chart */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <h2 className="text-lg font-medium mb-4">Transaction Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={transactionTrendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="successful"
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="#ef4444"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-sm">Successful</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Failed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
            <span className="text-sm">Pending</span>
          </div>
        </div>
      </div>

      {/* Hourly Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Hourly Analysis</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded p-2">
              <Calendar size={16} className="text-gray-500 mr-2" />
              <span>{hourlyDate}</span>
            </div>
            <div className="flex items-center bg-gray-100 rounded p-2">
              <span className="mr-2">Status:</span>
              <span>{hourlyStatus}</span>
              <ChevronDown size={16} className="ml-2 text-gray-500" />
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hourlyAnalysisData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="transactions" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Transaction ID</th>
              <th className="pb-2">Date & Time</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Account</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="border-b hover:bg-gray-50">
                <td className="py-3">
                  TXN{Math.floor(Math.random() * 10000000)}
                </td>
                <td className="py-3">
                  18 Apr 2025, {Math.floor(Math.random() * 12)}:
                  {Math.floor(Math.random() * 60)
                    .toString()
                    .padStart(2, "0")}{" "}
                  PM
                </td>
                <td className="py-3">₹{Math.floor(Math.random() * 10000)}</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Success
                  </span>
                </td>
                <td className="py-3">
                  XXXX{Math.floor(Math.random() * 10000)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Payout Page
function PayoutPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payout</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">New Payout</h2>

        {/* Payout Form */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Account
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter account number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IFSC Code
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter IFSC code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <select className="w-full p-2 border rounded">
              <option>Salary</option>
              <option>Vendor Payment</option>
              <option>Refund</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Add remarks (optional)"
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-gray-200 rounded mr-3">Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Process Payout
          </button>
        </div>
      </div>
    </div>
  );
}

// Bulk Payout Page
function BulkPayoutPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bulk Payout</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Upload Bulk Payout File</h2>
          <a href="#" className="text-blue-600 text-sm">
            Download Template
          </a>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <div className="mb-3 flex justify-center">
            <DownloadIcon />
          </div>
          <p className="text-gray-500 mb-3">
            Drag and drop your CSV file here or
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Browse Files
          </button>
        </div>

        <div className="border rounded p-4 mb-6">
          <h3 className="font-medium mb-2">File Guidelines</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Use the provided template format</li>
            <li>Maximum 500 transactions per file</li>
            <li>Maximum file size: 2MB</li>
            <li>Supported format: CSV only</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Process Bulk Payout
          </button>
        </div>
      </div>
    </div>
  );
}

// Reports Page
function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md cursor-pointer">
          <h2 className="font-medium mb-2">Transaction Report</h2>
          <p className="text-sm text-gray-500 mb-4">
            View detailed transaction history with filtering options
          </p>
          <div className="flex justify-end">
            <ChevronRight size={20} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md cursor-pointer">
          <h2 className="font-medium mb-2">Settlement Report</h2>
          <p className="text-sm text-gray-500 mb-4">
            Track all your settlement and reconciliation data
          </p>
          <div className="flex justify-end">
            <ChevronRight size={20} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md cursor-pointer">
          <h2 className="font-medium mb-2">Performance Analytics</h2>
          <p className="text-sm text-gray-500 mb-4">
            Analyze transaction performance and success rates
          </p>
          <div className="flex justify-end">
            <ChevronRight size={20} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Generate Custom Report</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select className="w-full p-2 border rounded">
              <option>Transaction Report</option>
              <option>Settlement Report</option>
              <option>Monthly Summary</option>
              <option>Tax Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex items-center border rounded p-2">
              <Calendar size={18} className="text-gray-500 mr-2" />
              <span>18.04.25-18.04.25</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select className="w-full p-2 border rounded">
              <option>PDF</option>
              <option>CSV</option>
              <option>Excel</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

// Download Centre Page
function DownloadCentrePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Download Centre</h1>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              className="pl-8 pr-2 py-2 border rounded w-64"
              placeholder="Search downloads"
            />
            <div className="absolute left-2 top-2.5 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <select className="p-2 border rounded">
            <option>All Types</option>
            <option>Reports</option>
            <option>Statements</option>
            <option>Receipts</option>
          </select>
        </div>
        <div>
          <select className="p-2 border rounded">
            <option>Latest First</option>
            <option>Oldest First</option>
            <option>Size: Largest</option>
            <option>Size: Smallest</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 font-medium">Filename</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Size</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Transaction_Report_April_2025.pdf",
                type: "Report",
                date: "18 Apr 2025",
                size: "1.2MB",
              },
              {
                name: "Monthly_Statement_Mar_2025.pdf",
                type: "Statement",
                date: "02 Apr 2025",
                size: "3.4MB",
              },
              {
                name: "Bulk_Payout_Success_17042025.csv",
                type: "Report",
                date: "17 Apr 2025",
                size: "0.8MB",
              },
              {
                name: "Settlement_Summary_Q1_2025.xlsx",
                type: "Report",
                date: "10 Apr 2025",
                size: "2.1MB",
              },
              {
                name: "Transaction_Receipt_TXN78945612.pdf",
                type: "Receipt",
                date: "15 Apr 2025",
                size: "0.3MB",
              },
            ].map((file, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{file.name}</td>
                <td className="p-3">{file.type}</td>
                <td className="p-3">{file.date}</td>
                <td className="p-3">{file.size}</td>
                <td className="p-3">
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    <DownloadIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// User Management Page
function UserManagementPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              className="pl-8 pr-2 py-2 border rounded w-64"
              placeholder="Search users"
            />
            <div className="absolute left-2 top-2.5 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <select className="p-2 border rounded">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Operator</option>
            <option>Viewer</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center">
          <span className="mr-2">Add New User</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Last Login</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Rahul Sharma",
                email: "rahul.s@example.com",
                role: "Admin",
                status: "Active",
                lastLogin: "18 Apr, 10:24 AM",
              },
              {
                name: "Priya Patel",
                email: "priya.p@example.com",
                role: "Manager",
                status: "Active",
                lastLogin: "17 Apr, 04:15 PM",
              },
              {
                name: "Amit Kumar",
                email: "amit.k@example.com",
                role: "Operator",
                status: "Inactive",
                lastLogin: "15 Apr, 11:05 AM",
              },
              {
                name: "Neha Singh",
                email: "neha.s@example.com",
                role: "Viewer",
                status: "Active",
                lastLogin: "18 Apr, 09:32 AM",
              },
              {
                name: "Vikram Malhotra",
                email: "vikram.m@example.com",
                role: "Manager",
                status: "Active",
                lastLogin: "16 Apr, 02:45 PM",
              },
            ].map((user, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">{user.lastLogin}</td>
                <td className="p-3 flex space-x-2">
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Profile Page
function ProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-medium">Rahul Sharma</h2>
              <p className="text-gray-500">Administrator</p>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Email</span>
                <span>rahul.s@example.com</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Phone</span>
                <span>+91 98765 43210</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Last Login</span>
                <span>18 Apr, 10:24 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Account Created</span>
                <span>12 Jan 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value="Rahul"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value="Sharma"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value="rahul.s@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value="+91 98765 43210"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Security Settings</h2>
            <div className="mb-6">
              <h3 className="font-medium mb-2">Change Password</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Update Password
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Enhance your account security by enabling 2FA
                  </p>
                  <p className="text-xs text-gray-500">
                    Status:{" "}
                    <span className="text-green-600 font-medium">Enabled</span>
                  </p>
                </div>
                <div>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded">
                    Disable 2FA
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Login Sessions</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                  <span className="font-medium">Current Session</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Active
                  </span>
                </div>
                <div className="p-3">
                  <div className="text-sm mb-1">Chrome on Windows</div>
                  <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span>IP: 103.45.xx.xx</span>
                    <span>Started: Today at 10:24 AM</span>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <button className="text-red-600 text-sm">
                  Logout from all other devices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-gray-500 mb-2">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

// Simple Icon Components
function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}

function PayoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path
        fillRule="evenodd"
        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BulkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
        clipRule="evenodd"
      />
    </svg>
  );
}
