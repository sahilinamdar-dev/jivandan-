import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Phone, Mail, MapPin, Activity, Calendar,
    Clock, Shield, Upload, DollarSign, FileText,
    CheckCircle2, ArrowRight, ArrowLeft, Info, AlertCircle,
    Building2, Heart, HeartPulse, ChevronRight, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SubmitCase = () => {
    const navigate = useNavigate();
    const { api } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        // Step 1: Identity
        patientName: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        city: '',
        state: '',
        relationshipToPatient: 'self',

        // Step 2: Medical
        title: '',
        disease: '',
        description: '',
        diagnosisDate: '',
        currentCondition: 'stable',
        recommendedTreatment: '',
        expectedDuration: '',
        hospitalId: '',

        // Step 3: Documents
        documents: [], // { name, url, type }

        // Step 4: Funding
        amountRequired: '',
        amountAlreadyArranged: '0',
        costBreakdown: {
            surgery: 0,
            medicines: 0,
            hospitalStay: 0,
            diagnostics: 0,
            other: 0
        },

        // Step 5: Consents
        consents: {
            sharePublicly: false,
            hospitalVerification: false,
            policyAgreement: false,
            truthfulnessDeclaration: false
        }
    });

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await api.get('/admin/hospitals/approved');
                setHospitals(res.data.hospitals || []);
            } catch (err) {
                console.error("Failed to fetch hospitals");
                setHospitals([]);
            }
        };
        fetchHospitals();
    }, [api]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleConsentChange = (name) => {
        setFormData(prev => ({
            ...prev,
            consents: { ...prev.consents, [name]: !prev.consents[name] }
        }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/cases', formData);
            setStep(6); // Success Step
        } catch (err) {
            console.error("Submission error details:", err.response?.data);
            const serverMsg = err.response?.data?.message;
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0]?.message;
                setError(firstError || serverMsg || 'Validation failed');
            } else {
                setError(serverMsg || 'Failed to submit case');
            }
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: 'Identity', icon: User },
        { id: 2, title: 'Medical', icon: Activity },
        { id: 3, title: 'Documents', icon: Upload },
        { id: 4, title: 'Funding', icon: DollarSign },
        { id: 5, title: 'Consent', icon: Shield },
    ];

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="max-w-4xl mx-auto">
                {/* Progress Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
                        <motion.div
                            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
                            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                        />
                        {steps.map((s) => (
                            <div key={s.id} className="relative z-10 flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${step >= s.id ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200'
                                    }`}>
                                    {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
                                </div>
                                <span className={`absolute -bottom-8 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${step >= s.id ? 'text-blue-600' : 'text-slate-400'
                                    }`}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white p-8 md:p-12 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-2">Patient Identity</h2>
                                        <p className="text-slate-500 font-medium">Verify patient details as per official medical records.</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                                        <Info className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-4 text-indigo-700">
                                    <Shield className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm font-bold">Your privacy is our priority. These details are only shared with verifying hospitals.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                name="patientName"
                                                value={formData.patientName}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                                placeholder="As per medical records"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Age</label>
                                            <input
                                                name="age"
                                                type="number"
                                                value={formData.age}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                                placeholder="25"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium appearance-none"
                                            >
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                                placeholder="patient@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Relationship</label>
                                        <select
                                            name="relationshipToPatient"
                                            value={formData.relationshipToPatient}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium appearance-none"
                                        >
                                            <option value="self">I am the Patient</option>
                                            <option value="parent">Parent</option>
                                            <option value="guardian">Guardian</option>
                                            <option value="spouse">Spouse</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">City</label>
                                            <input
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                                placeholder="Mumbai"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">State</label>
                                            <input
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                                placeholder="Maharashtra"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-8">
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.patientName || !formData.age || !formData.gender || !formData.phone || !formData.city || !formData.state}
                                        className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.05] transition-all flex items-center gap-3 group disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        Continue to Medical Details
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Medical Condition</h2>
                                    <p className="text-slate-500 font-medium">Provide details as confirmed by the doctor.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Disease / Condition</label>
                                        <input
                                            name="disease"
                                            value={formData.disease}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                            placeholder="e.g. Critical Heart Surgery required"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Short Case Headline</label>
                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                            placeholder="e.g. Help baby Aarav survive heart disease"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Status</label>
                                        <select
                                            name="currentCondition"
                                            value={formData.currentCondition}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium appearance-none"
                                        >
                                            <option value="stable">Stable</option>
                                            <option value="serious">Serious</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Diagnosis Date</label>
                                        <input
                                            name="diagnosisDate"
                                            type="date"
                                            value={formData.diagnosisDate}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Recommended Treatment</label>
                                        <input
                                            name="recommendedTreatment"
                                            value={formData.recommendedTreatment}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                            placeholder="As suggested by the doctor"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Expected Treatment Duration</label>
                                        <input
                                            name="expectedDuration"
                                            value={formData.expectedDuration}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                            placeholder="e.g. 6 months, 2 years"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Condition Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                            placeholder="Explain the condition in simple words..."
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Select Hospital for Verification</label>
                                        <select
                                            name="hospitalId"
                                            value={formData.hospitalId}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium appearance-none"
                                        >
                                            <option value="">Choose a registered hospital</option>
                                            {hospitals.map(h => (
                                                <option key={h._id} value={h._id}>{h.name} - {h.city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-8">
                                    <button
                                        onClick={prevStep}
                                        className="px-8 py-4 text-slate-500 font-black text-sm uppercase tracking-widest hover:text-slate-900 transition-all flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.hospitalId || !formData.disease || !formData.title || !formData.diagnosisDate || !formData.recommendedTreatment || !formData.expectedDuration}
                                        className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.05] transition-all flex items-center gap-3 group disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        Continue to Documents
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Medical Documents</h2>
                                    <p className="text-slate-500 font-medium">Upload mandatory documents for hospital verification.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: 'prescription', label: 'Doctor Prescription', required: true },
                                        { id: 'medical_report', label: 'Medical Reports (Lab/Scan)', required: true },
                                        { id: 'hospital_letter', label: 'Hospital Admission Letter', required: false },
                                        { id: 'patient_photo', label: 'Patient Photo (With Consent)', required: false },
                                    ].map((docType) => (
                                        <div key={docType.id} className="relative group">
                                            <div className="flex items-center justify-between mb-2 ml-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{docType.label}</label>
                                                {docType.required && <span className="text-[8px] font-black text-red-400 uppercase tracking-tighter">Required</span>}
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            // Mock upload: Create a preview URL
                                                            const url = URL.createObjectURL(file);
                                                            const newDoc = { name: file.name, url, type: docType.id };
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                documents: [...prev.documents.filter(d => d.type !== docType.id), newDoc]
                                                            }));
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    accept="image/*,.pdf"
                                                />
                                                <div className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${formData.documents.find(d => d.type === docType.id)
                                                    ? 'border-emerald-200 bg-emerald-50/50'
                                                    : 'border-slate-200 bg-slate-50 group-hover:border-blue-300 group-hover:bg-blue-50/30'
                                                    }`}>
                                                    {formData.documents.find(d => d.type === docType.id) ? (
                                                        <>
                                                            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                                                                <CheckCircle2 className="w-6 h-6" />
                                                            </div>
                                                            <div className="text-sm font-bold text-emerald-700 truncate max-w-full px-4">
                                                                {formData.documents.find(d => d.type === docType.id).name}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                            <div className="text-xs font-bold text-slate-500 group-hover:text-blue-600 uppercase tracking-widest">Click to Upload</div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                                    <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Upload Quality Notice</h4>
                                        <p className="text-sm text-amber-700 font-medium">Ensure documents are clear and readable. Blurred or incomplete documents will result in case rejection. Max size 10MB per file.</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-8">
                                    <button
                                        onClick={prevStep}
                                        className="px-8 py-4 text-slate-500 font-black text-sm uppercase tracking-widest hover:text-slate-900 transition-all flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={formData.documents.filter(d => ['prescription', 'medical_report'].includes(d.type)).length < 2}
                                        className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.05] transition-all flex items-center gap-3 group disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        Continue to Funding
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Funding Requirement</h2>
                                    <p className="text-slate-500 font-medium">Be honest and transparent about the medical costs.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Total Amount Needed (₹)</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</div>
                                            <input
                                                name="amountRequired"
                                                type="number"
                                                value={formData.amountRequired}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-black text-xl"
                                                placeholder="5,00,000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Amount Already Arranged (₹)</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</div>
                                            <input
                                                name="amountAlreadyArranged"
                                                type="number"
                                                value={formData.amountAlreadyArranged}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-4 rounded-2xl bg-transparent border-2 border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-600 font-bold"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-4 block">Estimated Cost Breakdown</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                { id: 'surgery', label: 'Surgery/Operation', icon: Activity },
                                                { id: 'medicines', label: 'Medicines', icon: HeartPulse },
                                                { id: 'hospitalStay', label: 'Hospital Stay', icon: Building2 },
                                                { id: 'diagnostics', label: 'Diagnostics/Tests', icon: FileText },
                                            ].map((item) => (
                                                <div key={item.id} className="relative group">
                                                    <item.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                                    <input
                                                        type="number"
                                                        name={`costBreakdown.${item.id}`}
                                                        value={formData.costBreakdown[item.id]}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-100 focus:border-blue-200 outline-none text-sm font-bold text-slate-700"
                                                        placeholder={item.label}
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">
                                                        {item.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Shield className="w-8 h-8 text-blue-400" />
                                            <h4 className="text-xl font-black tracking-tight">Financial Safety Escrow</h4>
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                            JIVANDAN uses a strict medical escrow system. All donations are <strong>held securely</strong> and released directly to the hospital's verified bank account.
                                        </p>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg inline-block">
                                            Zero Direct Cash Withdrawals
                                        </div>
                                    </div>
                                    <DollarSign className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
                                </div>

                                <div className="flex items-center justify-between pt-8">
                                    <button
                                        onClick={prevStep}
                                        className="px-8 py-4 text-slate-500 font-black text-sm uppercase tracking-widest hover:text-slate-900 transition-all flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.amountRequired || parseInt(formData.amountRequired) <= 0}
                                        className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.05] transition-all flex items-center gap-3 group disabled:opacity-50"
                                    >
                                        Final Step: Consent
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Consent & Declaration</h2>
                                    <p className="text-slate-500 font-medium">Finalize your case submission with legal declarations.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 'sharePublicly', label: 'I consent to share this medical case and related documents publicly on the JIVANDAN platform to seek donations.' },
                                        { id: 'hospitalVerification', label: 'I authorize JIVANDAN and its network of registered hospitals to verify my medical records and treatment details.' },
                                        { id: 'policyAgreement', label: 'I agree to the JIVANDAN Fund Usage Policy and understand that funds will only be released directly to hospitals.' },
                                        { id: 'truthfulnessDeclaration', label: 'I declare that all information and documents provided in this form are authentic and accurate to the best of my knowledge.' },
                                    ].map((consent) => (
                                        <button
                                            key={consent.id}
                                            onClick={() => handleConsentChange(consent.id)}
                                            className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${formData.consents[consent.id]
                                                ? 'border-blue-500 bg-blue-50/50 shadow-md'
                                                : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'
                                                }`}
                                        >
                                            <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${formData.consents[consent.id] ? 'bg-blue-600 text-white' : 'bg-white border-2 border-slate-200'
                                                }`}>
                                                {formData.consents[consent.id] && <CheckCircle2 className="w-4 h-4" />}
                                            </div>
                                            <span className={`text-sm font-bold ${formData.consents[consent.id] ? 'text-slate-900' : 'text-slate-500'}`}>
                                                {consent.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 relative overflow-hidden">
                                    <div className="relative z-10 text-center">
                                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Digital Declaration</div>
                                        <p className="text-xl md:text-2xl font-black text-indigo-900 italic tracking-tight mb-2">
                                            "I confirm that the information provided is accurate and can be legally verified."
                                        </p>
                                        <div className="w-20 h-1 bg-indigo-200 mx-auto rounded-full mt-4" />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-8">
                                    <button
                                        onClick={prevStep}
                                        className="px-8 py-4 text-slate-500 font-black text-sm uppercase tracking-widest hover:text-slate-900 transition-all flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || !Object.values(formData.consents).every(v => v)}
                                        className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-2xl shadow-blue-200 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            <>
                                                Submit Medical Case
                                                <CheckCircle2 className="w-6 h-6" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 6 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 mb-4">Case Submitted!</h2>
                                <p className="text-lg text-slate-600 font-medium mb-10 max-w-md mx-auto">
                                    Your medical case has been sent for verification. You will be notified once the hospital reviews your documents.
                                </p>
                                <button
                                    onClick={() => navigate('/patient-dashboard')}
                                    className="px-12 py-4 premium-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-[1.05] transition-all"
                                >
                                    Go to Dashboard
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SubmitCase;
