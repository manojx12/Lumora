import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    rollupOptions: {
      // Two sites, one design system. The personal site is the root; the studio
      // landing page keeps its own entry alongside it.
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        lumora: resolve(import.meta.dirname, 'lumora.html'),
      },
    },
  },
});
