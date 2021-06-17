import {OwdCoreModuleContext} from "@owd-client/types";

import ModuleAppExtend from "./module-app/extend/moduleAppExtend";
import ModuleDesktopExtend from "./module-desktop/extend/moduleDesktopExtend";

/**
 * Initialize OWD modules
 */
export default function initializeModules(context: OwdCoreModuleContext) {
  new ModuleAppExtend(context)
  new ModuleDesktopExtend(context)
}