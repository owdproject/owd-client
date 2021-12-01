import {initializeAppStore} from "../../store";
import {initializeAppRouter} from "../../plugins/router";
import {initializeAppPlugins} from "./plugins";
import {initializeAppI18n} from "../../plugins/i18n";
import {initializeAppTerminal} from "./terminal";

import {initializeDesktopApps, initializeDesktopModules} from "./modules";
import {initializeDesktopAssets} from "./assets";
import {OwdCoreContext} from "@owd-client/types";

/**
 * Initialize app
 */
export function initializeApp(context: OwdCoreContext) {
    if (debug) console.log('[owd] initializing app...')

    // set owd config to $owd vue globalProperties
    context.app.config.globalProperties.$owd = { ...context.config }

    context.store = initializeAppStore({
        app: context.app,
        modules: context.extensions.store
    })

    context.router = initializeAppRouter({
        app: context.app,
        routes: context.extensions.routes
    })

    initializeAppPlugins(context)

    initializeAppI18n(context.app)

    context.terminal = initializeAppTerminal()

    // app loaded
    context.booted.app = true
    if (debug) console.log('[owd] initialized app.')
}

/**
 * Initialize desktop
 */
export function initializeDesktop(context: OwdCoreContext) {
    initializeDesktopAssets(context)

    context.modules = {
        desktop: initializeDesktopModules(context),
        app: initializeDesktopApps(context)
    }

    // desktop loaded
    context.booted.desktop = true
    if (debug) console.log('[owd] initialized desktop.')
}