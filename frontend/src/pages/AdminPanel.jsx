import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    CheckCircle,
    XCircle,
    Users,
    ExternalLink,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { API_URL } from '../utils/apiConfig';

const AdminPanel = () => {
    const [stats, setStats] = useState({});
    const [pendingClubs, setPendingClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await axios.get(`${API_URL}/api/admin/stats`);
                setStats(statsRes.data);

                const activityRes = await axios.get(`${API_URL}/api/admin/activity`);
                // Filter for pending clubs
                setPendingClubs(activityRes.data.recentClubs.filter(c => !c.isApproved));
            } catch (err) {
                console.error('Failed to fetch admin data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.put(`${API_URL}/api/admin/approve/${id}`);
            setPendingClubs(prev => prev.filter(c => c.id !== id));
            alert('Club approved successfully!');
        } catch (err) {
            alert('Approval failed');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject this club?')) return;
        try {
            await axios.delete(`${API_URL}/api/admin/reject/${id}`);
            setPendingClubs(prev => prev.filter(c => c.id !== id));
            alert('Club rejected');
        } catch (err) {
            alert('Rejection failed');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white">Admin Command Center</h1>
                    <p className="text-gray-500 mt-1">Platform overview and club approval workflow</p>
                </div>
                <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-xl text-sm font-bold border border-primary-100">
                    <ShieldCheck size={18} /> Verified Super Admin
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={stats.totalStudents} color="blue" />
                <StatCard title="Total Clubs" value={stats.totalClubs} color="purple" />
                <StatCard title="Approved Clubs" value={stats.approvedClubs} color="green" />
                <StatCard title="Total Events" value={stats.totalEvents} color="orange" />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <AlertCircle className="text-orange-500" size={20} /> Pending Club Approvals
                    </h2>
                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {pendingClubs.length} Requests
                    </span>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading requests...</div>
                    ) : pendingClubs.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <CheckCircle className="mx-auto mb-4 opacity-20" size={48} />
                            <p>All club applications have been processed.</p>
                        </div>
                    ) : (
                        pendingClubs.map(club => (
                            <div key={club.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden text-primary-600 font-bold text-xl">
                                        {club.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold dark:text-white">{club.name}</h3>
                                        <p className="text-sm text-gray-500">Applied by <span className="text-primary-600 font-medium">{club.admin?.name || 'Unknown'}</span> • {club.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleApprove(club.id)}
                                        className="flex-1 md:flex-none flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all active:scale-95"
                                    >
                                        <CheckCircle size={18} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(club.id)}
                                        className="flex-1 md:flex-none flex items-center gap-2 bg-white dark:bg-gray-800 text-red-500 px-5 py-2.5 rounded-xl font-bold border border-red-100 dark:border-red-900/30 hover:bg-red-50 transition-all"
                                    >
                                        <XCircle size={18} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        green: "bg-green-50 text-green-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className={`p-6 rounded-3xl ${colors[color]} border-2 border-white dark:border-gray-800 shadow-sm`}>
            <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">{title}</p>
            <p className="text-3xl font-black">{value || 0}</p>
        </div>
    );
};

export default AdminPanel;
