
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LogOut,
  ChevronDown,
  Calendar,
} from "lucide-react";

function Profile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [merchant, setMerchant] = useState({
    name: "Loading...",
    image: "./assets/user.png", // Fallback image
    memberSince: "Loading...",
    lastLogin: "Loading...",
    verificationStatus: "Loading...",
    businessName: "Loading...",
    businessCategory: "Loading...",
    contactNumber: "Loading...",
    address: "Loading...",
    bankAccount: "Loading...",
    kycStatus: "Loading...",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMerchantProfile = async () => {
      try {
        const response = await axios.post(
          "https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiGetProfile",
          { merchantId: 1 },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success && response.data.code === 0) {
          const data = response.data.data;
          setMerchant({
            name: data.busiName || "Unknown",
            image: "./assets/user.png", // API doesn't provide image
            memberSince: new Date(data.registerDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            lastLogin: new Date(data.updateTime).toLocaleString("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            }),
            verificationStatus: data.kycStatus === "approved" ? "Verified" : "Pending",
            businessName: data.baseBusinessName || "N/A",
            businessCategory: data.baseEntityType || "N/A",
            contactNumber: data.baseContactNumber || "N/A",
            address: `${data.baseAddress}, ${data.baseCity}, ${data.baseState} ${data.basePinCode}`,
            bankAccount: `${data.bankName} ••••${data.bankAccountNumber.slice(-4)}`,
            kycStatus: data.kycStatus === "approved" ? "Complete" : "Pending",
          });
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (err) {
        setError("Error connecting to the server. Please try again later.");
        console.error("API Error:", err);
      }
    };

    fetchMerchantProfile();
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Top navigation bar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-10 w-10 items-center justify-center">
              <img
                src="./assets/logon.png"
                alt="logo"
                className="object-contain"
              />
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
                      <p className="font-medium text-slate-800">{merchant.name}</p>
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
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
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
                <h2 className="text-2xl font-bold text-slate-800">{merchant.name}</h2>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <div className="flex items-center text-sm text-slate-500">
                  <Calendar size={16} className="mr-1" />
                  <span>Joined {merchant.memberSince}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Merchant Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Business Name</p>
                    <p className="font-medium">{merchant.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Business Category</p>
                    <p className="font-medium">{merchant.businessCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Contact Number</p>
                    <p className="font-medium">{merchant.contactNumber}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Business Address</p>
                    <p className="font-medium">{merchant.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Settlement Account</p>
                    <p className="font-medium">{merchant.bankAccount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">KYC Status</p>
                    <div className="flex items-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center ${
                          merchant.kycStatus === "Complete"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            merchant.kycStatus === "Complete" ? "bg-green-600" : "bg-yellow-600"
                          }`}
                        ></span>
                        {merchant.kycStatus}
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

export default Profile;
