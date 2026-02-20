import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity, ArrowLeft, Download, Layers, Users, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminStats = () => {
    const navigate = useNavigate();
    const { api } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (err) {
                console.error('Error fetching admin stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [api]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4 mx-auto"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aggregating System Intelligence...</p>
                </div>
            </div>
        );
    }

    const cards = [
        { label: 'Total Medical Cases', value: stats?.totalCases || 0, icon: Layers, color: 'bg-blue-600' },
        { label: 'Verified & Live', value: stats?.verifiedCases || 0, icon: Activity, color: 'bg-emerald-600' },
        { label: 'Pending Hospitals', value: stats?.pendingHospitals || 0, icon: Building2, color: 'bg-orange-600' },
        { label: 'Active Supporters', value: '1,248', icon: Users, color: 'bg-indigo-600' },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/admin-dashboard')}
                            className="flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Return to Dashboard
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
                            <BarChart3 className="w-10 h-10 mr-4 text-indigo-600" />
                            Platform Analytics
                        </h1>
                        <p className="text-slate-600 font-medium mt-2">Quantitative overview of Jivandan's operational performance.</p>
                    </div>
                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                </div>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 rounded-[40px] bg-white border border-slate-100 shadow-xl overflow-hidden relative group"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 ${card.color} opacity-5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:opacity-10 transition-opacity`} />
                            <div className={`w-12 h-12 rounded-2xl ${card.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-100`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                            <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Funding Trends */}
                    <div className="glass-card p-10 rounded-[40px] bg-white border border-slate-100 shadow-xl">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 flex items-center">
                                    <TrendingUp className="w-6 h-6 mr-3 text-emerald-600" />
                                    Donation Flux
                                </h3>
                                <p className="text-sm text-slate-500 font-medium">Monthly aggregate of total support received.</p>
                            </div>
                        </div>
                        <div className="h-64 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 flex items-center justify-center">
                            <p className="text-slate-400 font-bold italic">Visualization Engine Loading...</p>
                        </div>
                    </div>

                    {/* Fraud Distribution */}
                    <div className="glass-card p-10 rounded-[40px] bg-slate-900 text-white border border-slate-800 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black flex items-center">
                                    <PieChart className="w-6 h-6 mr-3 text-indigo-400" />
                                    Fraud Spectrum
                                </h3>
                                <p className="text-sm text-slate-400 font-medium">Ratio of flagged vs safe submissions.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Flagged</p>
                                    <p className="text-2xl font-black text-rose-500">{stats?.fraudAlerts || 0}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Alert Rate</p>
                                    <p className="text-2xl font-black text-white">
                                        {stats?.totalCases ? ((stats.fraudAlerts / stats.totalCases) * 100).toFixed(1) : 0}%
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                                <div
                                    className="h-full bg-rose-500"
                                    style={{ width: `${stats?.totalCases ? (stats.fraudAlerts / stats.totalCases) * 100 : 0}%` }}
                                />
                                <div className="h-full bg-emerald-500 flex-1" />
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-rose-500">Suspicious</span>
                                <span className="text-emerald-500">Safe Baseline</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
