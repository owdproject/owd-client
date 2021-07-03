import {OwdCoreModuleContext} from "@owd-client/types";

import ModuleAppExtend from "./module-app/extend/moduleAppExtend";
import ModuleDesktopExtend from "./module-desktop/extend/moduleDesktopExtend";

/**
 * Initialize OWD app modules
 */
export function initializeAppModules(context: OwdCoreModuleContext) {
  return new ModuleAppExtend(context)
}

/**
 * Initialize OWD desktop modules
 */
export function initializeDesktopModules(context: OwdCoreModuleContext) {
  return new ModuleDesktopExtend(context)
}