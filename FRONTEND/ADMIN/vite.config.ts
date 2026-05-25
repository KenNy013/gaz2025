import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import { renameSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rename-index',
      closeBundle() {
        const distPath = resolve(__dirname, '../dist/admin')
        renameSync(resolve(distPath, 'index.html'), resolve(distPath, 'index.html'))
      }
    }
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true,
  }
});
