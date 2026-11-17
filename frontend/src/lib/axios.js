import axios from "axios";

// In development, target the Express backend on port 5001; in production, use relative /api
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // withCredentials ensures HTTP-only JWT cookies are sent with cross-origin requests
  withCredentials: true,
});

