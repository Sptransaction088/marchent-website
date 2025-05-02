import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Explicitly deny access to parent directories and sensitive folders
      deny: ['..', '.git', '/node_modules/']
    }
  }
});