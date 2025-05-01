import React, { useState } from "react";
import {
  ClipboardCopy,
  Eye,
  EyeOff,
  CheckCircle,
  Code
} from "lucide-react";

const DeveloperSettings = () => {
  const [activeTab, setActiveTab] = useState("api-keys");
  const [showKey, setShowKey] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Mock API key (single set, no test/live distinction)
  const apiKey = {
    public: "pk_51NjhaGH7N9JYs1v6WcZ2X8Y4dJ3kL5m6P7oR8",
    secret: "sk_51NjhaGH7N9JYs1v6WcZ2X8Y4dJ3kL5m6P7oR8",
  };

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
          <div className="space-y-6">
            {/* Public Key */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-md">
                <h3 className="text-sm font-medium text-gray-700">
                  Public Key
                </h3>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="flex-grow bg-gray-100 rounded-md flex items-center overflow-hidden">
                    <span className="px-3 py-2 text-gray-700 font-mono text-sm truncate">
                      {apiKey.public}
                    </span>
                  </div>
                  <button
                    className="ml-3 p-2 text-gray-500 hover:text-indigo-600"
                    onClick={() => copyToClipboard(apiKey.public)}
                  >
                    <ClipboardCopy className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your public key can be shared in client-side code.
                </p>
              </div>
            </div>

            {/* Secret Key */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-md">
                <h3 className="text-sm font-medium text-gray-700">
                  Secret Key
                </h3>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="flex-grow bg-gray-100 rounded-md flex items-center overflow-hidden">
                    <span className="px-3 py-2 text-gray-700 font-mono text-sm truncate">
                      {showKey ? apiKey.secret : "•".repeat(apiKey.secret.length)}
                    </span>
                  </div>
                  <button
                    className="ml-3 p-2 text-gray-500 hover:text-indigo-600"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    className="ml-1 p-2 text-gray-500 hover:text-indigo-600"
                    onClick={() => copyToClipboard(apiKey.secret)}
                  >
                    <ClipboardCopy className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Keep your secret key confidential. Never share it in
                  client-side code or public repositories.
                </p>
              </div>
            </div>
          </div>
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