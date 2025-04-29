import { useState, useEffect } from "react";

function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [bankTransferType, setBankTransferType] = useState("");
  const [bankDetails, setBankDetails] = useState({
    name: "",
    bankName: "",
    ifscCode: "",
    accountNo: "",
    confirmAccountNo: "",
    branchName: "",
    amount: "",
    mobileNumber: "",
  });
  const [upiDetails, setUpiDetails] = useState({
    vpa: "",
    amount: "",
  });
  const [errors, setErrors] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;

    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (section === "bank") {
      setBankDetails({ ...bankDetails, [name]: value });
    } else if (section === "upi") {
      setUpiDetails({ ...upiDetails, [name]: value });
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setActiveStep(method === "bank" ? 1 : 2);
    setIsValidated(false);
    setErrors({});
  };

  const validateBankForm = () => {
    const newErrors = {};

    // Required field validation
    if (!bankDetails.name) newErrors.name = "Name is required";
    if (!bankDetails.bankName) newErrors.bankName = "Bank name is required";
    if (!bankDetails.accountNo)
      newErrors.accountNo = "Account number is required";
    if (!bankDetails.confirmAccountNo)
      newErrors.confirmAccountNo = "Please confirm account number";
    if (!bankDetails.ifscCode) newErrors.ifscCode = "IFSC code is required";
    if (!bankDetails.amount) newErrors.amount = "Amount is required";
    if (!bankDetails.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";

    // Account number match validation
    if (
      bankDetails.accountNo &&
      bankDetails.confirmAccountNo &&
      bankDetails.accountNo !== bankDetails.confirmAccountNo
    ) {
      newErrors.confirmAccountNo = "Account numbers do not match";
    }

    // IFSC code validation (usually 11 characters)
    if (bankDetails.ifscCode && bankDetails.ifscCode.length !== 11) {
      newErrors.ifscCode = "IFSC code should be 11 characters";
    }

    // Mobile number validation (10 digits)
    if (
      bankDetails.mobileNumber &&
      !/^\d{10}$/.test(bankDetails.mobileNumber)
    ) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    // Transfer type validation
    if (!bankTransferType) {
      newErrors.transferType = "Please select a transfer method";
    }

    // Amount validation
    if (
      bankDetails.amount &&
      (isNaN(parseFloat(bankDetails.amount)) ||
        parseFloat(bankDetails.amount) <= 0)
    ) {
      newErrors.amount = "Please enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUpiForm = () => {
    const newErrors = {};

    if (!upiDetails.vpa) {
      newErrors.vpa = "UPI ID is required";
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiDetails.vpa)) {
      newErrors.vpa = "Enter a valid UPI ID (format: username@bankname)";
    }

    if (
      isValidated &&
      (!upiDetails.amount || parseFloat(upiDetails.amount) <= 0)
    ) {
      newErrors.upiAmount = "Please enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyPay = () => {
    if (!validateBankForm()) return;

    setLoading(true);
    setActiveStep(3);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      showSuccessAnimation();
      console.log("Verifying and Paying with Bank Details:", bankDetails);
    }, 1500);
  };

  const handleValidateUPI = () => {
    if (!validateUpiForm()) return;

    setLoading(true);
    // Simulate validation
    setTimeout(() => {
      setLoading(false);
      setIsValidated(true);
      setActiveStep(3);
      console.log("Validating UPI:", upiDetails.vpa);
    }, 1000);
  };

  const handlePayNowUPI = () => {
    if (!isValidated) {
      setErrors({ ...errors, vpa: "Please validate UPI ID first" });
      return;
    }

    if (!upiDetails.amount || parseFloat(upiDetails.amount) <= 0) {
      setErrors({ ...errors, upiAmount: "Please enter a valid amount" });
      return;
    }

    setLoading(true);
    // Simulate payment
    setTimeout(() => {
      setLoading(false);
      showSuccessAnimation();
      console.log("Paying with UPI:", upiDetails);
    }, 1500);
  };

  const showSuccessAnimation = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Bank logos mapping
  const bankLogos = {
    SBI: "🏦",
    ICICI: "🏛️",
    HDFC: "🏢",
    AXIS: "🏬",
    PNB: "🏦",
    default: "🏦",
  };

  // UPI app logos mapping
  const upiApps = [
    { name: "Google Pay", logo: "phone_android", color: "bg-blue-500" },
    { name: "PhonePe", logo: "account_balance_wallet", color: "bg-indigo-600" },
    { name: "Paytm", logo: "payment", color: "bg-blue-600" },
    { name: "BHIM", logo: "currency_rupee", color: "bg-green-600" },
  ];

  useEffect(() => {
    // Reset validation status when switching payment methods
    setIsValidated(false);
    setErrors({});
  }, [paymentMethod]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 rounded-xl shadow-xl w-full max-w-md mx-auto relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-green-500/10 rounded-full -ml-20 -mb-20"></div>

      {/* Success Animation */}
      {showConfetti && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg text-center z-10">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-green-600">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mt-2">
              Transaction completed successfully
            </p>
            <button
              onClick={() => setShowConfetti(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
          <div className="absolute inset-0 confetti-animation"></div>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="text-indigo-600 text-3xl mr-3">💸</div>
          <h2 className="text-2xl font-bold text-gray-800">Direct Payout</h2>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <div
              className={`flex flex-col items-center ${
                activeStep >= 1 ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  activeStep >= 1
                    ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                    : "bg-gray-200 text-gray-500"
                }`}
                aria-label={`Step 1 ${activeStep >= 1 ? "active" : "inactive"}`}
              >
                1
              </div>
              <span className="text-xs">Select Method</span>
            </div>
            <div
              className={`flex-1 mt-4 mx-2 h-0.5 ${
                activeStep >= 2 ? "bg-indigo-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                activeStep >= 2 ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  activeStep >= 2
                    ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                    : "bg-gray-200 text-gray-500"
                }`}
                aria-label={`Step 2 ${activeStep >= 2 ? "active" : "inactive"}`}
              >
                2
              </div>
              <span className="text-xs">Enter Details</span>
            </div>
            <div
              className={`flex-1 mt-4 mx-2 h-0.5 ${
                activeStep >= 3 ? "bg-indigo-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                activeStep >= 3 ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  activeStep >= 3
                    ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                    : "bg-gray-200 text-gray-500"
                }`}
                aria-label={`Step 3 ${activeStep >= 3 ? "active" : "inactive"}`}
              >
                3
              </div>
              <span className="text-xs">Confirm</span>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 text-white text-9xl leading-none -mt-6 -mr-6">
            ₹
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-gray-100 text-sm">Available Balance</div>
              <div className="text-white font-bold text-2xl">₹ 35,000.00</div>
            </div>
            <div className="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="material-icons text-white">account_balance</span>
            </div>
          </div>
          <div className="flex items-center text-xs mt-4">
            <div className="flex items-center">
              <span className="material-icons text-xs mr-1">
                calendar_today
              </span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="ml-auto flex items-center">
              <span className="material-icons text-xs mr-1">update</span>
              <span>Last updated: Just now</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="mb-6">
          <label
            className="block text-indigo-800 text-sm font-medium mb-2"
            id="payment-method-label"
          >
            Payment Methods
          </label>
          <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              className="block appearance-none w-full bg-indigo-600 text-white py-3 px-4 pr-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 cursor-pointer"
              aria-labelledby="payment-method-label"
            >
              <option value="" disabled>
                Select...
              </option>
              <option value="bank">Bank Transfer</option>
              <option value="upi">UPI</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <span className="material-icons">expand_more</span>
            </div>
          </div>
        </div>

        {paymentMethod === "bank" && (
          <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300">
            {/* Bank Transfer Type Selection */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                id="transfer-type-label"
              >
                Transfer Type <span className="text-red-500">*</span>
              </label>
              <div
                className="grid grid-cols-3 gap-2"
                role="radiogroup"
                aria-labelledby="transfer-type-label"
              >
                <button
                  onClick={() => {
                    setBankTransferType("NEFT");
                    setErrors((prev) => ({ ...prev, transferType: "" }));
                  }}
                  className={`py-2 px-3 rounded text-sm font-medium flex items-center justify-center border ${
                    bankTransferType === "NEFT"
                      ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  role="radio"
                  aria-checked={bankTransferType === "NEFT"}
                >
                  NEFT
                </button>
                <button
                  onClick={() => {
                    setBankTransferType("IMPS");
                    setErrors((prev) => ({ ...prev, transferType: "" }));
                  }}
                  className={`py-2 px-3 rounded text-sm font-medium flex items-center justify-center border ${
                    bankTransferType === "IMPS"
                      ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  role="radio"
                  aria-checked={bankTransferType === "IMPS"}
                >
                  IMPS
                </button>
                <button
                  onClick={() => {
                    setBankTransferType("RTGS");
                    setErrors((prev) => ({ ...prev, transferType: "" }));
                  }}
                  className={`py-2 px-3 rounded text-sm font-medium flex items-center justify-center border ${
                    bankTransferType === "RTGS"
                      ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  role="radio"
                  aria-checked={bankTransferType === "RTGS"}
                >
                  RTGS
                </button>
              </div>
              {errors.transferType && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.transferType}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <span className="material-icons text-sm">person</span>
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={bankDetails.name}
                    onChange={(e) => handleInputChange(e, "bank")}
                    className={`pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                      errors.name
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    } rounded-lg py-2.5 px-3`}
                    placeholder="Enter Full Name"
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="bankName"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <span className="material-icons text-sm">
                      account_balance
                    </span>
                  </span>
                  <select
                    id="bankName"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={(e) => handleInputChange(e, "bank")}
                    className={`pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                      errors.bankName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    } rounded-lg py-2.5 px-3 pr-10 cursor-pointer appearance-none`}
                    aria-invalid={errors.bankName ? "true" : "false"}
                  >
                    <option value="" disabled>
                      Select Bank
                    </option>
                    <option value="SBI">State Bank of India</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="PNB">Punjab National Bank</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="material-icons text-gray-400">
                      expand_more
                    </span>
                  </div>
                </div>
                {errors.bankName && (
                  <p className="mt-1 text-xs text-red-600">{errors.bankName}</p>
                )}
                {bankDetails.bankName && (
                  <div className="mt-2 text-sm flex items-center text-indigo-600">
                    <span className="text-xl mr-2">
                      {bankLogos[bankDetails.bankName] || bankLogos.default}
                    </span>
                    <span>{bankDetails.bankName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="accountNo"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Account Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <span className="material-icons text-sm">pin</span>
                  </span>
                  <input
                    type="text"
                    id="accountNo"
                    name="accountNo"
                    value={bankDetails.accountNo}
                    onChange={(e) => handleInputChange(e, "bank")}
                    className={`pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                      errors.accountNo
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    } rounded-lg py-2.5 px-3`}
                    placeholder="Enter Account Number"
                    aria-invalid={errors.accountNo ? "true" : "false"}
                  />
                </div>
                {errors.accountNo && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.accountNo}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmAccountNo"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Confirm Account Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <span className="material-icons text-sm">done_all</span>
                  </span>
                  <input
                    type="text"
                    id="confirmAccountNo"
                    name="confirmAccountNo"
                    value={bankDetails.confirmAccountNo}
                    onChange={(e) => handleInputChange(e, "bank")}
                    className={`pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                      errors.confirmAccountNo
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    } rounded-lg py-2.5 px-3`}
                    placeholder="Confirm Account Number"
                    aria-invalid={errors.confirmAccountNo ? "true" : "false"}
                  />
                </div>
                {errors.confirmAccountNo ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmAccountNo}
                  </p>
                ) : (
                  bankDetails.accountNo &&
                  bankDetails.confirmAccountNo &&
                  bankDetails.accountNo === bankDetails.confirmAccountNo && (
                    <p className="mt-1 text-xs text-green-600 flex items-center">
                      <span className="material-icons text-xs mr-1">
                        check_circle
                      </span>
                      Account numbers match
                    </p>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="ifscCode"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <span className="material-icons text-sm">code</span>
                  </span>
                  <input
                    type="text"
                    id="ifscCode"
                    name="ifscCode"
                    value={bankDetails.ifscCode}
                    onChange={(e) => handleInputChange(e, "bank")}
                    className={`pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                      errors.ifscCode
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    } rounded-lg py-2.5 px-3 uppercase`}
                    placeholder="Enter IFSC Code"
                    maxLength="11"
                    aria-invalid={errors.ifscCode ? "true" : "false"}
                  />
                </div>
                {errors.ifscCode ? (
                  <p className="mt-1 text-xs text-red-600">{errors.ifscCode}</p>
                ) : (
                  bankDetails.ifscCode && (
                    <p className="mt-1 text-xs text-gray-500">
                      IFSC codes are 11 characters long
                    </p>
                  )
                )}
              </div>
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <span className="material-icons text-sm">phone</span>
                  </span>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={bankDetails.mobileNumber}
                    onChange={(e) => handleInputChange(e, "bank")}
                    className={`pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                      errors.mobileNumber
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    } rounded-lg py-2.5 px-3`}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    aria-invalid={errors.mobileNumber ? "true" : "false"}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={bankDetails.amount}
                  onChange={(e) => handleInputChange(e, "bank")}
                  className={`pl-7 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                    errors.amount
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  } rounded-lg py-2.5 px-3`}
                  placeholder="0.00"
                  aria-invalid={errors.amount ? "true" : "false"}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
              )}
            </div>

            <button
              onClick={handleVerifyPay}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label={loading ? "Processing payment" : "Verify and pay"}
            >
              {loading ? (
                <span className="material-icons animate-spin mr-2">
                  refresh
                </span>
              ) : (
                <span className="material-icons mr-2">verified</span>
              )}
              {loading ? "Processing..." : "Verify & Pay"}
            </button>

            <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center">
              <span className="material-icons text-xs mr-1">lock</span>
              Your banking details are secure and encrypted
            </div>
          </div>
        )}

        {paymentMethod === "upi" && (
          <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300">
            <div className="mb-6">
              <label
                htmlFor="vpa"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                UPI ID / VPA <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <span className="material-icons text-sm">
                    alternate_email
                  </span>
                </span>
                <input
                  type="text"
                  id="vpa"
                  name="vpa"
                  value={upiDetails.vpa}
                  onChange={(e) => handleInputChange(e, "upi")}
                  className={`pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                    errors.vpa
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  } rounded-lg py-2.5 px-3`}
                  placeholder="Example: name@bank or mobile@upi"
                  aria-invalid={errors.vpa ? "true" : "false"}
                />
                {isValidated && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-600">
                    <span className="material-icons">check_circle</span>
                  </span>
                )}
              </div>
              {errors.vpa ? (
                <p className="mt-1 text-xs text-red-600">{errors.vpa}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Format: username@bankname or mobilenumber@upi
                </p>
              )}
            </div>

            {/* UPI Apps Suggestion */}
            {!isValidated && (
              <div className="mb-4">
                <label className="block text-gray-700 text-xs font-medium mb-2">
                  Popular UPI Apps
                </label>
                <div className="flex flex-wrap gap-2">
                  {upiApps.map((app, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`${app.color} text-white rounded-full px-3 py-1 text-xs font-medium flex items-center`}
                      onClick={() => {
                        const appName = app.name
                          .toLowerCase()
                          .replace(/\s+/g, "");
                        setUpiDetails({ ...upiDetails, vpa: `${appName}@upi` });
                        setErrors({ ...errors, vpa: "" });
                      }}
                    >
                      <span className="material-icons text-xs mr-1">
                        {app.logo}
                      </span>
                      {app.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isValidated ? (
              <button
                onClick={handleValidateUPI}
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 shadow-md flex items-center justify-center transition-all mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
                aria-label={loading ? "Validating UPI ID" : "Validate UPI ID"}
              >
                {loading ? (
                  <span className="material-icons animate-spin mr-2">
                    refresh
                  </span>
                ) : (
                  <span className="material-icons mr-2">verified_user</span>
                )}
                {loading ? "Validating..." : "Validate UPI ID"}
              </button>
            ) : (
              <>
                <div className="p-3 bg-green-50 rounded-lg flex items-center mb-6 border border-green-200">
                  <span className="material-icons text-green-600 mr-2">
                    check_circle
                  </span>
                  <div>
                    <p className="text-green-700 text-sm font-medium">
                      UPI ID Verified Successfully
                    </p>
                    <p className="text-green-600 text-xs">{upiDetails.vpa}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="upiAmount"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Payment Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      id="upiAmount"
                      name="amount"
                      value={upiDetails.amount}
                      onChange={(e) => handleInputChange(e, "upi")}
                      className={`pl-7 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                        errors.upiAmount
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300"
                      } rounded-lg py-2.5 px-3`}
                      placeholder="0.00"
                      aria-invalid={errors.upiAmount ? "true" : "false"}
                    />
                  </div>
                  {errors.upiAmount && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.upiAmount}
                    </p>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-xs font-medium mb-2">
                    Quick Select Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2000, 5000].map((amount, index) => (
                      <button
                        key={index}
                        type="button"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded py-1 text-sm transition-colors"
                        onClick={() => {
                          setUpiDetails({
                            ...upiDetails,
                            amount: amount.toString(),
                          });
                          setErrors({ ...errors, upiAmount: "" });
                        }}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePayNowUPI}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  aria-label={loading ? "Processing payment" : "Pay now"}
                >
                  {loading ? (
                    <span className="material-icons animate-spin mr-2">
                      refresh
                    </span>
                  ) : (
                    <span className="material-icons mr-2">paid</span>
                  )}
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </>
            )}

            <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center">
              <span className="material-icons text-xs mr-1">lock</span>
              Secured by UPI Payment Gateway
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <span className="material-icons text-blue-600 mr-3">info</span>
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Important Information
              </h4>
              <ul className="list-disc text-xs text-blue-700 mt-1 pl-4 space-y-1">
                <li>Your account details are encrypted and secure</li>
                <li>Payments are typically processed within 24 hours</li>
                <li>For assistance, please contact our support team</li>
              </ul>
            </div>
          </div>
        </div>

        
      </div>

      {/* Faux Material Icons - Added since we're using material icons in the UI */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/icon?family=Material+Icons");

        .confetti-animation {
          background-image: radial-gradient(
              circle,
              rgba(255, 0, 0, 0.8) 8px,
              transparent 8px
            ),
            radial-gradient(circle, rgba(0, 0, 255, 0.8) 8px, transparent 8px),
            radial-gradient(circle, rgba(255, 255, 0, 0.8) 8px, transparent 8px),
            radial-gradient(circle, rgba(0, 255, 0, 0.8) 8px, transparent 8px),
            radial-gradient(circle, rgba(255, 0, 255, 0.8) 8px, transparent 8px),
            radial-gradient(circle, rgba(0, 255, 255, 0.8) 8px, transparent 8px);
          background-size: 200px 200px;
          animation: confetti 5s linear infinite;
        }

        @keyframes confetti {
          0% {
            background-position: 0 0, 40px 60px, 130px 25px, 80px 120px,
              180px 60px, 60px 180px;
          }
          100% {
            background-position: 0 200px, 40px 260px, 130px 225px, 80px 320px,
              180px 260px, 60px 380px;
          }
        }
      `}</style>
    </div>
  );
}

export default PaymentForm;
