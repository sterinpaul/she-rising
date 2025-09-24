import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authUtils } from "../utils/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  // Note: Authentication check is now handled by ProtectedRoute wrapper

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.6
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0
    },
  };

  // Form validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await authUtils.login(formData.email, formData.password);
      // Redirect to dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({
        email: "",
        password: "Invalid email or password"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f5f1ee] to-[#c4b4a7] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo Section */}
        <motion.div 
          className="text-center mb-8"
          variants={logoVariants}
        >
          <motion.h1 
            className="text-4xl font-bold text-[#4D361E] mb-2 tracking-wide"
            whileHover={{
              scale: 1.02,
              textShadow: "0px 0px 20px rgba(77, 54, 30, 0.3)",
              transition: { duration: 0.3 },
            }}
          >
            SHE RISING
          </motion.h1>
          <motion.p 
            className="text-[#6f360d] text-sm font-medium"
            variants={itemVariants}
          >
            Admin Portal
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ 
            boxShadow: "0 25px 50px rgba(139, 69, 19, 0.15)",
            transition: { duration: 0.3 }
          }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C4A173]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#4D361E]/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

          <motion.h2 
            className="text-2xl font-bold text-[#4D361E] text-center mb-6"
            variants={itemVariants}
          >
            Welcome Back
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-[#4D361E] text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <motion.input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                    ${errors.email 
                      ? "border-red-400 focus:border-red-500" 
                      : focusedField === "email"
                      ? "border-[#C4A173] focus:border-[#C4A173] shadow-lg shadow-[#C4A173]/20"
                      : "border-gray-200 focus:border-[#C4A173]"
                    }
                    focus:outline-none focus:ring-0 text-[#4D361E] placeholder-[#6f360d]/60`}
                  placeholder="admin@sherising.org"
                  animate={{
                    scale: focusedField === "email" ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-[#C4A173] opacity-0 pointer-events-none"
                  animate={{
                    opacity: focusedField === "email" ? 0.3 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              {errors.email && (
                <motion.p 
                  className="text-red-500 text-xs mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-[#4D361E] text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <motion.input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                    ${errors.password 
                      ? "border-red-400 focus:border-red-500" 
                      : focusedField === "password"
                      ? "border-[#C4A173] focus:border-[#C4A173] shadow-lg shadow-[#C4A173]/20"
                      : "border-gray-200 focus:border-[#C4A173]"
                    }
                    focus:outline-none focus:ring-0 text-[#4D361E] placeholder-[#6f360d]/60`}
                  placeholder="••••••••"
                  animate={{
                    scale: focusedField === "password" ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6f360d] hover:text-[#4D361E] transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </motion.button>
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-[#C4A173] opacity-0 pointer-events-none"
                  animate={{
                    opacity: focusedField === "password" ? 0.3 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              {errors.password && (
                <motion.p 
                  className="text-red-500 text-xs mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Forgot Password */}
            {/* <motion.div 
              className="flex items-center justify-between text-sm"
              variants={itemVariants}
            >
              <motion.a 
                href="#" 
                className="text-[#C4A173] hover:text-[#4D361E] font-medium transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Forgot password?
              </motion.a>
            </motion.div> */}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ 
                scale: isLoading ? 1 : 1.02,
                boxShadow: "0 15px 35px rgba(196, 161, 115, 0.4)"
              }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8"
          variants={itemVariants}
        >
          <p className="text-[#6f360d] text-xs">
            © 2024 She Rising. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;