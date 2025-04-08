import axios from 'axios';

const api = axios.create({
  // baseURL: "https://caterer.gainenterprises.in/backend/api/v1",
  baseURL: "http://127.0.0.1:8000/api/v1/", 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;