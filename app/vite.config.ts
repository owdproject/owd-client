import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue'
import owd from '@owd-client/vite-plugin'

import config from './client.config'

export default defineConfig({
  plugins: [
    vue(),
    owd(config)
  ],
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
  }
});