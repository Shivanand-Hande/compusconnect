import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bell, Clock, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../utils/apiConfig';

const NotificationPanel = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const panelRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/notifications`);
                setNotifications(data);
            } catch (err) {
                console.error('Failed to fetch notifications');
            }
        };

        fetchNotifications();

        const socket = io(API_URL);
        socket.on('connect', () => {
            socket.emit('join_room', `user_${user.id}`);
            if (user.club) socket.emit('join_room', `club_${user.club}`);
        });

        socket.on('new_notification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
        });

        // Click outside handler
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            socket.disconnect();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [user, isOpen, onClose]);

    const markAsRead = async (id) => {
        try {
            await axios.put(`${API_URL}/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            // We don't necessarily close the panel here, but we could if we want.
            // onClose(); 
        } catch (err) {
            console.error('Failed to mark read');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            className="absolute right-0 top-full mt-4 w-[22rem] md:w-[26rem] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-[100] overflow-hidden animate-in slide-in-from-top-4 duration-300"
        >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between ">
                <div>
                    <h3 className="text-xl font-black dark:text-white flex items-center gap-2">
                        <Bell size={20} className="text-primary-600" /> Notifications
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Latest Updates</p>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all group">
                    <X size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
            </div>

            <div className="max-h-[450px] overflow-y-auto scrollbar-hide">
                {notifications.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="text-gray-200" size={32} />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">No new notifications</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {notifications.map(n => (
                            <div
                                key={n.id}
                                className={`p-5 transition-all cursor-pointer flex gap-4 ${!n.isRead ? 'bg-primary-50/20 dark:bg-primary-900/5' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50'}`}
                                onClick={() => markAsRead(n.id)}
                            >
                                <div className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-primary-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-transparent'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm leading-snug ${!n.isRead ? 'font-black text-gray-900 dark:text-white' : 'font-bold text-gray-500 dark:text-gray-400'}`}>
                                        {n.title}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{n.message}</p>
                                    <div className="flex items-center gap-2 mt-3 text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                        <Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50">
                <Link
                    to="/app/notifications"
                    onClick={onClose}
                    className="w-full bg-white dark:bg-gray-900 text-primary-600 font-black py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary-600/30 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                >
                    View All Activity <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
};

export default NotificationPanel;
