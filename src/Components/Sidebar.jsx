import { useState, useRef, useEffect } from "react";
import {
  CreditCard,
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  Settings,
  User,
  ChevronRight,
  Wallet,
  Handshake,
  LogOut,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBalanceScale, FaCreativeCommonsPdAlt } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);
  const [hoverItem, setHoverItem] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuItemRefs = useRef({});
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Set active item based on current location when component mounts
  useEffect(() => {
    const currentPath = location.pathname;
    // Find the menu item or sub-item that matches the current path
    const findActiveItem = () => {
      for (const item of menuItems) {
        if (item.path === currentPath) {
          return item.id;
        }
        if (item.subItems) {
          for (const subItem of item.subItems) {
            if (subItem.path === currentPath) {
              return subItem.id;
            }
          }
        }
      }
      return "dashboard"; // Default to dashboard if no match
    };

    setActiveItem(findActiveItem());
  }, [location.pathname]);

  // Smooth toggle for sidebar expansion
  const toggleExpanded = () => {
    setExpanded(!expanded);
    // Close any open submenu when toggling the sidebar
    setExpandedSubMenu(null);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedSubMenu) {
        const isClickingOnMenuItem =
          menuItemRefs.current[expandedSubMenu] &&
          menuItemRefs.current[expandedSubMenu].contains(event.target);

        const isClickingOnDropdown =
          document.getElementById(`dropdown-${expandedSubMenu}`) &&
          document
            .getElementById(`dropdown-${expandedSubMenu}`)
            .contains(event.target);

        if (!isClickingOnMenuItem && !isClickingOnDropdown) {
          setExpandedSubMenu(null);
        }
      }
      
      // Also close logout confirmation if clicking outside
      if (showLogoutConfirm) {
        const logoutConfirmElement = document.getElementById('logout-confirm-modal');
        if (logoutConfirmElement && !logoutConfirmElement.contains(event.target)) {
          setShowLogoutConfirm(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedSubMenu, showLogoutConfirm]);

  const handleMenuItemClick = (itemId, path, hasSubMenu) => {
    setActiveItem(itemId);

    // If sidebar is not expanded and item has submenu, handle differently
    if (!expanded && hasSubMenu) {
      setExpanded(true); // Expand the sidebar first
      // Set a timeout to open the submenu after sidebar expands
      setTimeout(() => {
        setExpandedSubMenu(itemId);
      }, 300); // Match this with sidebar transition duration
      return;
    }

    if (path) {
      navigate(path);
    }

    // Toggle submenu if item has a submenu
    if (hasSubMenu) {
      setExpandedSubMenu(expandedSubMenu === itemId ? null : itemId);
    } else {
      setExpandedSubMenu(null); // Close any open submenu
    }
  };

  const handleSubMenuToggle = (menu, event) => {
    event.stopPropagation();
    setExpandedSubMenu(expandedSubMenu === menu ? null : menu);
  };

  const handleSubItemClick = (itemId, path) => {
    setActiveItem(itemId);
    setExpandedSubMenu(null);
    if (path) {
      navigate(path);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  // Confirm logout
  const confirmLogout = () => {
    // Clear authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("rememberUser");
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event("storage"));
    
    // Show success message or redirect immediately
    navigate("/login", { replace: true });
  };

  // Show tooltip for collapsed sidebar
  const renderTooltip = (item) => {
    if (!expanded && hoverItem === item.id) {
      return (
        <div className="absolute left-full ml-2 z-50 bg-gradient-to-br from-blue-800/90 to-indigo-900/90 px-3 py-2 rounded-md shadow-lg text-white text-sm whitespace-nowrap">
          {item.label}
        </div>
      );
    }
    return null;
  };

  const menuItems = [
    {
      id: "dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
      label: "Dashboard",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: "payin",
      icon: <ArrowDownToLine size={20} />,
      label: "Payin",
      hasSubMenu: true,
      subItems: [
        {
          id: "transactionpayin",
          label: "Transactions",
          path: "/payin-transactions",
          icon: <CreditCard size={16} />,
        },
        {
          id: "settlementpayin",
          label: "Settlement",
          path: "/settlement",
          icon: <Handshake size={16} />,
        },
      ],
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: "payouts",
      icon: <ArrowUpFromLine size={20} />,
      label: "Payouts",
      hasSubMenu: true,
      subItems: [
        {
          id: "regular-payin",
          label: "Transactions",
          path: "/payout-transactions",
          icon: <CreditCard size={16} />,
        },
        {
          id: "add-balance-payin",
          label: "Add Balance",
          path: "/add-balances",
          icon: <Wallet size={16} />,
        },
        {
          id: "payment-payin",
          label: "Payments",
          path: "/payment",
          icon: <LiaRupeeSignSolid size={16} />,
        },
      ],
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: "reports",
      icon: <FileText size={20} />,
      label: "Reports",
      hasSubMenu: true,
      subItems: [
        {
          id: "transaction-report-payin",
          label: "Transaction Report (Payin)",
          path: "/payin-transaction-report",
          icon: <FileText size={16} />,
        },
        {
          id: "transaction-report-payout",
          label: "Transaction Report (Payout)",
          path: "/payout-transaction-report",
          icon: <FileText size={16} />,
        },
        {
          id: "top-up-reports",
          label: "Top up Reports",
          path: "/top-up-report",
          icon: <FileText size={16} />,
        },
      ],
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: "developers",
      icon: <Settings size={20} />,
      path: "/developer-setting",
      label: "Developer Settings",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: "profile",
      icon: <User size={20} />,
      path: "/profile",
      label: "Profile",
      color: "from-indigo-400 to-indigo-600",
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`bg-gradient-to-br from-blue-900 to-indigo-950 h-screen transition-all duration-500 ease-in-out ${
        expanded ? "w-[250px]" : "w-[100px]"
      } flex flex-col shadow-xl relative overflow-hidden text-sm p-2`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-transparent"></div>

      {/* Logo section */}
      <div className="flex items-center justify-between h-20 border-b border-blue-800/30 relative z-10">
        {expanded ? (
          <div className="flex items-center">
            <div className="h-20 w-20">
              <img
                src="../assets/logon.png"
                alt="logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-white font-semibold tracking-wide">
              Transaction Hub Technology
            </span>
          </div>
        ) : (
          <div className="mx-auto">
            <img
              src="../assets/logon.png"
              alt="logo"
              className="h-20 w-20 object-contain"
            />
          </div>
        )}
        <button
          onClick={toggleExpanded}
          className="text-blue-300 hover:text-white p-1.5 rounded-full hover:bg-blue-800/50 focus:outline-none transition-all hover:shadow-glow"
        >
          <ChevronRight
            size={16}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto pt-2 px-2 relative z-10 no-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="relative"
              ref={(el) => (menuItemRefs.current[item.id] = el)}
              id={item.id}
              onMouseEnter={() => setHoverItem(item.id)}
              onMouseLeave={() => setHoverItem(null)}
            >
              <div
                className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden ${
                  activeItem === item.id
                    ? "bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md"
                    : expandedSubMenu === item.id
                    ? "bg-blue-800/50 text-white"
                    : hoverItem === item.id
                    ? "bg-blue-800/30 text-white"
                    : "text-blue-100 hover:bg-blue-800/20"
                }`}
                onClick={() =>
                  handleMenuItemClick(item.id, item.path, item.hasSubMenu)
                }
              >
                {/* Hover effect */}
                {hoverItem === item.id && !activeItem === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-700/5 to-transparent shine-effect"></div>
                )}

                <div
                  className={`${
                    expanded ? "mr-3" : "mx-auto"
                  } bg-gradient-to-br ${
                    item.color
                  } p-1.5 rounded-md shadow-md transition-transform ${
                    hoverItem === item.id ||
                    activeItem === item.id ||
                    expandedSubMenu === item.id
                      ? "scale-110"
                      : ""
                  }`}
                >
                  {item.icon}
                </div>

                {expanded && (
                  <>
                    <span className="flex-1 text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                    {item.hasSubMenu && (
                      <button
                        onClick={(e) => handleSubMenuToggle(item.id, e)}
                        className="focus:outline-none transition-transform hover:scale-110 p-1"
                      >
                        <ChevronRight
                          size={14}
                          className={`text-blue-300 transition-transform duration-300 ${
                            expandedSubMenu === item.id ? "rotate-90" : ""
                          } ${
                            activeItem === item.id ||
                            expandedSubMenu === item.id
                              ? "text-white"
                              : ""
                          }`}
                        />
                      </button>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed sidebar */}
                {renderTooltip(item)}
              </div>

              {/* Inline submenu for collapsed sidebar */}
              {!expanded && item.hasSubMenu && expandedSubMenu === item.id && (
                <div className="absolute left-full top-0 z-50 ml-2">
                  <div className="animate-slideIn">
                    <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-md rounded-lg shadow-2xl"></div>
                    <ul className="bg-gradient-to-br from-blue-800/90 to-indigo-900/90 rounded-lg shadow-xl py-2 px-1 min-w-52 border border-blue-600/30 relative">
                      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-blue-500/20 to-transparent rounded-t-lg"></div>
                      {item.subItems.map((subItem) => (
                        <li
                          key={subItem.id}
                          className="py-2 px-3 mx-1 text-sm text-blue-100 hover:text-white hover:bg-blue-700/40 rounded-md cursor-pointer transition-all group"
                        >
                          <div
                            className="flex items-center justify-between w-full"
                            onClick={() =>
                              handleSubItemClick(subItem.id, subItem.path)
                            }
                          >
                            <div className="flex items-center">
                              <div className="mr-2 text-blue-300 group-hover:text-white transition-colors">
                                {subItem.icon}
                              </div>
                              <span>{subItem.label}</span>
                            </div>
                            {subItem.path && (
                              <ChevronRight
                                size={12}
                                className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Floating Dropdown Menu for expanded sidebar */}
      {expanded && expandedSubMenu && (
        <div
          id={`dropdown-${expandedSubMenu}`}
          className="fixed z-50"
          style={{
            left: `${
              menuItemRefs.current[expandedSubMenu]?.getBoundingClientRect()
                .right + 8
            }px`,
            top: `${
              menuItemRefs.current[expandedSubMenu]?.getBoundingClientRect().top
            }px`,
          }}
        >
          <div className="animate-slideIn relative">
            {/* Connection line between menu item and dropdown */}
            <div className="absolute left-0 top-4 w-2 h-0.5 bg-blue-500/50 transform -translate-x-full"></div>

            {/* Glass-like effect for dropdown */}
            <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-md rounded-lg shadow-2xl"></div>

            <ul className="bg-gradient-to-br from-blue-800/90 to-indigo-900/90 rounded-lg shadow-xl py-2 px-1 min-w-52 border border-blue-600/30 relative">
              {/* Subtle glow at the top */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-blue-500/20 to-transparent rounded-t-lg"></div>

              {menuItems
                .find((item) => item.id === expandedSubMenu)
                ?.subItems.map((subItem) => (
                  <li
                    key={subItem.id}
                    className="py-2 px-3 mx-1 text-sm text-blue-100 hover:text-white hover:bg-blue-700/40 rounded-md cursor-pointer transition-all group"
                  >
                    <div
                      className="flex items-center justify-between w-full"
                      onClick={() =>
                        handleSubItemClick(subItem.id, subItem.path)
                      }
                    >
                      <div className="flex items-center">
                        <div className="mr-2 text-blue-300 group-hover:text-white transition-colors">
                          {subItem.icon}
                        </div>
                        <span>{subItem.label}</span>
                      </div>
                      {subItem.path && (
                        <ChevronRight
                          size={12}
                          className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {/* User section */}
      <div className="p-4 border-t border-blue-800/30 bg-blue-900/20 backdrop-blur-sm relative z-10">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-full shadow-md">
            <User size={expanded ? 20 : 16} className="text-white" />
          </div>
          {expanded && (
            <div className="ml-3 flex-1">
              <p className="text-white font-medium text-sm">Merchant Name</p>
              <p className="text-blue-300 text-xs flex items-center">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                Admin
              </p>
            </div>
          )}
          {expanded ? (
            <button 
              className="text-blue-300 hover:text-white p-1.5 rounded-full hover:bg-blue-800/50 transition-all"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          ) : (
            <button 
              className="text-blue-300 hover:text-white mt-2 p-1.5 rounded-full hover:bg-blue-800/50 transition-all mx-auto block"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            id="logout-confirm-modal"
            className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full mx-4 animate-fadeIn"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-600">Are you sure you want to logout from your account?</p>
            </div>
            <div className="flex items-center justify-end gap-2 bg-gray-50 px-6 py-3 border-t border-gray-200">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .shadow-glow {
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
        }
        .shine-effect {
          animation: shine 2s infinite;
          background-size: 200% 100%;
        }
        @keyframes shine {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .bg-grid-pattern {
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}