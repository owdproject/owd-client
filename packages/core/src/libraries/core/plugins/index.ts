import {OwdCorePluginsContext} from "@owd-client/types";
import moment from "@owd-client/core/src/plugins/moment"

// register service worker
import '@owd-client/core/src/libraries/service-worker/registerServiceWorker'

export function initializeAppPlugins(context: OwdCorePluginsContext) {
  context.app.use(moment)

  initializeAdditionalPlugins(context)
}

/**
 * Initialize additional plugins
 *
 * @param context
 */
function initializeAdditionalPlugins(context: OwdCorePluginsContext) {
  if (!Array.isArray(context.plugins)) {
    throw new Error('Plugins are not an array in client.extensions.ts')
  }

  context.plugins.forEach((plugin) => {
    context.app.use(plugin)
  })
}