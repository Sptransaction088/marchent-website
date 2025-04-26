import React, { useState } from "react";
import { Wallet, Banknote, Link, CreditCard, ArrowDown, Copy, Upload, Calendar, ChevronsUpDown, CheckCircle } from "lucide-react";

const AddBalanceDesign = () => {
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  
  const copyToClipboard = (text) => {
    // In a real app, this would use the clipboard API
    alert(`Copied: ${text}`);
  };
  
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setShowPaymentDropdown(false);
  };
  
  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setShowBankDropdown(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-gradient-to-br from-white to-indigo-50 p-8 rounded-3xl shadow-xl border border-indigo-100">
      {/* Header with improved styling */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Add Balance</span>
        </h2>
        <div className="flex gap-2">
          <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
            <CreditCard className="w-5 h-5 text-gray-700" />
          </button>
          <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
            <ArrowDown className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Enhanced Wallet Section with glow effect */}
      <div className="flex justify-center mb-10">
        <div className="text-center border-2 border-indigo-400 px-8 py-4 rounded-2xl shadow-md bg-gradient-to-r from-indigo-50 to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-20 animate-pulse"></div>
          <p className="text-sm text-gray-600 font-medium">Available Balance</p>
          <h3 className="text-2xl font-bold text-indigo-700">₹ 5,200.00</h3>
          <p className="text-xs text-indigo-500 mt-1">Last updated: Today, 2:45 PM</p>
        </div>
      </div>
      
      {/* Cards with hover effects - UPDATED */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Virtual Account - UPDATED */}
        <div className="transition-all duration-300 hover:shadow-lg group">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <div className="bg-green-100 p-1.5 rounded-lg group-hover:bg-green-200 transition-colors">
              <Banknote className="text-green-600 w-5 h-5" />
            </div>
            Virtual Account
          </h3>
          <div className="border border-gray-300 bg-white rounded-xl p-5 text-sm text-gray-700 space-y-3 group-hover:border-green-300 transition-colors">
            <div className="flex justify-between items-center">
              <p className="font-medium">Account Holder</p>
              <p>Aman Yadav</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Account Number</p>
              <div className="flex items-center gap-1">
                <p>9876543210</p>
                <button onClick={() => copyToClipboard("9876543210")} className="text-indigo-500 hover:text-indigo-700">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">IFSC</p>
              <div className="flex items-center gap-1">
                <p>ICIC0001234</p>
                <button onClick={() => copyToClipboard("ICIC0001234")} className="text-indigo-500 hover:text-indigo-700">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Bank Name</p>
              <p>ICICI Bank, Delhi Branch</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">UTR Reference</p>
              <div className="flex items-center gap-1">
                <p>UTR8975436201</p>
                <button onClick={() => copyToClipboard("UTR8975436201")} className="text-indigo-500 hover:text-indigo-700">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Payment Mode</p>
              <div className="flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-full text-blue-700">
                <p className="text-xs font-medium">NEFT</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Merchant Linked Account - UPDATED */}
        <div className="transition-all duration-300 hover:shadow-lg group">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Link className="text-blue-600 w-5 h-5" />
            </div>
            Merchant Linked Account
          </h3>
          <div className="border border-gray-300 bg-white rounded-xl p-5 text-sm text-gray-700 space-y-3 group-hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-center">
              <p className="font-medium">Merchant Name</p>
              <p>Amazon India</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">UPI ID</p>
              <div className="flex items-center gap-1">
                <p>amazon@upi</p>
                <button onClick={() => copyToClipboard("amazon@upi")} className="text-indigo-500 hover:text-indigo-700">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Linked Account No</p>
              <div className="flex items-center gap-1">
                <p>556677889900</p>
                <button onClick={() => copyToClipboard("556677889900")} className="text-indigo-500 hover:text-indigo-700">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Payment UTR</p>
              <div className="flex items-center gap-1">
                <p>UTRPAY7654321</p>
                <button onClick={() => copyToClipboard("UTRPAY7654321")} className="text-indigo-500 hover:text-indigo-700">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Payment Amount</p>
              <p className="font-semibold text-indigo-600">₹ 2,500.00</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Status</p>
              <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full text-green-700">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-xs font-medium">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Balance Request Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-300 mb-8 shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Add Balance Request</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* RRN */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">RRN</label>
            <input 
              type="text"
              placeholder="Enter RRN" 
              className="w-full p-3 bg-indigo-50 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
            />
          </div>
          
          {/* Bank Name - FIXED DROPDOWN */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <div className="relative">
              <button
                className="w-full flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                onClick={() => {
                  setShowBankDropdown(!showBankDropdown);
                  setShowPaymentDropdown(false); // Close the other dropdown
                }}
              >
                <span className="text-gray-500">{selectedBank || "Select..."}</span>
                <ChevronsUpDown className="w-5 h-5 text-gray-500" />
              </button>
              
              {showBankDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="py-1">
                    {["ICICI Bank", "HDFC Bank", "SBI", "Axis Bank", "Kotak Mahindra"].map((bank) => (
                      <button
                        key={bank}
                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-gray-700"
                        onClick={() => handleBankSelect(bank)}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Payment UTR */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Payment UTR</label>
            <input 
              type="text"
              placeholder="Enter UTR Number" 
              className="w-full p-3 bg-indigo-50 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
            />
          </div>
          
          {/* Payment Mode - FIXED DROPDOWN */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
            <div className="relative">
              <button
                className="w-full flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                onClick={() => {
                  setShowPaymentDropdown(!showPaymentDropdown);
                  setShowBankDropdown(false); // Close the other dropdown
                }}
              >
                <span className="text-gray-500">{selectedMethod || "Select..."}</span>
                <ChevronsUpDown className="w-5 h-5 text-gray-500" />
              </button>
              
              {showPaymentDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="py-1">
                    {["RTGS", "IMPS", "NEFT", "UPI"].map((method) => (
                      <button
                        key={method}
                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-gray-700"
                        onClick={() => handleMethodSelect(method)}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Paid from which bank */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Paid from which bank</label>
            <input 
              type="text"
              placeholder="Enter bank name" 
              className="w-full p-3 bg-indigo-50 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
            />
          </div>
          
          {/* Paid to which account */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Paid to which account</label>
            <input 
              type="text"
              placeholder="Enter account information" 
              className="w-full p-3 bg-indigo-50 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
            />
          </div>
          
          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input 
              type="text"
              placeholder="Enter Amount" 
              className="w-full p-3 bg-indigo-50 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
            />
          </div>
          
          {/* Upload Payment Screenshot */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Payment Screenshot</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                  <p className="mb-2 text-sm text-indigo-600 font-medium">Click to upload</p>
                  <p className="text-xs text-gray-500">PNG, JPG or PDF (MAX. 2MB)</p>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md">
            Submit Request
          </button>
        </div>
      </div>
      
      {/* Last Transaction Status */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 mb-8 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-500 w-5 h-5" />
          Last Transaction Status
        </h3>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">UTR Number</p>
              <p className="font-medium text-gray-800">UTR8975436201</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="font-medium text-gray-800">₹ 1,800.00</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date & Time</p>
              <p className="font-medium text-gray-800">24 Apr 2025, 3:45 PM</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">From Bank</p>
              <p className="font-medium text-gray-800">HDFC Bank</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">To Account</p>
              <p className="font-medium text-gray-800">Virtual Account (9876543210)</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <div className="flex items-center gap-1 bg-green-200 w-fit px-2 py-0.5 rounded-full text-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-xs font-medium">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Button with improved styling */}
      <div className="text-center">
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 transition shadow-lg font-semibold flex items-center gap-2 mx-auto">
          <span>Change Account Request</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AddBalanceDesign;