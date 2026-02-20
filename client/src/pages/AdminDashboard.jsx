import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, AlertTriangle, BarChart3, Building2, CheckCircle, Package, Receipt, Filter, ArrowUpRight, Search, LayoutDashboard, Activity } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { api } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeHospitals: '0',
        totalVerified: '0',
        fraudAlerts: '0',
        totalDonations: '₹0'
    });
    const [filter, setFilter] = useState('all'); // all, individual, ngo

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Stats
                const statsRes = await api.get('/admin/stats');
                if (statsRes.data.success) {
                    const s = statsRes.data.stats;
                    setStats({
                        activeHospitals: s.activeHospitals.toString(),
                        totalVerified: s.verifiedCases.toString(),
                        fraudAlerts: s.fraudAlerts.toString(),
                        totalDonations: `₹${s.totalDonations.toLocaleString()}`
                    });
                }

                // 2. Fetch Transactions
                const url = filter === 'all' ? '/admin/transactions' : `/admin/transactions?supporterType=${filter}`;
                const res = await api.get(url);
                setTransactions(res.data.transactions);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [filter, api]);

    const statsDisplay = [
        { label: 'Active Hospitals', value: stats.activeHospitals, icon: Building2, color: 'text-indigo-600' },
        { label: 'Total Verified', value: stats.totalVerified, icon: CheckCircle, color: 'text-emerald-600' },
        { label: 'Fraud Alerts', value: stats.fraudAlerts, icon: AlertTriangle, color: 'text-rose-600' },
        { label: 'Total Donations', value: stats.totalDonations, icon: BarChart3, color: 'text-blue-600' },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-14 relative">
                    <div className="absolute -left-10 top-0 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full" />
                    <h1 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter">System Authority</h1>
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Registry Governance & Fraud Monitor</p>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
                    {statsDisplay.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-7 rounded-[32px] border border-slate-100 flex items-center space-x-5 shadow-2xl shadow-slate-200/40 relative overflow-hidden group"
                        >
                            {stat.label === 'Fraud Alerts' && parseInt(stat.value) > 0 && (
                                <div className="absolute top-4 right-4 flex h-3 w-3 z-20">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-20 h-20 bg-slate-50 rounded-full -mr-10 -mb-10 group-hover:scale-150 transition-transform duration-700" />
                            <div className={`p-4 rounded-2xl bg-slate-50 shadow-inner relative z-10 ${stat.color}`}>
                                <stat.icon className="w-7 h-7" />

                            </div>
                            <div className="relative z-10">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* 🚀 QUICK NAVIGATION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        whileHover={{ y: -10 }}
                        onClick={() => navigate('/admin/stats')}
                        className="p-8 rounded-[40px] bg-slate-900 text-white shadow-2xl shadow-indigo-200 cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/40 transition-colors" />
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
                                <BarChart3 className="w-8 h-8 text-indigo-400" />
                            </div>
                            <ArrowUpRight className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-black mb-2 leading-tight">Platform Insights</h3>
                        <p className="text-slate-400 font-medium">Deep dive into funding trends, donor statistics, and hospital performance metrics.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        onClick={() => navigate('/admin/cases/flagged')}
                        className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-xl cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-rose-500/10 transition-colors" />
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                                <ShieldCheck className="w-8 h-8 text-rose-600" />
                            </div>
                            <ArrowUpRight className="w-6 h-6 text-slate-300 group-hover:text-rose-600 transition-colors" />
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-slate-900 leading-tight">Fraud Audit Desk</h3>
                        <p className="text-slate-500 font-medium">Review medical cases flagged for high requested amounts or suspicious patterns.</p>
                        {parseInt(stats.fraudAlerts) > 0 && (
                            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest">
                                {stats.fraudAlerts} Active Alerts Requiring Review
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Monitoring Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Transactions Section */}
                        <div className="glass-card rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-xl overflow-hidden relative">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center mb-1">
                                        <Receipt className="w-7 h-7 mr-3 text-indigo-600" />
                                        Support Transactions
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium tracking-wide">Monitor real-time donations and filters.</p>
                                </div>
                                <div className="flex p-1.5 bg-slate-100 rounded-2xl self-start">
                                    {['all', 'individual', 'ngo'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setFilter(t)}
                                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Supporter</th>
                                            <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Type</th>
                                            <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2 text-right">Amount</th>
                                            <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2 truncate max-w-[150px]">Case</th>
                                            <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <AnimatePresence mode="popLayout">
                                            {transactions.length > 0 ? (
                                                transactions.map((t, i) => (
                                                    <motion.tr
                                                        key={t._id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="group hover:bg-slate-50/50 transition-colors"
                                                    >
                                                        <td className="py-5 px-2">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-indigo-600 uppercase">
                                                                    {t.supporterUser?.name?.charAt(0) || '?'}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-black text-slate-900">{t.supporterUser?.name || 'Anonymous'}</div>
                                                                    <div className="text-xs font-bold text-slate-400">{t.supporterUser?.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-2">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.donor?.donorType === 'ngo' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                                }`}>
                                                                {t.donor?.donorType || 'INDIVIDUAL'}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-2 text-right">
                                                            <div className="text-sm font-black text-indigo-600 tracking-tight">₹{t.amount.toLocaleString()}</div>
                                                        </td>
                                                        <td className="py-5 px-2">
                                                            <div className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{t.medicalCase?.title || 'Unknown Case'}</div>
                                                        </td>
                                                        <td className="py-5 px-2">
                                                            <div className="text-xs font-bold text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</div>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="py-10 text-center font-bold text-slate-400 italic">
                                                        {loading ? 'Crunching data...' : 'No transactions found for this segment.'}
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="glass-card rounded-[40px] p-10 border border-slate-100 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
                                <AlertTriangle className="w-7 h-7 mr-3 text-rose-600" />
                                Fraud Signals (Priority High)
                            </h2>

                            <div className="space-y-6">
                                {stats.fraudAlerts !== '0' ? (
                                    /* This would map real alerts if we had an endpoint */
                                    <div className="text-center py-10 font-bold text-slate-400 italic">
                                        Reviewing system signals...
                                    </div>
                                ) : (
                                    <div className="p-10 rounded-[32px] border-2 border-dashed border-rose-100 flex flex-col items-center justify-center text-center">
                                        <AlertTriangle className="w-10 h-10 text-rose-200 mb-4" />
                                        <p className="text-rose-400 font-black uppercase tracking-widest text-xs">No Fraud Signals Detected</p>
                                        <p className="text-slate-400 text-sm mt-1">System is running within normal parameters.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Escrow Status Panel & Analytics Quick Link */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Improved Analytics Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-[40px] bg-indigo-600 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group cursor-pointer"
                            onClick={() => navigate('/admin/analytics')}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />
                            <div className="relative z-10">
                                <Activity className="w-10 h-10 text-indigo-100 mb-6" />
                                <h3 className="text-2xl font-black mb-2 tracking-tight">System Insights</h3>
                                <p className="text-indigo-100/80 text-sm font-bold mb-8">View deep-dive analytics and performance trends.</p>
                                <div className="flex items-center text-xs font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                    Explore Analytics <ArrowUpRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Updated Escrow Panel */}
                        <div className="glass-card rounded-[40px] p-8 border border-white bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 premium-gradient" />
                            <Package className="w-10 h-10 text-indigo-400 mb-6 opacity-30" />
                            <h3 className="text-xl font-black mb-4 tracking-tight">Escrow Activity</h3>
                            <div className="space-y-6">
                                <div className="py-12 text-center bg-white/5 border border-white/10 rounded-[2rem]">
                                    <ShieldCheck className="w-10 h-10 text-white/10 mx-auto mb-4" />
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No Active Escrows</p>
                                    <p className="text-white/30 text-xs mt-1 px-4">Funds are currently distributed directly to verified causes.</p>
                                </div>
                            </div>
                        </div>

                        {/* System Health Status */}
                        <div className="p-6 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Security Core</h4>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Status: Operational</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

