import {OwdCoreModuleContext} from "@owd-client/types";

import DesktopApps from "./app/desktopApps";
import DesktopModules from "./desktop/desktopModules";

/**
 * Initialize OWD desktop apps
 */
export function initializeDesktopApps(context: OwdCoreModuleContext) {
  return new DesktopApps(context)
}

/**
 * Initialize OWD desktop modules
 */
export function initializeDesktopModules(context: OwdCoreModuleContext) {
  return new DesktopModules(context)
}