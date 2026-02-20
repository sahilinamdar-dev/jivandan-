import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-3">
                        {/* Jivandan Logo - Green Heart with Leaf */}
                        <div className="relative">
                            <div className="p-2 bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-md">
                                <Heart className="text-white w-6 h-6" fill="currentColor" />
                            </div>
                            {/* Leaf accent */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full transform rotate-45"
                                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold font-heading text-slate-900 tracking-tight leading-none">
                                <span className="text-green-700">JIVANDAN</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium leading-tight hidden sm:block">
                                Hope, Health & Help
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-10">
                        {user?.role === 'hospital' ? (
                            <Link to="/hospital-dashboard?tab=verified" className="text-sm font-bold text-slate-500 hover:text-green-700 transition-colors uppercase tracking-widest">My Cases</Link>
                        ) : (
                            <Link to="/cases" className="text-sm font-bold text-slate-500 hover:text-green-700 transition-colors uppercase tracking-widest">Verified Cases</Link>
                        )}
                        <Link to="/how-it-works" className="text-sm font-bold text-slate-500 hover:text-green-700 transition-colors uppercase tracking-widest">How it Works</Link>

                        {user ? (
                            <div className="flex items-center space-x-6 h-10 pl-6 border-l border-slate-100">
                                {user.role === 'admin' && (
                                    <Link to="/manage-hospitals" className="text-sm font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">
                                        Directory
                                    </Link>
                                )}
                                <Link
                                    to={user.role === 'supporter' ? '/supporter-dashboard' : `/${user.role}-dashboard`}
                                    className="flex items-center space-x-3 px-5 py-2 rounded-2xl bg-slate-900 text-white hover:bg-black transition-all shadow-lg shadow-slate-200"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                                        <User className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">{user.name}</span>
                                </Link>
                                <button onClick={logout} className="text-xs font-black text-red-500 hover:text-red-600 uppercase tracking-widest">Logout</button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-6 pl-6 border-l border-slate-100">
                                <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900">Login</Link>
                                <Link to="/register" className="px-8 py-3 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-green-700 transition-all shadow-xl shadow-green-100">
                                    Join Core
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-indigo-600 p-2">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4"
                    >
                        {user?.role === 'hospital' ? (
                            <Link to="/hospital-dashboard?tab=verified" className="block text-slate-600 font-medium">My Verified Cases</Link>
                        ) : (
                            <Link to="/cases" className="block text-slate-600 font-medium">Verified Cases</Link>
                        )}
                        <Link to="/how-it-works" className="block text-slate-600 font-medium">How it Works</Link>
                        {user ? (
                            <Link to={`/${user.role}-dashboard`} className="block text-indigo-600 font-semibold">{user.name}'s Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" className="block text-slate-600 font-medium">Login</Link>
                                <Link to="/register" className="btn-primary block text-center">Join Now</Link>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
