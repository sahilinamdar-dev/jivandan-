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
                    <div className="hidden md:flex items-center space-x-8">
                        {user?.role === 'hospital' ? (
                            <Link to="/hospital-dashboard?tab=verified" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">My Verified Cases</Link>
                        ) : (
                            <Link to="/cases" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Verified Cases</Link>
                        )}
                        <Link to="/how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">How it Works</Link>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to={`/${user.role}-dashboard`} className="flex items-center space-x-2 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-all">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-semibold">{user.name}</span>
                                </Link>
                                {user.role === 'admin' && (
                                    <div className="flex items-center space-x-4 border-l border-slate-200 pl-4">
                                        <Link to="/manage-hospitals" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Manage Hospitals</Link>
                                    </div>
                                )}
                                <button onClick={logout} className="text-sm font-semibold text-red-500 hover:text-red-600">Logout</button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium">Login</Link>
                                <Link to="/register" className="btn-primary btn-sm">
                                    Join Now
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
