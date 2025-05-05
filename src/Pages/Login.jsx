import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    // Validate credentials (dummy check for the example)
    if (loginForm.email !== "1234234234@gmail.com" || loginForm.password !== "test@123456") {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call to authenticate
      setTimeout(() => {
        // Generate and store the auth token
        const mockToken = "mock-jwt-token-" + Date.now();
        localStorage.setItem("authToken", mockToken);

        // If remember me is checked
        if (loginForm.rememberMe) {
          localStorage.setItem("rememberUser", loginForm.email);
        }

        setSuccess(true);

        // Redirect after a brief delay
        setTimeout(() => {
          window.dispatchEvent(new Event("storage"));
          navigate(from, { replace: true });
        }, 1000);
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to connect to the server. Please try again.");
      setLoading(false);
    }
  };

  // Function to make an API call after login
  const getAPIData = async (merchantId) => {
    const token = localStorage.getItem("authToken"); // Get the auth token
    if (!token) {
      console.error("Auth token is missing!");
      return;
    }

    try {
      const response = await fetch("/api/your-endpoint", {
        method: "GET", // or POST depending on your API
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify({ merchantId }), // Include merchantId in the request body
      });

      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="h-24 w-24 flex items-center justify-center">
              <img src="../assets/logon.png" alt="logo" />
            </div>
          </div>
          <p className="text-black-600">Sign in to your merchant account</p>
        </div>

        {/* Card container */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {success ? (
              <div className="text-center py-8">
                <div className="text-green-500 text-4xl mb-4">✓</div>
                <h3 className="text-xl font-medium mb-2">Login Successful!</h3>
                <p className="text-slate-600">You are now being redirected...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-5">
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
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Password
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
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, password: e.target.value })
                        }
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
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        checked={loginForm.rememberMe}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            rememberMe: e.target.checked,
                          })
                        }
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-slate-600"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {!success && (
              <div className="mt-8 text-center text-sm text-slate-600">
                Don’t have an account?{" "}
                <a href="#signup" className="text-blue-600 hover:text-blue-500">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}