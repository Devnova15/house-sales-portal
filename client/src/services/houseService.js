// src/services/houseService.js
import axios from 'axios';

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const houseService = {
  async getAllHouses(filters = {}) {
    try {
      console.log('Запрос на получение домов с фильтрами:', filters);
      const response = await axios.get(`${API_URL}/houses`, { params: filters });
      console.log('Получены дома:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка домов:', error);
      throw error;
    }
  },

  async getHouseById(id) {
    try {
      const response = await axios.get(`${API_URL}/houses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении дома по ID:', error);
      throw error;
    }
  },

  async createHouse(houseData) {
    try {
      const response = await axios.post(`${API_URL}/houses`, houseData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании дома:', error);
      throw error;
    }
  },

  async updateHouse(id, houseData) {
    try {
      const response = await axios.put(`${API_URL}/houses/${id}`, houseData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении дома:', error);
      throw error;
    }
  },

  async deleteHouse(id) {
    try {
      const response = await axios.delete(`${API_URL}/houses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении дома:', error);
      throw error;
    }
  }
};
