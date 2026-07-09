import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, Newspaper, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <nav className="bg-slate-900 text-white shadow-md px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-6">
                <Link to="/news" className="text-xl font-bold tracking-wider text-indigo-400 flex items-center space-x-2">
                    <Newspaper className="w-6 h-6" />
                    <span>SECURE NEWS</span>
                </Link>
                <Link to="/news" className="hover:text-indigo-300 transition-colors">Лента</Link>
                {isAdmin && (
                    <Link to="/news/create" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1">
                        <PlusCircle className="w-4 h-4" />
                        <span>Создать новость</span>
                    </Link>
                )}
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    <UserIcon className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium">{user.email}</span>
                    <span className={`ml-2 text-xs uppercase px-2 py-0.5 rounded font-bold ${isAdmin ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
            {user.role}
          </span>
                </div>
                <button
                    onClick={() => logout().then(() => navigate('/login'))}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all shadow-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти</span>
                </button>
            </div>
        </nav>
    );
};