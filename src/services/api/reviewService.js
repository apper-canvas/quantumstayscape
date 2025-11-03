import reviewsData from "@/services/mockData/reviews.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const reviewService = {
  async getAll(filters = {}) {
    await delay(300);
    
    let reviews = [...reviewsData];
    
    // Apply filters
    if (filters.hotelId) {
      reviews = reviews.filter(review => review.hotelId === parseInt(filters.hotelId));
    }
    
    if (filters.userId) {
      reviews = reviews.filter(review => review.userId === parseInt(filters.userId));
    }
    
    if (filters.minRating) {
      reviews = reviews.filter(review => review.rating >= filters.minRating);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      reviews = reviews.filter(review => 
        review.title.toLowerCase().includes(searchLower) ||
        review.comment.toLowerCase().includes(searchLower) ||
        review.userName.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      reviews.sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "rating-high":
            return b.rating - a.rating;
          case "rating-low":
            return a.rating - b.rating;
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    }
    
    return reviews;
  },

  async getById(id) {
    await delay(200);
    const review = reviewsData.find(r => r.Id === parseInt(id));
    if (!review) {
      throw new Error("Review not found");
    }
    return { ...review };
  },

  async getByHotelId(hotelId) {
    await delay(250);
    return reviewsData.filter(review => review.hotelId === parseInt(hotelId));
  },

  async getByUserId(userId) {
    await delay(250);
    return reviewsData.filter(review => review.userId === parseInt(userId));
  },

  async create(reviewData) {
    await delay(400);
    
    // Validate required fields
    if (!reviewData.hotelId || !reviewData.userId || !reviewData.rating || !reviewData.title) {
      throw new Error("Missing required fields");
    }
    
    const newId = Math.max(...reviewsData.map(r => r.Id), 0) + 1;
    const newReview = {
      Id: newId,
      hotelId: parseInt(reviewData.hotelId),
      userId: parseInt(reviewData.userId),
      userName: reviewData.userName || "Anonymous",
      userAvatar: reviewData.userAvatar || null,
      rating: parseInt(reviewData.rating),
      title: reviewData.title,
      comment: reviewData.comment || "",
      photos: reviewData.photos || [],
      stayDate: reviewData.stayDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      helpful: 0,
      verified: true
    };
    
    reviewsData.push(newReview);
    return { ...newReview };
  },

  async update(id, updateData) {
    await delay(350);
    
    const index = reviewsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Review not found");
    }
    
    const updatedReview = {
      ...reviewsData[index],
      ...updateData,
      Id: parseInt(id), // Preserve ID
      updatedAt: new Date().toISOString()
    };
    
    reviewsData[index] = updatedReview;
    return { ...updatedReview };
  },

  async delete(id) {
    await delay(300);
    
    const index = reviewsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Review not found");
    }
    
    reviewsData.splice(index, 1);
    return { success: true };
  },

  async getHotelStats(hotelId) {
    await delay(200);
    
    const hotelReviews = reviewsData.filter(r => r.hotelId === parseInt(hotelId));
    
    if (hotelReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    
    const totalRating = hotelReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / hotelReviews.length;
    
    const ratingDistribution = hotelReviews.reduce((dist, review) => {
      dist[review.rating] = (dist[review.rating] || 0) + 1;
      return dist;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    
    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: hotelReviews.length,
      ratingDistribution
    };
  }
};

export default reviewService;