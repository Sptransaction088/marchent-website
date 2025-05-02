import { useState, useEffect } from "react";
import { Calendar, Download, RefreshCw, ChevronDown } from "lucide-react";

// Sample data as fallback if API fails (based on your mock data structure)
const sampleData = [
  {
    userCode: "U1",
    name: "User1",
    amount: 1500,
    paymentMode: "IMPS",
    company: "Company XYZ",
    bank: "Bank ABC",
    topupStatus: "Approved",
    referenceId: "REF1",
    remark: "N/A",
    rejectionReason: "N/A",
    date: "2025-03-15",
    document: "doc1.pdf",
  },
  {
    userCode: "U2",
    name: "User2",
    amount: 2500,
    paymentMode: "UPI",
    company: "Company XYZ",
    bank: "Bank ABC",
    topupStatus: "Pending for Approval",
    referenceId: "REF2",
    remark: "N/A",
    rejectionReason: "N/A",
    date: "2025-03-16",
    document: "doc2.pdf",
  },
  {
    userCode: "U3",
    name: "User3",
    amount: 3500,
    paymentMode: "Net Banking",
    company: "Company XYZ",
    bank: "Bank ABC",
    topupStatus: "Rejected",
    referenceId: "REF3",
    remark: "N/A",
    rejectionReason: "Insufficient Funds",
    date: "2025-03-17",
    document: "doc3.pdf",
  },
];

const TopUpReport = () => {
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: "2025-03-01",
    end: "2025-04-01",
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const merchantId = 1; // Hardcoded, replace with dynamic value if needed

  // State for top-up creation form
  const [topUpForm, setTopUpForm] = useState({
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    amount: "",
    rrn: "",
    paymentMode: "IMPS",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch top-up report data
  useEffect(() => {
    fetchTopUpReport();
  }, [dateRange, statusFilter, searchValue, currentPage]);

  const fetchTopUpReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiTopUpList",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

          },
          body: JSON.stringify({
            merchantId,
            startDate: dateRange.start,
            endDate: dateRange.end,
            status: statusFilter,
            searchValue,
            pageNum: currentPage,
            pageSize: rowsPerPage,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("TopUpList API Response:", data); // Debug: Log response
      // Handle different response structures
      const transactions = data.data || data.transactions || data || sampleData;
      setReportData(Array.isArray(transactions) ? transactions : sampleData);
    } catch (error) {
      console.error("Error fetching top-up report:", error);
      alert("Failed to fetch report data. Using sample data. Check console.");
      setReportData(sampleData); // Fallback to sample data
    } finally {
      setIsLoading(false);
    }
  };

  // Handle top-up creation
  const handleCreateTopUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiCreateTopUp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add Authorization header if required
          },
          body: JSON.stringify({
            merchantId,
            accountHolder: topUpForm.accountHolder,
            accountNumber: topUpForm.accountNumber,
            ifsc: topUpForm.ifsc,
            bankName: topUpForm.bankName,
            amount: parseInt(topUpForm.amount),
            rrn: topUpForm.rrn,
            paymentMode: topUpForm.paymentMode,
          }),
        }
      );
      const result = await response.json();
      console.log("CreateTopUp API Response:", result); // Debug: Log response
      if (response.ok) {
        alert("Top-up request created successfully!");
        setTopUpForm({
          accountHolder: "",
          accountNumber: "",
          ifsc: "",
          bankName: "",
          amount: "",
          rrn: "",
          paymentMode: "IMPS",
        });
        setIsFormVisible(false);
        fetchTopUpReport(); // Refresh report
      } else {
        alert(`Error: ${result.message || "Failed to create top-up"}`);
      }
    } catch (error) {
      console.error("Error creating top-up:", error);
      alert("Failed to create top-up. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1); // Reset to first page
    fetchTopUpReport();
  };

  const handleDownload = (format) => {
    alert(`Downloading report as ${format}`);
    // Implement actual download logic (e.g., CSV/Excel)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Pagination
  const filteredTransactions =
    statusFilter === "All"
      ? reportData
      : reportData.filter((txn) => txn.topupStatus === statusFilter);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">TopUp Report</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition duration-150"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <div className="space-x-2">
              <button
                onClick={() => handleDownload("CSV")}
                className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition duration-150"
                disabled={isLoading}
              >
                CSV
              </button>
              <button
                onClick={() => handleDownload("Excel")}
                className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition duration-150"
                disabled={isLoading}
              >
                Excel
              </button>
              <button
                onClick={() => handleDownload("Text")}
                className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition duration-150"
                disabled={isLoading}
              >
                Text
              </button>
            </div>
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition duration-150"
              disabled={isLoading}
            >
              {isFormVisible ? "Close Form" : "Create TopUp"}
            </button>
          </div>
        </div>
      </div>

      {/* TopUp Creation Form */}
      {isFormVisible && (
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Create TopUp
          </h3>
          <form onSubmit={handleCreateTopUp} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Account Holder"
              value={topUpForm.accountHolder}
              onChange={(e) =>
                setTopUpForm({ ...topUpForm, accountHolder: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Account Number"
              value={topUpForm.accountNumber}
              onChange={(e) =>
                setTopUpForm({ ...topUpForm, accountNumber: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="IFSC Code"
              value={topUpForm.ifsc}
              onChange={(e) =>
                setTopUpForm({ ...topUpForm, ifsc: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Bank Name"
              value={topUpForm.bankName}
              onChange={(e) =>
                setTopUpForm({ ...topUpForm, bankName: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={topUpForm.amount}
              onChange={(e) =>
                setTopUpForm({ ...topUpForm, amount: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
              min="1"
            />
            <input
              type="text"
              placeholder="RRN"
              value={topUpForm.rrn}
              onChange={(e) =>
                setTopUpForm({ ...topUpForm, rrn: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={topUpForm.paymentMode}
              onChange={(e) =>
                setTopUpForm({ ...topUpForm, paymentMode: e.target.value })
              }
              className="border rounded px-3 py-2"
            >
              <option value="IMPS">IMPS</option>
              <option value="NEFT">NEFT</option>
              <option value="RTGS">RTGS</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 col-span-2"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit TopUp"}
            </button>
          </form>
        </div>
      )}

      {/* Filter Bar */}
      <div className="border-b px-6 py-3 bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="All">All</option>
              <option value="Approved">Approved</option>
              <option value="Pending for Approval">Pending for Approval</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={fetchTopUpReport}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-150"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get Report"}
          </button>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">
            Transaction Details
          </h3>
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * rowsPerPage + 1}-
            {Math.min(currentPage * rowsPerPage, filteredTransactions.length)}{" "}
            of {filteredTransactions.length} transactions
          </p>
        </div>
        <div className="overflow-x-auto border rounded-lg">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : paginatedTransactions.length === 0 ? (
            <div className="text-center py-4">No transactions found</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UserCode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topup Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remark
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rejection Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.map((txn, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {txn.userCode || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {txn.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(txn.amount || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.paymentMode || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.company || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.bank || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          txn.topupStatus === "Approved"
                            ? "bg-green-100 text-green-800"
                            : txn.topupStatus === "Pending for Approval"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {txn.topupStatus || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.referenceId || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.remark || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.rejectionReason || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.date || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.document || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {filteredTransactions.length} transactions found
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              className={`px-4 py-2 rounded text-sm font-medium ${
                currentPage === 1 || isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(filteredTransactions.length / rowsPerPage),
                    currentPage + 1
                  )
                )
              }
              disabled={
                currentPage ===
                  Math.ceil(filteredTransactions.length / rowsPerPage) ||
                isLoading
              }
              className={`px-4 py-2 rounded text-sm font-medium ${
                currentPage ===
                  Math.ceil(filteredTransactions.length / rowsPerPage) ||
                isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpReport;