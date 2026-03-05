import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Users,
    Calendar,
    Plus,
    Settings,
    UserCheck,
    UserMinus,
    LayoutDashboard,
    CheckCircle,
    Clock,
    MapPin,
    Megaphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/apiConfig';

const ClubManagement = () => {
    const { user } = useAuth();
    const [club, setClub] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bannerFile, setBannerFile] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        registrationLimit: ''
    });
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        type: 'Club'
    });

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/clubs/my-club`);
                setClub(data);
                const eventsRes = await axios.get(`${API_URL}/api/clubs/${data.id}/events`);
                setEvents(eventsRes.data);
            } catch (err) {
                console.error('Failed to fetch club data');
            } finally {
                setLoading(false);
            }
        };
        fetchClubData();
    }, [API_URL]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!club?.id) return alert('Club data not loaded');

        const formData = new FormData();
        formData.append('title', newEvent.title);
        formData.append('description', newEvent.description);
        formData.append('date', newEvent.date);
        formData.append('time', newEvent.time);
        formData.append('venue', newEvent.venue);
        formData.append('registrationLimit', newEvent.registrationLimit || 0);
        formData.append('clubId', club.id);

        if (bannerFile) {
            formData.append('banner', bannerFile);
        }

        try {
            await axios.post(`${API_URL}/api/events`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            alert('Event created successfully!');
            setShowEventModal(false);
            setNewEvent({ title: '', description: '', date: '', time: '', venue: '', registrationLimit: '' });
            setBannerFile(null);
            // Refresh events
            const eventsRes = await axios.get(`${API_URL}/api/clubs/${club.id}/events`);
            setEvents(eventsRes.data);
        } catch (err) {
            console.error('Error details:', err.response?.data);
            alert(err.response?.data?.message || 'Failed to create event');
        }
    };

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/announcements`, {
                ...newAnnouncement,
                clubId: user.club
            }, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            alert('Announcement broadcasted successfully!');
            setShowAnnouncementModal(false);
            setNewAnnouncement({ title: '', content: '', type: 'Club' });
        } catch (err) {
            alert('Failed to broadcast announcement');
        }
    };

    if (!user?.club) return (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
            <LayoutDashboard className="mx-auto text-gray-200 mb-6" size={64} />
            <h2 className="text-2xl font-black dark:text-white mb-2">No Club Associated</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't been assigned as an admin for any club yet. Apply for a new club or wait for your application to be approved.</p>
            <button
                onClick={() => window.location.href = '/app/clubs'}
                className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
            >
                View Clubs
            </button>
        </div>
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Synchronizing management console...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                        {club?.name[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">{club?.name || 'Loading...'}</h1>
                        <p className="text-gray-500 font-medium">{club?.category} • Official Management Console</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="p-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-primary-600 transition-all font-bold text-xs"
                    >
                        REFRESH STATE
                    </button>
                    <button
                        onClick={() => setShowEventModal(true)}
                        className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all flex items-center gap-2 group text-sm"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Create Event
                    </button>
                    <button
                        onClick={() => setShowAnnouncementModal(true)}
                        className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center gap-2 group text-sm"
                    >
                        <Megaphone size={18} className="group-hover:scale-110 transition-transform" /> Broadcast
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatItem icon={Users} label="Active Members" value={club?.members?.length} color="blue" />
                <StatItem icon={Calendar} label="Hosted Events" value={events.length} color="purple" />
                <StatItem icon={Clock} label="Upcoming" value={events.filter(e => e.status?.toLowerCase() === 'upcoming').length} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Events Management */}
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="text-xl font-black dark:text-white flex items-center gap-2">
                            <Calendar className="text-primary-600" size={24} /> Club Events
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {events.map(event => (
                            <div key={event.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                <div>
                                    <h3 className="font-bold dark:text-white">{event.title}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock size={12} /> {new Date(event.date).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <MapPin size={12} /> {event.venue}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${event.status?.toLowerCase() === 'upcoming' ? 'bg-blue-100 text-blue-600' : event.status?.toLowerCase() === 'ongoing' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Member Management */}
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="text-xl font-black dark:text-white flex items-center gap-2">
                            <Users className="text-indigo-600" size={24} /> Community Members
                        </h2>
                    </div>
                    <div className="p-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-center border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-400 text-sm mb-4">Export member data for administrative use</p>
                            <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-2 rounded-xl font-bold border border-gray-200 dark:border-gray-700 shadow-sm">
                                Download Member CSV
                            </button>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {club?.members?.map(member => (
                            <div key={member.id} className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600">
                                        {member.name?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold dark:text-white">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.email}</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors">
                                    <UserMinus size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <form onSubmit={handleCreateEvent} className="p-8 space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-black dark:text-white">Host New Event</h2>
                                <button type="button" onClick={() => setShowEventModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <Input label="Event Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                                    <textarea
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white text-sm min-h-[100px]"
                                        value={newEvent.description}
                                        onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                        required
                                        placeholder="Describe your event..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input type="date" label="Date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} required />
                                    <Input type="time" label="Time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} required />
                                </div>
                                <Input label="Venue" value={newEvent.venue} onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })} required />
                                <Input type="number" label="Registration Limit" value={newEvent.registrationLimit} onChange={e => setNewEvent({ ...newEvent, registrationLimit: e.target.value })} placeholder="0 for unlimited" />
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Event Banner Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setBannerFile(e.target.files[0])}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white text-sm"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-primary-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-600/20 hover:bg-primary-700 active:scale-[0.98] transition-all">
                                Create & Publish Event
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Announcement Modal */}
            {showAnnouncementModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <form onSubmit={handleCreateAnnouncement} className="p-8 space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-black dark:text-white flex items-center gap-2">
                                    <Megaphone className="text-orange-500" /> Broadcast Update
                                </h2>
                                <button type="button" onClick={() => setShowAnnouncementModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Announcement Title"
                                    placeholder="e.g. Important Change in Workshop Venue"
                                    value={newAnnouncement.title}
                                    onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    required
                                />
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Content</label>
                                    <textarea
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white text-sm min-h-[150px]"
                                        placeholder="Write your message here..."
                                        value={newAnnouncement.content}
                                        onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all">
                                Broadcast to Members
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatItem = ({ icon: Icon, label, value, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };
    return (
        <div className={`p-6 rounded-3xl ${colors[color]} border-2 border-white dark:border-gray-800 flex items-center gap-4`}>
            <div className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-sm">
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">{label}</p>
                <p className="text-2xl font-black">{value || 0}</p>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
        <input
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white text-sm"
            {...props}
        />
    </div>
);

export default ClubManagement;
