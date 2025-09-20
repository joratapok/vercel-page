// vite.config.js
import { defineConfig } from 'vite';
import { analyzer  } from 'vite-bundle-analyzer';

export default defineConfig(({ command }) => {
  return {
    // Включаем анализатор только при сборке
    plugins: [
      analyzer()
    ],

    // Остальные настройки (опционально)
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // можно true для отладки
    },

    // Если используешь Three.js / GSAP — иногда помогает
    optimizeDeps: {
      include: ['gsap', 'lil-gui', 'three'],
    },
  };
});
