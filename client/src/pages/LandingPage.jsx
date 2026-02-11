import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShieldCheck, Users, Activity, Clock, CheckCircle, Sparkles, TrendingUp, Building2, FileText } from 'lucide-react';
import SuccessStorySlider from '../components/SuccessStorySlider';
import TrendingCases from '../components/TrendingCases';
import { trendingCases, successStories, trustStats, howItWorksSteps } from '../data/dummyData';

const LandingPage = () => {
    return (
        <main className="overflow-hidden">
            {/* Emotional Hero Section with Family Imagery */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }} />
                </div>

                {/* Floating Hearts Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{ y: '100vh', x: `${Math.random() * 100}%`, opacity: 0 }}
                            animate={{
                                y: '-20vh',
                                opacity: [0, 0.6, 0],
                                scale: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 8 + Math.random() * 4,
                                repeat: Infinity,
                                delay: i * 2,
                                ease: "easeInOut"
                            }}
                        >
                            <Heart className="w-8 h-8 text-red-400/30" fill="currentColor" />
                        </motion.div>
                    ))}
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Emotional Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            {/* Trust Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-bold mb-6"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                <span>100% Hospital Verified • Trusted by 72 Lakh+ Indians</span>
                            </motion.div>

                            {/* Emotional Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight"
                            >
                                Every Family Deserves{' '}
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    A Fighting Chance
                                </span>
                            </motion.h1>

                            {/* Emotional Subtext */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed"
                            >
                                When medical bills threaten to break families apart, we bring hope together.
                                <span className="font-bold text-slate-900"> Hospital-verified cases. Real people. Real impact.</span>
                            </motion.p>

                            {/* Impact Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="grid grid-cols-3 gap-4 mb-8"
                            >
                                {[
                                    { count: '3.2L+', label: 'Lives Saved', icon: Heart, color: 'text-red-500' },
                                    { count: '72L+', label: 'Supporters', icon: Users, color: 'text-blue-500' },
                                    { count: '₹450Cr+', label: 'Raised', icon: TrendingUp, color: 'text-green-500' }
                                ].map((stat, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
                                        <stat.icon className={`w-6 h-6 ${stat.color} mb-2 mx-auto lg:mx-0`} />
                                        <p className="text-2xl font-black text-slate-900">{stat.count}</p>
                                        <p className="text-xs text-slate-600 font-medium">{stat.label}</p>
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <Link
                                    to="/cases"
                                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
                                >
                                    <Heart className="w-5 h-5" fill="currentColor" />
                                    <span>Help a Family Today</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/how-it-works"
                                    className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-900 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Activity className="w-5 h-5" />
                                    <span>How It Works</span>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Right: Emotional Family Image Collage */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative">
                                {/* Main Image - Family with Child */}
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                    <img
                                        src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=700&fit=crop"
                                        alt="Family with child in hospital"
                                        className="w-full h-[500px] object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                    {/* Floating Success Badge */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1, type: "spring" }}
                                        className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-bold text-sm">Treatment Successful!</span>
                                    </motion.div>
                                </div>

                                {/* Small Image 1 - Doctor with Patient */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute -bottom-6 -left-6 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop"
                                        alt="Doctor caring for patient"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                {/* Small Image 2 - Happy Recovery */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 }}
                                    className="absolute -top-6 -right-6 w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop"
                                        alt="Patient recovery celebration"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                {/* Pulse Animation */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        <span className="text-xs font-medium">Scroll to see impact</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center p-2"
                        >
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Success Stories Section */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-bold mb-4">
                            <Heart className="w-4 h-4" fill="currentColor" />
                            <span>REAL STORIES • REAL HOPE</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Families <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Reunited with Hope</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Every donation creates a ripple of hope. See how your support transforms lives.
                        </p>
                    </motion.div>
                    <SuccessStorySlider stories={successStories} />
                </div>
            </section>

            {/* Trending Cases */}
            <TrendingCases cases={trendingCases} />

            {/* How It Works - Hospital Verification Process */}
            <section className="py-16 md:py-24 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50" />
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-bold mb-4">
                            <ShieldCheck className="w-4 h-4" />
                            <span>VERIFIED PROCESS</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            How <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">JIVANDAN</span> Protects You
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Every rupee is tracked. Every case is verified. Every family is protected.
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto">
                        <div className="relative">
                            {/* Connecting Line */}
                            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 -translate-y-1/2" />

                            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
                                {[
                                    { icon: FileText, title: "Patient Submits Case", desc: "Family uploads medical documents and hospital bills", color: "from-blue-500 to-blue-600" },
                                    { icon: Building2, title: "Hospital Verifies", desc: "Registered hospital confirms diagnosis and treatment plan", color: "from-indigo-500 to-indigo-600" },
                                    { icon: Heart, title: "Supporters Donate", desc: "Funds held in escrow, released only for verified treatment", color: "from-purple-500 to-purple-600" }
                                ].map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 }}
                                        className="relative"
                                    >
                                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all relative z-10">
                                            {/* Step Number */}
                                            <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                                                <span className="text-2xl font-black text-white">{index + 1}</span>
                                            </div>

                                            {/* Icon */}
                                            <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                                <step.icon className="w-8 h-8 text-white" />
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-xl font-black text-slate-900 mb-3">
                                                {step.title}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust & Transparency */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            Built on <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Trust & Transparency</span>
                        </h2>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Every feature designed to eliminate fraud and maximize impact
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, title: "Hospital Verified", desc: "Every case verified by registered hospitals", color: "from-green-400 to-emerald-400" },
                            { icon: Activity, title: "Secure Payments", desc: "Razorpay-powered encrypted transactions", color: "from-blue-400 to-cyan-400" },
                            { icon: Users, title: "Platform Escrow", desc: "Funds released only after milestones", color: "from-indigo-400 to-purple-400" },
                            { icon: Clock, title: "Real-time Updates", desc: "Email notifications via Brevo", color: "from-pink-400 to-rose-400" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 hover:bg-white/15 hover:scale-105 transition-all"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                                    <item.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                                <p className="text-blue-100 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Emotional CTA Banner */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 5 L50 95 M5 50 L95 50' stroke='white' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            Be the Reason a Family Smiles Again
                        </h2>
                        <p className="text-xl md:text-2xl text-blue-100 mb-10">
                            Your verified donation can save a life. Join 72 lakh+ supporters making a real difference.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="group px-10 py-5 bg-white text-blue-600 font-black rounded-2xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                            >
                                <Heart className="w-6 h-6" fill="currentColor" />
                                <span>Start Helping Now</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/cases"
                                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-black rounded-2xl hover:bg-white/20 transition-all"
                            >
                                Browse Cases
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default LandingPage;