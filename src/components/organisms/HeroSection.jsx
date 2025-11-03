import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchWidget from "@/components/molecules/SearchWidget";
import ApperIcon from "@/components/ApperIcon";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleSearch = (searchData) => {
    const params = new URLSearchParams();
    if (searchData.destination) params.set("destination", searchData.destination);
    if (searchData.checkIn) params.set("checkIn", searchData.checkIn);
    if (searchData.checkOut) params.set("checkOut", searchData.checkOut);
    if (searchData.guests) params.set("guests", searchData.guests.toString());
    
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop"
          alt="Beautiful hotel resort"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-accent-600/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight"
          >
            Find Your Perfect
            <span className="block bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
              Stay Experience
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-100 mb-12 leading-relaxed"
          >
            Discover amazing accommodations worldwide with trusted reviews, 
            instant booking, and unbeatable prices.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-8 mb-12 text-primary-200"
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Shield" className="w-5 h-5" />
              <span className="text-sm font-medium">Secure Booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-5 h-5" />
              <span className="text-sm font-medium">Instant Confirmation</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Heart" className="w-5 h-5" />
              <span className="text-sm font-medium">Best Price Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Phone" className="w-5 h-5" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </motion.div>
        </div>

        {/* Search Widget */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <SearchWidget onSearch={handleSearch} size="large" />
        </motion.div>

        {/* Popular Destinations Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-primary-200 mb-4">Popular destinations:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Miami Beach", "New York", "Aspen", "Carmel", "Scottsdale"].map((destination) => (
              <button
                key={destination}
                onClick={() => handleSearch({ destination, checkIn: "", checkOut: "", guests: 2 })}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                {destination}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-primary-200">
          <span className="text-sm font-medium mb-2">Discover More</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ApperIcon name="ChevronDown" className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;