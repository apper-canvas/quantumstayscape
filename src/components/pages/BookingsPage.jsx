import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import BookingCard from "@/components/molecules/BookingCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import bookingService from "@/services/api/bookingService";

const BookingsPage = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const tabs = [
    { id: "all", label: "All Bookings", count: 0 },
    { id: "upcoming", label: "Upcoming", count: 0 },
    { id: "confirmed", label: "Confirmed", count: 0 },
    { id: "completed", label: "Completed", count: 0 },
    { id: "cancelled", label: "Cancelled", count: 0 }
  ];

  const loadBookings = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await bookingService.getAll();
      setBookings(data);
      
      // Show confirmation toast for new booking
      if (location.state?.showConfirmation && location.state?.newBooking) {
        toast.success(
          `Booking confirmed! Confirmation number: ${location.state.newBooking.confirmationNumber}`,
          { autoClose: 5000 }
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getFilteredBookings = () => {
    switch (activeTab) {
      case "upcoming":
        return bookings.filter(booking => 
          booking.status === "upcoming" || 
          (booking.status === "confirmed" && new Date(booking.checkIn) > new Date())
        );
      case "confirmed":
        return bookings.filter(booking => booking.status === "confirmed");
      case "completed":
        return bookings.filter(booking => booking.status === "completed");
      case "cancelled":
        return bookings.filter(booking => booking.status === "cancelled");
      default:
        return bookings;
    }
  };

  const getTabCounts = () => {
    return tabs.map(tab => ({
      ...tab,
      count: tab.id === "all" ? bookings.length : 
             tab.id === "upcoming" ? bookings.filter(b => 
               b.status === "upcoming" || 
               (b.status === "confirmed" && new Date(b.checkIn) > new Date())
             ).length :
             bookings.filter(b => b.status === tab.id).length
    }));
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await bookingService.cancel(bookingId);
      toast.success("Booking cancelled successfully");
      await loadBookings(); // Reload bookings
    } catch (err) {
      toast.error(err.message || "Failed to cancel booking");
    }
  };

  const filteredBookings = getFilteredBookings();
  const tabsWithCounts = getTabCounts();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBookings} />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            My Bookings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your hotel reservations and view your booking history.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {tabsWithCounts.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Bookings List */}
        <AnimatePresence mode="wait">
          {filteredBookings.length === 0 ? (
            <Empty
              type="bookings"
              title={activeTab === "all" ? "No bookings yet" : `No ${activeTab} bookings`}
              description={
                activeTab === "all"
                  ? "Start your journey by booking your first stay with us!"
                  : `You don't have any ${activeTab} bookings at the moment.`
              }
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {filteredBookings.map((booking, index) => (
                <BookingCard
                  key={booking.Id}
                  booking={booking}
                  onViewDetails={handleViewDetails}
                  onCancel={handleCancelBooking}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Details Modal */}
        <AnimatePresence>
          {showModal && selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-display font-bold text-gray-900">
                      Booking Details
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowModal(false)}
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Hotel Info */}
                    <div className="flex space-x-4">
                      <img
                        src={selectedBooking.hotelImage}
                        alt={selectedBooking.hotelName}
                        className="w-24 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="text-xl font-display font-semibold text-gray-900">
                          {selectedBooking.hotelName}
                        </h4>
                        <p className="text-gray-600 flex items-center">
                          <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                          {selectedBooking.location}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Confirmation: {selectedBooking.confirmationNumber}
                        </p>
                      </div>
                    </div>

                    {/* Stay Details */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-600">Check-in</span>
                        <div className="font-medium">{new Date(selectedBooking.checkIn).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Check-out</span>
                        <div className="font-medium">{new Date(selectedBooking.checkOut).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Duration</span>
                        <div className="font-medium">{selectedBooking.nights} nights</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Guests</span>
                        <div className="font-medium">{selectedBooking.guests}</div>
                      </div>
                    </div>

                    {/* Guest Details */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Guest Information</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <div className="font-medium">
                            {selectedBooking.guestDetails.firstName} {selectedBooking.guestDetails.lastName}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <div className="font-medium">{selectedBooking.guestDetails.email}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <div className="font-medium">{selectedBooking.guestDetails.phone}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Room Type:</span>
                          <div className="font-medium">{selectedBooking.roomType}</div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                        <span className="text-2xl font-bold text-primary-500">
                          ${selectedBooking.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingsPage;