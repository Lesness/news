import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { injectAuthHandlers } from '../api/axios';

const AuthContext = createContext(null);

// Вспомогательная функция для безопасного парсинга JWT Payload (без использования сторонних библиотек)
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Функция извлечения роли из строки токена ("ROLE_ADMIN,ROLE_STUDENT" -> "ADMIN")
    const extractRole = (rolesString) => {
        if (!rolesString) return 'STUDENT';
        if (rolesString.includes('ROLE_ADMIN')) return 'ADMIN';
        return 'STUDENT';
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { accessToken: token } = response.data; // рефреш уходит в httpOnly cookie на бэкенде

        const decoded = parseJwt(token);
        setAccessToken(token);
        setUser({
            email: decoded.sub,
            role: extractRole(decoded.roles),
        });
        return response.data;
    };

    const register = async (email, password, role) => {
        return await api.post('/auth/register', { email, password, role });
    };

    const logout = async () => {
        try {
            // Так как рефреш-токен фронтенд не трогает, бэкенд инвалидирует сессию по куке
            await api.post('/auth/logout');
        } catch (e) {
            console.error("Logout error on backend", e);
        } finally {
            // Очищаем состояние в памяти в любом случае
            setAccessToken(null);
            setUser(null);
        }
    };

    // Метод тихого обновления токена (Silent Refresh)
    const refreshTokens = async () => {
        try {
            const response = await api.post('/auth/refresh');
            const { accessToken: token } = response.data;

            const decoded = parseJwt(token);
            setAccessToken(token);
            setUser({
                email: decoded.sub,
                role: extractRole(decoded.roles),
            });
            return token;
        } catch (error) {
            setAccessToken(null);
            setUser(null);
            throw error;
        }
    };

    // Связываем функции контекста с интерцептором axios при инициализации
    useEffect(() => {
        injectAuthHandlers(
            refreshTokens,
            () => {
                setAccessToken(null);
                setUser(null);
            },
            () => accessToken
        );
    }, [accessToken]);

    // При первой загрузке вкладки пытаемся сделать silent refresh (проверить наличие живой куки)
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await refreshTokens();
            } catch (e) {
                // Куки нет или она невалидна — пользователь гость
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);

    const value = {
        accessToken,
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'ADMIN'
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);