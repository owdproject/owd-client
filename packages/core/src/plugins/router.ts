import { Router, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import {OwdCoreRouterContext} from "@owd-client/types";

let router: Router

export function initializeAppRouter(context: OwdCoreRouterContext) {
  router = createRouter({
    history: context.app.config.globalProperties.$owd.router?.mode === 'hash' ? createWebHashHistory() : createWebHistory(),
    routes: mergeRoutes(context.routes)
  })

  context.app.use(router)

  return router
}

/**
 * Merge provided client/src/pages/:page/routes
 *
 * @param owdPageRoutes
 */
function mergeRoutes(owdPageRoutes: any) {
  let vueRoutes: any[] = []

  owdPageRoutes.forEach((owdRoutes: any) => {
    vueRoutes = vueRoutes.concat(owdRoutes)
  })

  return vueRoutes
}