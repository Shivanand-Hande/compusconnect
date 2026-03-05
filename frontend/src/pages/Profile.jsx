import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/apiConfig';
import {
    User as UserIcon,
    Mail,
    Calendar,
    MapPin,
    Award,
    LogOut,
    Settings,
    Shield,
    LayoutDashboard,
    Ticket,
    Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/attendance/my-attendance`);
                setAttendanceRecords(data);
            } catch (err) {
                console.error('Failed to fetch attendance');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchAttendance();
    }, [user]);

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-primary-600 to-indigo-600 relative">
                    <div className="absolute -bottom-16 left-12">
                        <div className="w-32 h-32 rounded-[2rem] bg-white dark:bg-gray-800 p-2 shadow-2xl border-4 border-white dark:border-gray-900 flex items-center justify-center overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-[1.5rem]" />
                            ) : (
                                <UserIcon size={64} className="text-primary-600" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-12 px-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black dark:text-white tracking-tight">{user.name}</h1>
                            <span className="bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                                {user.role}
                            </span>
                        </div>
                        <p className="flex items-center gap-2 text-gray-500 font-medium">
                            <Mail size={18} /> {user.email}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all dark:text-white">
                            <Settings size={20} /> Edit Profile
                        </button>
                        {user.role === 'Club Admin' && (
                            <Link to="/app/my-club" className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all">
                                <LayoutDashboard size={20} /> My Club
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Enrolled Clubs */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[60px] rounded-full group-hover:bg-primary-500/10 transition-all"></div>
                    <h2 className="text-2xl font-bold dark:text-white mb-8 flex items-center gap-3">
                        <Shield className="text-primary-600" size={24} /> My Communities
                    </h2>
                    <div className="space-y-4">
                        {user.enrolledClubs?.length > 0 ? (
                            user.enrolledClubs.map(club => (
                                <div key={club.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.02]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
                                            {club.name?.[0]}
                                        </div>
                                        <span className="font-bold dark:text-white">{club.name || 'Club'}</span>
                                    </div>
                                    <button className="text-xs font-bold text-primary-600 hover:underline">View Page</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">You haven't joined any clubs yet.</p>
                        )}
                    </div>
                </div>

                {/* Active Registrations */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[60px] rounded-full group-hover:bg-primary-500/10 transition-all"></div>
                    <h2 className="text-2xl font-bold dark:text-white mb-8 flex items-center gap-3">
                        <Ticket className="text-primary-600" size={24} /> My Tickets
                    </h2>
                    <div className="space-y-4">
                        {user.registrations?.length > 0 ? (
                            user.registrations.map(reg => (
                                <div key={reg.id} className="flex flex-col p-5 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                                                <Calendar size={20} className="text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold dark:text-white text-sm">{reg.event?.title}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{reg.event?.club?.name}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${reg.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {reg.status}
                                        </span>
                                    </div>

                                    {reg.qrCode && (
                                        <div className="flex items-center gap-4 bg-white dark:bg-gray-900/50 p-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                            <img src={reg.qrCode} alt="QR" className="w-16 h-16 rounded-lg" />
                                            <div className="flex-1">
                                                <p className="text-xs font-bold dark:text-white">Entrance Pass</p>
                                                <p className="text-[10px] text-gray-400">Scan this at the venue</p>
                                                <button
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = reg.qrCode;
                                                        link.download = `ticket-${reg.event?.title}.png`;
                                                        link.click();
                                                    }}
                                                    className="mt-2 text-[10px] font-black text-primary-600 uppercase hover:underline flex items-center gap-1"
                                                >
                                                    <Download size={12} /> Save Ticket
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                                <Ticket className="mx-auto text-gray-200 mb-4" size={40} />
                                <p className="text-sm text-gray-400">No active tickets found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Certificates */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[60px] rounded-full group-hover:bg-orange-500/10 transition-all"></div>
                    <h2 className="text-2xl font-bold dark:text-white mb-8 flex items-center gap-3">
                        <Award className="text-orange-500" size={24} /> My Certificates
                    </h2>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <Award className="animate-bounce text-orange-500 mb-2" size={32} />
                                <p className="text-xs text-gray-400">Loading certificates...</p>
                            </div>
                        ) : attendanceRecords.length > 0 ? (
                            attendanceRecords.map(record => (
                                <div key={record.id} className="flex flex-col p-5 bg-orange-50/30 dark:bg-orange-900/10 rounded-[2rem] border border-orange-100 dark:border-orange-900/30 group hover:border-orange-500/50 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                                                <Award size={20} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold dark:text-white text-sm">{record.event?.title}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{record.event?.club?.name}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            Earned
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => window.open(`${API_URL}/api/attendance/certificate/${record.event?.id}`, '_blank')}
                                        className="w-full bg-white dark:bg-gray-800 text-orange-600 hover:text-white hover:bg-orange-600 dark:text-orange-400 font-black py-3 rounded-2xl shadow-sm border border-orange-100 dark:border-orange-800 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                                    >
                                        <Download size={16} /> Download Certificate
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                                <Award className="mx-auto text-gray-200 mb-4" size={40} />
                                <p className="text-sm text-gray-400">Certificates appear here after event completion</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Logout Action */}
            <div className="pt-8 flex justify-center">
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-8 py-3 rounded-2xl transition-all"
                >
                    <LogOut size={20} /> Sign Out of CampusConnect
                </button>
            </div>
        </div>
    );
};

export default Profile;
