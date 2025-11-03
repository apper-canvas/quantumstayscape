import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HotelCard from "@/components/molecules/HotelCard";
import SearchWidget from "@/components/molecules/SearchWidget";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import hotelService from "@/services/api/hotelService";

const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    destination: searchParams.get("destination") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: parseInt(searchParams.get("guests")) || 2,
    minPrice: null,
    maxPrice: null,
    starRating: [],
    amenities: [],
    rating: null,
    sortBy: "rating"
  });

  const [sortBy, setSortBy] = useState("rating");

  const loadHotels = async () => {
    try {
      setError(null);
      setLoading(true);
      const searchFilters = {
        ...filters,
        sortBy
      };
      const data = await hotelService.getAll(searchFilters);
      setHotels(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, [filters, sortBy]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (filters.destination) params.set("destination", filters.destination);
    if (filters.checkIn) params.set("checkIn", filters.checkIn);
    if (filters.checkOut) params.set("checkOut", filters.checkOut);
    if (filters.guests) params.set("guests", filters.guests.toString());
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleSearch = (searchData) => {
    setFilters(prev => ({
      ...prev,
      ...searchData
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      destination: "",
      checkIn: "",
      checkOut: "",
      guests: 2,
      minPrice: null,
      maxPrice: null,
      starRating: [],
      amenities: [],
      rating: null,
      sortBy: "rating"
    });
    setSortBy("rating");
  };

  const hasActiveFilters = filters.minPrice || filters.maxPrice || 
    filters.starRating.length > 0 || filters.amenities.length > 0 || 
    filters.rating || filters.destination;

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 pt-8 pb-12">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold text-white text-center mb-8"
          >
            Find Your Perfect Stay
          </motion.h1>
          <SearchWidget onSearch={handleSearch} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden"
                >
                  <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                
                {!loading && (
                  <div className="text-gray-600">
                    {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"} found
                    {filters.destination && (
                      <span> in <strong>{filters.destination}</strong></span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    <ApperIcon name="X" className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Hotel Name</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {loading ? (
                <Loading type="hotels" />
              ) : error ? (
                <Error message={error} onRetry={loadHotels} type="inline" />
              ) : hotels.length === 0 ? (
                <Empty
                  title="No hotels found"
                  description="Try adjusting your search criteria or clear filters to see more results."
                  action={handleClearFilters}
                  actionText="Clear Filters"
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {hotels.map((hotel, index) => (
                    <HotelCard key={hotel.Id} hotel={hotel} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;