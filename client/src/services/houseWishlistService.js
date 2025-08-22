import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('jwtToken');
};

// Helper function to get authorization headers
const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};};

export const houseWishlistService = {
    // Get house wishlist for current user
    async getWishlist() {
        try {
            const response = await axios.get(`${API_URL}/house-wishlist`, {
                headers: getAuthHeaders()
            });
            return response.data.houses || [];
        } catch (error) {
            console.error('Помилка при отриманні wishlist:', error);
            if (error.response?.status === 401) {
                throw new Error('Необхідно авторизуватися');
            }
            throw error;
        }
    },

    // Add house to wishlist
    async addToWishlist(houseId) {
        try {
            const response = await axios.post(`${API_URL}/house-wishlist/${houseId}`, {}, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Помилка при додаванні будинку в wishlist:', error);
            if (error.response?.status === 401) {
                throw new Error('Необхідно авторизуватися');
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
            const response = await axios.delete(`${API_URL}/house-wishlist/${houseId}`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Помилка при видаленні будинку з wishlist:', error);
            if (error.response?.status === 401) {
                throw new Error('Необхідно авторизуватися');
            }
            throw error;
        }
    },

    // Clear entire wishlist
    async clearWishlist() {
        try {
            const response = await axios.delete(`${API_URL}/house-wishlist`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Помилка при очищенні wishlist:', error);
            if (error.response?.status === 401) {
                throw new Error('Необхідно авторизуватися');
            }
            throw error;
        }
    },

// Check if house is in wishlist
    async isHouseInWishlist(houseId) {
        try {
            const response = await axios.get(`${API_URL}/house-wishlist/check/${houseId}`, {
                headers: getAuthHeaders()
            });
            return response.data.isInWishlist;
        } catch (error) {
            console.error('Помилка при перевірці будинку в wishlist:', error);
            if (error.response?.status === 401) {
                return false;
            }
            return false;
        }
    }
};