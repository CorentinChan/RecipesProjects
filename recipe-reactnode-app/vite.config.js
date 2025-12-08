import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/RecipeReact/', // <-- essentiel pour un sous-dossier

  plugins: [react()],
})

