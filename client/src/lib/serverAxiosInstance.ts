import axios from "axios";
import { cookies } from "next/headers";
import { baseURL } from "@/constants/apiUrl";

export const serverAxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

serverAxiosInstance.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);