import axios from 'axios';

let refreshHandler = null;
let logoutHandler = null;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    withCredentials: true, // Передача httpOnly Cookie на бэкенд
});

export const injectAuthHandlers = (refresh, logout, getAccessToken) => {
    refreshHandler = refresh;
    logoutHandler = logout;

    // Автоматическая подстановка Bearer токена в каждый запрос
    api.interceptors.request.use((config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

// Перехватчик ответов (Response Interceptor)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если 401 на эндпоинтах авторизации — НЕ зацикливаем, отдаем ошибку
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh') &&
            !originalRequest.url.includes('/auth/login')
        ) {
            originalRequest._retry = true;
            try {
                if (refreshHandler) {
                    const newToken = await refreshHandler();
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                if (logoutHandler) logoutHandler();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;