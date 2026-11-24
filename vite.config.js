import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base: './' keeps every asset path relative, so the built `dist/` folder works
// on any host — Netlify, Vercel, GitHub Pages (even under a sub-path), or cPanel.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
