import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const HotelCard = ({ hotel, index = 0 }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/hotels/${hotel.Id}`);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ApperIcon 
        key={i} 
        name="Star" 
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card overflow-hidden group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          {!hotel.available ? (
            <Badge variant="error">Unavailable</Badge>
          ) : hotel.featured ? (
            <Badge variant="accent">Featured</Badge>
          ) : null}
        </div>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
          {renderStars(hotel.starRating)}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-1">
            {hotel.name}
          </h3>
          <div className="text-right ml-4 flex-shrink-0">
            <div className="text-2xl font-bold text-primary-500">
              ${hotel.pricePerNight}
            </div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
          <span className="text-sm">{hotel.location.city}, {hotel.location.state}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center bg-primary-50 rounded-lg px-2 py-1">
              <ApperIcon name="Star" className="w-4 h-4 text-amber-400 fill-current mr-1" />
              <span className="text-sm font-medium text-primary-700">{hotel.rating}</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">
              ({hotel.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
            <Badge key={idx} variant="default" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {hotel.amenities.length > 3 && (
            <Badge variant="default" className="text-xs">
              +{hotel.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <Button
          onClick={handleViewDetails}
          className="w-full"
          variant={hotel.available ? "primary" : "outline"}
          disabled={!hotel.available}
        >
          {hotel.available ? "View Details" : "Unavailable"}
          <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default HotelCard;