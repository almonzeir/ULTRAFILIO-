'use client';

import { useEffect } from 'react';

/**
 * useShine Hook
 * Tracks the mouse position and updates CSS variables --x and --y on the target element.
 * This is used to create the dynamic "shining glass" effect.
 */
export function useShine(ref: React.RefObject<HTMLElement>) {
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                ref.current.style.setProperty('--x', `${x}px`);
                ref.current.style.setProperty('--y', `${y}px`);
            }
        };

        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [ref]);
}
