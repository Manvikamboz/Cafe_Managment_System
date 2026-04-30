import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to include JWT token in headers
API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default API;
