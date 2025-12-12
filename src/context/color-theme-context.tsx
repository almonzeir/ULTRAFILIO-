'use client';

import * as React from 'react';
import { COLOR_THEMES, ColorTheme, DEFAULT_THEME } from '@/lib/color-themes';

interface ColorThemeContextType {
    theme: ColorTheme;
    setTheme: (theme: ColorTheme) => void;
    availableThemes: { name: ColorTheme; primary: string }[];
}

const ColorThemeContext = React.createContext<ColorThemeContextType | undefined>(undefined);

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = React.useState<ColorTheme>(DEFAULT_THEME);

    const setTheme = React.useCallback((newTheme: ColorTheme) => {
        setThemeState(newTheme);
        if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio-color-theme', newTheme);
        }
    }, []);

    // Load theme from localStorage on mount
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('portfolio-color-theme') as ColorTheme;
            if (saved && COLOR_THEMES[saved]) {
                setThemeState(saved);
            }
        }
    }, []);

    // Apply CSS variables
    React.useEffect(() => {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            const themeColors = COLOR_THEMES[theme].css;
            Object.entries(themeColors).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        }
    }, [theme]);

    const availableThemes = React.useMemo(() => {
        return Object.keys(COLOR_THEMES).map(key => ({
            name: key as ColorTheme,
            // Use the HEX primary color for proper background display
            primary: COLOR_THEMES[key as ColorTheme].primary
        }));
    }, []);

    return (
        <ColorThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
            {children}
        </ColorThemeContext.Provider>
    );
}

export function useColorTheme() {
    const context = React.useContext(ColorThemeContext);
    if (!context) {
        throw new Error('useColorTheme must be used within ColorThemeProvider');
    }
    return context;
}
