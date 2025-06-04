import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://evaluapp.onrender.com',
        changeOrigin: true,
        secure: false,
        // No reescribir la ruta, el backend espera /api
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('[PROXY ERROR]', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`[PROXY] Sending ${req.method} to: ${req.url}`);
            console.log('[PROXY] Headers:', proxyReq.getHeaders());
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`[PROXY] Received ${proxyRes.statusCode} from: ${req.url}`);
            console.log('[PROXY] Response headers:', proxyRes.headers);
          });
        }
      }
    },
    port: 5173,
    host: true,
    strictPort: true,
    open: true,
    cors: true // Habilitar CORS para el servidor de desarrollo
  },
  preview: {
    port: 5173
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
