import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CheckCircle, XCircle, Clock, Search, MapPin, FileDigit, FileText, ArrowLeft, ShieldAlert, Ban, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ManageHospitals = () => {
    const { api, user, loading: authLoading } = useAuth();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all' | 'rejected' | 'blacklisted'
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [reasonInput, setReasonInput] = useState({ id: null, reason: '', status: '' });

    useEffect(() => {
        if (!authLoading && user) {
            fetchHospitals();
        }
    }, [authLoading, user, activeTab]);

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            let endpoint = '/admin/hospitals';
            if (activeTab === 'pending') endpoint = '/admin/hospitals/pending';
            else if (activeTab === 'rejected') endpoint = '/admin/hospitals/rejected';
            else if (activeTab === 'blacklisted') endpoint = '/admin/hospitals/blacklisted';

            const res = await api.get(endpoint);
            setHospitals(res.data.hospitals);
        } catch (err) {
            setError('Failed to fetch hospital requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status, reason = '') => {
        setActionLoading(id);
        try {
            await api.put(`/admin/hospitals/${id}/status`, { status, reason });
            if (activeTab === 'pending') {
                setHospitals(hospitals.filter(h => h._id !== id));
            } else {
                setHospitals(hospitals.map(h => h._id === id ? { ...h, status, statusReason: reason } : h));
            }
            setReasonInput({ id: null, reason: '', status: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredHospitals = hospitals.filter(h =>
        h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address?.line1?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address?.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <Link to="/admin-dashboard" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hospital Directory</h1>
                        <p className="text-slate-500 font-medium">Verify registrations and manage platform health</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1 sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-slate-900 shadow-sm"
                            />
                        </div>
                        <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === 'pending' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                All Verified
                            </button>
                            <button
                                onClick={() => setActiveTab('rejected')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === 'rejected' ? 'bg-white text-red-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Rejected
                            </button>
                            <button
                                onClick={() => setActiveTab('blacklisted')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === 'blacklisted' ? 'bg-white text-red-800 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Blacklisted
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
                        <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Syncing Directory...</p>
                    </div>
                ) : error ? (
                    <div className="glass-card p-6 rounded-2xl flex items-center space-x-3 text-red-600 border-red-100 bg-red-50/50">
                        <ShieldAlert className="w-6 h-6" />
                        <span className="font-bold">{error}</span>
                    </div>
                ) : filteredHospitals.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-20 rounded-[3rem] text-center border-dashed border-2 border-slate-200"
                    >
                        <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">No matching results</h2>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">
                            We couldn't find any hospitals matching "{searchQuery}". Try adjusting your search query.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredHospitals.map((hospital, index) => (
                                <motion.div
                                    key={hospital._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass-card rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all border border-white relative overflow-hidden flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-4 rounded-2xl premium-gradient shadow-lg">
                                                <Building2 className="text-white w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900">{hospital.name}</h3>
                                                <p className="text-slate-500 text-sm font-bold flex items-center uppercase tracking-tight">
                                                    <MapPin className="w-3 h-3 mr-1 text-indigo-500" />
                                                    {hospital.city || 'N/A'}, {hospital.state || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${hospital.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            hospital.status === 'blacklisted' ? 'bg-red-50 text-red-600 border-red-100' :
                                                hospital.status === 'rejected' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {hospital.status}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8 flex-grow">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Contact</span>
                                                <span className="text-sm font-bold text-slate-900 break-all">{hospital.email}</span>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration No.</span>
                                                <span className="text-sm font-bold text-slate-900">{hospital.organizationDetails?.registrationNumber || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100">
                                            <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Full Address</span>
                                            <span className="text-sm font-medium text-slate-700">
                                                {hospital.address
                                                    ? `${hospital.address.line1}${hospital.address.line2 ? ', ' + hospital.address.line2 : ''}, ${hospital.address.city}, ${hospital.address.state} - ${hospital.address.pincode}`
                                                    : 'N/A'}
                                            </span>
                                        </div>

                                        {hospital.statusReason && (
                                            <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${hospital.status === 'blacklisted' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-slate-100 border-slate-200 text-slate-700'
                                                }`}>
                                                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <span className="block text-[10px] font-black uppercase tracking-widest mb-1">Reason for {hospital.status}</span>
                                                    <p className="text-xs font-medium italic">"{hospital.statusReason}"</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action UI */}
                                    <div className="mt-auto border-t border-slate-100 pt-6">
                                        {reasonInput.id === hospital._id ? (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Provide a reason for {reasonInput.status}</label>
                                                    <textarea
                                                        rows="3"
                                                        value={reasonInput.reason}
                                                        onChange={(e) => setReasonInput({ ...reasonInput, reason: e.target.value })}
                                                        placeholder="Enter details here..."
                                                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all font-medium text-sm"
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleStatusUpdate(hospital._id, reasonInput.status, reasonInput.reason)}
                                                        disabled={actionLoading === hospital._id || !reasonInput.reason}
                                                        className={`flex-1 py-3 rounded-xl font-black text-sm shadow-lg transition-all ${reasonInput.status === 'blacklisted' ? 'bg-red-600 text-white shadow-red-100' : 'bg-slate-800 text-white shadow-slate-100'
                                                            }`}
                                                    >
                                                        Confirm {reasonInput.status}
                                                    </button>
                                                    <button
                                                        onClick={() => setReasonInput({ id: null, reason: '', status: '' })}
                                                        className="px-6 py-3 rounded-xl font-black text-sm text-slate-500 hover:bg-slate-100 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                {hospital.status === 'pending' && (
                                                    <button
                                                        disabled={actionLoading === hospital._id}
                                                        onClick={() => handleStatusUpdate(hospital._id, 'approved')}
                                                        className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-50 transition-all flex items-center justify-center group/btn"
                                                    >
                                                        <CheckCircle className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                                                        Approve
                                                    </button>
                                                )}

                                                {(hospital.status === 'pending') && (
                                                    <button
                                                        disabled={actionLoading === hospital._id}
                                                        onClick={() => setReasonInput({ id: hospital._id, reason: '', status: 'rejected' })}
                                                        className="px-6 py-4 bg-white hover:bg-red-50 text-red-500 border border-red-50 font-black rounded-2xl transition-all flex items-center justify-center group/btn"
                                                    >
                                                        <XCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                )}

                                                {(hospital.status === 'approved') && (
                                                    <button
                                                        disabled={actionLoading === hospital._id}
                                                        onClick={() => setReasonInput({ id: hospital._id, reason: '', status: 'blacklisted' })}
                                                        className="flex-1 py-4 bg-white hover:bg-red-50 text-red-600 border-2 border-red-50 font-black rounded-2xl transition-all flex items-center justify-center group/btn"
                                                    >
                                                        <Ban className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                                                        Blacklist Hospital
                                                    </button>
                                                )}

                                                {hospital.status === 'blacklisted' && (
                                                    <button
                                                        disabled={actionLoading === hospital._id}
                                                        onClick={() => handleStatusUpdate(hospital._id, 'approved', 'Re-approved by administrator')}
                                                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center group/btn"
                                                    >
                                                        <CheckCircle className="w-5 h-5 mr-2" />
                                                        Restore Access
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageHospitals;

