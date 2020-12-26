import { createRouter, createWebHistory } from 'vue-router'

export const owdCreateRouter = function(owdPageRoutes: any) {
  return createRouter({
    history: createWebHistory(),
    routes: owdMergeRoutes(owdPageRoutes)
  })
}

function owdMergeRoutes(owdPageRoutes: any) {
  let vueRoutes: any[] = []

  owdPageRoutes.forEach((owdRoutes: any) => {
    vueRoutes = vueRoutes.concat(owdRoutes)
  })

  return vueRoutes
}