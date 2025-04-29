import { useState } from "react";
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  ChevronDown,
  Calendar,
  ExternalLink,
} from "lucide-react";

export default function Profile() {
  const [showDropdown, setShowDropdown] = useState(false);

  // Merchant profile data (simplified, removing email and role)
  const merchant = {
    name: "Alex Thompson",
    image: "./assets/user.png",
    memberSince: "Aug 2023",
    lastLogin: "Today, 10:45 AM",
    verificationStatus: "Verified",
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Top navigation bar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-10 w-10 items-center justify-center">
              <img src="../assets/logon.png" alt="logo" />
            </div>
           
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="relative">
                <img
                  src={merchant.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform ${
                  showDropdown ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src={merchant.image}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-slate-800">
                        {merchant.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 py-2">
                  <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100">
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="p-6">
        {/* Profile section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-32 relative">
            <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-end">
              <div className="relative">
                <img
                  src={merchant.image}
                  alt="Profile"
                  className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md"
                />
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-6">
            <div className="flex flex-wrap items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {merchant.name}
                </h2>
              </div>

              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <div className="flex items-center text-sm text-slate-500">
                  <Calendar size={16} className="mr-1" />
                  <span>Joined {merchant.memberSince}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">
                Merchant Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Business Name</p>
                    <p className="font-medium">Thompson Retail Solutions</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Business Category
                    </p>
                    <p className="font-medium">E-commerce / Retail</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Contact Number
                    </p>
                    <p className="font-medium">+91 98765 43210</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Business Address
                    </p>
                    <p className="font-medium">
                      42 Commerce Avenue, Mumbai, MH 400001
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Settlement Account
                    </p>
                    <p className="font-medium">HDFC Bank ••••3456</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">KYC Status</p>
                    <div className="flex items-center">
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1"></span>
                        Complete
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
