import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CaseCard = ({ medicalCase }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all border border-slate-100 group"
        >
            <div className="relative h-48 overflow-hidden bg-slate-200">
                <img src={medicalCase.image || "https://images.unsplash.com/photo-1516549221184-ef395c07421f?q=80&w=600&auto=format&fit=crop"} alt={medicalCase.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800">Hospital Verified</span>
                </div>
            </div>
            <div className="p-6">
                <div className="text-sm font-semibold text-indigo-600 mb-2">{medicalCase.disease}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{medicalCase.title}</h3>

                <div className="mb-6">
                    <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-slate-500">Raised: ₹{medicalCase.amountCollected}</span>
                        <span className="text-slate-900">Goal: ₹{medicalCase.amountRequired}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full premium-gradient transition-all duration-1000"
                            style={{ width: `${Math.min((medicalCase.amountCollected / medicalCase.amountRequired) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                <Link to={`/cases/${medicalCase._id}`} className="w-full py-3 rounded-2xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all group">
                    View Case
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

const CaseListing = () => {
    // Dummy cases for demo
    const dummyCases = [
        { _id: '1', title: 'Urgent Heart Surgery for 5-Year-Old Aryan', disease: 'Congenital Heart Disease', amountRequired: 500000, amountCollected: 125000 },
        { _id: '2', title: 'Support Meera\'s Fight Against Cancer', disease: 'Leukemia', amountRequired: 800000, amountCollected: 450000 },
        { _id: '3', title: 'Emergency Transplant Required', disease: 'Liver Cirrhosis', amountRequired: 1500000, amountCollected: 200000 },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Verified Medical Cases</h1>
                        <p className="text-slate-600 font-medium">Every case is verified by our partner hospitals.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" placeholder="Search by disease or patient..." className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 outline-none w-full md:w-80 shadow-sm" />
                        </div>
                        <button className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                            <Filter className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dummyCases.map((c) => (
                        <CaseCard key={c._id} medicalCase={c} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CaseListing;
