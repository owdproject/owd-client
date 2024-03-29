import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue'

import config from './client.config'

export default defineConfig({
  plugins: [
    vue()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/themes/variables.scss";`
      }
    }
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "components": path.resolve(__dirname, "src/components"),
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false
  },
  define: {
    debug: config.debug
  }
});