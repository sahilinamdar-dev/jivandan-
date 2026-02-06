import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle, XCircle, Search, Activity, User } from 'lucide-react';

const HospitalDashboard = () => {
    // Dummy cases for hospital review
    const pendingCases = [
        { _id: '1', patientName: 'Aryan Sharma', disease: 'Congenital Heart Disease', amount: '₹5,00,000', date: '20 Oct 2023' },
        { _id: '4', patientName: 'Suresh Raina', disease: 'Chronic Kidney Disease', amount: '₹12,00,000', date: '25 Oct 2023' },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Hospital Panel</h1>
                    <p className="text-slate-600 font-medium">Review medical cases assigned to your institution.</p>
                </div>

                <div className="grid xl:grid-cols-4 gap-8">
                    {/* Sidebar Stats */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="glass-card p-6 rounded-3xl border border-slate-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="text-lg font-bold text-slate-800 tracking-tight">Overview</div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                    <span className="text-sm font-semibold text-slate-500">Pending Review</span>
                                    <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-lg text-xs font-black">02</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                    <span className="text-sm font-semibold text-slate-500">Verified Today</span>
                                    <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-xs font-black">05</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-900 rounded-3xl text-white">
                            <ShieldCheck className="w-8 h-8 text-indigo-400 mb-4" />
                            <h4 className="font-bold mb-2">Verification Policy</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                Ensure all medical reports match the patient identity. Fraudulent verification can lead to hospital blacklisting.
                            </p>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="xl:col-span-3">
                        <div className="glass-card rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="p-8 border-b border-slate-100 bg-white/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-2xl font-bold text-slate-900">Pending Verification</h2>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input type="text" placeholder="Search case or patient..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Patient</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Condition</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Goal</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pendingCases.map((c) => (
                                            <motion.tr key={c._id} hover={{ backgroundColor: 'rgb(248 250 252)' }} className="group transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold uppercase tracking-widest text-xs">
                                                            {c.patientName.split(' ')[0][0]}{c.patientName.split(' ')[1][0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{c.patientName}</div>
                                                            <div className="text-xs font-semibold text-slate-400 font-heading">Applied {c.date}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold w-fit">
                                                        {c.disease}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="font-black text-slate-900">{c.amount}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="Verify Case">
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="Reject Case">
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm" title="View Reports">
                                                            <FileText className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {pendingCases.length === 0 && (
                                <div className="p-12 text-center text-slate-400 font-bold tracking-widest uppercase text-xs">
                                    No pending cases for review
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
