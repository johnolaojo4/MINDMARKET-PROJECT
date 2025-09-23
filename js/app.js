// js/api.js
const API_BASE_URL = 'https://mind-market-api.onrender.com';

class ApiService {
  // User signup
  async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // User signin
  async signin(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return await response.json();
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  }

  // Get all users
  async getAllUsers(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
