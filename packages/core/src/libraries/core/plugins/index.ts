import {OwdCoreModuleContext} from "@owd-client/types";

import moment from "@owd-client/core/src/plugins/moment"
import {owdCreateRouter} from "@owd-client/core/src/plugins/router"
import {owdCreateVuetify} from "@owd-client/core/src/plugins/vuetify";

// register service worker
import '@owd-client/core/src/libraries/service-worker/registerServiceWorker'

/**
 * Initialize plugins
 *
 * @param context
 */
export function initializePlugins(context: OwdCoreModuleContext) {
  // vue router
  initializeRouter(context)

  // other core plugins
  context.app.use(moment)

  // initialize vuetify
  context.app.use(owdCreateVuetify(context.app))
}

/**
 * Initialize router
 *
 * @param context
 */
function initializeRouter(context: OwdCoreModuleContext) {
  // create owd router
  const owdRouter = owdCreateRouter(context.extensions.routes)

  // initialize owd router
  context.app.use(owdRouter)
}