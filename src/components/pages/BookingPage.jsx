import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, differenceInDays, parseISO } from "date-fns";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import bookingService from "@/services/api/bookingService";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, bookingData } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Guest Details, 2: Confirmation
  const [guestDetails, setGuestDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: ""
  });

  const [selectedRoom, setSelectedRoom] = useState({
    id: `${hotel?.Id}_deluxe`,
    type: "Deluxe Room",
    capacity: 2,
    pricePerNight: hotel?.pricePerNight || 0,
    amenities: ["Free WiFi", "Mini Bar", "City View"]
  });

  if (!hotel || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-accent-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
            Booking Information Missing
          </h2>
          <p className="text-gray-600 mb-6">
            Please select a hotel and dates to proceed with booking.
          </p>
          <Button onClick={() => navigate("/hotels")}>
            Browse Hotels
          </Button>
        </div>
      </div>
    );
  }

  const checkInDate = parseISO(bookingData.checkIn);
  const checkOutDate = parseISO(bookingData.checkOut);
  const nights = differenceInDays(checkOutDate, checkInDate);
  const totalPrice = selectedRoom.pricePerNight * nights;

  const handleInputChange = (field, value) => {
    setGuestDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitGuestDetails = (e) => {
    e.preventDefault();
    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      
      const booking = {
        userId: "user1", // Simulate current user
        hotelId: hotel.Id,
        hotelName: hotel.name,
        hotelImage: hotel.images[0],
        location: `${hotel.location.city}, ${hotel.location.state}`,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        nights,
        roomType: selectedRoom.type,
        totalPrice,
        guestDetails
      };

      const confirmedBooking = await bookingService.create(booking);
      
      toast.success("Booking confirmed successfully!");
      navigate("/bookings", { 
        state: { 
          newBooking: confirmedBooking,
          showConfirmation: true 
        } 
      });
    } catch (err) {
      toast.error(err.message || "Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-500' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              Guest Details
            </div>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center ${step >= 2 ? 'text-primary-500' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              Confirmation
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                  Guest Information
                </h2>
                
                <form onSubmit={handleSubmitGuestDetails} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name *"
                      value={guestDetails.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                    <Input
                      label="Last Name *"
                      value={guestDetails.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email Address *"
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                    <Input
                      label="Phone Number *"
                      type="tel"
                      value={guestDetails.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="label">Special Requests (Optional)</label>
                    <textarea
                      value={guestDetails.specialRequests}
                      onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                      placeholder="Any special requests or preferences..."
                      rows={4}
                      className="input resize-none"
                    />
                  </div>
                  
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate(-1)}
                    >
                      <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                      Back to Hotel
                    </Button>
                    <Button type="submit">
                      Continue to Review
                      <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Booking Confirmation */}
                <div className="card p-6">
                  <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                    Review Your Booking
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Guest Details Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Guest Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <div className="font-medium">{guestDetails.firstName} {guestDetails.lastName}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <div className="font-medium">{guestDetails.email}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <div className="font-medium">{guestDetails.phone}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Guests:</span>
                          <div className="font-medium">{bookingData.guests} {bookingData.guests === 1 ? 'guest' : 'guests'}</div>
                        </div>
                      </div>
                      {guestDetails.specialRequests && (
                        <div className="mt-3">
                          <span className="text-gray-600">Special Requests:</span>
                          <div className="font-medium">{guestDetails.specialRequests}</div>
                        </div>
                      )}
                    </div>

                    {/* Cancellation Policy */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <ApperIcon name="Shield" className="w-5 h-5 mr-2 text-success" />
                        Cancellation Policy
                      </h3>
                      <p className="text-sm text-gray-600">
                        Free cancellation up to 24 hours before check-in. 
                        Cancel or modify your booking anytime from your account.
                      </p>
                    </div>

                    {/* Terms */}
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>By confirming this booking, you agree to our Terms of Service and Privacy Policy.</p>
                      <p>You will receive a confirmation email with your booking details and check-in instructions.</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(1)}
                    >
                      <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                      Back to Details
                    </Button>
                    <Button
                      onClick={handleConfirmBooking}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                Booking Summary
              </h3>
              
              {/* Hotel Info */}
              <div className="flex space-x-4 mb-6">
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
                  <p className="text-sm text-gray-600">{hotel.location.city}, {hotel.location.state}</p>
                  <div className="flex items-center mt-1">
                    <ApperIcon name="Star" className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{hotel.rating}</span>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-medium">{format(checkInDate, "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-medium">{format(checkOutDate, "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type</span>
                  <span className="font-medium">{selectedRoom.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{bookingData.guests} {bookingData.guests === 1 ? 'guest' : 'guests'}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">${selectedRoom.pricePerNight} × {nights} nights</span>
                  <span className="font-medium">${selectedRoom.pricePerNight * nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & fees</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-500">${totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Shield" className="w-4 h-4 mr-2 text-success" />
                  Secure booking process
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-2 text-success" />
                  Instant confirmation
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2 text-success" />
                  Free cancellation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;