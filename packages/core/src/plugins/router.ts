import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import {OwdCoreContext} from "@owd-client/types";

/**
 * Initialize vue router
 *
 * @param context
 */
export function initializeRouter(context: OwdCoreContext) {
  const router = createRouter({
    history: context.config.router?.mode === 'hash' ? createWebHashHistory() : createWebHistory(),
    routes: mergeRoutes(context.extensions.routes)
  })

  context.app.use(router)

  return router
}

/**
 * Merge client/src/pages/:page/routes
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