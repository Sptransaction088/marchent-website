// Dashboard Component - Import this into your main application
import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, CreditCard, DollarSign, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '2025-04-16',
    endDate: '2025-04-23'
  });

  // Handle date change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Content based on selected payment section
  const renderContent = () => {
    if (activeSection === 'payin') {
      return <PayInSection />;
    } else if (activeSection === 'payout') {
      return <PayOutSection />;
    } else {
      return <OverviewSection setActiveSection={setActiveSection} dateRange={dateRange} />;
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-800">
            {activeSection === 'payin' ? 'Pay In' : 
             activeSection === 'payout' ? 'Pay Out' : 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Date Filter - Added at the top */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={18} />
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="startDate" className="text-sm text-gray-500">From:</label>
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
              <label htmlFor="endDate" className="text-sm text-gray-500">To:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="border border-gray-200 rounded-md p-2 text-sm"
              />
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
}

// Overview Section with the two main buttons
function OverviewSection({ setActiveSection, dateRange }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard 
          title="Total Transactions" 
          value="$24,780.00" 
          change="+14.5%" 
          icon={<CreditCard className="text-blue-500" />} 
        />
        <StatsCard 
          title="Pay In" 
          value="$18,230.00" 
          change="+7.2%" 
          icon={<ArrowDownCircle className="text-green-500" />} 
        />
        <StatsCard 
          title="Pay Out" 
          value="$6,550.00" 
          change="+2.3%" 
          icon={<ArrowUpCircle className="text-red-500" />} 
        />
      </div>
      
      {/* Two Prominent Payment Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div 
          onClick={() => setActiveSection('payin')}
          className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-50 hover:border-blue-200 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-blue-50">
                <ArrowDownCircle size={32} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Pay In</h2>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
          <div className="pl-16">
            <p className="text-gray-500 mb-4">Receive payments from customers, clients, and partners</p>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-gray-500">Last payment: $1,240.00 today</p>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => setActiveSection('payout')}
          className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-50 hover:border-blue-200 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-red-50">
                <ArrowUpCircle size={32} className="text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Pay Out</h2>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
          <div className="pl-16">
            <p className="text-gray-500 mb-4">Send payments to vendors, suppliers, and contractors</p>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p className="text-sm text-gray-500">Last payout: $850.00 yesterday</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm mt-6">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Recent Activity</h3>
          <p className="text-sm text-gray-500">
            Showing transactions from {dateRange.startDate} to {dateRange.endDate}
          </p>
        </div>
        <div className="p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { type: 'Pay In', party: 'John Smith', amount: '+$1,240.00', date: 'Today, 10:30 AM', status: 'Completed' },
                { type: 'Pay Out', party: 'ABC Suppliers', amount: '-$850.00', date: 'Yesterday', status: 'Completed' },
                { type: 'Pay In', party: 'Sarah Johnson', amount: '+$520.00', date: 'Apr 21, 2025', status: 'Completed' },
                { type: 'Pay Out', party: 'XYZ Services', amount: '-$330.00', date: 'Apr 20, 2025', status: 'Pending' }
              ].map((transaction, i) => (
                <tr key={i}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${transaction.type === 'Pay In' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {transaction.type === 'Pay In' ? 
                          <ArrowDownCircle size={16} className="text-green-600" /> : 
                          <ArrowUpCircle size={16} className="text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.type}</p>
                        <p className="text-sm text-gray-500">{transaction.party}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
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

// PayInSection placeholder
function PayInSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Pay In Section</h2>
      <p className="text-gray-500">Pay In functionality would be implemented here.</p>
    </div>
  );
}

// PayOutSection placeholder
function PayOutSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Pay Out Section</h2>
      <p className="text-gray-500">Pay Out functionality would be implemented here.</p>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, change, icon }) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="p-2 rounded-full bg-gray-50">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
        <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      </div>
    </div>
  );
}