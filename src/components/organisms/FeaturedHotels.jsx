import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HotelCard from "@/components/molecules/HotelCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import hotelService from "@/services/api/hotelService";

const FeaturedHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadFeaturedHotels = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await hotelService.getFeatured();
      setHotels(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedHotels();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-2/3" />
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Error message={error} onRetry={loadFeaturedHotels} type="inline" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Featured Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Handpicked accommodations that offer exceptional experiences and unmatched hospitality.
          </p>
        </motion.div>

        {hotels.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Building2" className="w-12 h-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
              No featured hotels available
            </h3>
            <p className="text-gray-600 mb-6">
              Check back later for our handpicked selections.
            </p>
            <Button onClick={() => navigate("/hotels")}>
              Browse All Hotels
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
              {hotels.map((hotel, index) => (
                <HotelCard key={hotel.Id} hotel={hotel} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/hotels")}
                className="px-12"
              >
                <ApperIcon name="Search" className="w-5 h-5 mr-2" />
                Browse All Hotels
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedHotels;