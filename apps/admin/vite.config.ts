import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@shared': path.resolve(__dirname, '../../packages/shared/src') } },
  server: { port: 3002, host: '0.0.0.0', proxy: { '/api': 'http://localhost:3001', '/ws/display': { target: 'ws://localhost:3001', ws: true } } },
  build: { outDir: 'dist' },
});
