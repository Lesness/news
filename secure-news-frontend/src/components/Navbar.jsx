import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();

    return (
        <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <Link to="/news" className="text-lg font-bold hover:text-slate-300">
                    Новости
                </Link>

                {/* Ссылка должна вести строго на /news/create */}
                {isAdmin && (
                    <Link
                        to="/news/create"
                        className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                        + Создать новость
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link to="/profile" className="hover:text-slate-300">
                            Профиль ({user.email})
                        </Link>
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-slate-300">
                            Войти
                        </Link>
                        <Link to="/register" className="hover:text-slate-300">
                            Зарегистрироваться
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};