import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, AlertTriangle, BarChart3, Building2, CheckCircle, Package, Receipt, Filter, ArrowUpRight, Search, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { api } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [statsData, setStatsData] = useState(null);
    const [fraudSignals, setFraudSignals] = useState([]);
    const [escrowActivity, setEscrowActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, individual, ngo

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch Stats
                const statsRes = await api.get('/admin/stats');
                setStatsData(statsRes.data.stats);
                setFraudSignals(statsRes.data.fraudSignals);
                setEscrowActivity(statsRes.data.escrowActivity);

                // Fetch Transactions
                const url = filter === 'all' ? '/admin/transactions' : `/admin/transactions?supporterType=${filter}`;
                const transRes = await api.get(url);
                setTransactions(transRes.data.transactions);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [filter, api]);

    const stats = [
        { label: 'Pending Requests', value: statsData?.pendingHospitals || '0', icon: Clock, color: 'text-amber-600' },
        { label: 'Total Verified', value: statsData?.approvedHospitals || '0', icon: CheckCircle, color: 'text-emerald-600' },
        { label: 'Fraud Alerts', value: statsData?.fraudAlerts || '0', icon: AlertTriangle, color: 'text-rose-600' },
        { label: 'Total Donations', value: `₹${(statsData?.totalDonations || 0).toLocaleString()}`, icon: BarChart3, color: 'text-blue-600' },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">System Authority</h1>
                    <p className="text-slate-600 font-medium">Platform-wide governance and fraud monitoring.</p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-[32px] border border-slate-100 flex items-center space-x-4 shadow-xl shadow-slate-200/50"
                        >
                            <div className={`p-4 rounded-2xl bg-white shadow-sm ${stat.color}`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                            </div>
                        </motion.div>
                    ))}
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
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.supporterUser?.supporterType === 'ngo' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                                }`}>
                                                                {t.supporterUser?.supporterType || 'INDIVIDUAL'}
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
                                {fraudSignals.length > 0 ? (
                                    fraudSignals.map((alert, i) => (
                                        <div key={i} className="p-6 rounded-[24px] bg-rose-50 border border-rose-100 flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <span className="text-sm font-black text-rose-600 uppercase tracking-widest">{alert.severity}</span>
                                                    <span className="w-1 h-1 bg-rose-300 rounded-full" />
                                                    <span className="text-xs font-bold text-rose-400 italic">#{alert.signal}</span>
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-900 mb-1">{alert.title}</h4>
                                                <p className="text-sm text-slate-600 font-medium">{alert.desc}</p>
                                            </div>
                                            <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:scale-105 transition-all">Review Case</button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 text-center font-bold text-slate-400 italic bg-slate-50 rounded-[24px]">
                                        No active fraud signals detected. System health optimal.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Escrow Status Panel */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-[40px] p-8 border border-white bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 premium-gradient" />
                            <Package className="w-12 h-12 text-indigo-400 mb-6 opacity-30 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                            <h3 className="text-xl font-bold mb-4 tracking-tight">Escrow Activity</h3>
                            <div className="space-y-6">
                                {escrowActivity.length > 0 ? (
                                    escrowActivity.map((esc, i) => (
                                        <div key={i} className="flex justify-between items-center pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                            <div>
                                                <div className="text-sm font-bold text-slate-100">{esc.hospital}</div>
                                                <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{esc.status}</div>
                                            </div>
                                            <div className="text-lg font-black">{esc.amount}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm font-bold text-slate-400 italic">No active escrow transfers.</div>
                                )}
                            </div>
                            <button className="w-full mt-10 py-4 rounded-2xl bg-white/10 border border-white/20 font-bold hover:bg-white/20 transition-all uppercase tracking-widest text-xs">
                                View Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

