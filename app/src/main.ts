import { createApp } from 'vue'
import { createWebDesktop } from '@owd-client/core/index'

import App from './App.vue'

/**
 * Vue initialization
 */
const app = createApp(App)

/**
 * OWD initialization
 */
import config from '../client.config'
import extensions from '../client.extensions'

// load Open Web Desktop & its modules
const owdInstance = new createWebDesktop({
  app,
  config,
  extensions
})

if (owdInstance.hasLoaded()) {
  app.mount('#app')
}