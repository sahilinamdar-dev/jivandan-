import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Heart, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { forgotPassword, verifyOTP, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await forgotPassword(email);
            setStep(2);
            setMessage('OTP sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await verifyOTP(email, otp);
            setStep(3);
            setMessage('OTP verified. Please set your new password.');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        setError('');
        try {
            await resetPassword(email, otp, newPassword);
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full mx-auto"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex p-3 rounded-2xl premium-gradient shadow-xl mb-4">
                        <KeyRound className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Reset Password</h2>
                    <p className="mt-2 text-slate-600">Securely recover your JIVANDAN account</p>
                </div>

                <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onSubmit={handleSendOTP}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                                <button
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl premium-gradient text-white font-bold text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center group"
                                >
                                    {loading ? 'Sending...' : 'Send OTP'}
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onSubmit={handleVerifyOTP}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all tracking-[0.5em] text-center font-bold"
                                            placeholder="000000"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 text-center">Enter the 6-digit code sent to {email}</p>
                                </div>
                                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                                <button
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl premium-gradient text-white font-bold text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center group"
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-slate-500 text-sm font-medium hover:text-indigo-600 transition-colors"
                                >
                                    Change Email
                                </button>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form
                                key="step3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onSubmit={handleResetPassword}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="password"
                                            required
                                            minLength="6"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                                {message && <p className="text-emerald-500 text-sm font-medium">{message}</p>}
                                <button
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl premium-gradient text-white font-bold text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center group"
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <p className="mt-8 text-center text-slate-600 font-medium">
                    Remembered your password?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline font-bold">Back to Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
