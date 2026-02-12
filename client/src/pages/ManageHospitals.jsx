import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CheckCircle, XCircle, Clock, Search, MapPin, FileDigit, FileText, ArrowLeft, ShieldAlert, Ban, Info, AlertTriangle, X, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ManageHospitals = () => {
    const { api, user, loading: authLoading } = useAuth();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'blacklisted'
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [reasonInput, setReasonInput] = useState({ id: null, reason: '', status: '' });
    const [selectedHospital, setSelectedHospital] = useState(null);

    useEffect(() => {
        if (!authLoading && user) {
            fetchHospitals();
        }
    }, [authLoading, user, activeTab]);

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            let endpoint = '';
            switch (activeTab) {
                case 'pending': endpoint = '/admin/hospitals/pending'; break;
                case 'approved': endpoint = '/admin/hospitals/approved'; break;
                case 'rejected': endpoint = '/admin/hospitals/rejected'; break;
                case 'blacklisted': endpoint = '/admin/hospitals/blacklisted'; break;
                default: endpoint = '/admin/hospitals/pending';
            }
            const res = await api.get(endpoint);
            const mappedHospitals = res.data.hospitals.map(h => ({
                ...h,
                status: h.userId?.status || 'pending',
                statusReason: h.userId?.statusReason || ''
            }));
            setHospitals(mappedHospitals);
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
            if (selectedHospital?._id === id) {
                setSelectedHospital(prev => ({ ...prev, status, statusReason: reason }));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredHospitals = hospitals.filter(h =>
        h.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address?.state?.toLowerCase().includes(searchQuery.toLowerCase())
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
                        <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit overflow-x-auto no-scrollbar max-w-full">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === 'pending' ? 'bg-white text-amber-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setActiveTab('approved')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === 'approved' ? 'bg-white text-emerald-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => setActiveTab('rejected')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === 'rejected' ? 'bg-white text-rose-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Rejected
                            </button>
                            <button
                                onClick={() => setActiveTab('blacklisted')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === 'blacklisted' ? 'bg-white text-slate-800 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
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
                                    className="glass-card rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all border border-white relative overflow-hidden flex flex-col cursor-pointer group/card"
                                    onClick={() => setSelectedHospital({
                                        ...hospital,
                                        status: hospital.status,
                                        statusReason: hospital.statusReason
                                    })}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-4 rounded-2xl premium-gradient shadow-lg">
                                                <Building2 className="text-white w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900">{hospital.hospitalName}</h3>
                                                <p className="text-slate-500 text-sm font-bold flex items-center uppercase tracking-tight">
                                                    <MapPin className="w-3 h-3 mr-1 text-indigo-500" />
                                                    {hospital.address?.city || 'N/A'}, {hospital.address?.state || 'N/A'}
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
                                                <span className="text-sm font-bold text-slate-900 break-all">{hospital.userId?.email}</span>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration No.</span>
                                                <span className="text-sm font-bold text-slate-900">{hospital.registrationNumber || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100">
                                            <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Full Address</span>
                                            <span className="text-sm font-medium text-slate-700">
                                                {hospital.address?.line1}{hospital.address?.line2 ? `, ${hospital.address.line2}` : ''}, {hospital.address?.city}, {hospital.address?.state} - {hospital.address?.pincode}
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

                {/* Hospital Detail Modal */}
                <AnimatePresence>
                    {selectedHospital && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedHospital(null)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-2xl premium-gradient text-white">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900">{selectedHospital.hospitalName}</h2>
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{selectedHospital.hospitalType} Hospital</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedHospital(null)}
                                        className="p-3 rounded-2xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-8 overflow-y-auto flex-grow space-y-8">
                                    {/* Grid Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <section>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Registration Details</h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                                                        <span className="text-sm font-bold text-slate-500">Reg Number</span>
                                                        <span className="text-sm font-black text-slate-900">{selectedHospital.registrationNumber}</span>
                                                    </div>
                                                    <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                                                        <span className="text-sm font-bold text-slate-500">Joined Date</span>
                                                        <span className="text-sm font-black text-slate-900">{new Date(selectedHospital.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Information</h4>
                                                <div className="space-y-3">
                                                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center space-x-3">
                                                        <MapPin className="w-4 h-4 text-indigo-500" />
                                                        <span className="text-sm font-medium text-slate-700">
                                                            {selectedHospital.address?.line1}{selectedHospital.address?.line2 ? `, ${selectedHospital.address.line2}` : ''}, {selectedHospital.address?.city}, {selectedHospital.address?.state} - {selectedHospital.address?.pincode}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                                            <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Email</span>
                                                            <span className="text-xs font-bold text-indigo-600 truncate block">{selectedHospital.userId?.email}</span>
                                                        </div>
                                                        <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                                            <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Phone</span>
                                                            <span className="text-xs font-bold text-slate-900">{selectedHospital.contact?.phone}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>

                                        <div className="space-y-6">
                                            <section>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Authorized Representative</h4>
                                                <div className="p-5 border-2 border-indigo-50 bg-indigo-50/20 rounded-[2rem] space-y-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-600">
                                                            {selectedHospital.authorizedPerson?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-slate-900">{selectedHospital.authorizedPerson?.name}</div>
                                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{selectedHospital.authorizedPerson?.designation}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-bold text-indigo-600 flex items-center">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        Verified Contact: {selectedHospital.authorizedPerson?.phone}
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Specialities & Capacity</h4>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {selectedHospital.specialities?.map((s, i) => (
                                                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">{s}</span>
                                                    ))}
                                                </div>
                                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex justify-between items-center">
                                                    <span className="text-xs font-bold text-emerald-700">Admission Capacity</span>
                                                    <span className="text-sm font-black text-emerald-900">{selectedHospital.activeCases || 0} / {selectedHospital.maxCapacity} Active Cases</span>
                                                </div>
                                            </section>
                                        </div>
                                    </div>

                                    {/* Documents Section */}
                                    <section>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Verification Documents</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <a
                                                href={selectedHospital.documents?.registrationCertificate}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all group"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">Reg Certificate</span>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                            </a>
                                            <a
                                                href={selectedHospital.documents?.license}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all group"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                                        <FileDigit className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">Medical License</span>
                                                </div>
                                            </a>
                                        </div>
                                    </section>

                                    {/* Status Reason Section */}
                                    {selectedHospital.statusReason && (
                                        <section className="animate-in fade-in slide-in-from-top-2">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Verification Feedback</h4>
                                            <div className={`p-6 rounded-[2rem] border-2 flex items-start space-x-4 ${selectedHospital.status === 'blacklisted' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-slate-100 border-slate-200 text-slate-700'
                                                }`}>
                                                <div className={`p-2 rounded-xl flex-shrink-0 ${selectedHospital.status === 'blacklisted' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>
                                                    <Info className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Status Note</span>
                                                    <p className="text-sm font-bold italic leading-relaxed">"{selectedHospital.statusReason}"</p>
                                                </div>
                                            </div>
                                        </section>
                                    )}

                                    {/* Dashboard Integration Snapshot */}
                                    <section className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                            <ShieldAlert className="w-24 h-24" />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Platform Oversight</h4>
                                            <div className="flex flex-col sm:flex-row gap-8">
                                                <div className="flex-1">
                                                    <span className="block text-2xl font-black mb-1">{selectedHospital.activeCases || 0}</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Medical Cases</span>
                                                </div>
                                                <div className="flex-1">
                                                    <span className="block text-2xl font-black mb-1">₹{(selectedHospital.activeCases * 50000).toLocaleString()}+</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Est. Escrow Volume</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="block text-2xl font-black">0</span>
                                                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-black">STABLE</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fraud Flags</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Modal Footer Actions */}
                                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                    <div className="text-sm font-bold text-slate-500">
                                        Current Status: <span className="uppercase text-indigo-600 font-black tracking-widest ml-1">{selectedHospital.status}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {selectedHospital.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedHospital._id, 'approved')}
                                                    disabled={actionLoading === selectedHospital._id}
                                                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 transition-all flex items-center"
                                                >
                                                    <CheckCircle className="w-5 h-5 mr-2" />
                                                    Approve Registration
                                                </button>
                                                <button
                                                    onClick={() => setReasonInput({ id: selectedHospital._id, reason: '', status: 'rejected' })}
                                                    disabled={actionLoading === selectedHospital._id}
                                                    className="px-6 py-4 bg-white hover:bg-red-50 text-red-500 border border-red-100 font-black rounded-2xl transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {selectedHospital.status === 'approved' && (
                                            <button
                                                onClick={() => setReasonInput({ id: selectedHospital._id, reason: '', status: 'blacklisted' })}
                                                disabled={actionLoading === selectedHospital._id}
                                                className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-xl shadow-rose-100 transition-all flex items-center"
                                            >
                                                <Ban className="w-5 h-5 mr-2" />
                                                Blacklist Hospital
                                            </button>
                                        )}
                                        {selectedHospital.status === 'blacklisted' && (
                                            <button
                                                onClick={() => handleStatusUpdate(selectedHospital._id, 'approved', 'Restored by admin')}
                                                disabled={actionLoading === selectedHospital._id}
                                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center"
                                            >
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Restore Access
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Rejection/Blacklist Overlay */}
                                {reasonInput.id === selectedHospital._id && (
                                    <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md p-12 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4">
                                        <div className="max-w-md mx-auto w-full">
                                            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-[2rem] flex items-center justify-center mb-6">
                                                <AlertTriangle className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 mb-2">Final Conclusion Needed</h3>
                                            <p className="text-slate-500 font-medium mb-8">Please provide a valid administrative reason for changing this hospital's status to <b>{reasonInput.status}</b>.</p>

                                            <textarea
                                                rows="4"
                                                value={reasonInput.reason}
                                                onChange={(e) => setReasonInput({ ...reasonInput, reason: e.target.value })}
                                                placeholder="Enter reason details here..."
                                                className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-medium text-slate-900 mb-6 shadow-inner"
                                            />

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedHospital._id, reasonInput.status, reasonInput.reason)}
                                                    disabled={!reasonInput.reason || actionLoading}
                                                    className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-100 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs"
                                                >
                                                    Confirm {reasonInput.status}
                                                </button>
                                                <button
                                                    onClick={() => setReasonInput({ id: null, reason: '', status: '' })}
                                                    className="px-8 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageHospitals;

