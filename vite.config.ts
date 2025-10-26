import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/random-prompt-generator/',
  build: {
    outDir: 'docs',
  },
})