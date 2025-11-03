import { toast } from 'react-toastify';

const tableName = 'booking_c';

class BookingService {
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

  transformBookingData(bookingData) {
    let guestDetails = {};
    try {
      guestDetails = typeof bookingData.guest_details_c === 'string' 
        ? JSON.parse(bookingData.guest_details_c) 
        : (bookingData.guest_details_c || {});
    } catch (e) {
      guestDetails = {};
    }

    return {
      Id: bookingData.Id,
      checkIn: bookingData.check_in_c,
      checkOut: bookingData.check_out_c,
      confirmationNumber: bookingData.confirmation_number_c,
      createdAt: bookingData.created_at_c,
      guestDetails: guestDetails,
      guests: bookingData.guests_c,
      hotelId: bookingData.hotel_id_c?.Id || bookingData.hotel_id_c,
      hotelImage: bookingData.hotel_image_c,
      hotelName: bookingData.hotel_name_c,
      location: bookingData.location_c,
      nights: bookingData.nights_c,
      roomType: bookingData.room_type_c,
      status: bookingData.status_c,
      totalPrice: bookingData.total_price_c,
      userId: bookingData.user_id_c?.Id || bookingData.user_id_c
    };
  }

  async getAll(userId = null) {
    this.ensureClient();
    
    let whereConditions = [];
    if (userId) {
      whereConditions.push({
        FieldName: "user_id_c",
        Operator: "EqualTo", 
        Values: [parseInt(userId)]
      });
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "check_in_c"}},
        {"field": {"Name": "check_out_c"}},
        {"field": {"Name": "confirmation_number_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "guest_details_c"}},
        {"field": {"Name": "guests_c"}},
        {"field": {"Name": "hotel_id_c"}},
        {"field": {"Name": "hotel_image_c"}},
        {"field": {"Name": "hotel_name_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "nights_c"}},
        {"field": {"Name": "room_type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "total_price_c"}},
        {"field": {"Name": "user_id_c"}}
      ],
      where: whereConditions.length > 0 ? whereConditions : undefined
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

    return response.data.map(booking => this.transformBookingData(booking));
  }

  async getById(id) {
    this.ensureClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "check_in_c"}},
        {"field": {"Name": "check_out_c"}},
        {"field": {"Name": "confirmation_number_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "guest_details_c"}},
        {"field": {"Name": "guests_c"}},
        {"field": {"Name": "hotel_id_c"}},
        {"field": {"Name": "hotel_image_c"}},
        {"field": {"Name": "hotel_name_c"}},
        {"field": {"Name": "location_c"}},
        {"field": {"Name": "nights_c"}},
        {"field": {"Name": "room_type_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "total_price_c"}},
        {"field": {"Name": "user_id_c"}}
      ]
    };

    const response = await this.apperClient.getRecordById(tableName, id, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error("Booking not found");
    }

    return this.transformBookingData(response.data);
  }

  async create(bookingData) {
    this.ensureClient();
    
    // Map UI fields to database fields - only include updateable fields
    const createData = {
      Name: `Booking - ${bookingData.hotelName}`,
      check_in_c: bookingData.checkIn,
      check_out_c: bookingData.checkOut,
      confirmation_number_c: `STY-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}-2024`,
      created_at_c: new Date().toISOString(),
      guest_details_c: JSON.stringify(bookingData.guestDetails),
      guests_c: bookingData.guests,
      hotel_id_c: parseInt(bookingData.hotelId),
      hotel_image_c: bookingData.hotelImage,
      hotel_name_c: bookingData.hotelName,
      location_c: bookingData.location,
      nights_c: bookingData.nights,
      room_type_c: bookingData.roomType,
      status_c: "confirmed",
      total_price_c: parseFloat(bookingData.totalPrice),
      user_id_c: parseInt(bookingData.userId)
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
        throw new Error("Failed to create booking");
      }

      if (successful.length > 0) {
        const createdBooking = successful[0].data;
        return this.transformBookingData(createdBooking);
      }
    }

    throw new Error("Create failed");
  }

  async update(id, updates) {
    this.ensureClient();
    
    // Map UI fields to database fields - only include updateable fields
    const updateData = { Id: parseInt(id) };
    if (updates.checkIn !== undefined) updateData.check_in_c = updates.checkIn;
    if (updates.checkOut !== undefined) updateData.check_out_c = updates.checkOut;
    if (updates.confirmationNumber !== undefined) updateData.confirmation_number_c = updates.confirmationNumber;
    if (updates.guestDetails !== undefined) updateData.guest_details_c = JSON.stringify(updates.guestDetails);
    if (updates.guests !== undefined) updateData.guests_c = updates.guests;
    if (updates.hotelId !== undefined) updateData.hotel_id_c = parseInt(updates.hotelId);
    if (updates.hotelImage !== undefined) updateData.hotel_image_c = updates.hotelImage;
    if (updates.hotelName !== undefined) updateData.hotel_name_c = updates.hotelName;
    if (updates.location !== undefined) updateData.location_c = updates.location;
    if (updates.nights !== undefined) updateData.nights_c = updates.nights;
    if (updates.roomType !== undefined) updateData.room_type_c = updates.roomType;
    if (updates.status !== undefined) updateData.status_c = updates.status;
    if (updates.totalPrice !== undefined) updateData.total_price_c = parseFloat(updates.totalPrice);
    if (updates.userId !== undefined) updateData.user_id_c = parseInt(updates.userId);

    const params = {
      records: [updateData]
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
  }

  async cancel(id) {
    return this.update(id, { status: "cancelled" });
  }

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

    return true;
  }

  async getByStatus(status, userId = null) {
    const bookings = await this.getAll(userId);
    return bookings.filter(booking => booking.status === status);
  }

  async getUpcoming(userId = null) {
    const bookings = await this.getAll(userId);
    const today = new Date();
    return bookings.filter(booking => 
      new Date(booking.checkIn) >= today &&
      booking.status !== "cancelled"
    );
  }

  async getRecent(userId = null, limit = 5) {
    const bookings = await this.getAll(userId);
    return bookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }
}

export default new BookingService();