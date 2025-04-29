import React, { useState, useEffect } from "react";
import { Calendar, Download, RefreshCw, ChevronDown } from "lucide-react";

const TopUpReport = () => {
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: "2025-03-11",
    end: "2025-04-17",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const mockData = generateMockData(100);
    setReportData(mockData);
  }, [dateRange]);

  const generateMockData = (count) => {
    const methods = ["Credit Card", "UPI", "Net Banking", "Wallet"];
    const statuses = ["Approved", "Pending for Approval", "Rejected"];
    const transactions = [];
    const endDate = new Date(dateRange.end);
    const startDate = new Date(dateRange.start);
    const dayRange = (endDate - startDate) / (24 * 60 * 60 * 1000);

    for (let i = 0; i < count; i++) {
      const randomDaysAgo = Math.floor(Math.random() * (dayRange + 1));
      const date = new Date(endDate);
      date.setDate(date.getDate() - randomDaysAgo);
      const method = methods[Math.floor(Math.random() * methods.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const amount = Math.floor(Math.random() * 10000) + 500;

      transactions.push({
        userCode: `U${i + 1}`,
        name: `User${i + 1}`,
        amount,
        paymentMode: method,
        company: "Company XYZ",
        bank: "Bank ABC",
        topupStatus: status,
        referenceId: `REF${i + 1}`,
        remark: "N/A",
        rejectionReason: status === "Rejected" ? "Insufficient Funds" : "N/A",
        date: date.toISOString().split("T")[0],
        document: `doc${i + 1}.pdf`,
      });
    }
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredTransactions = reportData.filter(
    (txn) => statusFilter === "all" || txn.topupStatus === statusFilter
  );

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRefresh = () => {
    const mockData = generateMockData(100);
    setReportData(mockData);
  };

  const handleDownload = (format) => {
    alert(`Downloading report as ${format}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <div className="space-x-2">
              <button
                onClick={() => handleDownload("CSV")}
                className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition duration-150"
              >
                CSV
              </button>
              <button
                onClick={() => handleDownload("Excel")}
                className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition duration-150"
              >
                Excel
              </button>
              <button
                onClick={() => handleDownload("Text")}
                className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition duration-150"
              >
                Text
              </button>
            </div>
          </div>
        </div>
      </div>

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
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="Approved">Approved</option>
              <option value="Pending for Approval">Pending for Approval</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-150">
            Get Report
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
                    {txn.userCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {txn.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {txn.paymentMode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {txn.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {txn.bank}
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
                      {txn.topupStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {txn.referenceId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {txn.remark}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {txn.rejectionReason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {txn.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {txn.document}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {filteredTransactions.length} transactions found
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded text-sm font-medium ${
                currentPage === 1
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
                Math.ceil(filteredTransactions.length / rowsPerPage)
              }
              className={`px-4 py-2 rounded text-sm font-medium ${
                currentPage ===
                Math.ceil(filteredTransactions.length / rowsPerPage)
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
