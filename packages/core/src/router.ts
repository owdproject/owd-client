import { createRouter, createWebHistory } from 'vue-router'

export default function(owdPageRoutes: any) {
  return createRouter({
    history: createWebHistory(),
    routes: owdMergeRoutes(owdPageRoutes)
    /*
    scrollBehavior: function() {
      return { x: 0, y: 0 }
    },
     */
  })
}

function owdMergeRoutes(owdPageRoutes: any) {
  let vueRoutes: any[] = []

  owdPageRoutes.forEach((owdRoutes: any) => {
    vueRoutes = vueRoutes.concat(owdRoutes)
  })

  return vueRoutes
}