import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8"
                >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-600">Trust-Based Medical Aid</span>
                    <span className="w-1 h-1 bg-indigo-300 rounded-full" />
                    <span className="text-sm font-medium text-indigo-500">Hackathon Demo</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight"
                >
                    Restoring Trust in <br />
                    <span className="text-gradient">Medical Crowdfunding.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Join a platform where every case is verified by hospitals, ensuring your donations go exactly where they're needed most. Secured with platform escrow.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    <Link to="/cases" className="group px-8 py-4 rounded-full premium-gradient text-white font-bold flex items-center shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all">
                        Support a Patient
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/register" className="px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all">
                        Join as Hospital
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {[
                        { icon: Users, label: '10k+', desc: 'Lives Impacted' },
                        { icon: ShieldCheck, label: '100%', desc: 'Verified Cases' },
                        { icon: Heart, label: '₹2Cr+', desc: 'Funds Raised' },
                        { icon: ShieldCheck, label: 'Secure', desc: 'Trust Escrow' },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 glass-card rounded-3xl text-center">
                            <stat.icon className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-slate-900">{stat.label}</div>
                            <div className="text-sm text-slate-500">{stat.desc}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
