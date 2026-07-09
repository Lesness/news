import axios from 'axios';

// Базовый инстанс axios с URL из .env
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Обязательно для передачи httpOnly cookies
});

// Ссылка на функции из AuthContext, которые мы внедрим позже,
// чтобы избежать циклической зависимости при импорте контекста
let logoutHandler = null;
let refreshTokensHandler = null;
let getAccessTokenFn = () => null;

export const injectAuthHandlers = (getRefreshedToken, doLogout, getAccessToken) => {
    refreshTokensHandler = getRefreshedToken;
    logoutHandler = doLogout;
    getAccessTokenFn = getAccessToken;
};

// Request Interceptor: Добавляет Access Token ко всем защищенным запросам
api.interceptors.request.use(
    (config) => {
        const token = getAccessTokenFn();
        // Если токен есть в памяти, добавляем заголовок Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Перехватывает 401 ошибку и обновляет токен через /auth/refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если сервер вернул 401 и это не повторный запрос к той же точке
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (refreshTokensHandler) {
                    // Вызываем функцию обновления токена (она получит новый accessToken)
                    const newAccessToken = await refreshTokensHandler();

                    // Обновляем заголовок в упавшем запросе и повторяем его
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Если рефреш-токен тоже протух или отозван — разлогиниваем пользователя
                if (logoutHandler) logoutHandler();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;