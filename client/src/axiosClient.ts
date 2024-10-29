import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import router from "./router/router";

const API_URL = "http://localhost:3000";

axios.defaults.baseURL = API_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    throw error;
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      router.push("/login");
    } else {
      throw error;
    }
  }
);

export const client = {
  get: (url: string, config?: AxiosRequestConfig<any>) => axiosClient.get(url, config),
  post: (url: string, data: any, config?: AxiosRequestConfig<any>) => axiosClient.post(url, data, config),
  put: (url: string, data: any, config?: AxiosRequestConfig<any>) => axiosClient.put(url, data, config),
  patch: (url: string, data: any, config?: AxiosRequestConfig<any>) => axiosClient.patch(url, data, config),
  delete: (url: string, config?: AxiosRequestConfig<any>) => axiosClient.delete(url, config),
}
