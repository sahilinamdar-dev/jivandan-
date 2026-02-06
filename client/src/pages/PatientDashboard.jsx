import React from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Clock, CheckCircle2, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
    const navigate = useNavigate();

    // Dummy patient data
    const stats = [
        { label: 'Total Needed', value: '₹5,00,000', icon: TrendingUp, color: 'text-indigo-600' },
        { label: 'Raised So Far', value: '₹1,25,000', icon: CheckCircle2, color: 'text-emerald-600' },
        { label: 'Status', value: 'Verified', icon: ShieldCheck, color: 'text-blue-600' },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Patient Dashboard</h1>
                        <p className="text-slate-600 font-medium">Manage your medical case and track donations.</p>
                    </div>
                    <button
                        onClick={() => navigate('/submit-case')}
                        className="mt-6 md:mt-0 px-8 py-4 rounded-2xl premium-gradient text-white font-bold shadow-xl shadow-indigo-100 flex items-center space-x-2 animate-pulse hover:animate-none"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Submit New Case</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 rounded-[32px] border border-slate-100"
                        >
                            <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</div>
                            <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Case Timeline */}
                    <div className="lg:col-span-2">
                        <div className="glass-card rounded-[32px] p-8 md:p-10 border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                                <Clock className="w-6 h-6 mr-3 text-indigo-600" />
                                Case Progress Timeline
                            </h2>
                            <div className="space-y-8">
                                {[
                                    { status: 'Case Submitted', date: 'Oct 20, 2023', remarks: 'Medical reports successfully uploaded.', done: true },
                                    { status: 'Hospital Verified', date: 'Oct 22, 2023', remarks: 'Verified by Apollo Hospitals cardiology dept.', done: true },
                                    { status: 'Live for Donation', date: 'Oct 24, 2023', remarks: 'Your case is now visible to supporters.', done: true },
                                    { status: 'Treatment Milestone 1', date: 'Pending', remarks: 'Awaiting 50% fund collection.', done: false },
                                ].map((step, i) => (
                                    <div key={i} className="flex space-x-6 relative">
                                        {i !== 3 && <div className="absolute left-4 top-8 bottom-[-32px] w-0.5 bg-slate-100" />}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${step.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {step.done ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <span className={`font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.status}</span>
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{step.date}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm">{step.remarks}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Alerts/Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="p-8 bg-indigo-600 rounded-[32px] text-white shadow-2xl shadow-indigo-200">
                            <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
                            <h3 className="text-xl font-bold mb-4 tracking-tight">Important Notice</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">
                                Funds will never be directly transferred to your bank account. They move directly into the hospital's verified account via <strong>Platform Escrow</strong>.
                            </p>
                            <button className="w-full py-3 bg-white/20 backdrop-blur-md rounded-xl font-bold text-sm hover:bg-white/30 transition-all border border-white/10 uppercase tracking-widest">
                                Read Escrow Rules
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal removed - using /submit-case instead */}
        </div>
    );
};


export default PatientDashboard;
