import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const houseService = {
  async getAllHouses(filters = {}) {
    try {
      console.log('Запрос на получение домов с фильтрами:', filters);
      const response = await axios.get(`${API_URL}/houses`, { params: filters });
      console.log('Получены дома:', response.data);
      // Extract houses array from paginated response
      return response.data.houses || response.data;
    } catch (error) {
      console.error('Ошибка при получении списка домов:', error);
      throw error;
    }
  },

  async getHousesWithPagination(filters = {}, page = 1, limit = 10) {
    try {
      const params = { ...filters, page, limit };
      console.log('Запрос на получение домов с пагинацией:', params);
      const response = await axios.get(`${API_URL}/houses`, { params });
      console.log('Получены дома с пагинацией:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка домов с пагинацией:', error);
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
  },

  async uploadImage(file, houseId) {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('image', file);
      formData.append('house_id', houseId);

      // Send the file to the server
      const response = await axios.post(`${API_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      throw error;
    }
  },

  async uploadImages(files, houseId) {
    try {
      // Create a FormData object to send the files
      const formData = new FormData();

      // Append each file to the FormData object
      files.forEach(file => {
        formData.append('images', file);
      });

      // Append the house ID
      formData.append('house_id', houseId);

      // Send the files to the server
      const response = await axios.post(`${API_URL}/upload/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      throw error;
    }
  }
};
