import Vue from 'vue'
import VueRouter from 'vue-router'

import routesMain from '~/pages/main/routes'
import clientConfig from '../../client.config'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  scrollBehavior: function() {
    return { x: 0, y: 0 }
  },
  routes: [
    ...routesMain,
    ...clientConfig.pages
  ]
})
