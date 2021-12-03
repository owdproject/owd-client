import {OwdCoreContext} from "@owd-client/types";
import moment from "@owd-client/core/src/plugins/moment"

// register service worker
import '@owd-client/core/src/core/service-worker/registerServiceWorker'

export function initializeAppPlugins(context: OwdCoreContext) {
  context.app.use(moment)

  initializeAdditionalPlugins(context)
}

/**
 * Initialize additional plugins
 *
 * @param context
 */
function initializeAdditionalPlugins(context: OwdCoreContext) {
  // initialize global plugins
  if (context.extensions.plugins) {
    if (!Array.isArray(context.extensions.plugins)) {
      throw new Error('Plugins are not an array in client.extensions.ts')
    }

    // initialize plugins
    context.extensions.plugins.forEach((plugin) => context.app.use(plugin))
  }

  // initialize theme plugins
  if (context.extensions.desktop.plugins) {
    if (!Array.isArray(context.extensions.desktop.plugins)) {
      throw new Error('Plugins are not an array in client.extensions.ts')
    }

    // initialize plugins
    context.extensions.desktop.plugins.forEach((plugin) => context.app.use(plugin))
  }
}