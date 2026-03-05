import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Clock, Check, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/apiConfig';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/notifications`);
                setNotifications(data);
            } catch (err) {
                console.error('Failed to fetch notifications');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchNotifications();
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await axios.put(`${API_URL}/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Failed to mark as read');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Failed to delete notification');
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`${API_URL}/api/notifications/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Failed to mark all as read');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-500 hover:text-primary-600 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black dark:text-white">Notifications</h1>
                        <p className="text-gray-500 text-sm">Stay updated with your activities</p>
                    </div>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm font-bold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-4 py-2 rounded-xl transition-all"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <Bell className="mx-auto text-primary-200 animate-bounce mb-4" size={48} />
                        <p className="text-gray-400">Loading your notifications...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {notifications.map(n => (
                            <div
                                key={n.id}
                                className={`p-6 flex gap-4 transition-all ${!n.isRead ? 'bg-primary-50/30 dark:bg-primary-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-primary-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-transparent'}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`text-lg ${!n.isRead ? 'font-black text-gray-900 dark:text-white' : 'font-bold text-gray-700 dark:text-gray-300'}`}>
                                            {n.title}
                                        </h3>
                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tight">
                                            <Clock size={12} /> {new Date(n.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                        {n.message}
                                    </p>
                                    <div className="flex gap-2">
                                        {!n.isRead && (
                                            <button
                                                onClick={() => markAsRead(n.id)}
                                                className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(n.id)}
                                            className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1"
                                        >
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="text-gray-200" size={40} />
                        </div>
                        <h2 className="text-xl font-bold dark:text-white mb-2">All Caught Up!</h2>
                        <p className="text-gray-500">You don't have any notifications at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
