import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/jsKid/' : '/',
  server: {
    port: 6000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        demos: resolve(__dirname, 'demos/index.html'),
        snake: resolve(__dirname, 'demos/snake/index.html'),
        breakout: resolve(__dirname, 'demos/breakout/index.html'),
        tetris: resolve(__dirname, 'demos/tetris/index.html'),
        pong: resolve(__dirname, 'demos/pong/index.html'),
        flappyBird: resolve(__dirname, 'demos/flappy-bird/index.html'),
        spaceShooter: resolve(__dirname, 'demos/space-shooter/index.html'),
        fruitCatcher: resolve(__dirname, 'demos/fruit-catcher/index.html'),
        runner: resolve(__dirname, 'demos/runner/index.html'),
        whackAMole: resolve(__dirname, 'demos/whack-a-mole/index.html'),
        memoryMatch: resolve(__dirname, 'demos/memory-match/index.html'),
        basicCanvas: resolve(__dirname, 'demos/basic-canvas/index.html')
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  },
  resolve: {
    alias: {
      '@jskid/core': resolve(__dirname, 'packages/core/src'),
      '@jskid/renderer': resolve(__dirname, 'packages/renderer/src'),
      '@jskid/sprite': resolve(__dirname, 'packages/sprite/src'),
      '@jskid/physics': resolve(__dirname, 'packages/physics/src'),
      '@jskid/input': resolve(__dirname, 'packages/input/src'),
      '@jskid/audio': resolve(__dirname, 'packages/audio/src'),
      '@jskid/utils': resolve(__dirname, 'packages/utils/src')
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.test.ts', '**/*.spec.ts']
    })
  ]
})