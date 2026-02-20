import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Building2, MapPin, Mail, Phone, User, FileText,
    CheckCircle, XCircle, Ban, ArrowLeft, Loader2,
    ShieldCheck, Globe, Clock, Activity, ExternalLink,
    Info, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HospitalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useAuth();
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [reasonInput, setReasonInput] = useState({ show: false, reason: '', status: '' });

    useEffect(() => {
        fetchHospitalDetail();
    }, [id]);

    const fetchHospitalDetail = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/hospitals/${id}`);
            setHospital(res.data.hospital);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch hospital details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status, reason = '') => {
        setActionLoading(true);
        try {
            await api.put(`/admin/hospitals/${id}/status`, { status, reason });
            setHospital({ ...hospital, status, statusReason: reason });
            setReasonInput({ show: false, reason: '', status: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Hospital Profile...</p>
                </div>
            </div>
        );
    }

    if (error || !hospital) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md w-full glass-card p-10 rounded-[2.5rem] text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
                    <p className="text-slate-500 font-medium mb-8">{error || 'Hospital profile not found'}</p>
                    <button
                        onClick={() => navigate('/manage-hospitals')}
                        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all"
                    >
                        Back to Directory
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Link */}
                <Link to="/manage-hospitals" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group-hover:bg-indigo-50 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Directory
                </Link>

                {/* Header Profile Section */}
                <div className="glass-card rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-white mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] premium-gradient shadow-2xl flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-12 h-12 text-white" />
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{hospital.hospitalName}</h1>
                                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border mx-auto md:mx-0 w-fit ${hospital.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        hospital.status === 'blacklisted' ? 'bg-red-50 text-red-600 border-red-100' :
                                            hospital.status === 'rejected' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                    {hospital.status}
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-bold text-sm uppercase tracking-tight">
                                <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-indigo-500" /> {hospital.address?.city}, {hospital.address?.state}</span>
                                <span className="flex items-center bg-slate-100 px-3 py-1 rounded-lg text-xs tracking-widest"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> REG: {hospital.registrationNumber}</span>
                                <span className="flex items-center"><Activity className="w-4 h-4 mr-2 text-rose-500" /> {hospital.hospitalType} Facility</span>
                            </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {hospital.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleStatusUpdate('approved')}
                                        disabled={actionLoading}
                                        className="flex-1 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 transition-all flex items-center justify-center"
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => setReasonInput({ show: true, reason: '', status: 'rejected' })}
                                        disabled={actionLoading}
                                        className="px-8 py-4 bg-white border-2 border-red-50 text-red-500 font-black rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center"
                                    >
                                        <XCircle className="w-5 h-5 mr-2" />
                                        Reject
                                    </button>
                                </>
                            )}
                            {hospital.status === 'approved' && (
                                <button
                                    onClick={() => setReasonInput({ show: true, reason: '', status: 'blacklisted' })}
                                    disabled={actionLoading}
                                    className="px-8 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-xl shadow-red-100 transition-all flex items-center justify-center"
                                >
                                    <Ban className="w-5 h-5 mr-2" />
                                    Blacklist
                                </button>
                            )}
                            {hospital.status === 'blacklisted' && (
                                <button
                                    onClick={() => handleStatusUpdate('approved', 'Re-approved by administrator')}
                                    disabled={actionLoading}
                                    className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center"
                                >
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Restore Access
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Reason Input Modal-like Section */}
                    {reasonInput.show && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-8 pt-8 border-t border-slate-100 relative z-10"
                        >
                            <div className="max-w-2xl mx-auto">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Provide reason for {reasonInput.status}</label>
                                <textarea
                                    rows="4"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-6 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-slate-900"
                                    placeholder="Enter detailed reason here..."
                                    value={reasonInput.reason}
                                    onChange={(e) => setReasonInput({ ...reasonInput, reason: e.target.value })}
                                ></textarea>
                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => handleStatusUpdate(reasonInput.status, reasonInput.reason)}
                                        disabled={!reasonInput.reason || actionLoading}
                                        className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all"
                                    >
                                        Confirm {reasonInput.status}
                                    </button>
                                    <button
                                        onClick={() => setReasonInput({ show: false, reason: '', status: '' })}
                                        className="px-8 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Status Reason Info */}
                        {hospital.statusReason && (
                            <div className={`p-8 rounded-[2.5rem] border flex items-start space-x-6 ${hospital.status === 'blacklisted' ? 'bg-red-50 border-red-100 text-red-900' :
                                    hospital.status === 'rejected' ? 'bg-slate-100 border-slate-200 text-slate-900' :
                                        'bg-indigo-50 border-indigo-100 text-indigo-900'
                                }`}>
                                <Info className="w-8 h-8 flex-shrink-0" />
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-60">Status Reason ({hospital.status})</h4>
                                    <p className="text-lg font-bold italic">"{hospital.statusReason}"</p>
                                </div>
                            </div>
                        )}

                        {/* Contact & Address Cards */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass-card p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-100">
                                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mr-4">
                                        <Mail className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    Contact Details
                                </h3>
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <span className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Office Email</span>
                                        <span className="text-sm font-bold text-slate-800 break-all">{hospital.email}</span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <span className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Contact Number</span>
                                        <span className="text-sm font-bold text-slate-800">{hospital.contact?.phone}</span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <span className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Administrative Email</span>
                                        <span className="text-sm font-bold text-slate-800">{hospital.contact?.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-100">
                                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mr-4">
                                        <MapPin className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    Location
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[12rem] flex flex-col justify-center">
                                        <span className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Full Address</span>
                                        <p className="text-lg font-bold text-slate-800 leading-relaxed">
                                            {hospital.address?.line1}<br />
                                            {hospital.address?.line2 && <>{hospital.address.line2}<br /></>}
                                            {hospital.address?.city}, {hospital.address?.state}<br />
                                            {hospital.address?.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Specialities & Facilities */}
                        <div className="glass-card p-10 rounded-[3rem] border border-white shadow-xl shadow-slate-100">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center uppercase tracking-tight">
                                        <Activity className="w-5 h-5 mr-3 text-indigo-600" /> Specialities
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {hospital.specialities?.map((spec, i) => (
                                            <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-black uppercase tracking-widest">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center uppercase tracking-tight">
                                        <ShieldCheck className="w-5 h-5 mr-3 text-emerald-600" /> Key Facilities
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {hospital.facilities?.map((fac, i) => (
                                            <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-black uppercase tracking-widest">
                                                {fac}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Auth Person & Documents */}
                    <div className="space-y-10">
                        {/* Authorized Person */}
                        <div className="glass-card p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <User className="w-32 h-32" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center relative z-10">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                                    <User className="w-5 h-5 text-slate-600" />
                                </div>
                                Authorized Person
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <span className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Full Name</span>
                                    <p className="text-xl font-black text-slate-900">{hospital.authorizedPerson?.name}</p>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Designation</span>
                                    <p className="text-sm font-bold text-slate-600">{hospital.authorizedPerson?.designation || 'Not Provided'}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</span>
                                    <span className="text-sm font-black text-indigo-600">{hospital.authorizedPerson?.phone || 'Not Provided'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="glass-card p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-100 overflow-hidden">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mr-4">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                </div>
                                Verification Files
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Registration Cert.', type: 'registrationCertificate' },
                                    { label: 'Operation License', type: 'license' }
                                ].map((doc, i) => (
                                    <div key={i} className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-lg rounded-2xl border border-slate-100 transition-all cursor-pointer">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 group-hover:bg-indigo-50 transition-colors">
                                                <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{doc.label}</span>
                                        </div>
                                        {hospital.documents?.[doc.type] ? (
                                            <a
                                                href={hospital.documents[doc.type]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        ) : (
                                            <span className="text-[10px] font-black text-slate-300 uppercase">Not Uploaded</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                                <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                                    Please verify these documents with the official health ministry registry before approving this institution.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDetail;
