import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Heart, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, setAuthUser, api } = useAuth();
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
      } else if (data.user.role === 'supporter') {
        navigate('/supporter-dashboard', { replace: true });
      } else {
        navigate('/patient-dashboard', { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message;

      if (message && message.includes('pending approval')) {
        setError(
          'Your hospital account is currently pending administrator approval. We will notify you once verified.'
        );
      } else {
        setError(message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50/50 to-white -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/20 mb-5"
          >
            <Heart className="text-white w-7 h-7" fill="currentColor" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-base md:text-lg text-slate-600">Secure access to <span className="text-teal-700 font-semibold">JIVANDAN</span></p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-white/50 ring-1 ring-slate-100">
          <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
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
                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2"
              >
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-600"
                />
                <label htmlFor="remember" className="ml-2 block text-slate-600 font-medium">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-base shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
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

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (cred) => {
                  try {
                    setLoading(true);
                    const res = await api.post(
                      '/auth/google',
                      { token: cred.credential }
                    );

                    const data = res.data;

                    if (data.token) {
                      // Store token using the same key as AuthContext expects
                      localStorage.setItem('trustaid_auth', 'true');
                      localStorage.setItem('token', data.token);
                      // Update axios default header for future requests
                      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                      // Immediately update AuthContext with user data
                      setAuthUser(data.user);
                    }

                    // Redirect based on role
                    if (data.user.role === 'admin') {
                      navigate('/admin-dashboard', { replace: true });
                    } else if (data.user.role === 'hospital') {
                      navigate('/hospital-dashboard', { replace: true });
                    } else if (data.user.role === 'supporter') {
                      navigate('/supporter-dashboard', { replace: true });
                    } else {
                      navigate('/patient-dashboard', { replace: true });
                    }
                  } catch (err) {
                    console.error("Google login error:", err);
                    setError(err.response?.data?.message || 'Google login failed');
                    setLoading(false);
                  }
                }}
                onError={() => setError('Google login failed')}
              />
            </div>
          </form>
        </div>

        {/* Quick Access */}
        <div className="mt-8 flex flex-col items-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Developer Access
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setEmail('admin@jivandan.com');
                setPassword('admin123');
              }}
              className="px-4 py-2 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold hover:bg-teal-100 hover:border-teal-200 transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Account</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <p className="mt-8 text-center text-sm text-slate-600 font-medium">
          New to Jivandan?{' '}
          <Link
            to="/register"
            className="text-teal-600 hover:text-teal-700 font-bold hover:underline transition-colors"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;