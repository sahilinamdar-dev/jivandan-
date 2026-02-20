import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldAlert, ArrowLeft, Calendar, User, Syringe, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FlaggedCases = () => {
    const navigate = useNavigate();
    const { api } = useAuth();
    const [flaggedCases, setFlaggedCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlaggedCases = async () => {
            try {
                const res = await api.get('/admin/cases/flagged');
                if (res.data.success) {
                    setFlaggedCases(res.data.cases);
                }
            } catch (err) {
                console.error('Error fetching flagged cases:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlaggedCases();
    }, [api]);

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <button
                            onClick={() => navigate('/admin-dashboard')}
                            className="flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Authority
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
                            <ShieldAlert className="w-10 h-10 mr-4 text-rose-600" />
                            Flagged Medical Cases
                        </h1>
                        <p className="text-slate-600 font-medium mt-2">Cases flagged for suspicious requested amounts or unknown diseases.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Auditing platform data...</p>
                    </div>
                ) : flaggedCases.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8">
                        <AnimatePresence>
                            {flaggedCases.map((c, i) => (
                                <motion.div
                                    key={c._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-xl overflow-hidden relative group hover:border-rose-200 transition-colors"
                                >
                                    <div className="absolute top-0 right-0 p-6">
                                        <div className="bg-rose-100 text-rose-600 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Needs Verification
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-4 gap-8 items-center">
                                        <div className="md:col-span-2">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                    <Syringe className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 leading-tight">{c.title}</h3>
                                                    <p className="text-slate-500 font-bold text-sm tracking-wide">{c.disease}</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed">{c.description}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                                                    <Banknote className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requested</p>
                                                    <p className="text-sm font-black text-slate-900">₹{c.amountRequired?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                                                    <p className="text-sm font-black text-slate-900">{c.patientId?.name || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center md:items-end justify-center space-y-4">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fraud Status</p>
                                                <p className="text-rose-600 font-black text-sm">{c.fraudStatus}</p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/cases/${c._id}`)}
                                                className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center"
                                            >
                                                Audit File
                                            </button>
                                        </div>
                                    </div>

                                    {/* Flags Badge Area */}
                                    <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap gap-3">
                                        {c.flags?.map((flag, fi) => (
                                            <span key={fi} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {flag.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                        {c.fraudReason && (
                                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest italic">
                                                {c.fraudReason}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="p-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                        <ShieldAlert className="w-16 h-16 text-slate-100 mb-6" />
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2">No High-Risk Cases Detected</h3>
                        <p className="text-slate-400 max-w-sm">All currently submitted cases are within standard cost parameters and match existing medical profiles.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlaggedCases;
