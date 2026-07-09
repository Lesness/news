import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/news');
        } catch (err) {
            setError(err.response?.data?.error || 'Неверный email или пароль');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Вход в систему</h2>
                {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors shadow-md">Войти</button>
                <p className="mt-4 text-center text-sm text-slate-600">Нет аккаунта? <Link to="/register" className="text-indigo-600 hover:underline">Регистрация</Link></p>
            </form>
        </div>
    );
};