import DesktopApps from "./app/desktopApps";
import DesktopModules from "./desktop/desktopModules";

import {OwdCoreContext} from "@owd-client/types";

let desktopApps: any

// callback for the "owd/desktop:mounted" event emitter
function desktopMountedCallback() {
  desktopApps.initialize()
}

/**
 * Initialize OWD desktop apps
 *
 * @param context
 */
export function initializeDesktopApps(context: OwdCoreContext) {
  // on desktop components ready
  context.on('owd/desktop:mounted', desktopMountedCallback)

  desktopApps = new DesktopApps(context)

  return desktopApps
}

/**
 * Terminate OWD desktop apps
 *
 * @param context
 */
export function terminateDesktopApps(context: OwdCoreContext) {
  // remove "on desktop components ready" event listener
  context.removeListener('owd/desktop:mounted', desktopMountedCallback)

  // unregister window components
  if (desktopApps) {
    desktopApps.terminate()
  }
}

/**
 * Initialize OWD desktop modules
 *
 * Desktop modules are essentially Vue components packed in an object;
 * this should be improved, but for now they can easily be placed where needed.
 */
export function initializeDesktopModules(context: OwdCoreContext) {
  return new DesktopModules(context)
}