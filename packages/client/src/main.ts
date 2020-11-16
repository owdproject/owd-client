import { createApp } from 'vue'
import App from './App.vue'

import { boot } from '@owd-client/core'
import config from '../client.config'

/**
 * Vue app initialization
 */
const app: ReturnType<typeof createApp> = createApp(App)

// load Open Web Desktop & its modules
const owdInstance = new boot({ app, config });

if (owdInstance.loaded) {
  app.mount('#app');
}