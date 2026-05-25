import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER || 'http://localhost:3001',
  withCredentials: true,
});
