// vite.config.js
import { defineConfig } from 'vite';
import { analyzer  } from 'vite-bundle-analyzer';
import glsl from 'vite-plugin-glsl';

export default defineConfig(({ command }) => {
  return {
    // Включаем анализатор только при сборке
    plugins: [
      analyzer(),
      glsl(),
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
