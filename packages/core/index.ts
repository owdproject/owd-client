import Boot from './src/boot'
import ModuleAppClass from './src/libraries/core/modules/module-app/moduleApp.class'

import {OwdCoreBootContext} from "@owd-client/types";

let owd: any

export async function createWebDesktop(context: OwdCoreBootContext) {
  return new Promise((resolve, reject) => {
    try {
      owd = new Boot(context)

      resolve(owd)
    } catch(e) {
      reject(e)
    }
  })
}

export function useWebDesktop() {
  return owd
}

// new moduleApp class
export const ModuleApp = ModuleAppClass