import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { injectAuthHandlers } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Обновление токена по httpOnly Cookie
    const refreshTokens = async () => {
        try {
            const response = await api.post('/auth/refresh');
            const token = response.data.accessToken;
            setAccessToken(token);

            // Передаем токен явно в заголовке, чтобы не ждать обновления состояния Axios
            const userRes = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser({
                email: userRes.data.email,
                role: userRes.data.roles?.[0]?.replace('ROLE_', '') || 'STUDENT'
            });

            return token;
        } catch (error) {
            setAccessToken(null);
            setUser(null);
            throw error;
        }
    };

    // Функция для получения данных текущего пользователя из компонентов
    const fetchCurrentUser = async () => {
        const response = await api.get('/auth/me');
        return response.data;
    };

    // Вход в систему
    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const token = response.data.accessToken;
        setAccessToken(token);

        // Получаем информацию о пользователе с сервера
        const userRes = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });

        setUser({
            email: userRes.data.email,
            role: userRes.data.roles?.[0]?.replace('ROLE_', '') || 'STUDENT'
        });

        return response.data;
    };

    // Регистрация
    const register = async (email, password, role) => {
        const response = await api.post('/auth/register', { email, password, role });
        return response.data;
    };

    // Выход
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error('Ошибка при выходе:', e);
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    useEffect(() => {
        injectAuthHandlers(refreshTokens, logout, () => accessToken);
    }, [accessToken]);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await refreshTokens();
            } catch (e) {
                // Пользователь не авторизован (гость) — это нормально при старте
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
        fetchCurrentUser,
        isAdmin: user?.role === 'ADMIN'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);