import React from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Calendar,
    ShieldCheck,
    Zap,
    Layout,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-primary-100 selection:text-primary-600">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">C</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">CampusConnect</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
                    <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
                    <a href="#community" className="hover:text-primary-600 transition-colors">Community</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-primary-600">Sign In</Link>
                    <Link to="/register" className="bg-white text-gray-900 border border-gray-200 px-5 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 animate-bounce">
                        <Zap size={14} /> The Future of College Engagement
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                        Centralized Hub for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">College Events & Clubs</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Manage your clubs, discover exciting events, track attendance with smart QR codes, and celebrate achievements with automated certificates.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2 group">
                            Start Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                            Live Demo
                        </Link>
                    </div>

                    <div className="mt-20 relative px-4">
                        <div className="absolute inset-0 bg-primary-500/10 blur-[120px] rounded-full"></div>
                        <img
                            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200"
                            alt="Dashboard Preview"
                            className="relative rounded-3xl shadow-2xl border border-gray-200 mx-auto max-w-5xl"
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything you need to scale</h2>
                        <p className="text-gray-500">Powerful tools designed for students and administrators</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Layout}
                            title="Club Management"
                            desc="Create, manage and scale your student organizations with approval workflows and analytics."
                        />
                        <FeatureCard
                            icon={Calendar}
                            title="Event RSVP"
                            desc="Seamless registration system for events with capacity limits and automated waitlists."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Smart Attendance"
                            desc="Zero-fraud attendance tracking using unique QR codes for every student and event."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">C</span>
                        </div>
                        <span className="font-bold">CampusConnect</span>
                    </div>
                    <p className="text-sm text-gray-500">© 2026 CampusConnect. All rights reserved.</p>
                    <div className="flex gap-6 text-sm font-semibold text-gray-500">
                        <a href="#" className="hover:text-primary-600">Privacy</a>
                        <a href="#" className="hover:text-primary-600">Terms</a>
                        <a href="#" className="hover:text-primary-600">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1">
        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
