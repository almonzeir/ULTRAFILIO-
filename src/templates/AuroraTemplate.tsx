'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, ArrowUpRight, Sparkles, Briefcase, GraduationCap, Award, MapPin, Phone, Globe, ChevronDown, Star, Zap, Code2, Palette, Layers, Sun, Moon } from 'lucide-react';
import type { PortfolioData } from './types';
import { useColorTheme } from '@/context/color-theme-context';
import { COLOR_THEMES, ColorTheme } from '@/lib/color-themes';

// Color mappings for aurora effects based on theme
const AURORA_COLORS: Record<ColorTheme, { primary: string; secondary: string; accent: string; bg: string; bgLight: string }> = {
    purple: {
        primary: 'rgba(139, 92, 246, 0.4)',
        secondary: 'rgba(168, 85, 247, 0.3)',
        accent: 'rgba(236, 72, 153, 0.25)',
        bg: '#0a0118',
        bgLight: '#f5f3ff'
    },
    blue: {
        primary: 'rgba(59, 130, 246, 0.4)',
        secondary: 'rgba(6, 182, 212, 0.3)',
        accent: 'rgba(14, 165, 233, 0.25)',
        bg: '#020617',
        bgLight: '#eff6ff'
    },
    green: {
        primary: 'rgba(16, 185, 129, 0.4)',
        secondary: 'rgba(20, 184, 166, 0.3)',
        accent: 'rgba(34, 197, 94, 0.25)',
        bg: '#022c22',
        bgLight: '#ecfdf5'
    },
    orange: {
        primary: 'rgba(249, 115, 22, 0.4)',
        secondary: 'rgba(251, 146, 60, 0.3)',
        accent: 'rgba(245, 158, 11, 0.25)',
        bg: '#1c1917',
        bgLight: '#fff7ed'
    },
    red: {
        primary: 'rgba(239, 68, 68, 0.4)',
        secondary: 'rgba(244, 63, 94, 0.3)',
        accent: 'rgba(236, 72, 153, 0.25)',
        bg: '#1c0a0a',
        bgLight: '#fef2f2'
    },
    indigo: {
        primary: 'rgba(99, 102, 241, 0.4)',
        secondary: 'rgba(139, 92, 246, 0.3)',
        accent: 'rgba(168, 85, 247, 0.25)',
        bg: '#0c0a1d',
        bgLight: '#eef2ff'
    },
    pink: {
        primary: 'rgba(236, 72, 153, 0.4)',
        secondary: 'rgba(244, 114, 182, 0.3)',
        accent: 'rgba(219, 39, 119, 0.25)',
        bg: '#1c0a14',
        bgLight: '#fdf2f8'
    },
    dark: {
        primary: 'rgba(75, 85, 99, 0.4)',
        secondary: 'rgba(107, 114, 128, 0.3)',
        accent: 'rgba(156, 163, 175, 0.25)',
        bg: '#030712',
        bgLight: '#f9fafb'
    },
};
// ==================== AURORA BACKGROUND (THEME-AWARE) ====================
function AuroraBackground({ colors, isDark }: { colors: typeof AURORA_COLORS['purple']; isDark: boolean }) {
    // Generate stable star positions with deterministic seeded randomness (fixes hydration mismatch)
    // MORE STARS - 300 static + 50 shooting stars
    const stars = useMemo(() =>
        Array.from({ length: 300 }, (_, i) => {
            const seed = i + 1;
            const r = (n: number) => {
                const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
                return x - Math.floor(x);
            };

            return {
                left: `${r(1) * 100}%`,
                top: `${r(2) * 100}%`,
                size: r(3) * 3 + 1, // Slightly larger stars
                opacity: r(4) * 0.6 + 0.4, // More visible
                animDuration: r(5) * 2 + 1.5, // Faster twinkle
                floatDuration: r(6) * 10 + 8, // Faster floating
                floatDelay: r(7) * 3,
                xOffset: r(8) * 50 - 25, // Larger movement range
                yOffset: r(9) * 50 - 25, // Larger movement range
                isBright: r(10) > 0.9, // 10% are extra bright
            };
        }), []
    );

    // Shooting stars - deterministic positions
    const shootingStars = useMemo(() =>
        Array.from({ length: 8 }, (_, i) => {
            const seed = i + 500;
            const r = (n: number) => {
                const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
                return x - Math.floor(x);
            };
            return {
                startLeft: `${r(1) * 80 + 10}%`,
                startTop: `${r(2) * 40}%`,
                delay: i * 4 + r(3) * 3,
                duration: 1.5 + r(4) * 1,
            };
        }), []
    );

    const bgColor = isDark ? colors.bg : colors.bgLight;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500" style={{ backgroundColor: bgColor }}>
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Star field (only in dark mode) - "Magical" floating motion */}
                {isDark && (
                    <>
                        {/* Main rotating star field */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] -translate-x-1/2 -translate-y-1/2"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 600, repeat: Infinity, ease: "linear" }}
                        >
                            {stars.map((star, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        left: star.left,
                                        top: star.top,
                                        width: star.size,
                                        height: star.size,
                                        backgroundColor: 'white',
                                        boxShadow: star.isBright
                                            ? `0 0 ${star.size * 4}px ${star.size * 2}px rgba(255,255,255,0.8), 0 0 ${star.size * 8}px rgba(255,255,255,0.4)`
                                            : `0 0 ${star.size * 2}px rgba(255,255,255,0.6)`,
                                    }}
                                    animate={{
                                        opacity: [star.opacity, 1, star.opacity * 0.5, star.opacity],
                                        scale: [1, star.isBright ? 1.5 : 1.2, 0.8, 1],
                                        x: [0, star.xOffset, -star.xOffset * 0.5, 0],
                                        y: [0, star.yOffset, -star.yOffset * 0.5, 0],
                                    }}
                                    transition={{
                                        opacity: { duration: star.animDuration, repeat: Infinity, ease: "easeInOut" },
                                        scale: { duration: star.animDuration, repeat: Infinity, ease: "easeInOut" },
                                        x: { duration: star.floatDuration, repeat: Infinity, ease: "easeInOut", delay: star.floatDelay },
                                        y: { duration: star.floatDuration, repeat: Infinity, ease: "easeInOut", delay: star.floatDelay },
                                    }}
                                />
                            ))}
                        </motion.div>

                        {/* Shooting stars - occasional streaks across the sky */}
                        {shootingStars.map((ss, i) => (
                            <motion.div
                                key={`shooting-${i}`}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                style={{
                                    left: ss.startLeft,
                                    top: ss.startTop,
                                    boxShadow: '0 0 6px 2px white, -20px 0 20px 1px rgba(255,255,255,0.5), -40px 0 30px 1px rgba(255,255,255,0.3)',
                                }}
                                initial={{ opacity: 0, x: 0, y: 0 }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    x: [0, 200, 400],
                                    y: [0, 100, 200],
                                }}
                                transition={{
                                    duration: ss.duration,
                                    delay: ss.delay,
                                    repeat: Infinity,
                                    repeatDelay: 15 + i * 3,
                                    ease: "easeOut",
                                }}
                            />
                        ))}

                        {/* Extra layer of closer, faster stars for depth */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-[100vmax] h-[100vmax] -translate-x-1/2 -translate-y-1/2"
                            animate={{ rotate: [0, -360] }}
                            transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
                        >
                            {stars.slice(0, 50).map((star, i) => (
                                <motion.div
                                    key={`close-${i}`}
                                    className="absolute rounded-full bg-white"
                                    style={{
                                        left: `${parseFloat(star.left) * 0.8 + 10}%`,
                                        top: `${parseFloat(star.top) * 0.8 + 10}%`,
                                        width: star.size * 1.5,
                                        height: star.size * 1.5,
                                        boxShadow: `0 0 ${star.size * 6}px rgba(255,255,255,0.8)`,
                                    }}
                                    animate={{
                                        opacity: [0.7, 1, 0.3, 0.7],
                                        scale: [1, 1.3, 0.9, 1],
                                    }}
                                    transition={{
                                        duration: star.animDuration * 0.7,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: i * 0.1,
                                    }}
                                />
                            ))}
                        </motion.div>
                    </>
                )}

                {/* Aurora curtain layers */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Primary aurora - main curtain */}
                    <motion.div
                        className="absolute w-[200%] h-[60%] top-0 -left-1/2"
                        style={{
                            background: `linear-gradient(180deg, transparent 0%, ${colors.primary} 40%, ${colors.secondary} 60%, transparent 100%)`,
                            filter: 'blur(40px)',
                        }}
                        animate={{
                            x: ['-10%', '10%', '-10%'],
                            scaleY: [1, 1.2, 0.8, 1],
                            opacity: isDark ? [0.6, 0.8, 0.5, 0.6] : [0.3, 0.5, 0.25, 0.3],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Secondary aurora */}
                    <motion.div
                        className="absolute w-[150%] h-[50%] top-[10%] -left-1/4"
                        style={{
                            background: `linear-gradient(180deg, transparent 0%, ${colors.secondary} 30%, ${colors.accent} 50%, ${colors.secondary.replace('0.3', '0.1')} 70%, transparent 100%)`,
                            filter: 'blur(50px)',
                        }}
                        animate={{
                            x: ['5%', '-15%', '5%'],
                            scaleY: [0.9, 1.1, 0.9],
                            opacity: isDark ? [0.5, 0.7, 0.5] : [0.25, 0.4, 0.25],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 2,
                        }}
                    />

                    {/* Accent aurora */}
                    <motion.div
                        className="absolute w-[120%] h-[40%] top-[5%] left-[20%]"
                        style={{
                            background: `linear-gradient(180deg, transparent 0%, ${colors.accent} 30%, ${colors.primary} 50%, transparent 100%)`,
                            filter: 'blur(60px)',
                        }}
                        animate={{
                            x: ['-5%', '10%', '-5%'],
                            scaleX: [1, 0.8, 1.2, 1],
                            opacity: isDark ? [0.4, 0.6, 0.3, 0.4] : [0.2, 0.35, 0.15, 0.2],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 4,
                        }}
                    />

                    {/* Vertical light rays */}
                    <motion.div
                        className="absolute w-32 h-[80%] top-0 left-[20%]"
                        style={{
                            background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.primary.replace('0.4', '0.1')} 50%, transparent 100%)`,
                            filter: 'blur(20px)',
                        }}
                        animate={{
                            height: ['60%', '80%', '60%'],
                            opacity: isDark ? [0.3, 0.6, 0.3] : [0.15, 0.3, 0.15],
                            x: [0, 50, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute w-24 h-[70%] top-0 left-[60%]"
                        style={{
                            background: `linear-gradient(180deg, ${colors.secondary} 0%, ${colors.secondary.replace('0.3', '0.1')} 50%, transparent 100%)`,
                            filter: 'blur(25px)',
                        }}
                        animate={{
                            height: ['50%', '70%', '50%'],
                            opacity: isDark ? [0.2, 0.5, 0.2] : [0.1, 0.25, 0.1],
                            x: [0, -30, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 3,
                        }}
                    />
                </div>

                {/* Horizon glow */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[30%] transition-colors duration-500"
                    style={{
                        background: `linear-gradient(to top, ${colors.primary.replace('0.4', '0.2')}, transparent)`
                    }}
                />

                {/* Subtle grid overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)'} 1px, transparent 1px)`,
                        backgroundSize: '80px 80px'
                    }}
                />

                {/* Noise texture for organic feel */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
            </div>
        </div>
    );
}

// ==================== MOUSE SPOTLIGHT ====================
function MouseSpotlight({ color, containerRef }: { color: string; containerRef: React.RefObject<HTMLDivElement> }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateMousePosition = (ev: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            setMousePosition({
                x: ev.clientX - rect.left,
                y: ev.clientY - rect.top
            });
        };
        container.addEventListener('mousemove', updateMousePosition);
        return () => container.removeEventListener('mousemove', updateMousePosition);
    }, [containerRef]);

    return (
        <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
                background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${color}15, transparent 40%)`
            }}
        />
    );
}

// ==================== MAGNETIC BUTTON (THEMED) ====================
function MagneticButton({ children, href, className = '', themeConfig }: { children: React.ReactNode; href?: string; className?: string; themeConfig?: any }) {
    const ref = useRef<HTMLAnchorElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const x = (clientX - left - width / 2) * 0.35;
        const y = (clientY - top - height / 2) * 0.35;
        setPosition({ x, y });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    // Dynamic style if theme provided
    const style = themeConfig ? {
        background: href?.startsWith('mailto') ? `linear-gradient(135deg, ${themeConfig.primary}, ${themeConfig.secondary})` : 'rgba(255,255,255,0.05)',
        borderColor: href?.startsWith('mailto') ? 'transparent' : 'rgba(255,255,255,0.1)',
    } : {};

    return (
        <motion.a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener"
            className={`relative inline-flex items-center gap-2 overflow-hidden ${className}`}
            style={style}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 350, damping: 15 }}
        >
            {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {children}
        </motion.a>
    );
}

// ==================== REVEAL TEXT (ENHANCED) ====================
function RevealText({ children, className = '', delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-20px' });

    return (
        <span ref={ref} className={`inline-block overflow-hidden ${className}`} style={style}>
            <motion.span
                className="inline-block"
                initial={{ y: '100%', opacity: 0, rotateX: 20 }}
                animate={isInView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                transition={{ duration: 0.8, delay, ease: [0.2, 0.65, 0.3, 0.9] }}
            >
                {children}
            </motion.span>
        </span>
    );
}

// ==================== ANIMATED GRADIENT TEXT ====================
function AnimatedGradientText({
    children,
    className = '',
    themeConfig
}: {
    children: React.ReactNode;
    className?: string;
    themeConfig: { primary: string; secondary: string; accent: string };
}) {
    return (
        <motion.span
            className={`inline-block bg-clip-text text-transparent bg-[length:300%_100%] ${className}`}
            style={{
                backgroundImage: `linear-gradient(90deg, ${themeConfig.primary}, ${themeConfig.secondary}, ${themeConfig.accent}, ${themeConfig.secondary}, ${themeConfig.primary})`,
            }}
            animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'linear',
            }}
        >
            {children}
        </motion.span>
    );
}

// ==================== BENTO CARD (DYNAMIC THEME) ====================
function BentoCard({
    children,
    className = '',
    themeColor,
    delay = 0,
    isDark = true
}: {
    children: React.ReactNode;
    className?: string;
    themeColor: string;
    delay?: number;
    isDark?: boolean;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [hover, setHover] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`
                relative group overflow-hidden rounded-3xl
                transition-all duration-500
                border
                ${className}
            `}
            style={{
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                borderColor: hover ? themeColor : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                boxShadow: hover ? `0 20px 40px -10px ${themeColor}20` : 'none'
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* Dynamic Gradient overlay on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                    background: `radial-gradient(800px circle at 50% -20%, ${themeColor}15, transparent 40%)`
                }}
            />

            {/* Content container */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
}

// ==================== BEAUTIFUL SKILLS CLOUD ====================
function SkillOrbit({ skills, themeColor, isDark }: { skills: string[], themeColor: string, isDark: boolean }) {
    // Create a beautiful floating skills cloud instead of messy orbit
    return (
        <div className="relative w-full h-full min-h-[280px] flex flex-col items-center justify-center py-4">
            {/* Glowing background effect */}
            <div
                className="absolute inset-0 opacity-20 blur-3xl"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${themeColor}, transparent 70%)`
                }}
            />

            {/* Skills as beautiful floating tags */}
            <div className="relative z-10 flex flex-wrap justify-center gap-2 px-2 max-w-full">
                {skills.slice(0, 12).map((skill, i) => (
                    <motion.div
                        key={skill}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            delay: i * 0.08,
                            duration: 0.5,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        whileHover={{
                            scale: 1.1,
                            y: -5,
                            transition: { duration: 0.2 }
                        }}
                        className="group cursor-default"
                    >
                        <div
                            className={`
                                px-3 py-1.5 rounded-full text-sm font-medium
                                backdrop-blur-md border transition-all duration-300
                                ${isDark
                                    ? 'bg-white/5 border-white/10 text-white/90 hover:border-white/30 hover:bg-white/10'
                                    : 'bg-black/5 border-black/10 text-black/80 hover:border-black/20 hover:bg-black/10'
                                }
                            `}
                            style={{
                                boxShadow: `0 0 0 0 ${themeColor}00`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `0 0 20px ${themeColor}40, 0 4px 15px rgba(0,0,0,0.2)`;
                                e.currentTarget.style.borderColor = themeColor;
                                e.currentTarget.style.color = themeColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = `0 0 0 0 ${themeColor}00`;
                                e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                                e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)';
                            }}
                        >
                            {skill}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Show count if more skills exist */}
            {skills.length > 12 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className={`mt-4 text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}
                >
                    +{skills.length - 12} more skills
                </motion.div>
            )}
        </div>
    );
}

// ==================== FLOATING STAT (THEMED) ====================
function FloatingStat({ value, label, icon: Icon, delay = 0, themeColor, isDark }: { value: string; label: string; icon: any; delay?: number; themeColor: string; isDark: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6 }}
            className="flex items-center gap-3 group"
        >
            <div
                className="p-3 rounded-2xl border transition-colors duration-300 group-hover:scale-110"
                style={{
                    background: `${themeColor}15`, // 15 = 8% opacity approx
                    borderColor: `${themeColor}30`,
                    color: themeColor
                }}
            >
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
                <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{label}</div>
            </div>
        </motion.div>
    );
}

// ==================== MAIN TEMPLATE ====================
export default function AuroraTemplate({ data, isDarkMode }: { data: PortfolioData; isDarkMode?: boolean }) {
    const { personalInfo, about, experience, projects, education } = data;
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Theme support
    const { theme } = useColorTheme();
    // Internal state synced with global prop
    const [localIsDark, setLocalIsDark] = useState(true);
    const isDark = isDarkMode !== undefined ? isDarkMode : localIsDark;

    // Sync with global prop
    useEffect(() => {
        if (isDarkMode !== undefined) setLocalIsDark(isDarkMode);
    }, [isDarkMode]);
    const auroraColors = AURORA_COLORS[theme] || AURORA_COLORS.purple;
    const themeConfig = COLOR_THEMES[theme] || COLOR_THEMES.purple;

    // Flatten skills for orbit
    const allSkills = about.skills?.flatMap(s => s.tags || []) || [];

    // Dynamic text colors based on mode
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-white/70' : 'text-gray-600';
    const textMuted = isDark ? 'text-white/50' : 'text-gray-500';
    const cardBg = isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]';
    const cardBorder = isDark ? 'border-white/10' : 'border-black/10';

    return (
        <div ref={containerRef} className={`min-h-screen overflow-x-hidden transition-colors duration-500 relative ${textPrimary}`}>
            <AuroraBackground colors={auroraColors} isDark={isDark} />
            <MouseSpotlight color={themeConfig.primary} containerRef={containerRef} />

            {/* Progress bar - uses theme color */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
                style={{
                    scaleX: smoothProgress,
                    background: `linear-gradient(to right, ${themeConfig.primary}, ${themeConfig.secondary}, ${themeConfig.accent})`
                }}
            />

            {/* Dark/Light Mode Toggle */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                onClick={() => setLocalIsDark(!isDark)}
                className={`absolute top-6 right-6 z-50 p-3 rounded-full backdrop-blur-md transition-all duration-300 ${isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-black/10 hover:bg-black/20 text-gray-900'
                    } border ${cardBorder}`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center px-6 py-20">

                <div className="relative z-10 max-w-6xl mx-auto w-full">
                    {/* Hero content */}
                    <div className="text-center mb-16">

                        {/* User Avatar (New "Awesome" Addition) */}
                        {personalInfo.profilePhotoURL && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="relative w-32 h-32 mx-auto mb-8 group"
                            >
                                <div className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse" style={{ background: themeConfig.primary }} />
                                <div className={`relative w-full h-full rounded-full overflow-hidden border-2 ${cardBorder} p-1 backdrop-blur-md`}>
                                    <img
                                        src={personalInfo.profilePhotoURL}
                                        alt={personalInfo.fullName}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none rounded-full" />
                                </div>
                            </motion.div>
                        )}
                        {/* Glowing badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm mb-8 ${cardBorder} ${cardBg}`}
                        >
                            <Sparkles className="w-4 h-4" style={{ color: themeConfig.primary }} />
                            <span className={`text-sm ${textSecondary}`}>Available for new projects</span>
                        </motion.div>

                        {/* Name with gradient */}
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter">
                            <RevealText className={`block text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-white via-white/80 to-white' : 'from-gray-900 via-gray-700 to-gray-900'}`}>
                                {personalInfo.fullName.split(' ')[0]}
                            </RevealText>
                            <RevealText delay={0.1} className="block text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${themeConfig.primary}, ${themeConfig.secondary}, ${themeConfig.accent})` }}>
                                <span style={{ backgroundImage: `linear-gradient(to right, ${themeConfig.primary}, ${themeConfig.secondary}, ${themeConfig.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {personalInfo.fullName.split(' ').slice(1).join(' ')}
                                </span>
                            </RevealText>
                        </h1>

                        {/* Title with animated underline */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="relative inline-block"
                        >
                            <span className={`text-2xl md:text-3xl font-light ${textSecondary}`}>{personalInfo.title}</span>
                            <motion.div
                                className="absolute -bottom-2 left-0 h-0.5"
                                style={{ background: `linear-gradient(90deg, ${themeConfig.primary}, ${themeConfig.secondary})` }}
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 1, duration: 0.8 }}
                            />
                        </motion.div>

                        {/* Tagline */}
                        {personalInfo.tagline && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className={`mt-8 text-lg ${textMuted} max-w-xl mx-auto`}
                            >
                                {personalInfo.tagline}
                            </motion.p>
                        )}

                        {/* CTA buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="mt-12 flex flex-wrap justify-center gap-4"
                        >
                            <MagneticButton
                                href={`mailto:${personalInfo.email}`}
                                className="px-8 py-4 rounded-full text-white font-semibold hover:shadow-lg transition-all"
                                themeConfig={themeConfig}
                            >
                                <Mail className="w-5 h-5" />
                                Let&apos;s Talk
                            </MagneticButton>
                            {personalInfo.githubURL && (
                                <MagneticButton
                                    href={personalInfo.githubURL}
                                    className={`px-8 py-4 rounded-full backdrop-blur-sm border font-semibold transition-all ${cardBorder} ${cardBg} ${textPrimary} hover:bg-white/10`}
                                >
                                    <Github className="w-5 h-5" />
                                    GitHub
                                </MagneticButton>
                            )}
                        </motion.div>
                    </div>

                    {/* Scroll indicator */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 10, 0] }}
                        transition={{ opacity: { delay: 2 }, y: { duration: 2, repeat: Infinity } }}
                    >
                        <ChevronDown className={`w-8 h-8 ${textMuted}`} />
                    </motion.div>
                </div>
            </section>

            {/* ===== BENTO GRID SECTION ===== */}
            <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-10 sm:mb-16">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`inline-block text-xs sm:text-sm uppercase tracking-widest mb-4 ${textMuted}`}
                        >
                            Get to know me
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold"
                        >
                            <AnimatedGradientText themeConfig={themeConfig}>
                                About Me
                            </AnimatedGradientText>
                        </motion.h2>
                    </div>

                    {/* Bento grid - improved gaps for mobile */}
                    <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-6">
                        {/* Bio card - large */}
                        <BentoCard className="col-span-12 md:col-span-8 p-8" themeColor={themeConfig.primary} isDark={isDark}>
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg" style={{ background: `${themeConfig.primary}20` }}>
                                        <Code2 className="w-5 h-5" style={{ color: themeConfig.primary }} />
                                    </div>
                                    <span className={`text-sm uppercase tracking-wider ${textMuted}`}>Bio</span>
                                </div>
                                <p className={`text-xl md:text-2xl leading-relaxed flex-grow ${isDark ? 'text-white/80' : 'text-gray-800'}`}>
                                    {about.extendedBio || personalInfo.tagline}
                                </p>
                                <div className="mt-8 flex flex-wrap gap-6">
                                    {about.stats?.slice(0, 3).map((stat, i) => (
                                        <FloatingStat
                                            key={i}
                                            value={stat.value}
                                            label={stat.label}
                                            icon={Zap}
                                            delay={i * 0.1}
                                            themeColor={themeConfig.primary}
                                            isDark={isDark}
                                        />
                                    ))}
                                </div>
                            </div>
                        </BentoCard>

                        {/* Skills orbit card */}
                        <BentoCard className="col-span-12 md:col-span-4 p-6" themeColor={themeConfig.secondary} isDark={isDark}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg" style={{ background: `${themeConfig.secondary}20` }}>
                                    <Palette className="w-5 h-5" style={{ color: themeConfig.secondary }} />
                                </div>
                                <span className={`text-sm uppercase tracking-wider ${textMuted}`}>Skills</span>
                            </div>
                            <SkillOrbit skills={allSkills} themeColor={themeConfig.secondary} isDark={isDark} />
                        </BentoCard>

                        {/* Location card - More impressive */}
                        <BentoCard className="col-span-6 md:col-span-3 p-6" themeColor={themeConfig.accent} delay={0.1} isDark={isDark}>
                            <div className="h-full flex flex-col items-center justify-center text-center relative">
                                {/* Animated background pulse */}
                                <motion.div
                                    className="absolute inset-0 rounded-full opacity-10"
                                    style={{ background: `radial-gradient(circle, ${themeConfig.accent}, transparent 70%)` }}
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="relative mb-4 p-4 rounded-2xl"
                                    style={{ background: `${themeConfig.accent}20` }}
                                >
                                    <MapPin className="w-8 h-8" style={{ color: themeConfig.accent }} />
                                </motion.div>
                                <span className={`text-xs uppercase tracking-widest mb-1 ${textMuted}`}>Based in</span>
                                <span className={`text-xl font-bold ${textPrimary}`}>{personalInfo.location || 'Remote'}</span>
                            </div>
                        </BentoCard>

                        {/* Contact card - More impressive */}
                        <BentoCard className="col-span-6 md:col-span-3 p-6" themeColor={themeConfig.primary} delay={0.2} isDark={isDark}>
                            <div className="h-full flex flex-col items-center justify-center text-center relative">
                                {/* Animated background pulse */}
                                <motion.div
                                    className="absolute inset-0 rounded-full opacity-10"
                                    style={{ background: `radial-gradient(circle, ${themeConfig.primary}, transparent 70%)` }}
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                />
                                <motion.a
                                    href={`mailto:${personalInfo.email}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="relative mb-4 p-4 rounded-2xl cursor-pointer"
                                    style={{ background: `${themeConfig.primary}20` }}
                                >
                                    <Mail className="w-8 h-8" style={{ color: themeConfig.primary }} />
                                </motion.a>
                                <span className={`text-xs uppercase tracking-widest mb-1 ${textMuted}`}>Get in touch</span>
                                <span className={`text-base font-semibold truncate max-w-full px-2 ${textPrimary}`}>{personalInfo.email}</span>
                            </div>
                        </BentoCard>

                        {/* Social links - More impressive */}
                        <BentoCard className="col-span-12 md:col-span-6 p-6 sm:p-8" themeColor={themeConfig.secondary} delay={0.3} isDark={isDark}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-full gap-4 sm:gap-6">
                                <div className="flex-1">
                                    <span className={`text-xs uppercase tracking-widest ${textMuted}`}>Connect</span>
                                    <h3 className={`text-xl sm:text-2xl font-bold mt-1 ${textPrimary}`}>Let&apos;s build together</h3>
                                    <p className={`text-sm mt-2 ${textMuted} hidden sm:block`}>Find me on these platforms</p>
                                </div>
                                <div className="flex gap-3 sm:gap-4">
                                    {personalInfo.githubURL && (
                                        <motion.a
                                            href={personalInfo.githubURL}
                                            target="_blank"
                                            rel="noopener"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                            whileHover={{ scale: 1.15, y: -3 }}
                                            className={`p-3 sm:p-4 rounded-2xl border transition-all duration-300 ${cardBg} ${cardBorder}`}
                                            style={{ boxShadow: `0 0 0 0 transparent` }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow = `0 0 25px #333333, 0 8px 25px rgba(0,0,0,0.3)`;
                                                e.currentTarget.style.borderColor = '#333';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow = `0 0 0 0 transparent`;
                                                e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            <Github className={`w-5 h-5 sm:w-6 sm:h-6 ${textPrimary}`} />
                                        </motion.a>
                                    )}
                                    {personalInfo.linkedInURL && (
                                        <motion.a
                                            href={personalInfo.linkedInURL}
                                            target="_blank"
                                            rel="noopener"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                            whileHover={{ scale: 1.15, y: -3 }}
                                            className={`p-3 sm:p-4 rounded-2xl border transition-all duration-300 ${cardBg} ${cardBorder}`}
                                            style={{ boxShadow: `0 0 0 0 transparent` }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow = `0 0 25px #0077B5, 0 8px 25px rgba(0,0,0,0.3)`;
                                                e.currentTarget.style.borderColor = '#0077B5';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow = `0 0 0 0 transparent`;
                                                e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            <Linkedin className={`w-5 h-5 sm:w-6 sm:h-6`} style={{ color: '#0077B5' }} />
                                        </motion.a>
                                    )}
                                    {personalInfo.website && (
                                        <motion.a
                                            href={personalInfo.website}
                                            target="_blank"
                                            rel="noopener"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                                            whileHover={{ scale: 1.15, y: -3 }}
                                            className={`p-3 sm:p-4 rounded-2xl border transition-all duration-300 ${cardBg} ${cardBorder}`}
                                            style={{ boxShadow: `0 0 0 0 transparent` }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow = `0 0 25px ${themeConfig.primary}, 0 8px 25px rgba(0,0,0,0.3)`;
                                                e.currentTarget.style.borderColor = themeConfig.primary;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow = `0 0 0 0 transparent`;
                                                e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            <Globe className={`w-5 h-5 sm:w-6 sm:h-6`} style={{ color: themeConfig.primary }} />
                                        </motion.a>
                                    )}
                                </div>
                            </div>
                        </BentoCard>
                    </div>
                </div>
            </section>

            {/* ===== PROJECTS SECTION ===== */}
            <section className="relative z-10 px-6 py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`inline-block text-xs sm:text-sm uppercase tracking-widest mb-4 ${textMuted}`}
                        >
                            My Portfolio
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold"
                        >
                            <AnimatedGradientText themeConfig={themeConfig}>
                                Featured Work
                            </AnimatedGradientText>
                        </motion.h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((project, i) => {
                            const projectColor = i % 2 === 0 ? themeConfig.primary : themeConfig.secondary;
                            return (
                                <BentoCard
                                    key={i}
                                    className="p-8 group cursor-pointer"
                                    themeColor={projectColor}
                                    delay={i * 0.1}
                                    isDark={isDark}
                                >
                                    <div className="flex flex-col h-full">
                                        {/* Project header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <span className="text-sm uppercase tracking-wider mb-2 block" style={{ color: projectColor }}>{project.category}</span>
                                                <h3 className={`text-2xl font-bold transition-colors group-hover:opacity-80 ${textPrimary}`}>
                                                    {project.name}
                                                </h3>
                                            </div>
                                            {project.detailsURL && (
                                                <MagneticButton href={project.detailsURL} className={`p-3 rounded-xl border transition-colors ${cardBg} ${cardBorder} hover:bg-white/10`}>
                                                    <ArrowUpRight className={`w-5 h-5 group-hover:rotate-45 transition-transform ${textPrimary}`} />
                                                </MagneticButton>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <p className={`flex-grow mb-6 ${textSecondary}`}>{project.description}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags?.slice(0, 4).map((tag, j) => (
                                                <span key={j} className={`px-3 py-1 text-sm rounded-full border ${textSecondary}`} style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </BentoCard>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== EXPERIENCE SECTION ===== */}
            <section className="relative z-10 px-6 py-24">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <RevealText className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent`} style={{ backgroundImage: `linear-gradient(to right, ${isDark ? 'white, rgba(255,255,255,0.6)' : 'black, rgba(0,0,0,0.6)'})` }}>
                            Experience
                        </RevealText>
                    </div>

                    <div className="space-y-6">
                        {experience.map((exp, i) => (
                            <BentoCard key={i} className="p-8" themeColor={themeConfig.primary} delay={i * 0.1} isDark={isDark}>
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 rounded-2xl border flex items-center justify-center" style={{ background: `${themeConfig.primary}20`, borderColor: `${themeConfig.primary}30` }}>
                                            <Briefcase className="w-7 h-7" style={{ color: themeConfig.primary }} />
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                                            <h3 className={`text-xl font-bold ${textPrimary}`}>{exp.jobTitle}</h3>
                                            <span className={`text-sm ${textMuted}`}>{exp.dates}</span>
                                        </div>
                                        <p className="font-medium mb-4" style={{ color: themeConfig.secondary }}>{exp.company}</p>
                                        {exp.responsibilities && (
                                            <ul className="space-y-2">
                                                {exp.responsibilities.slice(0, 3).map((resp, j) => (
                                                    <li key={j} className={`text-sm flex items-start gap-2 ${textSecondary}`}>
                                                        <Star className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: themeConfig.secondary }} />
                                                        {resp}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </BentoCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== EDUCATION SECTION ===== */}
            {education && education.length > 0 && (
                <section className="relative z-10 px-6 py-24">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <RevealText className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent`} style={{ backgroundImage: `linear-gradient(to right, ${isDark ? 'white, rgba(255,255,255,0.6)' : 'black, rgba(0,0,0,0.6)'})` }}>
                                Education
                            </RevealText>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {education.map((edu, i) => (
                                <BentoCard key={i} className="p-6" themeColor={themeConfig.accent} delay={i * 0.1} isDark={isDark}>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl border" style={{ background: `${themeConfig.accent}20`, borderColor: `${themeConfig.accent}30` }}>
                                            <GraduationCap className="w-6 h-6" style={{ color: themeConfig.accent }} />
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-bold mb-1 ${textPrimary}`}>{edu.degree}</h3>
                                            <p className="text-sm mb-2" style={{ color: themeConfig.accent }}>{edu.institution}</p>
                                            <p className={`text-sm ${textMuted}`}>{edu.startDate} - {edu.endDate}</p>
                                        </div>
                                    </div>
                                </BentoCard>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== FOOTER CTA ===== */}
            <section className="relative z-10 px-6 py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black mb-8">
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${themeConfig.primary}, ${themeConfig.secondary}, ${themeConfig.accent})` }}>
                                Let&apos;s Create
                            </span>
                            <br />
                            <span className={textPrimary}>Something Amazing</span>
                        </h2>

                        <p className={`text-xl mb-12 max-w-xl mx-auto ${textSecondary}`}>
                            Ready to bring your vision to life? Let&apos;s collaborate and build something extraordinary together.
                        </p>

                        <MagneticButton
                            href={`mailto:${personalInfo.email}`}
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-size-200 animate-gradient text-white font-bold text-lg hover:shadow-2xl transition-all"
                            themeConfig={themeConfig}
                        >
                            <Mail className="w-6 h-6" />
                            Start a Conversation
                            <ArrowUpRight className="w-5 h-5" />
                        </MagneticButton>
                    </motion.div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className={`relative z-10 px-6 py-8 border-t ${cardBorder}`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className={`text-sm ${textMuted}`}>
                        © {new Date().getFullYear()} {personalInfo.fullName}. Crafted with passion.
                    </p>
                    <div className="flex gap-6">
                        {personalInfo.githubURL && (
                            <a href={personalInfo.githubURL} target="_blank" rel="noopener" className={`${textMuted} hover:text-white transition-colors`}>
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                        {personalInfo.linkedInURL && (
                            <a href={personalInfo.linkedInURL} target="_blank" rel="noopener" className={`${textMuted} hover:text-white transition-colors`}>
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                        {personalInfo.email && (
                            <a href={`mailto:${personalInfo.email}`} className={`${textMuted} hover:text-white transition-colors`}>
                                <Mail className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
