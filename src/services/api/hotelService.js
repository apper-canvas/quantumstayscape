import { toast } from 'react-toastify';

const tableName = 'hotel_c';

class HotelService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  ensureClient() {
    if (!this.apperClient) {
      this.initializeClient();
    }
    if (!this.apperClient) {
      throw new Error('ApperClient not initialized');
    }
  }

  transformHotelData(hotelData) {
    return {
      Id: hotelData.Id,
      name: hotelData.name_c || hotelData.Name,
      address: hotelData.address_c,
      available: hotelData.available_c,
      description: hotelData.description_c,
      featured: hotelData.featured_c,
      location: {
        city: hotelData.city_c,
        state: hotelData.state_c,
        country: hotelData.country_c,
        coordinates: hotelData.coordinates_c
      },
      pricePerNight: hotelData.price_per_night_c,
      rating: hotelData.rating_c,
      reviewCount: hotelData.review_count_c,
      starRating: hotelData.star_rating_c,
      // Mock data for UI compatibility
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
      amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Restaurant"]
    };
  }

  async getAll(filters = {}) {
    this.ensureClient();
    
    let whereConditions = [];
    let whereGroups = [];

    // Apply filters
    if (filters.destination) {
      whereGroups.push({
        operator: "OR",
        subGroups: [
          {
            conditions: [
              { fieldName: "city_c", operator: "Contains", values: [filters.destination] },
              { fieldName: "state_c", operator: "Contains", values: [filters.destination] },
              { fieldName: "name_c", operator: "Contains", values: [filters.destination] }
            ],
            operator: "OR"
          }
        ]
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice) {
        whereConditions.push({
          FieldName: "price_per_night_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.minPrice]
        });
      }
      if (filters.maxPrice) {
        whereConditions.push({
          FieldName: "price_per_night_c",
          Operator: "LessThanOrEqualTo",
          Values: [filters.maxPrice]
        });
      }
    }

    if (filters.starRating && filters.starRating.length > 0) {
      whereConditions.push({
        FieldName: "star_rating_c",
        Operator: "ExactMatch",
        Values: filters.starRating
      });
    }

    if (filters.rating) {
      whereConditions.push({
        FieldName: "rating_c",
        Operator: "GreaterThanOrEqualTo",
        Values: [filters.rating]
      });
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "available_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "featured_c"}},
        {"field": {"Name": "city_c"}},
        {"field": {"Name": "state_c"}},
        {"field": {"Name": "country_c"}},
        {"field": {"Name": "coordinates_c"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "price_per_night_c"}},
        {"field": {"Name": "rating_c"}},
        {"field": {"Name": "review_count_c"}},
        {"field": {"Name": "star_rating_c"}}
      ],
      where: whereConditions,
      whereGroups: whereGroups.length > 0 ? whereGroups : undefined,
      orderBy: filters.sortBy ? this.getSortOrder(filters.sortBy) : undefined
    };

    const response = await this.apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    if (!response.data) {
      return [];
    }

    return response.data.map(hotel => this.transformHotelData(hotel));
  }

  getSortOrder(sortBy) {
    switch (sortBy) {
      case "price-low":
        return [{"fieldName": "price_per_night_c", "sorttype": "ASC"}];
      case "price-high":
        return [{"fieldName": "price_per_night_c", "sorttype": "DESC"}];
      case "rating":
        return [{"fieldName": "rating_c", "sorttype": "DESC"}];
      case "name":
        return [{"fieldName": "name_c", "sorttype": "ASC"}];
      default:
        return undefined;
    }
  }

  async getById(id) {
    this.ensureClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "available_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "featured_c"}},
        {"field": {"Name": "city_c"}},
        {"field": {"Name": "state_c"}},
        {"field": {"Name": "country_c"}},
        {"field": {"Name": "coordinates_c"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "price_per_night_c"}},
        {"field": {"Name": "rating_c"}},
        {"field": {"Name": "review_count_c"}},
        {"field": {"Name": "star_rating_c"}}
      ]
    };

    const response = await this.apperClient.getRecordById(tableName, id, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error("Hotel not found");
    }

    const hotel = this.transformHotelData(response.data);

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
      return hotel;
    }
  }

  async getFeatured() {
    this.ensureClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "available_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "featured_c"}},
        {"field": {"Name": "city_c"}},
        {"field": {"Name": "state_c"}},
        {"field": {"Name": "country_c"}},
        {"field": {"Name": "coordinates_c"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "price_per_night_c"}},
        {"field": {"Name": "rating_c"}},
        {"field": {"Name": "review_count_c"}},
        {"field": {"Name": "star_rating_c"}}
      ],
      where: [
        {
          FieldName: "featured_c",
          Operator: "EqualTo",
          Values: [true]
        }
      ],
      pagingInfo: {"limit": 4, "offset": 0}
    };

    const response = await this.apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    if (!response.data) {
      return [];
    }

    return response.data.map(hotel => this.transformHotelData(hotel));
  }

  async search(query) {
    if (!query || query.trim() === "") {
      return [];
    }

    this.ensureClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "available_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "featured_c"}},
        {"field": {"Name": "city_c"}},
        {"field": {"Name": "state_c"}},
        {"field": {"Name": "country_c"}},
        {"field": {"Name": "coordinates_c"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "price_per_night_c"}},
        {"field": {"Name": "rating_c"}},
        {"field": {"Name": "review_count_c"}},
        {"field": {"Name": "star_rating_c"}}
      ],
      whereGroups: [{
        operator: "OR",
        subGroups: [
          {
            conditions: [
              { fieldName: "name_c", operator: "Contains", values: [query] },
              { fieldName: "city_c", operator: "Contains", values: [query] },
              { fieldName: "state_c", operator: "Contains", values: [query] },
              { fieldName: "description_c", operator: "Contains", values: [query] }
            ],
            operator: "OR"
          }
        ]
      }]
    };

    const response = await this.apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    if (!response.data) {
      return [];
    }

    return response.data.map(hotel => this.transformHotelData(hotel));
  }

  async checkAvailability(hotelId, checkIn, checkOut) {
    const hotel = await this.getById(hotelId);
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