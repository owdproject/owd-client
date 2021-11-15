import DesktopApps from "./app/desktopApps";
import DesktopModules from "./desktop/desktopModules";

import {OwdCoreContext} from "@owd-client/types";

/**
 * Initialize OWD desktop apps
 */
export function initializeDesktopApps(context: OwdCoreContext) {
  return new DesktopApps(context)
}

/**
 * Initialize OWD desktop modules
 */
export function initializeDesktopModules(context: OwdCoreContext) {
  return new DesktopModules(context)
}