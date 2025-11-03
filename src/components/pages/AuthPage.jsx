import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (isLogin) {
        const result = await userService.authenticate(formData.email, formData.password);
        toast.success("Welcome back!");
        // In a real app, you'd store the token and user info
        navigate("/dashboard");
      } else {
        const userData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone
        };
        
        const result = await userService.register(userData);
        toast.success("Account created successfully! Welcome to StayScape!");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.message || `Failed to ${isLogin ? "sign in" : "create account"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Building2" className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-gray-900">StayScape</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-gray-600">
              {isLogin 
                ? "Sign in to access your bookings and continue your journey" 
                : "Join thousands of travelers and start exploring the world"
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  error={errors.firstName}
                  placeholder="John"
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  error={errors.lastName}
                  placeholder="Smith"
                />
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder="john@example.com"
            />

            {!isLogin && (
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={errors.phone}
                placeholder="+1 (555) 123-4567"
              />
            )}

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
            />

            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
              />
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>

            <div className="text-center">
              <span className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => navigate(isLogin ? "/signup" : "/login")}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>

            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary-500 hover:text-primary-600"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" className="w-full">
                <ApperIcon name="Mail" className="w-5 h-5 mr-2" />
                Google
              </Button>
              <Button variant="outline" type="button" className="w-full">
                <ApperIcon name="Facebook" className="w-5 h-5 mr-2" />
                Facebook
              </Button>
            </div>
          </div>

          {/* Terms */}
          {!isLogin && (
            <div className="mt-6 text-center text-sm text-gray-600">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-primary-500 hover:text-primary-600">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary-500 hover:text-primary-600">
                Privacy Policy
              </a>
            </div>
          )}
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=1200&fit=crop"
          alt="Luxury hotel lobby"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-accent-600/90" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-center text-center text-white p-8"
        >
          <div className="max-w-lg">
            <h2 className="text-3xl font-display font-bold mb-6">
              {isLogin ? "Continue Your Journey" : "Start Your Adventure"}
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              {isLogin 
                ? "Access your bookings, manage your trips, and discover new destinations with ease."
                : "Join our community of travelers and unlock exclusive deals, personalized recommendations, and seamless booking experiences."
              }
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-primary-200">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Shield" className="w-5 h-5" />
                <span className="text-sm font-medium">Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Clock" className="w-5 h-5" />
                <span className="text-sm font-medium">Instant</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Heart" className="w-5 h-5" />
                <span className="text-sm font-medium">Trusted</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;