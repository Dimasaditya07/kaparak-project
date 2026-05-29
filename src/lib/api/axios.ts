import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8001/api', 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});


axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default axiosInstance;