import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export const NewsDetails = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/api/news/${id}`)
            .then(res => setNews(res.data))
            .catch(err => setError('Новость не найдена или доступ ограничен.'));
    }, [id]);

    if (error) return <div className="max-w-3xl mx-auto mt-8 p-4 text-rose-600 bg-rose-50 rounded-lg">{error}</div>;
    if (!news) return <div className="text-center mt-8">Загрузка контента...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Link to="/news" className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center space-x-1 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4"/> <span>Назад к ленте</span>
            </Link>
            <article className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-3xl font-black text-slate-900 mb-4">{news.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-slate-400 mb-6 pb-4 border-b border-slate-100">
                    <span className="flex items-center space-x-1"><User className="w-4 h-4 text-indigo-500"/> <span className="font-medium text-slate-600">{news.author}</span></span>
                    <span className="flex items-center space-x-1"><Calendar className="w-4 h-4"/> <span>{news.publishDate}</span></span>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">{news.content}</p>
            </article>
        </div>
    );
};