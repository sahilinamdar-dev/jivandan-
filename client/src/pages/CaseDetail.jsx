import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Calendar, Activity, Building2, ChevronRight, FileText, Heart, ShieldQuestion, Loader2 } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import { useAuth } from '../context/AuthContext';

const CaseDetail = () => {
    const { id } = useParams();
    const { api, user } = useAuth();
    const [activeTab, setActiveTab] = useState('story');
    const [c, setCase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState(500);
    const [donating, setDonating] = useState(false);

    useEffect(() => {
        const fetchCase = async () => {
            try {
                const res = await api.get(`/cases/${id}`);
                setCase(res.data);
            } catch (err) {
                console.error('Error fetching case:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCase();
    }, [id, api]);

    const handleDonate = async () => {
        if (!user) {
            alert('Please login to donate');
            return;
        }

        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setDonating(true);
        try {
            const donationAmount = parseInt(amount);
            if (isNaN(donationAmount) || donationAmount <= 0) {
                alert('Please enter a valid amount');
                setDonating(false);
                return;
            }

            // 1. Create order on backend
            const { data: order } = await api.post('/donations/order', {
                amount: donationAmount,
                caseId: id
            });

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "TrustAid",
                description: `Donation for ${c.title}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        // 3. Verify payment on backend
                        const verifyRes = await api.post('/donations/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            alert('Thank you for your donation!');
                            // Refresh case data
                            const updatedRes = await api.get(`/cases/${id}`);
                            setCase(updatedRes.data);
                        }
                    } catch (err) {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#4f46e5",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert('Failed to initiate donation');
        } finally {
            setDonating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
    );

    if (!c) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-800">
            Case not found
        </div>
    );

    const progress = (c.amountCollected / c.amountRequired) * 100;

    return (
        <div className="min-h-screen pt-32 pb-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm font-medium text-slate-500 mb-8">
                    <Link to="/cases" className="hover:text-indigo-600 transition-colors">Cases</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 line-clamp-1">{c.title}</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card rounded-[32px] overflow-hidden mb-8"
                        >
                            <div className="h-96 relative overflow-hidden bg-slate-200">
                                <img src="https://images.unsplash.com/photo-1516549221184-ef395c07421f?q=80&w=1200&auto=format&fit=crop" alt={c.title} className="w-full h-full object-cover" />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <span className="text-sm font-bold text-slate-800 tracking-tight">Hospital Verified Case</span>
                                </div>
                            </div>

                            <div className="p-8 md:p-12">
                                <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold mb-6">
                                    {c.disease}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                                    {c.title}
                                </h1>

                                <div className="flex flex-wrap gap-6 mb-12 py-6 border-y border-slate-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-slate-100 rounded-lg"><Building2 className="w-5 h-5 text-slate-600" /></div>
                                        <div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hospital</div>
                                            <div className="font-bold text-slate-900">{c.hospitalId?.name || 'Vetted Hospital'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-slate-100 rounded-lg"><Calendar className="w-5 h-5 text-slate-600" /></div>
                                        <div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Posted On</div>
                                            <div className="font-bold text-slate-900">{new Date(c.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-slate-100 rounded-lg"><Activity className="w-5 h-5 text-slate-600" /></div>
                                        <div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</div>
                                            <div className="font-bold text-emerald-600 capitalize">{c.status}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex space-x-8 border-b border-slate-200 mb-8">
                                    {['story', 'reports', 'updates'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="prose prose-slate max-w-none">
                                    {activeTab === 'story' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-slate-600 leading-relaxed font-normal whitespace-pre-wrap">
                                            {c.description}
                                        </motion.div>
                                    )}
                                    {activeTab === 'reports' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center mb-6">
                                                <ShieldCheck className="w-10 h-10 text-emerald-500 mr-4" />
                                                <p className="text-emerald-800 text-sm font-medium">{c.verificationRemarks || 'Medical records verified by TrustAid clinical team.'}</p>
                                            </div>
                                            {c.documents?.map((doc, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 transition-colors">
                                                    <div className="flex items-center">
                                                        <FileText className="w-6 h-6 text-slate-400 mr-3" />
                                                        <span className="font-bold text-slate-700">{doc.name}</span>
                                                    </div>
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-colors">View Document</a>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Donation Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-32"
                        >
                            <div className="glass-card rounded-[32px] p-8 md:p-10 border border-indigo-100/30">
                                <div className="mb-8">
                                    <div className="text-4xl font-black text-slate-900 mb-1">₹{c.amountCollected.toLocaleString()}</div>
                                    <div className="text-slate-500 font-medium tracking-wide">raised of ₹{c.amountRequired.toLocaleString()} goal</div>
                                </div>

                                <div className="mb-10">
                                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-3">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(progress, 100)}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full premium-gradient rounded-full"
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-indigo-600 italic">
                                        <span>{Math.round(progress)}% Complete</span>
                                        <span>Helping {c.patientId?.name || 'Patient'}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Amount to Donate</label>
                                        <div className="relative group">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400 group-focus-within:text-indigo-600 transition-colors">₹</span>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-2xl font-black text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {[100, 500, 1000, 2000].map((quick) => (
                                            <button
                                                key={quick}
                                                onClick={() => setAmount(quick)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${amount == quick ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                            >
                                                ₹{quick}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleDonate}
                                            disabled={donating}
                                            className="flex-1 py-5 rounded-[24px] premium-gradient text-white font-black text-xl shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            {donating ? (
                                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                                            ) : (
                                                <Heart className="w-6 h-6 text-white group-hover:scale-125 transition-transform" />
                                            )}
                                            <span>{donating ? 'Processing...' : 'Donate Now'}</span>
                                        </button>
                                        <ShareButton
                                            caseData={{
                                                id: id,
                                                patientName: c.patientId?.name,
                                                disease: c.disease,
                                                goal: c.amountRequired
                                            }}
                                        />
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center">
                                        <ShieldQuestion className="w-5 h-5 text-indigo-400 mr-3" />
                                        <p className="text-xs text-slate-500 font-medium">Funds are held in <span className="text-indigo-600 font-bold italic underline">platform escrow</span> and released only for treatment milestones.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseDetail;

