import axios from 'axios';

// Replace with the IP of your machine running the backend
// For Android emulator, you can use 10.0.2.2
const BASE_URL = 'http://10.0.2.2:3000';

export const api = axios.create({
  baseURL: BASE_URL,
});

// We will add interceptors later when we implement JWT auth storage
