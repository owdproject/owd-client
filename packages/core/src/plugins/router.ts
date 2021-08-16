import { Router, createRouter, createWebHistory } from 'vue-router'
import {OwdCoreRouterContext} from "@owd-client/types";

let router: Router

export function initializeAppRouter(context: OwdCoreRouterContext) {
  router = createRouter({
    history: createWebHistory(),
    routes: mergeRoutes(context.routes)
  })

  context.app.use(router)
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