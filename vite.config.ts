import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    return {
        plugins: [react()],

        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            global: 'window',
        },

        resolve: {
            alias: {
                '@': path.resolve(__dirname, './'),
            }
        },

        server: {
            port: 5173,
            host: "localhost",

            proxy: {
                "/api": {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    secure: false,
                    ws: true
                },
                "/ws": {
                    target: "ws://ec2-98-83-41-85.compute-1.amazonaws.com:8080",
                    ws: true,
                    changeOrigin: true,
                    secure: false
                }
            }
        },

        build: {
            chunkSizeWarningLimit: 800
            // ❌ NO manualChunks — this was breaking React
        }
    };
});
