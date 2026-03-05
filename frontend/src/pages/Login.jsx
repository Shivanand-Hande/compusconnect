import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/app/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                            <LogIn className="text-primary-600" size={32} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
                        <p className="text-primary-100 mt-2">Login to your CampusConnect account</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-200 group-focus-within:text-white transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-light"
                                    placeholder="name@college.edu"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-200 group-focus-within:text-white transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-light"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-primary-600 font-bold py-3 rounded-xl shadow-lg hover:bg-primary-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-primary-100 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-white font-bold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
