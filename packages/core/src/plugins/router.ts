import { createRouter, createWebHistory } from 'vue-router'

export function owdCreateRouter(owdPageRoutes: any) {
  return createRouter({
    history: createWebHistory(),
    routes: owdMergeRoutes(owdPageRoutes)
  })
}

/**
 * Merge provided client/src/pages/:page/routes
 *
 * @param owdPageRoutes
 */
function owdMergeRoutes(owdPageRoutes: any) {
  let vueRoutes: any[] = []

  owdPageRoutes.forEach((owdRoutes: any) => {
    vueRoutes = vueRoutes.concat(owdRoutes)
  })

  return vueRoutes
}