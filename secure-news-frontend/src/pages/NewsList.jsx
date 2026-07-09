import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, User } from 'lucide-react';

export const NewsList = () => {
    const [news, setNews] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/api/news')
            .then(res => setNews(res.data))
            .catch(err => setError('Не удалось загрузить новости.'));
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Лента новостей</h1>
            {error && <div className="text-rose-600 mb-4">{error}</div>}
            <div className="grid gap-6 md:grid-cols-2">
                {news.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-xl shadow border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            {/* Автоматическое безопасное экранирование строк силами React против XSS */}
                            <h2 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h2>
                            <p className="text-slate-600 line-clamp-3 mb-4">{item.content}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 border-t pt-4 border-slate-100">
                            <div className="flex items-center space-x-3">
                                <span className="flex items-center space-x-1"><User className="w-3 h-3"/> <span>{item.author}</span></span>
                                <span className="flex items-center space-x-1"><Calendar className="w-3 h-3"/> <span>{item.publishDate}</span></span>
                            </div>
                            <Link to={`/news/${item.id}`} className="text-indigo-600 font-semibold hover:text-indigo-800">Читать далее &rarr;</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};