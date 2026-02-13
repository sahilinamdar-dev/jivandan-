import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Heart, Search, TrendingUp,
    ArrowUpRight, Filter, Zap, X, Loader2, MapPin
} from 'lucide-react';

const DonorDashboard = () => {
    const { api } = useAuth();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCase, setSelectedCase] = useState(null);
    const [donationAmount, setDonationAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. Fetch Real Data from Backend
    useEffect(() => {
        const fetchLiveCases = async () => {
            try {
                // Adjust this URL to your actual backend endpoint
                const res = await api.get('/cases?status=live');

                // Safety check to prevent .map() errors
                if (res.data && Array.isArray(res.data)) {
                    setCases(res.data);
                } else if (res.data.cases && Array.isArray(res.data.cases)) {
                    setCases(res.data.cases);
                } else {
                    setCases([]);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setCases([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveCases();
    }, []);

    // 2. Razorpay Payment Logic
    const handlePayment = async () => {
        if (!donationAmount || isProcessing) return;
        setIsProcessing(true);

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = async () => {
            try {
                // Optional: Create order on backend first for security
                // const order = await axios.post('/api/payment/order', { amount: donationAmount });

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your actual key
                    amount: Number(donationAmount) * 100, // Paise
                    currency: "INR",
                    name: "LifeCare Foundation",
                    description: `Donation for ${selectedCase?.patientName || 'Medical Case'}`,
                    handler: async function (response) {
                        // After success, update the 'amountCollected' in DB
                        try {
                            await api.patch(`/cases/${selectedCase?._id}/donate`, {
                                paymentId: response.razorpay_payment_id,
                                amount: Number(donationAmount)
                            });
                            alert("Thank you for your generous donation!");
                            window.location.reload(); // Refresh to show updated progress
                        } catch (e) {
                            console.error("DB Update Failed", e);
                        }
                    },
                    prefill: { name: "Supporter", email: "supporter@example.com" },
                    theme: { color: "#4F46E5" },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } catch (err) {
                console.error("Razorpay init error", err);
            } finally {
                setIsProcessing(false);
            }
        };
        document.body.appendChild(script);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Support a Life</h1>
                        <p className="text-slate-600 font-medium text-lg">Every donation helps a verified medical case reach its goal.</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
                            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-tight">Verified Cases</div>
                            <div className="text-xl font-black text-slate-900">{cases.length} Live</div>
                        </div>
                    </div>
                </div>

                <div className="grid xl:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
                            <Zap className="w-8 h-8 text-indigo-400 mb-4" />
                            <h4 className="font-bold mb-2">Transparency</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                Funds are held in escrow and released directly to the hospital upon verification of treatment milestones.
                            </p>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="xl:col-span-3">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Loading Real Cases...</span>
                            </div>
                        ) : cases.length === 0 ? (
                            <div className="bg-white rounded-[32px] p-20 text-center border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No verified cases found at this moment.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {cases.map((item) => {
                                    // Progress Calculation based on your Schema
                                    const progress = Math.min((item.amountCollected / item.amountRequired) * 100, 100);

                                    return (
                                        <motion.div
                                            key={item._id}
                                            whileHover={{ y: -5 }}
                                            className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center">
                                                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                                                </div>
                                                <div className="flex items-center text-slate-400 text-[10px] font-bold">
                                                    <MapPin className="w-3 h-3 mr-1" /> {item.city}, {item.state}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-slate-900 mb-1">{item.patientName}</h3>
                                            <p className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-3">{item.disease}</p>
                                            <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">{item.description}</p>

                                            <div className="mt-auto">
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="font-bold text-slate-900">₹{item.amountCollected.toLocaleString()}</span>
                                                    <span className="text-slate-400 font-bold tracking-tighter">GOAL: ₹{item.amountRequired.toLocaleString()}</span>
                                                </div>

                                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-6">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        className="h-full bg-indigo-500 rounded-full"
                                                    />
                                                </div>

                                                <button
                                                    onClick={() => setSelectedCase(item)}
                                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
                                                >
                                                    Donate Now <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Razorpay Amount Selection Modal */}
            <AnimatePresence>
                {selectedCase && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative"
                        >
                            <button onClick={() => setSelectedCase(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-black text-slate-900 mb-1 leading-tight">Support {selectedCase?.patientName}</h2>
                            <p className="text-slate-500 text-sm mb-8">Enter the amount you wish to donate.</p>

                            <div className="space-y-4">
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">₹</span>
                                    <input
                                        type="number"
                                        value={donationAmount}
                                        onChange={(e) => setDonationAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl text-2xl font-black outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={!donationAmount || isProcessing}
                                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : 'Complete Donation'}
                                </button>
                                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Secure Payment via Razorpay</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DonorDashboard;