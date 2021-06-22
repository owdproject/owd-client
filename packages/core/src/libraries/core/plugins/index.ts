import {App} from "vue";

import moment from "@owd-client/core/src/plugins/moment"

// register service worker
import '@owd-client/core/src/libraries/service-worker/registerServiceWorker'

export function initializePlugins(app: App) {
  app.use(moment)
}