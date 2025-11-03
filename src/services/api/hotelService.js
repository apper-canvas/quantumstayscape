import hotelsData from "@/services/mockData/hotels.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class HotelService {
  async getAll(filters = {}) {
    await delay(300);
    
    let hotels = [...hotelsData];
    
    // Apply filters
    if (filters.destination) {
      hotels = hotels.filter(hotel => 
        hotel.location.city.toLowerCase().includes(filters.destination.toLowerCase()) ||
        hotel.location.state.toLowerCase().includes(filters.destination.toLowerCase()) ||
        hotel.name.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }
    
    if (filters.minPrice || filters.maxPrice) {
      hotels = hotels.filter(hotel => {
        const price = hotel.pricePerNight;
        return (!filters.minPrice || price >= filters.minPrice) &&
               (!filters.maxPrice || price <= filters.maxPrice);
      });
    }
    
    if (filters.starRating && filters.starRating.length > 0) {
      hotels = hotels.filter(hotel => 
        filters.starRating.includes(hotel.starRating)
      );
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      hotels = hotels.filter(hotel =>
        filters.amenities.some(amenity => 
          hotel.amenities.some(hotelAmenity => 
            hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }
    
    if (filters.rating) {
      hotels = hotels.filter(hotel => hotel.rating >= filters.rating);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      hotels.sort((a, b) => {
        switch (filters.sortBy) {
          case "price-low":
            return a.pricePerNight - b.pricePerNight;
          case "price-high":
            return b.pricePerNight - a.pricePerNight;
          case "rating":
            return b.rating - a.rating;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }
    
    return hotels;
  }

async getById(id) {
    await delay(200);
    const hotel = hotelsData.find(h => h.Id === parseInt(id));
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    
    // Get review statistics
    try {
      const reviewService = await import("@/services/api/reviewService.js");
      const reviewStats = await reviewService.default.getHotelStats(parseInt(id));
      
      return { 
        ...hotel, 
        rating: reviewStats.averageRating || hotel.rating,
        reviewCount: reviewStats.totalReviews || hotel.reviewCount || 0,
        reviewStats: reviewStats.ratingDistribution
      };
    } catch (err) {
      // Fallback to original hotel data if review service fails
      return { ...hotel };
    }
  }

  async getFeatured() {
    await delay(250);
    return hotelsData.filter(hotel => hotel.featured).slice(0, 4);
  }

  async search(query) {
    await delay(300);
    if (!query || query.trim() === "") {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    return hotelsData.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm) ||
      hotel.location.city.toLowerCase().includes(searchTerm) ||
      hotel.location.state.toLowerCase().includes(searchTerm) ||
      hotel.description.toLowerCase().includes(searchTerm)
    );
  }

  async checkAvailability(hotelId, checkIn, checkOut) {
    await delay(400);
    const hotel = hotelsData.find(h => h.Id === parseInt(hotelId));
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    
    // Simulate availability check
    const available = hotel.available && Math.random() > 0.1;
    
    return {
      available,
      hotelId: hotel.Id,
      checkIn,
      checkOut,
      rooms: available ? [
        {
          id: `${hotel.Id}_deluxe`,
          type: "Deluxe Room",
          capacity: 2,
          pricePerNight: hotel.pricePerNight,
          amenities: ["Free WiFi", "Mini Bar", "City View"],
          available: true
        },
        {
          id: `${hotel.Id}_suite`,
          type: "Executive Suite",
          capacity: 4,
          pricePerNight: hotel.pricePerNight * 1.5,
          amenities: ["Free WiFi", "Mini Bar", "Ocean View", "Living Area"],
          available: true
        }
      ] : []
    };
  }
}

export default new HotelService();