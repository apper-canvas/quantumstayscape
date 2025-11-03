import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import bookingService from "@/services/api/bookingService";
import userService from "@/services/api/userService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  const loadDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [userData, upcoming, recent] = await Promise.all([
        userService.getCurrentUser(),
        bookingService.getUpcoming(),
        bookingService.getRecent(undefined, 3)
      ]);
      
      setUser(userData);
      setUpcomingBookings(upcoming);
      setRecentBookings(recent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed": return "success";
      case "upcoming": return "info";
      case "completed": return "default";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const stats = [
    {
      title: "Total Bookings",
      value: user?.totalBookings || 0,
      icon: "Calendar",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Upcoming Trips",
      value: upcomingBookings.length,
      icon: "Clock",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Countries Visited",
      value: "12",
      icon: "Globe",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Loyalty Status",
      value: user?.loyaltyStatus || "Bronze",
      icon: "Crown",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || user?.name || "Traveler"}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Here's what's happening with your travels.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {typeof stat.value === "string" ? stat.value : stat.value.toLocaleString()}
              </h3>
              <p className="text-gray-600">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-semibold text-gray-900">
                Upcoming Trips
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/bookings")}
              >
                View All
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Calendar" className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                  No upcoming trips
                </h3>
                <p className="text-gray-600 mb-6">
                  Start planning your next adventure!
                </p>
                <Button onClick={() => navigate("/hotels")}>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Browse Hotels
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.Id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img
                      src={booking.hotelImage}
                      alt={booking.hotelName}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {booking.hotelName}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">
                        {booking.nights} nights
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-semibold text-gray-900">
                Recent Activity
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/bookings")}
              >
                View All
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Clock" className="w-8 h-8 text-accent-500" />
                </div>
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                  No recent activity
                </h3>
                <p className="text-gray-600">
                  Your booking history will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        booking.status === "confirmed" ? "bg-success/10" :
                        booking.status === "completed" ? "bg-primary/10" :
                        booking.status === "cancelled" ? "bg-error/10" : "bg-gray-100"
                      }`}>
                        <ApperIcon 
                          name={
                            booking.status === "confirmed" ? "CheckCircle" :
                            booking.status === "completed" ? "Check" :
                            booking.status === "cancelled" ? "XCircle" : "Clock"
                          }
                          className={`w-5 h-5 ${
                            booking.status === "confirmed" ? "text-success" :
                            booking.status === "completed" ? "text-primary-500" :
                            booking.status === "cancelled" ? "text-error" : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {booking.status === "confirmed" ? "Booking Confirmed" :
                           booking.status === "completed" ? "Trip Completed" :
                           booking.status === "cancelled" ? "Booking Cancelled" : "Booking Created"}
                        </h4>
                        <p className="text-sm text-gray-600">{booking.hotelName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                      <Badge variant={getStatusVariant(booking.status)} className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              variant="primary"
              size="lg"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate("/hotels")}
            >
              <ApperIcon name="Search" className="w-6 h-6" />
              <span>Find Hotels</span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate("/bookings")}
            >
              <ApperIcon name="Calendar" className="w-6 h-6" />
              <span>My Bookings</span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate("/profile")}
            >
              <ApperIcon name="User" className="w-6 h-6" />
              <span>Profile Settings</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;