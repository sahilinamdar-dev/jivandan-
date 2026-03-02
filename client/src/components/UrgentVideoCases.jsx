import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, ShieldCheck, ArrowRight, Play, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UrgentVideoCases = ({ video1, video2 }) => {
    const { api } = useAuth();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUrgentCases = async () => {
            try {
                // Fetch all live cases
                const res = await api.get('/cases');
                const allCases = res.data;

                // Specifically look for Aarav and Ishita to map them to videos
                const aarav = allCases.find(c => c.patientName === 'Aarav');
                const ishita = allCases.find(c => c.patientName === 'Ishita');

                const urgentList = [];
                if (aarav) urgentList.push({ ...aarav, video: video1 });
                if (ishita) urgentList.push({ ...ishita, video: video2 });

                setCases(urgentList);
            } catch (err) {
                console.error("Failed to fetch urgent cases:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUrgentCases();
    }, [api, video1, video2]);

    if (loading) {
        return (
            <div className="py-20 flex justify-center items-center bg-blue-50/30 min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-blue-600 font-bold animate-pulse">Loading Urgent Appeals...</p>
                </div>
            </div>
        );
    }

    if (cases.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-blue-50/30 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-bold mb-4">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span>URGENT APPEALS • TIME IS RUNNING OUT</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                        Be Their <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Miracle Today</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        These children are fighting for their lives. Your contribution, no matter how small, brings them one step closer to a healthy future.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {cases.map((child, idx) => (
                        <motion.div
                            key={child._id}
                            initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            className="group"
                        >
                            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white hover:shadow-blue-200/50 transition-all duration-500 h-full flex flex-col">
                                {/* Video Wrapper */}
                                <div className="relative aspect-video bg-black overflow-hidden group/video">
                                    <video
                                        src={child.video}
                                        className="w-full h-full object-cover opacity-90"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Video Badge */}
                                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-xl">
                                        <Play className="w-3 h-3 fill-current" />
                                        LIVE APPEAL
                                    </div>

                                    {/* Hospital Verified */}
                                    <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/90 text-sm font-medium">
                                        <ShieldCheck className="w-4 h-4 text-green-400" />
                                        Hospital Verified Case
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 md:p-10 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 mb-1">
                                                {child.patientName}, {child.age} Years
                                            </h3>
                                            <p className="text-blue-600 font-bold text-lg">
                                                {child.disease}
                                            </p>
                                        </div>
                                        <div className="bg-slate-100 rounded-2xl px-4 py-2 text-center">
                                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Urgency</span>
                                            <span className="text-blue-700 font-black">Critical</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 leading-relaxed mb-8 text-lg italic flex-grow">
                                        "{child.description}"
                                    </p>

                                    {/* Progress */}
                                    <div className="mb-10">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-slate-900 font-black text-xl">
                                                ₹{child.amountCollected.toLocaleString()}
                                            </span>
                                            <span className="text-slate-500 font-bold">
                                                Raised of ₹{child.amountRequired.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${(child.amountCollected / child.amountRequired) * 100}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>{Math.round((child.amountCollected / child.amountRequired) * 100)}% Reached</span>
                                            <span>Required Immediately</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/cases/${child._id}`}
                                        className="w-full group/btn px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg"
                                    >
                                        <Heart className="w-6 h-6 fill-current group-hover/btn:animate-ping" />
                                        <span>Save {child.patientName}'s Life</span>
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UrgentVideoCases;
