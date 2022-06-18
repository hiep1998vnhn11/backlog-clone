import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
const OUTPUT_DIR = 'public'
const root = process.cwd()
export default defineConfig({
  root,
  resolve: {
    alias: [
      {
        find: /\/@\//,
        replacement: pathResolve('resources/js') + '/',
      },
      {
        find: /\/#\//,
        replacement: pathResolve('resources/types') + '/',
      },
    ],
  },
  server: {
    host: true,
    port: 8080,
  },
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: OUTPUT_DIR,
    brotliSize: false,
    chunkSizeWarningLimit: 2000,
    manifest: true,
    emptyOutDir: false,
    rollupOptions: {
      input: './resources/js/main.tsx',
    },
  },
  publicDir: 'public',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ` @import '/@/assets/scss/variables'; `,
      },
    },
  },
})
