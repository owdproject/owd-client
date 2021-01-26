import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default function(clientConfig) {
  return new VueRouter({
    mode: 'history',
    scrollBehavior: function() {
      return { x: 0, y: 0 }
    },
    routes: mergeOwdRoutes(clientConfig.routes)
  })
}

function mergeOwdRoutes(owdAllRoutes) {
  let vueRoutes = []

  owdAllRoutes.forEach(owdRoutes => {
    vueRoutes = vueRoutes.concat(owdRoutes)
  })

  return vueRoutes
}