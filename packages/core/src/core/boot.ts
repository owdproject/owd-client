import {initializeStore} from "../plugins/store";
import {initializeRouter} from "../plugins/router";
import {initializeI18n} from "../plugins/i18n";
import {initializePlugins} from "./plugins";

import {initializeDesktopTerminal, terminateDesktopTerminal} from "./terminal";
import {initializeDesktopApps, terminateDesktopApps, initializeDesktopModules} from "./modules";
import {initializeDesktopAssets, terminateDesktopAssets} from "./assets";

import {OwdCoreContext} from "@owd-client/types";

/**
 * Initialize app and plugins
 * (vuex, vue router and other libraries)
 */
export function initializeApp(context: OwdCoreContext) {
    if (debug) console.log('[owd] initializing app...')

    // set owd config to $owd vue globalProperties.
    // this will probably change in future
    context.app.config.globalProperties.$owd = { ...context.config }

    context.store = initializeStore(context)

    context.router = initializeRouter(context)

    initializeI18n(context)

    initializePlugins(context)

    context.app.mount('#app')

    // app loaded
    context.booted.app = true

    if (debug) console.log('[owd] initialized app.')
}

/**
 * Initialize desktop
 */
export function initializeDesktop(context: OwdCoreContext) {
    // initialize store client
    context.store.dispatch('core/client/initialize')

    initializeDesktopAssets(context)
    initializeDesktopTerminal(context)

    // owd modules can be "app modules" or "desktop modules"
    context.modules = {
        app: initializeDesktopApps(context),
        desktop: initializeDesktopModules(context)
    }

    // set desktop loaded
    context.booted.desktop = true

    if (debug) console.log('[owd] initialized desktop.')
}

/**
 * Terminate desktop
 */
export function terminateDesktop(context: OwdCoreContext) {
    // terminate store client
    context.store.dispatch('core/client/terminate')

    terminateDesktopAssets(context)
    terminateDesktopTerminal(context)
    terminateDesktopApps(context)

    // reset modules
    context.modules = {
        app: {},
        desktop: {}
    }

    // set desktop unloaded
    context.booted.desktop = false

    if (debug) console.log('[owd] terminated desktop.')
}