import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync } from 'fs'

export default defineConfig({
  base: '/pickpick/',
  plugins: [
    vue(),
    {
      name: 'copy-404',
      writeBundle() {
        try { copyFileSync('dist/index.html', 'dist/404.html') } catch {}
      }
    }
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.js']
  }
})
