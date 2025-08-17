import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('jwtToken');
};

export const houseWishlistService = {
  // Get house wishlist for current user
  async getWishlist() {
    try {
      const response = await axios.get(`${API_URL}/house-wishlist`);
      return response.data.houses || [];
    } catch (error) {
      console.error('Ошибка при получении wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Необходимо авторизоваться');
      }
      throw error;
    }
  },

  // Add house to wishlist
  async addToWishlist(houseId) {
    try {
      const response = await axios.post(`${API_URL}/house-wishlist/${houseId}`, {});
      return response.data;
    } catch (error) {
      console.error('Ошибка при добавлении дома в wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Необходимо авторизоваться');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Дом уже в избранном');
      }
      throw error;
    }
  },

  // Remove house from wishlist
  async removeFromWishlist(houseId) {
    try {
      const response = await axios.delete(`${API_URL}/house-wishlist/${houseId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении дома из wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Необходимо авторизоваться');
      }
      throw error;
    }
  },

  // Clear entire wishlist
  async clearWishlist() {
    try {
      const response = await axios.delete(`${API_URL}/house-wishlist`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при очистке wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Необходимо авторизоваться');
      }
      throw error;
    }
  },

  // Check if house is in wishlist
  async isHouseInWishlist(houseId) {
    try {
      const response = await axios.get(`${API_URL}/house-wishlist/check/${houseId}`);
      return response.data.isInWishlist;
    } catch (error) {
      console.error('Ошибка при проверке дома в wishlist:', error);
      if (error.response?.status === 401) {
        return false; // If not authenticated, house is not in wishlist
      }
      return false;
    }
  }
};