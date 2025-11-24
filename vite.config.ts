import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  server: {
    port: 6000,
    open: true
  },
  build: {
    lib: {
      entry: {
        'jskid': resolve(__dirname, 'packages/core/src/index.ts'),
        'jskid/renderer': resolve(__dirname, 'packages/renderer/src/index.ts'),
        'jskid/sprite': resolve(__dirname, 'packages/sprite/src/index.ts'),
        'jskid/physics': resolve(__dirname, 'packages/physics/src/index.ts'),
        'jskid/input': resolve(__dirname, 'packages/input/src/index.ts'),
        'jskid/audio': resolve(__dirname, 'packages/audio/src/index.ts'),
        'jskid/utils': resolve(__dirname, 'packages/utils/src/index.ts')
      },
      name: 'Jskid',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format, entryName) => {
        const extension = format === 'es' ? 'mjs' : 'js'
        return `${entryName}.${extension}`
      }
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: true,
    minify: 'terser'
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