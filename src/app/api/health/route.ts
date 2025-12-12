import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            services: {
                googleAI: !!process.env.GOOGLE_API_KEY,
            },
        };

        // Check if critical services are available
        const allServicesHealthy = Object.values(health.services).every(Boolean);

        return NextResponse.json(health, {
            status: allServicesHealthy ? 200 : 503,
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: 'Health check failed',
            },
            { status: 500 }
        );
    }
}
