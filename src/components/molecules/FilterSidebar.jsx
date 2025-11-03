import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FilterSidebar = ({ filters, onFiltersChange, onClearFilters, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value ? parseInt(value) : null
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleStarRatingChange = (rating) => {
    const currentRatings = localFilters.starRating || [];
    const newRatings = currentRatings.includes(rating)
      ? currentRatings.filter(r => r !== rating)
      : [...currentRatings, rating];
    
    handleFilterChange("starRating", newRatings);
  };

  const handleAmenityChange = (amenity) => {
    const currentAmenities = localFilters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    handleFilterChange("amenities", newAmenities);
  };

  const sidebarContent = (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-gray-900">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Price Range (per night)</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Min Price</label>
            <input
              type="number"
              placeholder="$0"
              value={localFilters.minPrice || ""}
              onChange={(e) => handlePriceChange("minPrice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Max Price</label>
            <input
              type="number"
              placeholder="$1000"
              value={localFilters.maxPrice || ""}
              onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Star Rating */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Star Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center">
              <input
                type="checkbox"
                checked={(localFilters.starRating || []).includes(rating)}
                onChange={() => handleStarRatingChange(rating)}
                className="mr-3 rounded border-gray-300"
              />
              <div className="flex items-center">
                {Array.from({ length: rating }, (_, i) => (
                  <ApperIcon key={i} name="Star" className="w-4 h-4 text-amber-400 fill-current" />
                ))}
                {Array.from({ length: 5 - rating }, (_, i) => (
                  <ApperIcon key={i} name="Star" className="w-4 h-4 text-gray-300" />
                ))}
                <span className="ml-2 text-sm text-gray-700">{rating} Stars</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Guest Rating */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Guest Rating</h3>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map(rating => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                checked={localFilters.rating === rating}
                onChange={() => handleFilterChange("rating", rating)}
                className="mr-3"
              />
              <span className="text-sm text-gray-700">{rating}+ Rating</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Amenities</h3>
        <div className="space-y-2">
          {["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Parking", "Beach Access", "Pet Friendly"].map(amenity => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={(localFilters.amenities || []).includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                className="mr-3 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Mobile overlay
  if (isOpen) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-display font-semibold">Filters</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
          {sidebarContent}
        </motion.div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden lg:block w-80 bg-white border-r border-gray-200">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;