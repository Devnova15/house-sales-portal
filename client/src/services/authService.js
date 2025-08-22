import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('jwtToken', token);
    // Set default Authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;    // Emit custom event for auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: true } }));
  } else {
    localStorage.removeItem('jwtToken');
    delete axios.defaults.headers.common['Authorization'];
    // Emit custom event for auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: false } }));
  }
};

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('jwtToken');
};

export const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);

      if (response.data.success && response.data.token) {
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { message: 'Помилка зв\'язку з сервером' };
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);

      if (response.data.success && response.data.token) {
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { message: 'Помилка зв\'язку з сервером' };
    }
  },

  // Admin login
  async loginAdmin(credentials) {
    try {
      const response = await axios.post(`${API_URL}/customers/admin/login`, credentials);

      if (response.data.success && response.data.token) {
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { message: 'Помилка зв\'язку з сервером' };
    }
  },

  // Logout user or admin
  logout() {
    setAuthToken(null);
  },

  // Get current auth token
  getToken() {
    return getAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!getAuthToken();
  },

  // Get current user from token
  getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) return null;

      // Берем токен без префикса Bearer, если он есть
      const jwtToken = token.includes('Bearer ') ? token.split(' ')[1] : token;

      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};
