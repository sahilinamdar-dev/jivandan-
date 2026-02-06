import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, ShieldCheck, CreditCard, ArrowRight, Activity, Users, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const StepCard = ({ icon: Icon, title, description, step }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: step * 0.1 }}
        className="glass-card p-8 rounded-3xl shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all"
    >
        <div className="absolute top-0 right-0 p-6 text-6xl font-black text-indigo-50/50 -z-10 group-hover:text-indigo-100 transition-colors">
            {step}
        </div>
        <div className="p-4 rounded-2xl premium-gradient w-fit mb-6 shadow-lg shadow-indigo-100">
            <Icon className="text-white w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium">
            {description}
        </p>
    </motion.div>
);

const HowItWorks = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8"
                >
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-bold text-green-700 uppercase tracking-wider">How JIVANDAN Works</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
                    Transparent, Verified, <br />
                    <span className="premium-text">Direct Medical Aid.</span>
                </h1>

                <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
                    We bridge the gap between patients in need and compassionate supporters through a
                    rigorous verification process and direct hospital payments.
                </p>
            </div>

            {/* Process Steps */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StepCard
                        step={1}
                        icon={Search}
                        title="Case Discovery"
                        description="Browse verified medical cases that resonate with you. Every case is documented with detailed medical records."
                    />
                    <StepCard
                        step={2}
                        icon={ShieldCheck}
                        title="Verification"
                        description="Hospitals verify the case urgency and financial requirements, ensuring every rupee goes to a genuine medical need."
                    />
                    <StepCard
                        step={3}
                        icon={Heart}
                        title="Direct Support"
                        description="Make contributions direct to the hospital's dedicated account for the patient's treatment."
                    />
                    <StepCard
                        step={4}
                        icon={Activity}
                        title="Live Tracking"
                        description="Track the treatment progress and receive updates from the patient and hospital in real-time."
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="premium-gradient rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to make an impact?</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-indigo-600 font-black text-lg hover:scale-105 transition-all shadow-xl flex items-center justify-center group">
                                Start Verification
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/cases" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-indigo-500/30 text-white border border-white/20 font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center">
                                View Cases
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HowItWorks;
