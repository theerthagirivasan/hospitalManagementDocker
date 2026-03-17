import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hospitalmanagementdocker.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user && user.token) {
      config.headers['Authorization'] = 'Bearer ' + user.token;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
