import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          filename: 'bundle-size-reports/stats-treemap.html',
          template: 'treemap',
          gzipSize: true,
          brotliSize: true
        }),
        visualizer({
          filename: 'bundle-size-reports/stats-network.html',
          template: 'network',
          gzipSize: true,
          brotliSize: true
        }),
        visualizer({
          filename: 'bundle-size-reports/stats-list.txt',
          template: 'list',
          gzipSize: true,
          brotliSize: true
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    allowedHosts: ['*'],
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  },
  test: {
    include: ['tests/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setupTests.js'
  }
});
