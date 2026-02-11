import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User, Phone, Mail, MapPin, Activity, Calendar,
    FileText, CheckCircle, XCircle, ArrowLeft,
    AlertTriangle, Building2, DollarSign, Loader2,
    ShieldCheck, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HospitalCaseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useAuth();

    const [c, setCase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [remarks, setRemarks] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Support for Demo Data
    const demoCases = {
        'demo-1': {
            _id: 'demo-1',
            patientName: 'Aryan Sharma',
            age: 8,
            gender: 'male',
            phone: '+91 98765 43210',
            email: 'parent@example.com',
            city: 'Mumbai',
            state: 'Maharashtra',
            relationshipToPatient: 'parent',
            disease: 'Congenital Heart Disease',
            title: 'Help baby Aryan survive heart surgery',
            description: 'Aryan was born with a hole in his heart. He needs immediate surgery at TrustCare Hospital to survive.',
            diagnosisDate: '2023-09-15',
            currentCondition: 'critical',
            recommendedTreatment: 'ASDO/VSD Closure Surgery',
            expectedDuration: '3 months',
            amountRequired: 500000,
            costBreakdown: { surgery: 350000, medicines: 50000, hospitalStay: 100000 },
            documents: [
                { name: 'Medical Report.pdf', type: 'medical_report', url: '#' },
                { name: 'Hospital Estimate.pdf', type: 'hospital_letter', url: '#' }
            ],
            isDemo: true,
            createdAt: '2023-10-20'
        },
        'demo-4': {
            _id: 'demo-4',
            patientName: 'Suresh Raina',
            age: 45,
            gender: 'male',
            phone: '+91 88888 77777',
            email: 'suresh@example.com',
            city: 'Chennai',
            state: 'Tamil Nadu',
            relationshipToPatient: 'self',
            disease: 'Chronic Kidney Disease',
            title: 'Support Suresh with Urgent Dialysis',
            description: 'Suresh has been fighting CKD for 2 years. He needs help covering long-term dialysis costs.',
            diagnosisDate: '2022-05-10',
            currentCondition: 'serious',
            recommendedTreatment: 'Bi-weekly Dialysis & Transplant Prep',
            expectedDuration: 'Ongoing',
            amountRequired: 1200000,
            costBreakdown: { diagnostics: 200000, medicines: 300000, other: 700000 },
            documents: [
                { name: 'Case History.pdf', type: 'prescription', url: '#' }
            ],
            isDemo: true,
            createdAt: '2023-10-25'
        },
        'demo-v1': {
            _id: 'demo-v1',
            patientName: 'Neha Gupta',
            age: 28,
            gender: 'female',
            phone: '+91 77777 66666',
            email: 'neha@example.com',
            city: 'Bangalore',
            state: 'Karnataka',
            relationshipToPatient: 'self',
            disease: 'Leukemia Treatment',
            title: 'Help Neha overcome Leukemia',
            description: 'Neha is a bright software engineer whose life came to a halt when she was diagnosed with Leukemia. She needs help with her chemotherapy costs.',
            diagnosisDate: '2023-08-01',
            currentCondition: 'stable',
            recommendedTreatment: 'Chemotherapy & Bone Marrow Transplant',
            expectedDuration: '6 months',
            amountRequired: 800000,
            costBreakdown: { chemo: 400000, transplant: 300000, hospital: 100000 },
            documents: [
                { name: 'Oncology Report.pdf', type: 'medical_report', url: '#' }
            ],
            isDemo: true,
            status: 'hospital_verified',
            createdAt: '2023-10-01'
        }
    };

    useEffect(() => {
        if (id.startsWith('demo-')) {
            setCase(demoCases[id]);
            setLoading(false);
            return;
        }

        const fetchCase = async () => {
            try {
                const res = await api.get(`/cases/${id}`);
                setCase(res.data);
            } catch (err) {
                console.error("Failed to fetch case details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCase();
    }, [id, api]);

    const handleAction = async (newStatus) => {
        if (!remarks && newStatus === 'rejected') {
            alert('Please provide rejection remarks');
            return;
        }

        if (c.isDemo) {
            alert('This is a demo case. Actions are simulated.');
            navigate('/hospital-dashboard');
            return;
        }

        setActionLoading(true);
        try {
            await api.patch(`/cases/${id}/status`, {
                status: newStatus === 'verify' ? 'hospital_verified' : 'rejected',
                remarks
            });
            alert(`Case ${newStatus === 'verify' ? 'Verified' : 'Rejected'} successfully!`);
            navigate('/hospital-dashboard');
        } catch (err) {
            alert('Failed to update case status');
        } finally {
            setActionLoading(false);
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

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-5xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/hospital-dashboard')}
                            className="p-3 bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Case Review</h1>
                                {c.isDemo && (
                                    <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Demo Data</span>
                                )}
                            </div>
                            <p className="text-slate-500 font-medium">Verify patient medical and identity records.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {c.status === 'pending' ? (
                            <>
                                <button
                                    onClick={() => handleAction('verify')}
                                    disabled={actionLoading}
                                    className="flex-1 md:flex-none px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:scale-[1.05] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Verify Case
                                </button>
                                <button
                                    onClick={() => handleAction('reject')}
                                    disabled={actionLoading}
                                    className="flex-1 md:flex-none px-8 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    <XCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                    Reject
                                </button>
                            </>
                        ) : (
                            <div className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 border border-emerald-100">
                                <CheckCircle className="w-6 h-6" />
                                Case {c.status.replace('_', ' ')}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Detailed Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Patient Identity */}
                        <div className="glass-card p-8 rounded-[32px] border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <User className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Patient Identity</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Full Name</label>
                                    <div className="font-bold text-slate-900">{c.patientName}</div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Relationship</label>
                                    <div className="font-bold text-slate-900 capitalize">{c.relationshipToPatient}</div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Age / Gender</label>
                                    <div className="font-bold text-slate-900">{c.age} Yrs / {c.gender}</div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Contact</label>
                                    <div className="font-bold text-slate-900">{c.phone}</div>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Address</label>
                                    <div className="font-bold text-slate-900">{c.city}, {c.state}</div>
                                </div>
                            </div>
                        </div>

                        {/* Medical Condition */}
                        <div className="glass-card p-8 rounded-[32px] border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Medical Condition</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-2">{c.disease}</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-3">{c.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{c.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Diagnosis</div>
                                            <div className="text-sm font-bold text-slate-900">{new Date(c.diagnosisDate).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
                                        <ShieldCheck className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Condition</div>
                                            <div className="text-sm font-bold text-rose-600 uppercase italic">{c.currentCondition}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Remarks Input */}
                        <div className="glass-card p-8 rounded-[32px] border border-slate-100">
                            <h2 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Verification Remarks</h2>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter verification notes or reason for rejection..."
                                className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[24px] transition-all outline-none font-medium h-32"
                            />
                        </div>
                    </div>

                    {/* Right: Funding & Documents */}
                    <div className="space-y-8">
                        {/* Funding */}
                        <div className="glass-card p-8 rounded-[32px] border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Financials</h2>
                            </div>

                            <div className="text-center p-6 bg-slate-900 rounded-3xl text-white mb-6">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Target Amount</div>
                                <div className="text-3xl font-black italic">₹{c.amountRequired?.toLocaleString()}</div>
                            </div>

                            <div className="space-y-3">
                                {c.costBreakdown && Object.entries(c.costBreakdown).map(([key, val]) => (
                                    <div key={key} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{key}</span>
                                        <span className="font-black text-slate-900">₹{val.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="glass-card p-8 rounded-[32px] border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Documents</h2>
                            </div>

                            <div className="space-y-4">
                                {c.documents?.map((doc, idx) => (
                                    <a
                                        key={idx}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-slate-900 truncate max-w-[120px]">{doc.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">{doc.type}</div>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                    </a>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-amber-50 rounded-2xl flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase">
                                    Review all documents carefully. Ensure authenticity before verification.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalCaseDetail;
