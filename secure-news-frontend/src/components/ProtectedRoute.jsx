import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Загрузка безопасности...</div>;
    }

    // Если нет токена/пользователя в памяти — редирект на логин
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Проверка авторизации по роли (например, для /news/create нужен только ADMIN)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/news" replace />;
    }

    return children;
};