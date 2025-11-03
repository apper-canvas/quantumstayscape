import { toast } from 'react-toastify';

const tableName = 'review_c';

const reviewService = {
  apperClient: null,

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK && !this.apperClient) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  },

  ensureClient() {
    if (!this.apperClient) {
      this.initializeClient();
    }
    if (!this.apperClient) {
      throw new Error('ApperClient not initialized');
    }
  },

  transformReviewData(reviewData) {
    let photos = [];
    try {
      photos = typeof reviewData.photos === 'string' 
        ? JSON.parse(reviewData.photos) 
        : (reviewData.photos || []);
    } catch (e) {
      photos = [];
    }

    return {
      Id: reviewData.Id,
      hotelId: reviewData.hotel_id_c?.Id || reviewData.hotel_id_c,
      userId: reviewData.user_id_c?.Id || reviewData.user_id_c,
      userName: reviewData.user_name_c,
      userAvatar: reviewData.user_avatar_c,
      rating: reviewData.rating_c,
      title: reviewData.title_c,
      comment: reviewData.comment_c,
      photos: photos,
      stayDate: reviewData.stay_date_c,
      createdAt: reviewData.created_at_c,
      updatedAt: reviewData.updated_at_c,
      helpful: reviewData.helpful_c,
      verified: reviewData.verified_c
    };
  },

  async getAll(filters = {}) {
    this.ensureClient();
    
    let whereConditions = [];

    // Apply filters
    if (filters.hotelId) {
      whereConditions.push({
        FieldName: "hotel_id_c",
        Operator: "EqualTo",
        Values: [parseInt(filters.hotelId)]
      });
    }

    if (filters.userId) {
      whereConditions.push({
        FieldName: "user_id_c",
        Operator: "EqualTo",
        Values: [parseInt(filters.userId)]
      });
    }

    if (filters.minRating) {
      whereConditions.push({
        FieldName: "rating_c",
        Operator: "GreaterThanOrEqualTo",
        Values: [filters.minRating]
      });
    }

    if (filters.search) {
      whereConditions.push({
        FieldName: "title_c",
        Operator: "Contains",
        Values: [filters.search]
      });
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "comment_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "helpful_c"}},
        {"field": {"Name": "hotel_id_c"}},
        {"field": {"Name": "rating_c"}},
        {"field": {"Name": "stay_date_c"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "updated_at_c"}},
        {"field": {"Name": "user_avatar_c"}},
        {"field": {"Name": "user_id_c"}},
        {"field": {"Name": "user_name_c"}},
        {"field": {"Name": "verified_c"}}
      ],
      where: whereConditions.length > 0 ? whereConditions : undefined,
      orderBy: filters.sortBy ? this.getSortOrder(filters.sortBy) : [{"fieldName": "created_at_c", "sorttype": "DESC"}]
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

    return response.data.map(review => this.transformReviewData(review));
  },

  getSortOrder(sortBy) {
    switch (sortBy) {
      case "newest":
        return [{"fieldName": "created_at_c", "sorttype": "DESC"}];
      case "oldest":
        return [{"fieldName": "created_at_c", "sorttype": "ASC"}];
      case "rating-high":
        return [{"fieldName": "rating_c", "sorttype": "DESC"}];
      case "rating-low":
        return [{"fieldName": "rating_c", "sorttype": "ASC"}];
      default:
        return [{"fieldName": "created_at_c", "sorttype": "DESC"}];
    }
  },

  async getById(id) {
    this.ensureClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "comment_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "helpful_c"}},
        {"field": {"Name": "hotel_id_c"}},
        {"field": {"Name": "rating_c"}},
        {"field": {"Name": "stay_date_c"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "updated_at_c"}},
        {"field": {"Name": "user_avatar_c"}},
        {"field": {"Name": "user_id_c"}},
        {"field": {"Name": "user_name_c"}},
        {"field": {"Name": "verified_c"}}
      ]
    };

    const response = await this.apperClient.getRecordById(tableName, id, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error("Review not found");
    }

    return this.transformReviewData(response.data);
  },

  async getByHotelId(hotelId) {
    return this.getAll({ hotelId });
  },

  async getByUserId(userId) {
    return this.getAll({ userId });
  },

  async create(reviewData) {
    this.ensureClient();
    
    // Validate required fields
    if (!reviewData.hotelId || !reviewData.userId || !reviewData.rating || !reviewData.title) {
      throw new Error("Missing required fields");
    }

    // Map UI fields to database fields - only include updateable fields
    const createData = {
      Name: `Review - ${reviewData.title}`,
      comment_c: reviewData.comment || "",
      created_at_c: new Date().toISOString(),
      helpful_c: 0,
      hotel_id_c: parseInt(reviewData.hotelId),
      rating_c: parseInt(reviewData.rating),
      stay_date_c: reviewData.stayDate || new Date().toISOString().split('T')[0],
      title_c: reviewData.title,
      updated_at_c: new Date().toISOString(),
      user_avatar_c: reviewData.userAvatar || null,
      user_id_c: parseInt(reviewData.userId),
      user_name_c: reviewData.userName || "Anonymous",
      verified_c: true
    };

    const params = {
      records: [createData]
    };

    const response = await this.apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to create review");
      }

      if (successful.length > 0) {
        const createdReview = successful[0].data;
        return this.transformReviewData(createdReview);
      }
    }

    throw new Error("Create failed");
  },

  async update(id, updateData) {
    this.ensureClient();
    
    // Map UI fields to database fields - only include updateable fields
    const dbUpdateData = { Id: parseInt(id) };
    if (updateData.comment !== undefined) dbUpdateData.comment_c = updateData.comment;
    if (updateData.helpful !== undefined) dbUpdateData.helpful_c = updateData.helpful;
    if (updateData.rating !== undefined) dbUpdateData.rating_c = parseInt(updateData.rating);
    if (updateData.stayDate !== undefined) dbUpdateData.stay_date_c = updateData.stayDate;
    if (updateData.title !== undefined) dbUpdateData.title_c = updateData.title;
    if (updateData.userAvatar !== undefined) dbUpdateData.user_avatar_c = updateData.userAvatar;
    if (updateData.userName !== undefined) dbUpdateData.user_name_c = updateData.userName;
    if (updateData.verified !== undefined) dbUpdateData.verified_c = updateData.verified;
    
    // Always update the updated_at timestamp
    dbUpdateData.updated_at_c = new Date().toISOString();

    const params = {
      records: [dbUpdateData]
    };

    const response = await this.apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        return this.getById(id);
      }
    }

    throw new Error("Update failed");
  },

  async delete(id) {
    this.ensureClient();
    
    const params = { 
      RecordIds: [parseInt(id)]
    };

    const response = await this.apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Delete failed");
      }
    }

    return { success: true };
  },

  async getHotelStats(hotelId) {
    const hotelReviews = await this.getByHotelId(parseInt(hotelId));
    
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