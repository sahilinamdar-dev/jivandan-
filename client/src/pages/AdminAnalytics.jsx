import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, Users, PieChart, ArrowLeft,
    Calendar, Download, Filter, Loader2, ArrowUpRight,
    ArrowDownRight, IndianRupee, Activity, Building2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminAnalytics = () => {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/admin/analytics');
            setAnalytics(res.data.analytics);
        } catch (err) {
            setError('Failed to load analytics data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synthesizing platform data...</p>
                </div>
            </div>
        );
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <Link to="/admin-dashboard" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-4 transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Authority
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Analytics</h1>
                        <p className="text-slate-500 font-medium">Deep insights into growth, impact, and operations.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center">
                            <Download className="w-4 h-4 mr-2" /> Export Report
                        </button>
                    </div>
                </div>

                {/* Growth Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-10">
                    {/* Donation Trends */}
                    <div className="glass-card rounded-[2.5rem] p-8 border border-white shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Donation Volume</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Last 6 Months</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>

                        <div className="h-64 flex items-end gap-3 px-2">
                            {analytics.donationTrends.map((data, i) => {
                                const maxVal = Math.max(...analytics.donationTrends.map(d => d.totalAmount), 1);
                                const height = (data.totalAmount / maxVal) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg font-black whitespace-nowrap z-10">
                                            ₹{data.totalAmount.toLocaleString()}
                                        </div>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: i * 0.1, duration: 1 }}
                                            className="w-full bg-indigo-500 rounded-t-xl group-hover:bg-indigo-600 transition-colors relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" />
                                        </motion.div>
                                        <span className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">
                                            {monthNames[data._id.month - 1]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Hospital Onboarding */}
                    <div className="glass-card rounded-[2.5rem] p-8 border border-white shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Hospital Growth</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Institutions Added</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>

                        <div className="h-64 flex items-end gap-3 px-2">
                            {analytics.hospitalTrends.map((data, i) => {
                                const maxVal = Math.max(...analytics.hospitalTrends.map(d => d.count), 1);
                                const height = (data.count / maxVal) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg font-black whitespace-nowrap z-10">
                                            {data.count} Added
                                        </div>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: i * 0.1, duration: 1 }}
                                            className="w-full bg-emerald-500 rounded-t-xl group-hover:bg-emerald-600 transition-colors relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" />
                                        </motion.div>
                                        <span className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">
                                            {monthNames[data._id.month - 1]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sub-Analytics */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Donor Type Breakdown */}
                    <div className="glass-card rounded-[2.5rem] p-8 border border-white shadow-xl shadow-slate-200/50">
                        <h3 className="text-lg font-black text-slate-900 mb-6">Support Distribution</h3>
                        <div className="space-y-6">
                            {analytics.donationBreakdown.map((item, i) => {
                                const totalFunds = analytics.donationBreakdown.reduce((acc, curr) => acc + curr.total, 0);
                                const percentage = (item.total / totalFunds) * 100;
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                                            <span className="text-slate-500">{item._id || 'Individual'}</span>
                                            <span className="text-indigo-600">{percentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className={`h-full ${i % 2 === 0 ? 'bg-indigo-500' : 'bg-indigo-300'}`}
                                            />
                                        </div>
                                        <div className="mt-2 text-[10px] font-bold text-slate-400">
                                            ₹{item.total.toLocaleString()} from {item.count} transactions
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Case Breakdown */}
                    <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-8 border border-white shadow-xl shadow-slate-200/50">
                        <h3 className="text-lg font-black text-slate-900 mb-8">Medical Case Lifecycle</h3>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {analytics.caseBreakdown.map((item, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-colors">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item._id}</div>
                                    <div className="text-3xl font-black text-slate-900">{item.count}</div>
                                    <div className="mt-4 flex items-center text-[10px] font-bold text-slate-500">
                                        <Activity className="w-3 h-3 mr-1 text-indigo-500" /> System Total
                                    </div>
                                </div>
                            ))}
                            {analytics.caseBreakdown.length === 0 && (
                                <div className="col-span-4 py-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <Activity className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                    <p className="text-slate-400 font-bold text-xs uppercase">No case activity tracked</p>
                                </div>
                            )}
                        </div>

                        {/* Summary Insight */}
                        <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between overflow-hidden relative group">
                            <div className="absolute right-0 top-0 h-full w-32 bg-indigo-600 blur-[80px] opacity-20 -mr-16" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Impact Insight</p>
                                <h4 className="text-lg font-bold leading-tight">Total support volume has increased by <span className="text-emerald-400">12%</span> compared to last month.</h4>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 ml-6 relative z-10 transition-transform group-hover:scale-110">
                                <ArrowUpRight className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
