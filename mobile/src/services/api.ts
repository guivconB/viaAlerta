import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with the IP of your machine running the backend
// For Android emulator, you can use 10.0.2.2
const BASE_URL = 'http://10.0.2.2:3000/api';

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
