import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell } from 'lucide-react';
import NotificationPanel from '../components/NotificationPanel';
import { Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const { user } = useAuth();

    const getTitle = (pathname) => {
        const path = pathname.split('/').pop();
        if (!path || path === 'app') return 'Overview';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    useEffect(() => {
        if (!user) return;
        const fetchUnreadCount = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/notifications`);
                setUnreadCount(data.filter(n => !n.isRead).length);
            } catch (err) {
                console.error('Failed to fetch unread count');
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 font-inter">
            <Sidebar />
            <main className="pl-64">
                <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-[60] border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold dark:text-white tracking-tight">{getTitle(location.pathname)}</h2>
                    <div className="flex items-center gap-2 relative">
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all relative group"
                        >
                            <Bell size={20} className="text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-primary-600 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center animate-pulse">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                        <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                        <button
                            onClick={toggleDarkMode}
                            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                        >
                            {isDarkMode ? <Sun size={20} className="text-yellow-400 group-hover:rotate-45 transition-transform" /> : <Moon size={20} className="text-gray-600 group-hover:-rotate-12 transition-transform" />}
                        </button>
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
