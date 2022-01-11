import Core from './src/core'
import ModuleAppClass from './src/core/modules/app/classes/moduleApp.class'
import {OwdCoreBootContext, OwdCoreContext} from "@owd-client/types";

let owd: OwdCoreContext

/**
 * Create Vue app
 *
 * @param context
 */
export async function createApp(context: OwdCoreBootContext): Promise<OwdCoreContext> {
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
export function useDesktopApps() { return owd.modules?.app }

/**
 * Use OWD desktop modules
 */
export function useDesktopModules() { return owd.modules?.desktop }

/**
 * Use OWD terminal
 */
export function useDesktopTerminal() { return owd.terminal }

// new moduleApp class
export const ModuleApp = ModuleAppClass