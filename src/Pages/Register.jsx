import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  ChevronLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState({ success: null, message: "" });

  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
    agreeToTerms: false,
  });

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    // Simple password strength calculator
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
    setRegisterForm({ ...registerForm, password });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      nextStep();
      return;
    }
    
    // Form validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setApiResponse({
        success: false,
        message: "Passwords do not match."
      });
      return;
    }
    
    if (!registerForm.agreeToTerms) {
      setApiResponse({
        success: false,
        message: "You must agree to the Terms of Service and Privacy Policy."
      });
      return;
    }
    
    // Prepare API payload
    const apiPayload = {
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      phone: registerForm.phone,
      password: registerForm.password,
      businessName: registerForm.businessName,
      businessType: registerForm.businessType,
    };
    
    setIsSubmitting(true);
    setApiResponse({ success: null, message: "" });
    
    try {
      // Make API call
      const response = await fetch('https://tpgapi.pvearnfast.com/api/tpgApi/merchant/apiRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setApiResponse({
          success: true,
          message: "Account created successfully! You'll be redirected to login."
        });
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        setApiResponse({
          success: false,
          message: data.message || "Registration failed. Please try again."
        });
      }
    } catch (error) {
      setApiResponse({
        success: false,
        message: "Network error. Please check your connection and try again."
      });
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            1
          </div>
          <div
            className={`w-12 h-1 ${
              currentStep >= 2 ? "bg-blue-600" : "bg-slate-200"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            2
          </div>
          <div
            className={`w-12 h-1 ${
              currentStep >= 3 ? "bg-blue-600" : "bg-slate-200"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 3
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            3
          </div>
        </div>
      </div>
    );
  };

  // API response notification
  const renderApiResponse = () => {
    if (apiResponse.success === null) return null;
    
    return (
      <div className={`p-4 rounded-lg mb-6 flex items-start ${
        apiResponse.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
      }`}>
        {apiResponse.success ? (
          <CheckCircle className="flex-shrink-0 w-5 h-5 mr-2" />
        ) : (
          <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2" />
        )}
        <span>{apiResponse.message}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="h-24 w-24 flex items-center justify-center">
              <img src="../assets/logon.png" alt="logo" />
            </div>
          </div>
         
          <p className="text-slate-600">Create your merchant account</p>
        </div>

        {renderStepIndicator()}

        {/* Card container */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {renderApiResponse()}
          
          <form onSubmit={handleSubmit}>
            <div className="p-6 md:p-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-medium text-slate-800 mb-4">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User size={18} className="text-slate-400" />
                        </div>
                        <input
                          id="firstName"
                          type="text"
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="John"
                          value={registerForm.firstName}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Doe"
                        value={registerForm.lastName}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail size={18} className="text-slate-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="you@example.com"
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone size={18} className="text-slate-400" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (555) 123-4567"
                        value={registerForm.phone}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Security */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-medium text-slate-800 mb-4">
                    Security
                  </h2>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Create Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        value={registerForm.password}
                        onChange={handlePasswordChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} className="text-slate-400" />
                        ) : (
                          <Eye size={18} className="text-slate-400" />
                        )}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">
                          Password strength:
                        </span>
                        <span className="text-xs font-medium">
                          {passwordStrength === 0 && "Very weak"}
                          {passwordStrength === 1 && "Weak"}
                          {passwordStrength === 2 && "Medium"}
                          {passwordStrength === 3 && "Strong"}
                          {passwordStrength === 4 && "Very strong"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            passwordStrength === 0
                              ? "bg-red-500 w-1/5"
                              : passwordStrength === 1
                              ? "bg-orange-500 w-2/5"
                              : passwordStrength === 2
                              ? "bg-yellow-500 w-3/5"
                              : passwordStrength === 3
                              ? "bg-lime-500 w-4/5"
                              : "bg-green-500 w-full"
                          }`}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-1 ${
                            registerForm.password.length >= 8
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        ></div>
                        <span>At least 8 characters</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-1 ${
                            /[A-Z]/.test(registerForm.password)
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        ></div>
                        <span>Uppercase letter</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-1 ${
                            /[0-9]/.test(registerForm.password)
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        ></div>
                        <span>Number</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-1 ${
                            /[^A-Za-z0-9]/.test(registerForm.password)
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        ></div>
                        <span>Special character</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        value={registerForm.confirmPassword}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} className="text-slate-400" />
                        ) : (
                          <Eye size={18} className="text-slate-400" />
                        )}
                      </button>
                    </div>
                    {registerForm.password &&
                      registerForm.confirmPassword &&
                      registerForm.password !==
                        registerForm.confirmPassword && (
                        <p className="mt-2 text-xs text-red-500">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </div>
              )}

              {/* Step 3: Business Information */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-medium text-slate-800 mb-4">
                    Business Information
                  </h2>

                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Business Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Building size={18} className="text-slate-400" />
                      </div>
                      <input
                        id="businessName"
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your Business Name"
                        value={registerForm.businessName}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            businessName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="businessType"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Business Type
                    </label>
                    <select
                      id="businessType"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={registerForm.businessType}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          businessType: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="retail">Retail</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="service">Service Business</option>
                      <option value="saas">SaaS / Software</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex items-start mt-6">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        checked={registerForm.agreeToTerms}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            agreeToTerms: e.target.checked,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-slate-600">
                        I agree to the{" "}
                        <a
                          href="#terms"
                          className="text-blue-600 hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#privacy"
                          className="text-blue-600 hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm bg-white text-slate-700 hover:bg-slate-50"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft size={16} className="mr-2" />
                    Back
                  </button>
                ) : (
                  <a
                    href="/login"
                    className="flex items-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm bg-white text-slate-700 hover:bg-slate-50"
                  >
                    <ChevronLeft size={16} className="mr-2" />
                    Login
                  </a>
                )}

                <button
                  type="submit"
                  className={`flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-white 
                    ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  disabled={
                    isSubmitting || 
                    (currentStep === 3 && !registerForm.agreeToTerms) ||
                    (currentStep === 2 && 
                      registerForm.password !== registerForm.confirmPassword)
                  }
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      {currentStep < 3 ? "Continue" : "Create Account"}
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}