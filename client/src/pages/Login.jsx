import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Heart, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await login(email, password);
            // Redirect based on role
            if (data.user.role === 'admin') {
                navigate('/admin-dashboard', { replace: true });
            } else if (data.user.role === 'hospital') {
                navigate('/hospital-dashboard', { replace: true });
            } else {
                navigate('/patient-dashboard', { replace: true });
            }
        } catch (err) {
            const message = err.response?.data?.message;
            if (message && message.includes('pending approval')) {
                setError('Your hospital account is currently pending administrator approval. We will notify you once verified.');
            } else {
                setError(message || 'Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-12 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-8 md:mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 mb-4"
                    >
                        <Heart className="text-white w-8 h-8" fill="currentColor" />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Welcome Back</h2>
                    <p className="text-base md:text-lg text-slate-600">Secure access to your JIVANDAN account</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 md:p-10 shadow-2xl border border-blue-100">
                    <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-3 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                />
                                <label htmlFor="remember" className="ml-2 block text-slate-600 font-medium">
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base md:text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing In...
                                </span>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Quick Access */}
                <div className="mt-6 md:mt-8 flex flex-col items-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 md:mb-4">Quick Access for Developers</p>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        <button
                            onClick={() => {
                                setEmail('inamdarsahil708@gmail.com');
                                setPassword('admin786');
                            }}
                            className="px-3 md:px-4 py-2 rounded-xl bg-blue-50 border-2 border-blue-200 text-blue-700 text-xs md:text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
                        >
                            <ShieldAlert className="w-4 h-4" />
                            <span className="hidden sm:inline">Admin Account</span>
                            <span className="sm:hidden">Admin</span>
                        </button>
                    </div>
                </div>

                {/* Register Link */}
                <p className="mt-6 md:mt-8 text-center text-sm md:text-base text-slate-600 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors">
                        Start verification
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
