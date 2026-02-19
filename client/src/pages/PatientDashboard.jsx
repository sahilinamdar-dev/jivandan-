import React from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Clock, CheckCircle2, AlertCircle, TrendingUp, ShieldCheck, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { api } = useAuth();
    const [medicalCase, setMedicalCase] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCase = async () => {
            try {
                const res = await api.get('/cases/my-case');
                setMedicalCase(res.data);
            } catch (err) {
                console.error("Error fetching case:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCase();
    }, [api]);

    const STATUS_ORDER = ['CASE_SUBMITTED', 'CASE_VERIFIED', 'HOSPITAL_ASSIGNED', 'HOSPITAL_APPROVED', 'CASE_LIVE', 'TREATMENT_MILESTONE'];

    const getStatusLabel = (status) => {
        return status.replace(/_/g, ' ').split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    };

    const stats = [
        { label: 'Total Needed', value: medicalCase ? `₹${medicalCase.amountRequired?.toLocaleString()}` : '₹0', icon: TrendingUp, color: 'text-indigo-600' },
        { label: 'Raised So Far', value: medicalCase ? `₹${medicalCase.amountCollected?.toLocaleString()}` : '₹0', icon: CheckCircle2, color: 'text-emerald-600' },
        { label: 'Status', value: medicalCase ? getStatusLabel(medicalCase.status) : 'No Case', icon: ShieldCheck, color: 'text-blue-600' },
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

                {/* ⚠️ HIGH AMOUNT WARNING BANNER */}
                {medicalCase?.fraudStatus === 'REVIEW' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 p-6 rounded-[2rem] bg-red-50 border border-red-100 flex items-start gap-5"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-red-900 mb-1">Fee Verification Underway</h3>
                            <p className="text-red-700 font-medium leading-relaxed">
                                Our system has flagged that your requested amount (₹{medicalCase.amountRequired?.toLocaleString()}) is significantly higher than the standard treatment cost for {medicalCase.disease}. Your case is currently being verified by our medical desk for accuracy.
                            </p>
                        </div>
                    </motion.div>
                )}

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
                                {loading ? (
                                    <div className="flex justify-center p-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    </div>
                                ) : !medicalCase ? (
                                    <div className="text-center p-12 bg-slate-50 rounded-3xl">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold">You haven't submitted a medical case yet.</p>
                                    </div>
                                ) : (
                                    STATUS_ORDER.map((status, i) => {
                                        const currentIndex = STATUS_ORDER.indexOf(medicalCase.status);
                                        const isCompleted = i < currentIndex;
                                        const isCurrent = i === currentIndex;
                                        const isFuture = i > currentIndex;

                                        // For milestones, we might have multiple entries
                                        const timelineEntries = medicalCase.timeline.filter(t => t.status === status);
                                        const lastEntry = timelineEntries[timelineEntries.length - 1];

                                        if (status === 'TREATMENT_MILESTONE' && timelineEntries.length > 0) {
                                            return timelineEntries.map((entry, mIndex) => (
                                                <TimelineItem
                                                    key={`milestone-${mIndex}`}
                                                    status={`Milestone: ${entry.remarks || 'Treatment Update'}`}
                                                    date={new Date(entry.updatedAt).toLocaleDateString()}
                                                    remarks={entry.remarks}
                                                    type={isCurrent ? 'current' : 'completed'}
                                                    isLast={mIndex === timelineEntries.length - 1 && i === STATUS_ORDER.length - 1}
                                                />
                                            ));
                                        }

                                        return (
                                            <TimelineItem
                                                key={status}
                                                status={getStatusLabel(status)}
                                                date={lastEntry ? new Date(lastEntry.updatedAt).toLocaleDateString() : (isFuture ? 'Pending' : '')}
                                                remarks={lastEntry?.remarks}
                                                type={isCompleted ? 'completed' : isCurrent ? 'current' : 'future'}
                                                isLast={i === STATUS_ORDER.length - 1}
                                            />
                                        );
                                    })
                                )}
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


const TimelineItem = ({ status, date, remarks, type, isLast }) => {
    const colors = {
        completed: 'bg-emerald-500 text-white',
        current: 'bg-blue-600 text-white ring-4 ring-blue-100',
        future: 'bg-slate-100 text-slate-400'
    };

    return (
        <div className="flex space-x-6 relative">
            {!isLast && <div className="absolute left-4 top-8 bottom-[-32px] w-0.5 bg-slate-100" />}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${colors[type]}`}>
                {type === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                    type === 'current' ? <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" /> :
                        <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" />}
            </div>
            <div>
                <div className="flex flex-col mb-1">
                    <span className={`font-bold ${type === 'future' ? 'text-slate-400' : 'text-slate-900'}`}>
                        {status}
                    </span>
                    {date && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {date}
                        </span>
                    )}
                </div>
                {remarks && <p className="text-slate-500 text-sm mt-2">{remarks}</p>}
            </div>
        </div>
    );
};

export default PatientDashboard;
