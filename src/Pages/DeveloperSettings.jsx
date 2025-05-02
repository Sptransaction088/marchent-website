import React, { useState, useEffect } from "react";
import {
  ClipboardCopy,
  Eye,
  EyeOff,
  CheckCircle,
  Code,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const DeveloperSettings = () => {
  // State for webhook URLs and white IP
  const [webhookUrls, setWebhookUrls] = useState({
    payIn: "",
    payOut: ""
  });
  const [whiteIp, setWhiteIp] = useState("");
  const [activeTab, setActiveTab] = useState("api-keys");
  const [showKey, setShowKey] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKeys, setApiKeys] = useState({
    public: "",
    secret: ""
  });

  // Fetch developer settings from API
  const fetchDeveloperSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiGetDeveloperSettings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any required authentication headers here
          // For example: "Authorization": `Bearer ${yourAuthToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract API keys and additional data from the response structure
      if (data.success && data.data) {
        setApiKeys({
          public: data.data.apiKey || "",
          secret: data.data.apiSecret || ""
        });
        
        // Also set the webhook URLs and white IP
        setWebhookUrls({
          payIn: data.data.payInWebHookUrl || "",
          payOut: data.data.payOutWebHookUrl || ""
        });
        
        setWhiteIp(data.data.whiteIp || "");
      } else {
        throw new Error("Invalid API response format or unsuccessful response");
      }
      
    } catch (err) {
      console.error("Failed to fetch developer settings:", err);
      setError("Failed to load API keys. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load the developer settings when the component mounts
  useEffect(() => {
    fetchDeveloperSettings();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const openDocumentation = () => {
    window.open("https://docs.google.com/document/d/1EjAXl67OYd7VT37RFaWVDrsYYvHuAmIG5D_9DKmbzYQ/edit?tab=t.0#heading=h.zaqg8iwuogd7", "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Developer Settings
      </h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          <button
            className={`pb-4 px-1 ${
              activeTab === "api-keys"
                ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("api-keys")}
          >
            API Keys
          </button>
         
          <button
            className={`pb-4 px-1 ${
              activeTab === "docs"
                ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("docs")}
          >
            Documentation
          </button>
        </nav>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center shadow-md">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Copied to clipboard!</span>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "api-keys" && (
        <div>
          {/* Refresh Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={fetchDeveloperSettings}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Keys
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading API keys...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* API Key */}
              <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-md">
                  <h3 className="text-sm font-medium text-gray-700">
                    API Key
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex-grow bg-gray-100 rounded-md flex items-center overflow-hidden">
                      <span className="px-3 py-2 text-gray-700 font-mono text-sm truncate">
                        {apiKeys.public || "No API key available"}
                      </span>
                    </div>
                    <button
                      className="ml-3 p-2 text-gray-500 hover:text-indigo-600"
                      onClick={() => copyToClipboard(apiKeys.public)}
                      disabled={!apiKeys.public}
                    >
                      <ClipboardCopy className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your API key is used to identify your account when making API requests.
                  </p>
                </div>
              </div>

              {/* API Secret */}
              <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-md">
                  <h3 className="text-sm font-medium text-gray-700">
                    API Secret
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex-grow bg-gray-100 rounded-md flex items-center overflow-hidden">
                      <span className="px-3 py-2 text-gray-700 font-mono text-sm truncate">
                        {apiKeys.secret 
                          ? (showKey ? apiKeys.secret : "•".repeat(apiKeys.secret.length)) 
                          : "No API secret available"}
                      </span>
                    </div>
                    <button
                      className="ml-3 p-2 text-gray-500 hover:text-indigo-600"
                      onClick={() => setShowKey(!showKey)}
                      disabled={!apiKeys.secret}
                    >
                      {showKey ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      className="ml-1 p-2 text-gray-500 hover:text-indigo-600"
                      onClick={() => copyToClipboard(apiKeys.secret)}
                      disabled={!apiKeys.secret}
                    >
                      <ClipboardCopy className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Keep your API secret confidential. Never share it in
                    client-side code or public repositories.
                  </p>
                </div>
              </div>
              
              {/* Webhook URLs */}
              <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-md">
                  <h3 className="text-sm font-medium text-gray-700">
                    Webhook URLs
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Pay In Webhook URL */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pay In Webhook URL
                    </label>
                    <div className="flex items-center">
                      <div className="flex-grow bg-gray-100 rounded-md flex items-center overflow-hidden">
                        <span className="px-3 py-2 text-gray-700 font-mono text-sm truncate">
                          {webhookUrls.payIn || "No URL configured"}
                        </span>
                      </div>
                      <button
                        className="ml-3 p-2 text-gray-500 hover:text-indigo-600"
                        onClick={() => copyToClipboard(webhookUrls.payIn)}
                        disabled={!webhookUrls.payIn}
                      >
                        <ClipboardCopy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Pay Out Webhook URL */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pay Out Webhook URL
                    </label>
                    <div className="flex items-center">
                      <div className="flex-grow bg-gray-100 rounded-md flex items-center overflow-hidden">
                        <span className="px-3 py-2 text-gray-700 font-mono text-sm truncate">
                          {webhookUrls.payOut || "No URL configured"}
                        </span>
                      </div>
                      <button
                        className="ml-3 p-2 text-gray-500 hover:text-indigo-600"
                        onClick={() => copyToClipboard(webhookUrls.payOut)}
                        disabled={!webhookUrls.payOut}
                      >
                        <ClipboardCopy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* White IP */}
              <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-md">
                  <h3 className="text-sm font-medium text-gray-700">
                    Whitelisted IP
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex-grow bg-gray-100 rounded-md flex items-center overflow-hidden">
                      <span className="px-3 py-2 text-gray-700 font-mono text-sm truncate">
                        {whiteIp || "No IP whitelisted"}
                      </span>
                    </div>
                    <button
                      className="ml-3 p-2 text-gray-500 hover:text-indigo-600"
                      onClick={() => copyToClipboard(whiteIp)}
                      disabled={!whiteIp}
                    >
                      <ClipboardCopy className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Only API requests from this IP address will be accepted.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === "docs" && (
        <div className="p-6 flex justify-center">
          <button 
            onClick={openDocumentation}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Code className="h-5 w-5 mr-2" />
            API Documentation
          </button>
        </div>
      )}
    </div>
  );
};

export default DeveloperSettings;