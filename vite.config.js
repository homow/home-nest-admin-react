import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';
import {fileURLToPath} from "url";
import {visualizer} from "rollup-plugin-visualizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        base: env.VITE_BASE_PATH || "/",
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (!id.includes('node_modules')) return;

                        if (id.includes('react') || id.includes('react-dom')) return 'react-core';
                        if (id.includes('react-router-dom')) return 'react-router-dom';
                        if (id.includes('@supabase/supabase-js')) return 'supabase';
                        if (id.includes('axios')) return 'axios';
                        if (id.includes('clsx') || id.includes('tailwind-merge')) return 'utils';

                        return 'vendor';
                    }
                }
            },
            chunkSizeWarningLimit: 500,
            sourcemap: mode === 'development',
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@components': path.resolve(__dirname, 'src/components'),
                '@pages': path.resolve(__dirname, 'src/pages'),
                '@img': path.resolve(__dirname, 'src/assets/images'),
                '@hooks': path.resolve(__dirname, 'src/hooks'),
                '@api': path.resolve(__dirname, 'src/lib/api'),
                '@context': path.resolve(__dirname, 'src/context'),
            }
        },
        plugins: [
            react(),
            tailwindcss(),
            env.ANALYZE === "true" &&
            visualizer({
                filename: "analyze.html",
                open: true,
                gzipSize: true,
                brotliSize: true
            }),
        ].filter(Boolean),
    }
});
