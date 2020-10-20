import Vue from 'vue'
import App from './App.vue'

import store from './core/store'
import router from './core/router'
import boot from './core/boot'

// load Open Web Desktop & its modules
boot({ Vue, store })

Vue.config.productionTip = false

/**
 * INIT
 */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
