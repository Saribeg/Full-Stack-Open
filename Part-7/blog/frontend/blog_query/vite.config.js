import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isCypress = process.env.CYPRESS === 'true';

export default defineConfig({
  plugins: [react()],
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
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    ...(isCypress
      ? {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
      }
      : {}),
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
    },
  },
  test: {
    include: ['tests/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setupTests.js',
  },
});
