import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Plus, Users, Shield, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/apiConfig';

const Clubs = () => {
    const [clubs, setClubs] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newClub, setNewClub] = useState({ name: '', description: '', category: 'Technical' });
    const [logoFile, setLogoFile] = useState(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/clubs`);
                setClubs(data);
            } catch (err) {
                console.error('Failed to fetch clubs');
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    const handleJoin = async (clubId) => {
        try {
            await axios.post(`${API_URL}/api/clubs/${clubId}/members`);
            alert('Joined successfully!');
            // Update local state or re-fetch
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to join club');
        }
    };

    const handleCreateClub = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newClub.name);
        formData.append('description', newClub.description);
        formData.append('category', newClub.category);
        if (logoFile) formData.append('logo', logoFile);

        try {
            await axios.post(`${API_URL}/api/clubs`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Club application submitted! Wait for Super Admin approval.');
            setShowModal(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit application');
        }
    };

    const filteredClubs = clubs.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white">Clubs & Communities</h1>
                    <p className="text-gray-500 mt-1">Discover and join passionate student organizations</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:bg-primary-700 transition-all active:scale-95"
                >
                    <Plus size={20} /> Create New Club
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <form onSubmit={handleCreateClub} className="p-8 space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-black dark:text-white">Start a Club</h2>
                                <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Club Name</label>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white text-sm"
                                        value={newClub.name}
                                        onChange={e => setNewClub({ ...newClub, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                                    <select
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white text-sm"
                                        value={newClub.category}
                                        onChange={e => setNewClub({ ...newClub, category: e.target.value })}
                                    >
                                        {['Technical', 'Cultural', 'Sports', 'Academic', 'Social'].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                                    <textarea
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white text-sm min-h-[100px]"
                                        value={newClub.description}
                                        onChange={e => setNewClub({ ...newClub, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Club Logo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setLogoFile(e.target.files[0])}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white text-sm"
                                    />
                                </div>
                            </div>

                            <button className="w-full bg-primary-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-600/20 hover:bg-primary-700 active:scale-[0.98] transition-all">
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[2.5rem]" />)
                ) : (
                    filteredClubs.map(club => (
                        <div key={club.id} className="group bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[60px] rounded-full group-hover:bg-primary-500/10 transition-all"></div>

                            <div className="flex items-center gap-6 mb-8 relative z-10">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center p-1 border-2 border-white dark:border-gray-700 shadow-xl overflow-hidden group-hover:scale-110 transition-transform duration-500">
                                    {club.logo ? (
                                        <img src={`${API_URL}/${club.logo}`} alt={club.name} className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                        <span className="text-3xl font-black text-primary-600 uppercase">{club.name[0]}</span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`w-2 h-2 rounded-full ${club.category === 'Technical' ? 'bg-blue-500' : club.category === 'Cultural' ? 'bg-purple-500' : 'bg-green-500'}`}></span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{club.category}</span>
                                    </div>
                                    <h3 className="text-2xl font-black dark:text-white tracking-tight">{club.name}</h3>
                                </div>
                            </div>

                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 font-medium h-12">
                                {club.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800 relative z-10">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                            <Users size={14} className="text-gray-400" />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-[10px] font-bold text-primary-600">
                                        +42
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleJoin(club.id)}
                                    className="bg-primary-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary-600/20 hover:bg-primary-700 active:scale-[0.98] transition-all"
                                >
                                    Join Community
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Clubs;
