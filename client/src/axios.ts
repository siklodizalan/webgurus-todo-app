import axios from "axios";
import Cookies from "js-cookie";
import router from "./router/router";

const API_URL = "http://localhost:3000";

axios.defaults.baseURL = API_URL;

axios.interceptors.request.use(
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

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        Cookies.remove("token");
        router.push("/login");
      }
    }
    throw error;
  }
);

export default axios;
