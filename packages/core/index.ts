import Boot from './src/boot'
import ModuleAppClass from './src/libraries/core/modules/module-app/moduleApp.class'

import {OwdCoreBootContext} from "@owd-client/types";
import OwdBoot from "./src/boot";

let owd: any

/**
 * Create Vue app
 *
 * @param context
 */
export async function createApp(context: OwdCoreBootContext): Promise<OwdBoot> {
  return new Promise((resolve, reject) => {
    try {
      owd = new Boot(context)
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
export function useDesktop() {
  return owd
}

// new moduleApp class
export const ModuleApp = ModuleAppClass