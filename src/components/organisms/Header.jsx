import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Simulate authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user] = useState({
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
  });

  const isActivePath = (path) => location.pathname === path;

  const publicNavItems = [
    { name: "Home", path: "/", icon: "Home" },
    { name: "Hotels", path: "/hotels", icon: "Building2" },
    { name: "About", path: "/about", icon: "Info" }
  ];

  const privateNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { name: "My Bookings", path: "/bookings", icon: "Calendar" },
    { name: "Profile", path: "/profile", icon: "User" }
  ];

  const handleAuth = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const navItems = isAuthenticated ? [...publicNavItems, ...privateNavItems] : publicNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gray-900">StayScape</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? "text-primary-500 bg-primary-50"
                    : "text-gray-600 hover:text-primary-500 hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleAuth}>
                  <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Log In
                </Button>
                <Button variant="primary" onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden"
          >
            <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 bg-white"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? "text-primary-500 bg-primary-50"
                        : "text-gray-600 hover:text-primary-500 hover:bg-gray-50"
                    }`}
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 px-4 py-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-base font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">View Profile</div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={handleAuth}
                      >
                        <ApperIcon name="LogOut" className="w-5 h-5 mr-3" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => {
                          navigate("/login");
                          setIsMenuOpen(false);
                        }}
                      >
                        <ApperIcon name="LogIn" className="w-5 h-5 mr-3" />
                        Log In
                      </Button>
                      <Button 
                        variant="primary" 
                        className="w-full justify-start" 
                        onClick={() => {
                          navigate("/signup");
                          setIsMenuOpen(false);
                        }}
                      >
                        <ApperIcon name="UserPlus" className="w-5 h-5 mr-3" />
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;