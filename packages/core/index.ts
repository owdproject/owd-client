import Core from './src/core'
import {OwdCoreBootContext} from "@owd-client/types";

import ModuleAppClass from './src/libraries/core/modules/app/classes/moduleApp.class'

let owd: any

/**
 * Create Vue app
 *
 * @param context
 */
export async function createApp(context: OwdCoreBootContext): Promise<Core> {
  return new Promise((resolve, reject) => {
    try {
      owd = new Core(context)
      resolve(owd)
    } catch(e) {
      reject(e)
    }
  })
}

/**
 * Create Vue app and initialize OWD
 *
 * @param context
 */
export function createDesktop(context: OwdCoreBootContext) {
  return createApp(context).then(owd => {
    // initialize desktop
    owd.initializeDesktop()

    return owd
  })
}

/**
 * Use OWD instance
 */
export function useDesktop() { return owd }

/**
 * Use OWD store
 */
export function useDesktopStore() { return owd.store }

/**
 * Use OWD router
 */
export function useDesktopRouter() { return owd.router }

/**
 * Use OWD desktop apps
 */
export function useDesktopApps() { return owd.modules.app }

/**
 * Use OWD desktop modules
 */
export function useDesktopModules() { return owd.modules.desktop }

/**
 * Use OWD terminal
 */
export function useDesktopTerminal() { return owd.terminal }

// new moduleApp class
export const ModuleApp = ModuleAppClass