import {createRouter, createWebHashHistory, createWebHistory, Router} from 'vue-router'
import CoreModule from "../core.module";

export default class CoreRouter extends CoreModule {
  private readonly instance: Router

  constructor(ctx) {
    super(ctx)

    const config = this.config.router || {
      mode: 'history'
    }

    this.instance = createRouter({
      history: config.mode === 'hash' ? createWebHashHistory() : createWebHistory(),
      routes: CoreRouter.mergeRoutes(this.extensions.routes)
    })

    this.app.use(this.instance)

    return this.instance
  }

  /**
   * Merge client/src/pages/:page/routes
   *
   * @param owdPageRoutes
   */
  private static mergeRoutes(owdPageRoutes: any) {
    let vueRoutes: any[] = []

    owdPageRoutes.forEach((owdRoutes: any) => {
      vueRoutes = vueRoutes.concat(owdRoutes)
    })

    return vueRoutes
  }
}