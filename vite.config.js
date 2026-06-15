import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync } from 'fs'

export default defineConfig({
  base: '/pickpick/',
  plugins: [
    vue(),
    {
      name: 'generate-404',
      writeBundle() {
        const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PickPick</title>
  <script>
    var path = location.pathname.replace(/\\/pickpick\\//, '');
    if (path && path !== '') {
      sessionStorage.setItem('spa_redirect', '/' + path + location.search);
    }
    location.replace('/pickpick/');
  </script>
</head>
<body></body>
</html>`;
        try { require('fs').writeFileSync('dist/404.html', content) } catch {}
      }
    }
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.js']
  }
})
