import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages(사용자 사이트 루트)에 그대로 올릴 수 있도록 base는 '/'.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  server: { host: true, port: 5173 },
})
