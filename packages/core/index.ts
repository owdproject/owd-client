import Core from './src/core'
import ModuleAppClass from './src/core/modules/app/classes/moduleApp.class'
import {OwdCoreBootContext, OwdCoreContext} from "@owd-client/types";

let owd: OwdCoreContext

/**
 * Create Vue app
 *
 * @param context
 */
export async function createApp(context: OwdCoreBootContext) {
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
export function useDesktop(): OwdCoreContext {
  return owd
}

// new moduleApp class
export const ModuleApp = ModuleAppClass