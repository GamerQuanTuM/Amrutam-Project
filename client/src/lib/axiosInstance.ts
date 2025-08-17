import axios from "axios";
import { baseURL } from "@/constants/apiUrl";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


