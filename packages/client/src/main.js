import Vue from 'vue'
import App from './App'

import config from '../client.config'
import {store, boot} from '@owd-client/core'

// load Open Web Desktop & its modules
const owdInstance = new boot({ Vue, config, store });

/**
 * Vue app initialization
 */
new Vue({
  store,
  router: owdInstance.router,
  render: h => h(App)
}).$mount('#app');