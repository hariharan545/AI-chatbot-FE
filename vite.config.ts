import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ai-chatbot-tau-beige.vercel.app',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://ai-chatbot-be-1.onrender.com',
        ws: true
      }
    }
  }
});


