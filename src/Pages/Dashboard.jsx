// Dashboard Component - Import this into your main application
import { useState, useEffect } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  IndianRupee,
  Calendar,
} from "lucide-react";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-04-16",
    endDate: "2025-04-23",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [apiData, setApiData] = useState(null);

  // Fetch API data on component mount and when filter is applied
  useEffect(() => {
    fetchApiData();
  }, []);

  // Function to fetch data from API
  const fetchApiData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiHomeSummary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
        }
      );

      const data = await response.json();
      console.log("API response:", data);
      setApiData(data);
      setSuccess(true);
    } catch (err) {
      console.error("API error:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filter - fetch new data with selected date range
  const applyFilter = () => {
    fetchApiData();
  };

  // Content based on selected payment section
  const renderContent = () => {
    if (activeSection === "payin") {
      return <PayInSection />;
    } else if (activeSection === "payout") {
      return <PayOutSection />;
    } else {
      return (
        <OverviewSection
          setActiveSection={setActiveSection}
          dateRange={dateRange}
          apiData={apiData}
        />
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 w-full">
      {/* Header with back button when in a section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {activeSection && (
            <button
              onClick={() => setActiveSection(null)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Date Filter - Added at the top */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={18} />
            <span className="text-sm font-medium text-gray-700">
              Date Range:
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="startDate" className="text-sm text-gray-500">
                From:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="border border-gray-200 rounded-md p-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="endDate" className="text-sm text-gray-500">
                To:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="border border-gray-200 rounded-md p-2 text-sm"
              />
            </div>
            <button
              onClick={applyFilter}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply Filter"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>{renderContent()}</div>
    </div>
  );
}

// Overview Section with the two main buttons
function OverviewSection({ setActiveSection, dateRange, apiData }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Transactions"
          value={apiData?.totalAmount || "₹24,780.00"}
          icon={<CreditCard className="text-purple-500" />}
        />
        <StatsCard
          title="Pay In"
          value={apiData?.payInAmount || "₹18,230.00"}
          icon={<ArrowDownCircle className="text-green-500" />}
        />
        <StatsCard
          title="Pay Out"
          value={apiData?.payOutAmount || "₹6,550.00"}
          icon={<ArrowUpCircle className="text-red-500" />}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm mt-6">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Recent Activity</h3>
          <p className="text-sm text-gray-500">
            Showing transactions from {dateRange.startDate} to{" "}
            {dateRange.endDate}
          </p>
        </div>
        <div className="p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(
                apiData?.transactions || [
                  {
                    type: "Pay In",
                    party: "John Smith",
                    amount: "+₹1,240.00",
                    date: "Today, 10:30 AM",
                    status: "Completed",
                  },
                  {
                    type: "Pay Out",
                    party: "ABC Suppliers",
                    amount: "-₹850.00",
                    date: "Yesterday",
                    status: "Completed",
                  },
                  {
                    type: "Pay In",
                    party: "Sarah Johnson",
                    amount: "+₹520.00",
                    date: "Apr 21, 2025",
                    status: "Completed",
                  },
                  {
                    type: "Pay Out",
                    party: "XYZ Services",
                    amount: "-₹330.00",
                    date: "Apr 20, 2025",
                    status: "Pending",
                  },
                ]
              ).map((transaction, i) => (
                <tr key={i}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          transaction.type === "Pay In"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "Pay In" ? (
                          <ArrowDownCircle
                            size={16}
                            className="text-green-600"
                          />
                        ) : (
                          <ArrowUpCircle size={16} className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.party}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        transaction.amount.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="p-2 rounded-full bg-gray-50">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
