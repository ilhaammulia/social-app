import axios from 'axios'

export const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
});

// Request interceptor to add auth token
client.interceptors.request.use(
    (config) => {
        config.headers["Content-Type"] = "application/json";
        
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
client.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error)
        if (error.response?.status === 401) {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);