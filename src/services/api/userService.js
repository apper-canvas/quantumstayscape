import { toast } from 'react-toastify';

const tableName = 'user_c';

class UserService {
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

  async getById(id) {
    this.ensureClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "avatar_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "first_name_c"}},
        {"field": {"Name": "last_name_c"}},
        {"field": {"Name": "loyalty_status_c"}},
        {"field": {"Name": "member_since_c"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "room_type_c"}},
        {"field": {"Name": "bed_type_c"}},
        {"field": {"Name": "smoking_preference_c"}},
        {"field": {"Name": "floor_preference_c"}},
        {"field": {"Name": "newsletter_c"}},
        {"field": {"Name": "total_bookings_c"}}
      ]
    };

    const response = await this.apperClient.getRecordById(tableName, id, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error("User not found");
    }

    // Transform database fields to UI format
    const user = {
      Id: response.data.Id,
      name: response.data.name_c || response.data.Name,
      firstName: response.data.first_name_c,
      lastName: response.data.last_name_c,
      email: response.data.email_c,
      phone: response.data.phone_c,
      avatar: response.data.avatar_c,
      loyaltyStatus: response.data.loyalty_status_c,
      memberSince: response.data.member_since_c,
      totalBookings: response.data.total_bookings_c,
      preferences: {
        roomType: response.data.room_type_c,
        bedType: response.data.bed_type_c,
        smokingPreference: response.data.smoking_preference_c,
        floorPreference: response.data.floor_preference_c,
        newsletter: response.data.newsletter_c
      }
    };

    return user;
  }

  async getCurrentUser() {
    // In a real implementation, this would get the current authenticated user
    // For now, return a mock current user or fetch from authentication context
    this.ensureClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "avatar_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "first_name_c"}},
        {"field": {"Name": "last_name_c"}},
        {"field": {"Name": "loyalty_status_c"}},
        {"field": {"Name": "member_since_c"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "room_type_c"}},
        {"field": {"Name": "bed_type_c"}},
        {"field": {"Name": "smoking_preference_c"}},
        {"field": {"Name": "floor_preference_c"}},
        {"field": {"Name": "newsletter_c"}},
        {"field": {"Name": "total_bookings_c"}}
      ],
      pagingInfo: {"limit": 1, "offset": 0}
    };

    const response = await this.apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data || response.data.length === 0) {
      throw new Error("No users found");
    }

    // Transform database fields to UI format
    const userData = response.data[0];
    const user = {
      Id: userData.Id,
      name: userData.name_c || userData.Name,
      firstName: userData.first_name_c,
      lastName: userData.last_name_c,
      email: userData.email_c,
      phone: userData.phone_c,
      avatar: userData.avatar_c,
      loyaltyStatus: userData.loyalty_status_c,
      memberSince: userData.member_since_c,
      totalBookings: userData.total_bookings_c,
      preferences: {
        roomType: userData.room_type_c,
        bedType: userData.bed_type_c,
        smokingPreference: userData.smoking_preference_c,
        floorPreference: userData.floor_preference_c,
        newsletter: userData.newsletter_c
      }
    };

    return user;
  }

  async updateProfile(id, updates) {
    this.ensureClient();
    
    // Map UI fields to database fields - only include updateable fields
    const updateData = {};
    if (updates.firstName !== undefined) updateData.first_name_c = updates.firstName;
    if (updates.lastName !== undefined) updateData.last_name_c = updates.lastName;
    if (updates.name !== undefined) updateData.name_c = updates.name;
    if (updates.email !== undefined) updateData.email_c = updates.email;
    if (updates.phone !== undefined) updateData.phone_c = updates.phone;
    if (updates.avatar !== undefined) updateData.avatar_c = updates.avatar;
    if (updates.loyaltyStatus !== undefined) updateData.loyalty_status_c = updates.loyaltyStatus;
    if (updates.memberSince !== undefined) updateData.member_since_c = updates.memberSince;
    if (updates.totalBookings !== undefined) updateData.total_bookings_c = updates.totalBookings;

    // Handle preferences object
    if (updates.preferences) {
      if (updates.preferences.roomType !== undefined) updateData.room_type_c = updates.preferences.roomType;
      if (updates.preferences.bedType !== undefined) updateData.bed_type_c = updates.preferences.bedType;
      if (updates.preferences.smokingPreference !== undefined) updateData.smoking_preference_c = updates.preferences.smokingPreference;
      if (updates.preferences.floorPreference !== undefined) updateData.floor_preference_c = updates.preferences.floorPreference;
      if (updates.preferences.newsletter !== undefined) updateData.newsletter_c = updates.preferences.newsletter;
    }

    const params = {
      records: [
        {
          Id: parseInt(id),
          ...updateData
        }
      ]
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
        return await this.getById(id);
      }
    }

    throw new Error("Update failed");
  }

  async updatePreferences(id, preferences) {
    return this.updateProfile(id, { preferences });
  }

  async uploadAvatar(id, avatarUrl) {
    return this.updateProfile(id, { avatar: avatarUrl });
  }

  // Note: Authentication is now handled by ApperUI, these methods are kept for compatibility
  async authenticate(email, password) {
    throw new Error("Authentication is now handled by ApperUI. Please use the login component.");
  }

  async register(userData) {
    throw new Error("Registration is now handled by ApperUI. Please use the signup component.");
  }
}

export default new UserService();