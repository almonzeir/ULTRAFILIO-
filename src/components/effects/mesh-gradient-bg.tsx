'use client';

import { useEffect, useRef } from 'react';

/**
 * MeshGradientBackground - Liquid Silver Theme
 * Creates a living mesh gradient with silver/gray accent colors.
 */
export default function MeshGradientBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationId: number;
        let time = 0;
        let lastFrame = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio, 1.5);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.scale(dpr, dpr);
        };

        resize();
        window.addEventListener('resize', resize);

        // Liquid Silver Color Palette
        const colors = [
            { r: 15, g: 16, b: 18 },      // Deep Charcoal #0f1012
            { r: 42, g: 45, b: 53 },      // Dark Slate #2a2d35
            { r: 100, g: 116, b: 139 },   // Silver/Slate #64748b
        ];

        const blobs = colors.map((color, i) => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: 350 + Math.random() * 300,
            color,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            phase: i * Math.PI * 0.7,
        }));

        const animate = (timestamp: number) => {
            if (timestamp - lastFrame < frameInterval) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            lastFrame = timestamp;

            time += 0.002;

            // Deep charcoal base
            ctx.fillStyle = '#0f1012';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            blobs.forEach((blob, i) => {
                blob.x += Math.sin(time + blob.phase) * 0.25 + blob.vx;
                blob.y += Math.cos(time * 0.5 + blob.phase) * 0.25 + blob.vy;

                if (blob.x < -blob.radius) blob.x = window.innerWidth + blob.radius;
                if (blob.x > window.innerWidth + blob.radius) blob.x = -blob.radius;
                if (blob.y < -blob.radius) blob.y = window.innerHeight + blob.radius;
                if (blob.y > window.innerHeight + blob.radius) blob.y = -blob.radius;

                const dynamicRadius = blob.radius + Math.sin(time + i) * 25;

                const gradient = ctx.createRadialGradient(
                    blob.x, blob.y, 0,
                    blob.x, blob.y, dynamicRadius
                );

                gradient.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.6)`);
                gradient.addColorStop(0.6, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.15)`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            });

            ctx.globalCompositeOperation = 'source-over';
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{ opacity: 0.8 }}
        />
    );
}
