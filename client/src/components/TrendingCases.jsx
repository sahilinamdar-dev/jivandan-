import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Clock, Users, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShareButton from './ShareButton';
import { Activity, MapPin } from 'lucide-react';

const TrendingCases = ({ cases }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'Critical': return 'bg-red-50 text-red-600 border-red-100';
            case 'High': return 'bg-orange-50 text-orange-600 border-orange-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    return (
        <div className="py-16 md:py-24 bg-slate-50">
            <div className="container-responsive">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold mb-4">
                        <TrendingUp className="w-4 h-4" />
                        <span>URGENT CASES</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                        Trending <span className="premium-text">Verified Cases</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                        Every case you see here is hospital-verified, ensuring your help reaches the right hands.
                    </p>
                </motion.div>

                {/* Cases Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {cases.map((caseItem, index) => {
                        const progress = (caseItem.amountRaised / caseItem.amountRequired) * 100;

                        return (
                            <motion.div
                                key={caseItem.id}
                                variants={cardVariants}
                                whileHover={{ y: -8 }}
                                className="group relative"
                            >
                                <div className="glass-card rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col glow-border">
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={caseItem.image}
                                            alt={caseItem.patientName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                        {/* Verified Badge */}
                                        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                            <span className="text-xs font-black text-slate-900">VERIFIED</span>
                                        </div>

                                        {/* Urgency Badge */}
                                        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-black border ${getUrgencyColor(caseItem.urgency)}`}>
                                            {caseItem.urgency}
                                        </div>

                                        {/* Days Left */}
                                        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full">
                                            <Clock className="w-4 h-4 text-indigo-600" />
                                            <span className="text-xs font-black text-slate-900">{caseItem.daysLeft} Days Left</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-grow flex flex-col">
                                        <h3 className="text-xl font-black text-slate-900 mb-2">
                                            {caseItem.patientName}, {caseItem.age}
                                        </h3>
                                        <p className="text-indigo-600 font-bold text-sm mb-3">
                                            {caseItem.disease}
                                        </p>
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
                                            {caseItem.story}
                                        </p>

                                        {/* Hospital */}
                                        <p className="text-xs text-slate-500 font-medium mb-4">
                                            📍 {caseItem.hospital}
                                        </p>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold text-slate-700">
                                                    ₹{(caseItem.amountRaised / 1000).toFixed(0)}K raised
                                                </span>
                                                <span className="text-sm font-bold text-slate-500">
                                                    of ₹{(caseItem.amountRequired / 1000).toFixed(0)}K
                                                </span>
                                            </div>
                                            <div className="progress-bar h-3">
                                                <motion.div
                                                    className="progress-fill"
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${progress}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: index * 0.2 }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-slate-500 font-medium">
                                                    {progress.toFixed(0)}% funded
                                                </span>
                                                <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                                                    <Users className="w-3 h-3" />
                                                    <span>{caseItem.supporters} supporters</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="flex gap-3 mt-4">
                                            <Link
                                                to={`/cases/${caseItem.id}`}
                                                className="flex-1 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all flex items-center justify-center group/btn text-sm md:text-base"
                                            >
                                                <Heart className="w-4 h-4 mr-2" fill="currentColor" />
                                                <span>Donate Now</span>
                                            </Link>
                                            <ShareButton caseData={caseItem} variant="icon" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link
                        to="/cases"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 font-black rounded-2xl hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all group"
                    >
                        <span>View All Cases</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default TrendingCases;
