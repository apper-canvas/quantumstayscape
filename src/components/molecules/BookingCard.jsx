import { motion } from "framer-motion";
import { format, parseISO, differenceInDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const BookingCard = ({ booking, onViewDetails, onCancel, index = 0 }) => {
  const checkInDate = parseISO(booking.checkIn);
  const checkOutDate = parseISO(booking.checkOut);
  const nights = differenceInDays(checkOutDate, checkInDate);

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed": return "success";
      case "upcoming": return "info";
      case "completed": return "default";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed": return "CheckCircle";
      case "upcoming": return "Clock";
      case "completed": return "Check";
      case "cancelled": return "XCircle";
      default: return "Clock";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card p-6 hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <img
            src={booking.hotelImage}
            alt={booking.hotelName}
            className="w-full h-40 lg:h-32 object-cover rounded-lg"
          />
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-display font-semibold text-xl text-gray-900 mb-1">
                {booking.hotelName}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                <span className="text-sm">{booking.location}</span>
              </div>
              <div className="text-sm text-gray-500">
                Confirmation: {booking.confirmationNumber}
              </div>
            </div>
            <Badge variant={getStatusVariant(booking.status)}>
              <ApperIcon name={getStatusIcon(booking.status)} className="w-3 h-3 mr-1" />
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600 mb-1">Check-in</div>
              <div className="font-medium">{format(checkInDate, "MMM d, yyyy")}</div>
              <div className="text-sm text-gray-500">{format(checkInDate, "EEEE")}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Check-out</div>
              <div className="font-medium">{format(checkOutDate, "MMM d, yyyy")}</div>
              <div className="text-sm text-gray-500">{format(checkOutDate, "EEEE")}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Duration</div>
              <div className="font-medium">{nights} {nights === 1 ? "night" : "nights"}</div>
              <div className="text-sm text-gray-500">{booking.guests} {booking.guests === 1 ? "guest" : "guests"}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="text-sm text-gray-600">Room Type</div>
              <div className="font-medium text-gray-900">{booking.roomType}</div>
              <div className="text-2xl font-bold text-primary-500 mt-1">
                ${booking.totalPrice}
                <span className="text-sm font-normal text-gray-500 ml-1">total</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(booking)}
              >
                <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                View Details
              </Button>
              
              {booking.status === "upcoming" && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onCancel(booking.Id)}
                >
                  <ApperIcon name="X" className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;