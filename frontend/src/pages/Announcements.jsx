import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, User, Clock, Megaphone } from 'lucide-react';
import { API_URL } from '../utils/apiConfig';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/announcements`);
                setAnnouncements(data);
            } catch (err) {
                console.error('Failed to fetch');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Megaphone className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold dark:text-white">Announcements</h1>
                    <p className="text-gray-500">Stay updated with latest college and club news</p>
                </div>
            </div>

            <div className="space-y-8">
                {loading ? (
                    [1, 2].map(i => <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl" />)
                ) : announcements.length > 0 ? (
                    announcements.map((item, idx) => (
                        <div key={item.id} className="relative group p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.type === 'College' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {item.type} Announcement
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold dark:text-white mb-4">{item.title}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.content}</p>

                                    <div className="mt-8 flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                            <User className="text-gray-400" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold dark:text-white">{item.sender?.name || 'Academic Administration'}</p>
                                            <p className="text-xs text-gray-500">{item.club?.name || 'Campus Connect Staff'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                        <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold dark:text-white">All Quiet Here!</h3>
                        <p className="text-gray-500 mt-2">No announcements have been published yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
