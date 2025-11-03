import usersData from "@/services/mockData/users.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async getById(id) {
    await delay(200);
    const user = this.users.find(u => u.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async getCurrentUser() {
    await delay(300);
    // Simulate returning current logged in user
    return { ...this.users[0] };
  }

  async updateProfile(id, updates) {
    await delay(400);
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users[index] = {
      ...this.users[index],
      ...updates
    };
    
    return { ...this.users[index] };
  }

  async updatePreferences(id, preferences) {
    await delay(300);
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users[index] = {
      ...this.users[index],
      preferences: {
        ...this.users[index].preferences,
        ...preferences
      }
    };
    
    return { ...this.users[index] };
  }

  async uploadAvatar(id, avatarUrl) {
    await delay(500);
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users[index] = {
      ...this.users[index],
      avatar: avatarUrl
    };
    
    return { ...this.users[index] };
  }

  async authenticate(email, password) {
    await delay(800);
    
    // Simulate authentication
    const user = this.users.find(u => u.email === email);
    if (!user || password !== "password123") {
      throw new Error("Invalid email or password");
    }
    
    return {
      user: { ...user },
      token: `token_${user.Id}_${Date.now()}`
    };
  }

  async register(userData) {
    await delay(600);
    
    // Check if email already exists
    if (this.users.find(u => u.email === userData.email)) {
      throw new Error("Email already exists");
    }
    
    const newUser = {
      ...userData,
      Id: Math.max(...this.users.map(u => u.Id), 0) + 1,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      preferences: {
        roomType: "deluxe",
        bedType: "queen",
        smokingPreference: "non-smoking",
        floorPreference: "any",
        newsletter: true
      },
      memberSince: new Date().toISOString().split('T')[0],
      totalBookings: 0,
      loyaltyStatus: "bronze",
      createdAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    
    return {
      user: { ...newUser },
      token: `token_${newUser.Id}_${Date.now()}`
    };
  }
}

export default new UserService();