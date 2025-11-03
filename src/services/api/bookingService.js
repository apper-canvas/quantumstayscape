import bookingsData from "@/services/mockData/bookings.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BookingService {
  constructor() {
    this.bookings = [...bookingsData];
  }

  async getAll(userId = "user1") {
    await delay(300);
    return this.bookings.filter(booking => booking.userId === userId);
  }

  async getById(id) {
    await delay(200);
    const booking = this.bookings.find(b => b.Id === parseInt(id));
    if (!booking) {
      throw new Error("Booking not found");
    }
    return { ...booking };
  }

  async create(bookingData) {
    await delay(500);
    
    // Simulate potential booking conflicts
    if (Math.random() < 0.1) {
      throw new Error("Room is no longer available for selected dates");
    }
    
    const newBooking = {
      ...bookingData,
      Id: Math.max(...this.bookings.map(b => b.Id), 0) + 1,
      status: "confirmed",
      confirmationNumber: `STY-${String(Math.max(...this.bookings.map(b => b.Id), 0) + 1).padStart(3, '0')}-2024`,
      createdAt: new Date().toISOString()
    };
    
    this.bookings.push(newBooking);
    return { ...newBooking };
  }

  async update(id, updates) {
    await delay(400);
    const index = this.bookings.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Booking not found");
    }
    
    this.bookings[index] = {
      ...this.bookings[index],
      ...updates
    };
    
    return { ...this.bookings[index] };
  }

  async cancel(id) {
    await delay(400);
    const index = this.bookings.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Booking not found");
    }
    
    this.bookings[index] = {
      ...this.bookings[index],
      status: "cancelled"
    };
    
    return { ...this.bookings[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.bookings.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Booking not found");
    }
    
    this.bookings.splice(index, 1);
    return true;
  }

  async getByStatus(status, userId = "user1") {
    await delay(250);
    return this.bookings.filter(booking => 
      booking.userId === userId && booking.status === status
    );
  }

  async getUpcoming(userId = "user1") {
    await delay(250);
    const today = new Date();
    return this.bookings.filter(booking => 
      booking.userId === userId && 
      new Date(booking.checkIn) >= today &&
      booking.status !== "cancelled"
    );
  }

  async getRecent(userId = "user1", limit = 5) {
    await delay(200);
    return this.bookings
      .filter(booking => booking.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }
}

export default new BookingService();