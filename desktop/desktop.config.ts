import { defineDesktopConfig } from '@owdproject/core'

export default defineDesktopConfig({
  theme: '@owdproject/theme-gnome',
  apps: ['@owdproject/app-about', '@owdproject/app-todo'],
  modules: [
    '@owdproject/module-persistence',
    '@owdproject/module-jazz'
  ],
  jazz: {
    broadcastOnly: true
  }
})
