// Color themes for portfolio templates
export const COLOR_THEMES = {
    purple: {
        name: '🟣 Purple',
        primary: '#8b5cf6',     // violet-500
        secondary: '#a855f7',    // purple-500
        accent: '#ec4899',       // pink-500
        gradient: 'from-violet-600 to-purple-600',
        css: {
            '--brand': '262 83% 58%',           // violet-500 in HSL
            '--brand-2': '283 71% 67%',          // purple-500 in HSL
            '--brand-contrast': '0 0% 100%',     // white
        }
    },
    blue: {
        name: '🔵 Blue',
        primary: '#3b82f6',     // blue-500
        secondary: '#06b6d4',    // cyan-500
        accent: '#0ea5e9',       // sky-500
        gradient: 'from-blue-600 to-cyan-600',
        css: {
            '--brand': '217 91% 60%',
            '--brand-2': '189 94% 43%',
            '--brand-contrast': '0 0% 100%',
        }
    },
    green: {
        name: '🟢 Green',
        primary: '#10b981',     // emerald-500
        secondary: '#14b8a6',    // teal-500
        accent: '#22c55e',       // green-500
        gradient: 'from-emerald-600 to-teal-600',
        css: {
            '--brand': '160 84% 39%',
            '--brand-2': '173 80% 40%',
            '--brand-contrast': '0 0% 100%',
        }
    },
    orange: {
        name: '🟠 Orange',
        primary: '#f97316',     // orange-500
        secondary: '#fb923c',    // orange-400
        accent: '#f59e0b',       // amber-500
        gradient: 'from-orange-600 to-amber-600',
        css: {
            '--brand': '25 95% 53%',
            '--brand-2': '43 96% 56%',
            '--brand-contrast': '0 0% 100%',
        }
    },
    red: {
        name: '🔴 Red',
        primary: '#ef4444',     // red-500
        secondary: '#f43f5e',    // rose-500
        accent: '#ec4899',       // pink-500
        gradient: 'from-red-600 to-rose-600',
        css: {
            '--brand': '0 84% 60%',
            '--brand-2': '350 89% 60%',
            '--brand-contrast': '0 0% 100%',
        }
    },
    indigo: {
        name: '🔷 Indigo',
        primary: '#6366f1',     // indigo-500
        secondary: '#8b5cf6',    // violet-500
        accent: '#a855f7',       // purple-500
        gradient: 'from-indigo-600 to-violet-600',
        css: {
            '--brand': '239 84% 67%',
            '--brand-2': '262 83% 58%',
            '--brand-contrast': '0 0% 100%',
        }
    },
    pink: {
        name: '💗 Pink',
        primary: '#ec4899',     // pink-500
        secondary: '#f472b6',    // pink-400
        accent: '#db2777',       // pink-600
        gradient: 'from-pink-600 to-rose-600',
        css: {
            '--brand': '330 81% 60%',
            '--brand-2': '350 89% 60%',
            '--brand-contrast': '0 0% 100%',
        }
    },
    dark: {
        name: '⚫ Dark',
        primary: '#1f2937',     // gray-800
        secondary: '#374151',    // gray-700
        accent: '#4b5563',       // gray-600
        gradient: 'from-gray-800 to-gray-700',
        css: {
            '--brand': '220 13% 18%',
            '--brand-2': '217 19% 27%',
            '--brand-contrast': '0 0% 100%',
        }
    },
} as const;

export type ColorTheme = keyof typeof COLOR_THEMES;

export const DEFAULT_THEME: ColorTheme = 'purple';
