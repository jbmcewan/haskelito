import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      output: [
        {
          format: 'es',
          dir: 'dist',
          entryFileNames: '[name].js',
          chunkFileNames: 'shared/[name]-[hash].js',
          preserveModules: true,
          preserveModulesRoot: 'src'
        },
        {
          format: 'cjs',
          dir: 'dist',
          entryFileNames: '[name].cjs',
          chunkFileNames: 'shared/[name]-[hash].cjs',
          exports: 'named',
          preserveModules: true,
          preserveModulesRoot: 'src'
        }
      ]
    }
  }
})
