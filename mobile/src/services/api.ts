import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with the IP of your machine running the backend
// For physical devices on the same Wi-Fi, use this local IP
const BASE_URL = 'http://192.168.1.133:3333';

export const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to inject JWT token into request headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('viaAlerta_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token for interceptor:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
