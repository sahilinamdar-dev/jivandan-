import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CaseCard = ({ medicalCase }) => {
    const patientPhoto = medicalCase.documents?.find(d => d.type === 'patient_photo')?.url || "https://images.unsplash.com/photo-1516549221184-ef395c07421f?q=80&w=600&auto=format&fit=crop";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all border border-slate-100 group"
        >
            <div className="relative h-48 overflow-hidden bg-slate-200">
                <img src={patientPhoto} alt={medicalCase.patientName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800">Hospital Verified</span>
                </div>
            </div>
            <div className="p-6">
                <div className="text-sm font-semibold text-indigo-600 mb-2">{medicalCase.disease}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{medicalCase.patientName}: {medicalCase.title}</h3>

                <div className="mb-6">
                    <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-slate-500">Raised: ₹{medicalCase.amountCollected?.toLocaleString()}</span>
                        <span className="text-slate-900">Goal: ₹{medicalCase.amountRequired?.toLocaleString()}</span>
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
    const { api } = useAuth();
    const [cases, setCases] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await api.get('/cases?status=live');
                setCases(res.data);
            } catch (err) {
                console.error("Failed to fetch cases:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, [api]);

    const filteredCases = cases.filter(c =>
        c.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.disease?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <input
                                type="text"
                                placeholder="Search by disease or patient..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 outline-none w-full md:w-80 shadow-sm"
                            />
                        </div>
                        <button className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                            <Filter className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredCases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCases.map((c) => (
                            <CaseCard key={c._id} medicalCase={c} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">
                        No verified cases found
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseListing;
