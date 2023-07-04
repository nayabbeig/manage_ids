import axios from "axios";
import path from "../router/paths";
import { clearAuthData, getLocalToken } from "./auth.helper";

export const authInstance = axios.create({
  baseURL: path.host,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiInstance = axios.create({
  baseURL: path.host,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(
  (path) => {
    const token = getLocalToken();
    if (path.headers != null && token) {
      path.headers["Authorization"] = "Bearer " + token;
    }
    return path;
  },
  async (error) => {
    return await Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    // const originalPath = error.path;
    if (error.response) {
      // Access Token was expired
      if (
        error.response.status > 400 &&
        error?.response?.data?.code === "BAD_TOKEN"
      ) {
        if (error.response && error.response.data) {
          clearAuthData();
          window.location.href = path.ui.login;
          return await Promise.reject(error.response.data);
        }
        return await Promise.reject(error);
      }

      if (error.response.status === 403 && error.response.data) {
        return await Promise.reject(error.response.data);
      }
    }

    return await Promise.reject(error?.response);
  }
);

export const interceptedApiInstance = apiInstance;
