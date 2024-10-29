import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
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
  get: <T>(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<T>> => axiosClient.get<T>(url, config),
  post: <T, R>(url: string, data: T, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<R>> => axiosClient.post<R>(url, data, config),
  put: <T, R>(url: string, data: T, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<R>> => axiosClient.put<R>(url, data, config),
  patch: <T, R>(url: string, data: T, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<R>> => axiosClient.patch<R>(url, data, config),
  delete: <R>(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<R>> => axiosClient.delete<R>(url, config),
}
