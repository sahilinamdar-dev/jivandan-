import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Mail, Lock, UserPlus, ArrowRight, ArrowLeft, Heart, Eye, EyeOff, Phone, MapPin, Globe, FileText, CheckCircle2, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [supporterType, setSupporterType] = useState('individual');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        gender: '',
        dob: '',
        idNumber: '',
        registrationNumber: '',
        address: '',
        city: '',
        state: '',
        website: '',
        description: ''
    });

    const roles = [
        { id: 'patient', title: 'Patient', desc: 'Seeking medical aid', icon: User, color: 'from-blue-500 to-blue-600' },
        { id: 'supporter', title: 'Supporter', desc: 'Donor or NGO', icon: Heart, color: 'from-green-500 to-emerald-600' },
        { id: 'hospital', title: 'Hospital', desc: 'Verify medical cases', icon: Building2, color: 'from-indigo-500 to-purple-600' },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const submissionData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: role,
                phone: formData.phone,
                gender: role === 'patient' ? formData.gender : null,
                dob: role === 'patient' ? formData.dob : null,
                idNumber: role === 'patient' ? formData.idNumber : null,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                supporterType: role === 'supporter' ? supporterType : null,
                organizationDetails: (role === 'hospital' || (role === 'supporter' && supporterType === 'ngo')) ? {
                    registrationNumber: formData.registrationNumber,
                    description: formData.description,
                    website: formData.website
                } : null
            };

            await register(submissionData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-2xl border border-emerald-100"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Registration Successful!</h2>
                    <p className="text-slate-600 font-medium mb-8">
                        {role === 'hospital' || (role === 'supporter' && supporterType === 'ngo')
                            ? "Your account has been created and is pending administrator approval. We'll notify you once verified."
                            : "Your account is ready! Please check your email to verify your address."}
                    </p>
                    <div className="text-sm font-bold text-indigo-600 animate-pulse">
                        Redirecting to login in 5 seconds...
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-12 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-3xl w-full mx-auto">
                {/* Header */}
                <div className="text-center mb-8 md:mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 mb-4"
                    >
                        <Heart className="text-white w-8 h-8" fill="currentColor" />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Start Your Journey</h2>
                    <p className="text-base md:text-lg text-slate-600">Join our trust-based medical aid network</p>
                </div>

                {/* Card */}
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 md:p-10 shadow-2xl border border-blue-100 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-6 text-center">Select Your Role</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {roles.map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => { setRole(r.id); setStep(2); }}
                                            className={`flex items-center p-5 md:p-6 rounded-2xl border-2 transition-all ${role === r.id
                                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                                : 'border-slate-200 hover:border-blue-300 bg-white hover:shadow-md'
                                                }`}
                                        >
                                            <div className={`p-3 md:p-4 rounded-xl bg-gradient-to-br ${r.color} shadow-lg`}>
                                                <r.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                            </div>
                                            <div className="ml-4 md:ml-5 text-left flex-1">
                                                <div className="font-black text-base md:text-lg text-slate-900">{r.title}</div>
                                                <div className="text-sm md:text-base text-slate-600 mt-0.5">{r.desc}</div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-slate-400" />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-5 md:space-y-6"
                            >
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline mb-4 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back to role selection
                                </button>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl md:text-2xl font-black text-slate-800">
                                        {role === 'hospital' ? 'Hospital Verification' : `Create your ${role === 'supporter' ? supporterType : role} account`}
                                    </h3>
                                    {import.meta.env.DEV && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const hospitalNames = ["City General Hospital", "Metro Wellness Center", "St. Mary Medical", "Apollo Specialty", "Fortis Care"];
                                                const ngoNames = ["Global Health Initiative", "Care for All Foundation", "Mercy Corps India", "Lifeline Trust", "Hope Foundation"];
                                                const patientNames = ["John Doe", "Jane Smith", "Robert Brown", "Emily Davis", "Sahil Inamdar"];
                                                const selectedName = role === 'hospital' ? hospitalNames[Math.floor(Math.random() * hospitalNames.length)] : role === 'supporter' && supporterType === 'ngo' ? ngoNames[Math.floor(Math.random() * ngoNames.length)] : patientNames[Math.floor(Math.random() * patientNames.length)];

                                                setFormData({
                                                    ...formData,
                                                    name: selectedName,
                                                    registrationNumber: (role === 'hospital' || (role === 'supporter' && supporterType === 'ngo')) ? `REG-${Math.floor(100000 + Math.random() * 900000)}` : '',
                                                    address: "123 Healthcare Avenue, Medical District",
                                                    city: "Mumbai",
                                                    state: "Maharashtra",
                                                    website: (role === 'hospital' || (role === 'supporter' && supporterType === 'ngo')) ? `https://www.${selectedName.toLowerCase().replace(/ /g, '')}.org` : '',
                                                    description: role === 'hospital' ? "A leading multi-specialty hospital dedicated to providing accessible healthcare at the highest standards." : "Non-profit organization focused on providing life-saving medical assistance to underprivileged communities.",
                                                    gender: role === 'patient' ? ['male', 'female', 'other'][Math.floor(Math.random() * 3)] : '',
                                                    dob: role === 'patient' ? '1990-01-01' : '',
                                                    idNumber: role === 'patient' ? `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}` : ''
                                                });
                                            }}
                                            className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-100 transition-all flex items-center gap-2"
                                        >
                                            <Activity className="w-3 h-3" />
                                            Quick Fill (Dev)
                                        </button>
                                    )}
                                </div>

                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                                            {error}
                                        </div>
                                    )}

                                    {role === 'supporter' && (
                                        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                                            <button
                                                type="button"
                                                onClick={() => setSupporterType('individual')}
                                                className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${supporterType === 'individual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                            >
                                                Individual
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSupporterType('ngo')}
                                                className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${supporterType === 'ngo' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                            >
                                                Registered NGO
                                            </button>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Basic Info */}
                                        <div className="relative">
                                            <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                placeholder={role === 'hospital' ? 'Hospital Name' : role === 'supporter' && supporterType === 'ngo' ? 'NGO Name' : 'Full Name'}
                                            />
                                        </div>

                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                placeholder="Email Address"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                placeholder="Phone Number"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                placeholder="Create Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>

                                        {/* Patient Specific Details */}
                                        {role === 'patient' && (
                                            <>
                                                <div className="relative">
                                                    <select
                                                        name="gender"
                                                        required
                                                        value={formData.gender}
                                                        onChange={handleChange}
                                                        className="block w-full px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 appearance-none"
                                                    >
                                                        <option value="" disabled>Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>

                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        name="dob"
                                                        required
                                                        value={formData.dob}
                                                        onChange={handleChange}
                                                        className="block w-full px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900"
                                                        title="Date of Birth"
                                                    />
                                                </div>

                                                <div className="relative md:col-span-2">
                                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        name="idNumber"
                                                        required
                                                        value={formData.idNumber}
                                                        onChange={handleChange}
                                                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                        placeholder="Government ID Number (Aadhaar/PAN/Voter ID)"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Organization/Patient Location Details */}
                                        {(role === 'hospital' || role === 'patient' || (role === 'supporter' && supporterType === 'ngo')) && (
                                            <>
                                                <div className="relative md:col-span-2">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        required
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                        placeholder="Full Address"
                                                    />
                                                </div>

                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        required
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                        placeholder="City"
                                                    />
                                                </div>

                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        required
                                                        value={formData.state}
                                                        onChange={handleChange}
                                                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                        placeholder="State"
                                                    />
                                                </div>

                                                {/* Org Only */}
                                                {(role === 'hospital' || (role === 'supporter' && supporterType === 'ngo')) && (
                                                    <>
                                                        <div className="relative md:col-span-2">
                                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input
                                                                type="text"
                                                                name="registrationNumber"
                                                                required
                                                                value={formData.registrationNumber}
                                                                onChange={handleChange}
                                                                className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                                placeholder="Goverment Registration Number"
                                                            />
                                                        </div>

                                                        <div className="relative md:col-span-2">
                                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input
                                                                type="url"
                                                                name="website"
                                                                value={formData.website}
                                                                onChange={handleChange}
                                                                className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                                placeholder="Website (Optional)"
                                                            />
                                                        </div>

                                                        <div className="relative md:col-span-2">
                                                            <textarea
                                                                name="description"
                                                                required
                                                                value={formData.description}
                                                                onChange={handleChange}
                                                                rows="3"
                                                                className="block w-full px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
                                                                placeholder={role === 'hospital' ? 'Hospital specialization and facility overview...' : 'NGO mission and impact...'}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center justify-center group disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Creating Account...
                                            </div>
                                        ) : (
                                            <>
                                                Complete Sign Up
                                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Login Link */}
                <p className="mt-8 text-center text-slate-600 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
