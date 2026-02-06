import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, CheckCircle } from 'lucide-react';

const SuccessStorySlider = ({ stories }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % stories.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex, isPaused, stories.length]);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => {
            const next = prev + newDirection;
            if (next < 0) return stories.length - 1;
            if (next >= stories.length) return 0;
            return next;
        });
    };

    const currentStory = stories[currentIndex];

    return (
        <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative min-h-[600px] md:h-[600px] flex items-center justify-center py-8 md:py-0">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="absolute w-full px-4 md:px-8"
                    >
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-white/95 backdrop-blur-lg rounded-3xl md:rounded-[3rem] p-6 md:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-blue-100">
                                {/* Background Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl -z-10" />

                                <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                                    {/* Patient Image */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="relative w-full flex justify-center"
                                    >
                                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-2xl opacity-20 animate-pulse" />
                                            <img
                                                src={currentStory.image}
                                                alt={currentStory.patientName}
                                                className="relative w-full h-full object-cover object-center rounded-full shadow-2xl border-4 border-white"
                                            />
                                            <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-green-500 text-white p-3 md:p-4 rounded-2xl shadow-xl">
                                                <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Story Content */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-center md:text-left w-full"
                                    >
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-full text-sm font-bold mb-4 md:mb-6">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>{currentStory.status}</span>
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 md:mb-3">
                                            {currentStory.patientName}
                                        </h3>

                                        <p className="text-slate-600 font-semibold mb-2 text-sm md:text-base">
                                            {currentStory.disease} • Age {currentStory.age}
                                        </p>

                                        <p className="text-xs md:text-sm text-slate-500 font-medium mb-4 md:mb-6">
                                            📍 {currentStory.hospital}
                                        </p>

                                        <div className="relative mb-4 md:mb-6">
                                            <Quote className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-6 h-6 md:w-8 md:h-8 text-blue-200" />
                                            <p className="text-base md:text-lg lg:text-xl text-slate-700 italic leading-relaxed pl-5 md:pl-6">
                                                "{currentStory.quote}"
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                                            <div className="bg-blue-50 border border-blue-100 px-4 md:px-6 py-2 md:py-3 rounded-2xl">
                                                <p className="text-xl md:text-2xl font-black text-blue-600">
                                                    ₹{(currentStory.amountRaised / 1000).toFixed(0)}K
                                                </p>
                                                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Raised</p>
                                            </div>
                                            <div className="bg-indigo-50 border border-indigo-100 px-4 md:px-6 py-2 md:py-3 rounded-2xl">
                                                <p className="text-xl md:text-2xl font-black text-indigo-600">
                                                    {currentStory.supporters}
                                                </p>
                                                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Supporters</p>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-400 font-medium mt-3 md:mt-4">
                                            Treated in {currentStory.treatmentDate}
                                        </p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => paginate(-1)}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 md:p-4 rounded-full shadow-xl hover:scale-110 transition-all backdrop-blur-sm"
                aria-label="Previous story"
            >
                <ChevronLeft className="w-6 h-6 text-slate-900" />
            </button>
            <button
                onClick={() => paginate(1)}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 md:p-4 rounded-full shadow-xl hover:scale-110 transition-all backdrop-blur-sm"
                aria-label="Next story"
            >
                <ChevronRight className="w-6 h-6 text-slate-900" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {stories.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`h-2 rounded-full transition-all ${index === currentIndex
                            ? 'w-8 bg-indigo-600'
                            : 'w-2 bg-slate-300 hover:bg-slate-400'
                            }`}
                        aria-label={`Go to story ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SuccessStorySlider;
