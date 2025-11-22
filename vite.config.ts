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
            global: "window",
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
                    target: "http://localhost:8080",
                    changeOrigin: true,
                    secure: false,
                },

                // ✅ WebSocket Fix (Vite + Spring Boot / Node works perfectly)
                "/ws": {
                    target: env.VITE_API_URL || "ws://localhost:8080",
                    ws: true,
                    changeOrigin: true,
                    secure: false,
                }
            }
        },

        build: {
            chunkSizeWarningLimit: 800, // smaller and safer default

            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {

                            // --- SPLIT COMMON CHUNKS ---
                            if (id.includes('react')) return "react-vendors";
                            if (id.includes('@mui') || id.includes('mui')) return "mui-vendors";
                            if (id.includes('lodash')) return "lodash";
                            if (id.includes('date-fns')) return "date-utils";

                            return "vendor"; 
                        }

                        // --- OPTIONAL: SPLIT LARGE FEATURE MODULES ---
                        if (id.includes('/src/pages/')) {
                            const name = id.split('/src/pages/')[1].split('/')[0];
                            return `page-${name}`;
                        }

                        if (id.includes('/src/components/')) {
                            const name = id.split('/src/components/')[1].split('/')[0];
                            return `cmp-${name}`;
                        }
                    }
                }
            }
        }
    };
});
