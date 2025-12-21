'use client';

import { useEffect, useRef } from 'react';

/**
 * MeshGradientBackground - Purple Glass Theme
 * Creates a living mesh gradient with purple/violet accent colors.
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

        // Purple Glass Color Palette
        const colors = [
            { r: 15, g: 10, b: 25 },      // Deep Purple Black #0f0a19
            { r: 88, g: 28, b: 135 },     // Purple-900 #581c87
            { r: 139, g: 92, b: 246 },    // Violet-500 #8b5cf6
            { r: 168, g: 85, b: 247 },    // Purple-500 #a855f7
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

            // Deep purple-black base
            ctx.fillStyle = '#0a0612';
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

                gradient.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.5)`);
                gradient.addColorStop(0.6, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.12)`);
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
