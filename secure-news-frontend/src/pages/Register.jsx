import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await register(email, password, role);
            setSuccess('Регистрация успешна! Перенаправление на вход...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка при регистрации. Проверьте валидацию (пароль от 8 символов).');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Создать аккаунт</h2>
                {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
                {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-lg text-sm mb-4">{success}</div>}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Пароль (мин. 8 знаков)</label>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Роль доступа</label>
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                        <option value="STUDENT">Студент</option>
                        <option value="ADMIN">Администратор</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors shadow-md">Зарегистрироваться</button>
                <p className="mt-4 text-center text-sm text-slate-600">Уже зарегистрированы? <Link to="/login" className="text-indigo-600 hover:underline">Войти</Link></p>
            </form>
        </div>
    );
};