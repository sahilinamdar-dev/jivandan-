import React, { useState } from 'react';
import { Share2, MessageCircle, Instagram, Copy, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShareButton = ({ caseData, variant = 'default' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = `${window.location.origin}/cases/${caseData.id}`;
    const shareMessage = `🙏 Help Save a Life!\n\n${caseData.patientName} needs urgent help for ${caseData.disease}\nGoal: ₹${(caseData.goal / 100000).toFixed(1)}L\n\nEvery contribution counts. Please donate or share:\n${shareUrl}\n\n#JIVANDAN #MedicalHelp #SaveLives`;

    const handleWhatsAppShare = () => {
        const encodedMessage = encodeURIComponent(shareMessage);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
        setIsOpen(false);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInstagramShare = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            alert("Link copied! \n\nInstagram doesn't support direct web sharing. \nYou can now paste the link in your Story or Bio.");
        }, 500);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {variant === 'icon' ? (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all text-slate-600 hover:text-green-600"
                    title="Share Case"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:text-green-600 transition-all text-sm font-bold text-slate-600 bg-white"
                >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-full mb-3 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[70] origin-bottom-right"
                        >
                            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-50 mb-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share Case</span>
                                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleWhatsAppShare}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 text-slate-700 hover:text-green-700 transition-colors group"
                            >
                                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                    <MessageCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="font-semibold text-sm">WhatsApp</span>
                            </button>

                            <button
                                onClick={handleInstagramShare}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 text-slate-700 hover:text-pink-700 transition-colors group"
                            >
                                <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                                    <Instagram className="w-5 h-5 text-pink-600" />
                                </div>
                                <span className="font-semibold text-sm">Instagram</span>
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors group"
                            >
                                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    {copied ? <Check className="w-5 h-5 text-blue-600" /> : <Copy className="w-5 h-5 text-blue-600" />}
                                </div>
                                <span className="font-semibold text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShareButton;
