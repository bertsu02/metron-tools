import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        plinko: resolve(__dirname, 'src/plinko.html'),
      },
    },
  },
})