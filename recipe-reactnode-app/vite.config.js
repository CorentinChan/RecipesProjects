import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // <-- essentiel pour un sous-dossier

  plugins: [react()],
  test: {
    globals: true, // <--- AJOUTE CETTE LIGNE
    environment: 'jsdom',
    //setupFiles: './src/test/setup.js', // Optionnel : pour jest-dom
  },
})

