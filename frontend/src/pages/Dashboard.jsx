import React, { useEffect, useState } from 'react';
import {
    Users,
    Calendar,
    Trophy,
    ArrowUpRight,
    TrendingUp,
    Clock,
    ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/apiConfig';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalClubs: 0,
        totalEvents: 0,
        upcomingEvents: [],
        participationData: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/admin/stats`);
                setStats(data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setStats(prev => ({
                        ...prev,
                        totalStudents: '-',
                        totalClubs: '-',
                        totalEvents: '-',
                        totalRegistrations: '-'
                    }));
                } else {
                    console.error('Failed to fetch stats');
                }
            }
        };
        fetchStats();
    }, []);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                fill: true,
                label: 'Event Participation',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.05)',
                borderWidth: 3,
                pointBackgroundColor: '#0ea5e9',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                tension: 0.4,
            },
        ],
    };

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="group bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-300 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] blur-2xl group-hover:opacity-[0.08] transition-opacity`}></div>
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{title}</p>
                    <h3 className="text-4xl font-black dark:text-white tracking-tight">{value}</h3>
                    <div className="flex items-center gap-1 mt-3 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg w-fit text-[10px] font-black uppercase tracking-widest">
                        <TrendingUp size={12} />
                        <span>+{trend}% Growth</span>
                    </div>
                </div>
                <div className={`p-4 rounded-2xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="text-white" size={24} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Welcome Section */}
            <div className="relative overflow-hidden bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-primary-600/10 group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 opacity-20 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 opacity-20 blur-[80px] translate-y-1/2 -translate-x-1/3"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
                            <TrendingUp size={14} /> Academic Year 2026-27
                        </span>
                        <h1 className="text-5xl font-black tracking-tight mb-4">Welcome back, <span className="text-primary-400">{user?.name || 'User'}</span> 👋</h1>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            You have 3 club activities today and 1 upcoming event in your registered community. Stay engaged and keep connecting!
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-[2rem] min-w-[120px]">
                            <p className="text-3xl font-black">12</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mt-1">Events Done</p>
                        </div>
                        <div className="text-center bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-[2rem] min-w-[120px]">
                            <p className="text-3xl font-black">98%</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mt-1">Attendance</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats?.totalStudents === '-' ? '1k+' : (stats?.totalStudents ?? 0)}
                    icon={Users} color="bg-blue-500" trend="0"
                />
                <StatCard
                    title="Active Clubs"
                    value={stats?.totalClubs === '-' ? '10+' : (stats?.totalClubs ?? 0)}
                    icon={Trophy} color="bg-orange-500" trend="0"
                />
                <StatCard
                    title="Events Held"
                    value={stats?.totalEvents === '-' ? '50+' : (stats?.totalEvents ?? 0)}
                    icon={Calendar} color="bg-green-500" trend="0"
                />
                <StatCard
                    title="Registrations"
                    value={stats?.totalRegistrations ?? (stats?.totalStudents === '-' ? '200+' : 0)}
                    icon={ArrowUpRight} color="bg-purple-500" trend="0"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold dark:text-white">Participation Analytics</h3>
                        <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm px-3 py-2 outline-none dark:text-gray-200">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 dark:text-white">Upcoming Events</h3>
                    <div className="space-y-6">
                        {stats?.upcomingEvents?.length > 0 ? (
                            stats.upcomingEvents.map((event) => (
                                <div key={event?.id || Math.random()} className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex flex-col items-center justify-center text-primary-600 font-bold">
                                        <span className="text-xs">{event?.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : '---'}</span>
                                        <span>{event?.date ? new Date(event.date).getDate() : '--'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">{event?.title || 'Unknown Event'}</h4>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Clock size={14} /> {event?.time || '--:--'} • {event?.location || 'TBA'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm text-center py-8">No upcoming events</p>
                        )}
                    </div>
                    <button className="w-full mt-8 flex items-center justify-center gap-2 text-primary-600 font-semibold text-sm hover:underline">
                        View All Events <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
