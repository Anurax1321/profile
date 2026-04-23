import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8889,
    allowedHosts: ['chinnaboina.com'],
    // Project lives on /mnt/d (Windows filesystem via WSL); inotify doesn't
    // fire for Windows-side writes, so HMR needs polling to pick up changes.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  preview: {
    port: 8889,
  },
})
