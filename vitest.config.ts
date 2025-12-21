import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        './src/lib/supabase/**',
        './src/middleware.ts',
        './src/app/**/*.tsx', // Exclude Next.js pages/layouts as they are mostly integration
        './src/hooks/use-shine.ts', // Exclude simple hooks
      ],
    },
  },
});
