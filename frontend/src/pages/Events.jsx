import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, Ticket, Filter, Search, Award, Download, X, CheckCircle } from 'lucide-react';
import { API_URL } from '../utils/apiConfig';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [rsvpSuccess, setRsvpSuccess] = useState(null); // Stores registration info for modal

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/events`);
                setEvents(data);
            } catch (err) {
                console.error('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [API_URL]);

    const handleRSVP = async (eventId) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/events/${eventId}/register`);
            setRsvpSuccess(data);
            // Optional: alert('Registered successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to register');
        }
    };

    const filteredEvents = events.filter(e => {
        if (filter === 'All') return true;
        return e.status?.toLowerCase() === filter.toLowerCase();
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white">Upcoming Events</h1>
                    <p className="text-gray-500 mt-1">Book your spot in the most exciting college events</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-1.5 rounded-xl shadow-sm">
                    {['All', 'Upcoming', 'Ongoing', 'Completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === f ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredEvents.map(event => (
                        <div key={event.id} className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all overflow-hidden group">
                            <div className="relative h-48 overflow-hidden">
                                {event.banner ? (
                                    <img src={`${API_URL}/${event.banner}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600" />
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center min-w-[50px]">
                                    <span className="text-[10px] font-bold text-primary-600 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-lg font-black text-gray-900 leading-tight">{new Date(event.date).getDate()}</span>
                                </div>
                                <div className="absolute bottom-4 right-4 animate-pulse">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/30 backdrop-blur-md ${event.status === 'Upcoming' ? 'bg-blue-500/80 text-white' : event.status === 'Ongoing' ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                                        <Users size={12} className="text-primary-600" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{event.club?.name}</span>
                                </div>
                                <h3 className="text-xl font-bold dark:text-white line-clamp-1">{event.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm line-clamp-2">{event.description}</p>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        <MapPin size={18} className="text-primary-500" />
                                        <span>{event.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        <Ticket size={18} className="text-primary-500" />
                                        <span>{event.registrationLimit || '∞'} Capacity</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 flex items-center gap-3">
                                    <button
                                        onClick={() => handleRSVP(event.id)}
                                        className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-2xl shadow-lg hover:bg-primary-700 active:scale-95 transition-all text-sm"
                                    >
                                        RSVP Now
                                    </button>
                                    {event.status === 'Completed' && (
                                        <button
                                            onClick={async () => {
                                                window.open(`${API_URL}/api/attendance/certificate/${event.id}`, '_blank');
                                            }}
                                            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-2xl shadow-lg hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Award size={18} /> Cert.
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                    <Calendar size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold dark:text-white">No {filter} events found</h3>
                    <p className="text-gray-500 mt-2">Check back later for new updates!</p>
                </div>
            )}
            {/* RSVP Success Modal */}
            {rsvpSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center relative">
                        <button
                            onClick={() => setRsvpSuccess(null)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-400" />
                        </button>

                        <div className="mb-6 inline-flex p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                            <CheckCircle size={40} />
                        </div>

                        <h2 className="text-2xl font-black dark:text-white mb-2">You're In! 🎉</h2>
                        <p className="text-gray-500 mb-8">Your registration is confirmed. Show this QR at the venue.</p>

                        <div className="bg-white p-4 rounded-3xl inline-block shadow-inner mb-8 border-4 border-primary-50">
                            {rsvpSuccess.qrCode ? (
                                <img src={rsvpSuccess.qrCode} alt="Registration QR" className="w-48 h-48" />
                            ) : (
                                <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">QR Loading...</div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = rsvpSuccess.qrCode;
                                    link.download = `ticket-${rsvpSuccess.id}.png`;
                                    link.click();
                                }}
                                className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={20} /> Download Ticket
                            </button>
                            <button
                                onClick={() => setRsvpSuccess(null)}
                                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
