// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // ✅ Controlled by .env
});

export default api;
