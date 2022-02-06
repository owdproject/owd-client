import CoreModule from "../core.module";
import moment from "@owd-client/core/src/plugins/moment"

// register service worker
import '@owd-client/core/src/core/service-worker/registerServiceWorker'

export default class CorePlugins extends CoreModule {
  constructor(ctx) {
    super(ctx)

    this.registerCorePlugins()
    this.registerClientPlugins()
    this.registerThemePlugins()
  }

  /**
   * Initialize core plugins
   *
   * @private
   */
  private registerCorePlugins() {
    this.registerPlugin(moment)
  }

  /**
   * Initialize plugins defined in client.extensions.ts
   *
   * @private
   */
  private registerClientPlugins() {
    if (!Object.prototype.hasOwnProperty.call(this.extensions, 'plugins')) {
      return false
    }

    if (!Array.isArray(this.extensions.plugins)) {
      throw new Error('[owd] client "extensions.plugins" is not an array in client.extensions.ts')
    }

    this.extensions.plugins.forEach((plugin) => {
      this.registerPlugin(plugin)
    })
  }

  /**
   * Initialize theme plugins defined in desktop.extensions.ts
   *
   * @private
   */
  private registerThemePlugins() {
    if (Object.prototype.hasOwnProperty.call(this.theme, 'plugins')) {
      if (!Array.isArray(this.theme.plugins)) {
        throw new Error('[owd] theme "extensions.plugins" is not an array in desktop.extensions.ts')
      }

      this.theme.plugins.forEach((plugin) => {
        this.registerPlugin(plugin)
      })
    }
  }

  private registerPlugin(plugin) {
    this.app.use(plugin)
  }
}