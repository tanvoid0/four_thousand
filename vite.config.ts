import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// For a GitHub Pages *project* site the app is served from
// https://<user>.github.io/<repo>/ , so assets need this base path.
// Change it to '/' if you deploy to a custom domain or a <user>.github.io root repo.
const BASE = '/four_thousand/'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? BASE : '/',
}))
