// Environment validation utility
// This ensures all required environment variables are present

const requiredEnvVars = {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: 'Supabase URL',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase Anon Key',
    SUPABASE_SERVICE_ROLE_KEY: 'Supabase Service Role Key',

    // Google AI
    GOOGLE_API_KEY: 'Google AI API Key',
} as const;

const optionalEnvVars = {
    NEXT_PUBLIC_APP_URL: 'Application URL',
    NODE_ENV: 'Node Environment',
} as const;

export function validateEnv(): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const [key, description] of Object.entries(requiredEnvVars)) {
        if (!process.env[key]) {
            missing.push(`${key} (${description})`);
        }
    }

    return {
        valid: missing.length === 0,
        missing,
    };
}

export function getEnvOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export function getEnvOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

// Validate on import (only in Node.js environment)
if (typeof window === 'undefined') {
    const { valid, missing } = validateEnv();

    if (!valid && process.env.NODE_ENV !== 'test') {
        console.error('❌ Missing required environment variables:');
        missing.forEach(m => console.error(`   - ${m}`));
        console.error('\n💡 Please check your .env.local file');

        // Don't throw in development to allow setup
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Missing required environment variables');
        }
    } else if (valid) {
        console.log('✅ All required environment variables are set');
    }
}
