import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Deployed to GitHub Pages at https://baderfahoum17.github.io/bader-yara-wedding-invite/
export default defineConfig({
  base: '/bader-yara-wedding-invite/',
  plugins: [react(), tailwindcss()],
})
