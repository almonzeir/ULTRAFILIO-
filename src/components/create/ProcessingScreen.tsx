'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Star, Code2, Diamond } from 'lucide-react';

const PORTFOLIO_FACTS = [
    "Your portfolio speaks louder than your résumé.",
    "Small side-projects can change your career.",
    "Your portfolio shapes people's perception instantly.",
    "Portfolios beat degrees in creative fields.",
    "Digital portfolios are global branding power.",
    "One great project can open a thousand doors.",
    "Your work tells your story better than words.",
    "Recruiters spend 7 seconds on a résumé, 2 minutes on a portfolio.",
    "The best portfolios show process, not just results.",
    "A portfolio is your 24/7 sales pitch."
];

const PROCESSING_STEPS = [
    { label: "Initializing Neural Engine", duration: 2500 },
    { label: "Scanning Professional DNA", duration: 3000 },
    { label: "Extracting Semantic Insights", duration: 4000 },
    { label: "Optimizing Layout Matrix", duration: 3500 },
    { label: "Synthesizing Design System", duration: 3000 },
    { label: "Finalizing Your UltraFolio", duration: 2000 },
];

export default function ProcessingScreen() {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [factIndex, setFactIndex] = React.useState(0);

    // Rotate through facts
    React.useEffect(() => {
        const factInterval = setInterval(() => {
            setFactIndex((prev) => (prev + 1) % PORTFOLIO_FACTS.length);
        }, 4000);
        return () => clearInterval(factInterval);
    }, []);

    // Step progression
    React.useEffect(() => {
        let timeout: NodeJS.Timeout;
        const runSteps = (index: number) => {
            if (index >= PROCESSING_STEPS.length) return;
            setCurrentStep(index);
            timeout = setTimeout(() => {
                runSteps(index + 1);
            }, PROCESSING_STEPS[index].duration);
        };
        runSteps(0);
        return () => clearTimeout(timeout);
    }, []);

    const progress = (currentStep / (PROCESSING_STEPS.length - 1)) * 100;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]">
            {/* Animated Silver Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    animation: 'gridMove 30s linear infinite'
                }} />
            </div>

            {/* Floating Silver Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(200,200,200,0.3))',
                            boxShadow: '0 0 10px rgba(255,255,255,0.3)',
                        }}
                        animate={{
                            y: [0, -150, 0],
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1.2, 0.5],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                    />
                ))}
            </div>

            {/* Subtle Silver Gradient Orbs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[200px] opacity-10 bg-gradient-to-br from-white via-gray-300 to-transparent" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[180px] opacity-10 bg-gradient-to-tr from-gray-200 via-white to-transparent" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[150px] opacity-5 bg-white" />

            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-6">

                {/* Central Premium Orb */}
                <div className="relative w-56 h-56 mb-16 flex items-center justify-center">

                    {/* Outer Silver Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                            border: '2px solid transparent',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(150,150,150,0.1)) padding-box, linear-gradient(135deg, rgba(255,255,255,0.4), rgba(100,100,100,0.2)) border-box',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Middle Diamond Ring */}
                    <motion.div
                        className="absolute inset-4 rounded-full"
                        style={{
                            border: '1px solid transparent',
                            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent) padding-box, linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) border-box',
                        }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Pulsing Glow */}
                    <motion.div
                        className="absolute inset-10 rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                        }}
                        animate={{
                            opacity: [0.3, 0.7, 0.3],
                            scale: [0.9, 1.15, 0.9]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Core Icon Container - Premium Glass */}
                    <motion.div
                        className="relative p-8 rounded-3xl backdrop-blur-xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            boxShadow: '0 0 60px rgba(255,255,255,0.1), inset 0 0 30px rgba(255,255,255,0.05)',
                        }}
                        animate={{
                            boxShadow: [
                                '0 0 60px rgba(255,255,255,0.1), inset 0 0 30px rgba(255,255,255,0.05)',
                                '0 0 80px rgba(255,255,255,0.2), inset 0 0 40px rgba(255,255,255,0.08)',
                                '0 0 60px rgba(255,255,255,0.1), inset 0 0 30px rgba(255,255,255,0.05)',
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        >
                            <Diamond className="w-16 h-16 text-white/80" strokeWidth={1.5} />
                        </motion.div>
                    </motion.div>

                    {/* Orbiting Icons - Silver Accents */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Zap className="w-5 h-5 text-white/70" />
                        </motion.div>
                        <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                        >
                            <Star className="w-5 h-5 text-white/70" />
                        </motion.div>
                        <motion.div
                            className="absolute left-0 top-1/2 -translate-y-1/2"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                        >
                            <Code2 className="w-5 h-5 text-white/70" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Typography & Status - Silver Theme */}
                <div className="text-center space-y-8 w-full">

                    {/* Step Label */}
                    <div className="space-y-4 min-h-[100px]">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={currentStep}
                                initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -25, filter: "blur(10px)" }}
                                transition={{ duration: 0.6 }}
                                className="text-4xl md:text-5xl font-black tracking-tight"
                                style={{
                                    background: 'linear-gradient(180deg, #ffffff 0%, #a0a0a0 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                {PROCESSING_STEPS[currentStep].label}
                            </motion.h2>
                        </AnimatePresence>

                        {/* Status Badge - Premium Silver */}
                        <motion.div
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-sm"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        >
                            <motion.div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    background: 'linear-gradient(135deg, #ffffff, #c0c0c0)',
                                    boxShadow: '0 0 12px rgba(255,255,255,0.6)'
                                }}
                                animate={{ scale: [1, 1.4, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-xs text-white/60 font-semibold uppercase tracking-[0.25em]">Processing</span>
                        </motion.div>
                    </div>

                    {/* Enhanced Progress Bar - Silver Gradient */}
                    <div className="space-y-3">
                        <div className="w-full max-w-lg mx-auto relative">
                            <div
                                className="h-2 w-full rounded-full overflow-hidden"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.8), rgba(255,255,255,0.3))',
                                        backgroundSize: '200% 100%',
                                        boxShadow: '0 0 20px rgba(255,255,255,0.4)',
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${progress}%`,
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                    }}
                                    transition={{
                                        width: { duration: 1 },
                                        backgroundPosition: { duration: 2, repeat: Infinity }
                                    }}
                                />
                            </div>
                        </div>
                        <p className="text-sm text-white/30 font-mono tracking-wider">
                            {Math.round(progress)}% Complete
                        </p>
                    </div>

                    {/* Rotating Facts - Elegant Silver */}
                    <div className="pt-8 min-h-[100px] max-w-xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={factIndex}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.7 }}
                                className="space-y-3"
                            >
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                    <Sparkles className="w-4 h-4 text-white/40" />
                                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                </div>
                                <p className="text-lg text-white/50 font-medium italic leading-relaxed px-6">
                                    "{PORTFOLIO_FACTS[factIndex]}"
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes gridMove {
                    0% { transform: translateY(0) translateX(0); }
                    100% { transform: translateY(60px) translateX(60px); }
                }
            `}</style>
        </div>
    );
}
