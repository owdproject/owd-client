import {OwdCoreContext} from "@owd-client/types";
import moment from "@owd-client/core/src/plugins/moment"

// register service worker
import '@owd-client/core/src/core/service-worker/registerServiceWorker'

/**
 * Initialize core plugins
 *
 * @param context
 */
export function initializePlugins(context: OwdCoreContext) {
  // core plugins
  context.app.use(moment)

  // additional plugins
  initializeAdditionalPlugins(context)
}

/**
 * Initialize additional plugins
 *
 * @param context
 */
function initializeAdditionalPlugins(context: OwdCoreContext) {
  // initialize plugins defined in client.extensions.ts
  if (context.extensions.plugins) {
    if (!Array.isArray(context.extensions.plugins)) {
      throw new Error('Plugins are not an array in client.extensions.ts')
    }

    context.extensions.plugins.forEach((plugin) => context.app.use(plugin))
  }

  // initialize theme plugins
  if (context.extensions.desktop.plugins) {
    if (!Array.isArray(context.extensions.desktop.plugins)) {
      throw new Error('Theme plugins are not an array')
    }

    context.extensions.desktop.plugins.forEach((plugin) => context.app.use(plugin))
  }
}