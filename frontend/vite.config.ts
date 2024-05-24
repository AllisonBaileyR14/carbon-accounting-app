import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://backend:8080', // This should match the service name and internal port in Docker Compose
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
