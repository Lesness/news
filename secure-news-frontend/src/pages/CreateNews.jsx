import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const CreateNews = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = {
            title,
            content,
            author,
            publishDate: new Date().toISOString().split('T')[0] // Формат YYYY-MM-DD для LocalDate
        };

        try {
            await api.post('/api/news', payload);
            navigate('/news');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка при сохранении. Проверьте заголовок (от 3 до 100 символов).');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Создать новую публикацию</h1>
                {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4 border border-rose-100">{error}</div>}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Заголовок новости</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Автор</label>
                    <input type="text" required value={author} onChange={e => setAuthor(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Текст публикации</label>
                    <textarea required rows={6} value={content} onChange={e => setContent(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow">Опубликовать</button>
            </form>
        </div>
    );
};