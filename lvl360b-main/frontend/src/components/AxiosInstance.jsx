import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/";

const AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    Accept: "application/json", // Set only the Accept header here
  },
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  } else {
    config.headers.Authorization = "";
  }

  // Conditionally set Content-Type based on request data
  if (config.data instanceof FormData) {
    // If FormData is being sent, remove the Content-Type header
    // to let the browser set it automatically
    delete config.headers["Content-Type"];
  } else {
    // For other requests, set Content-Type to application/json
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("Token");
    }
  }
);

export default AxiosInstance;
