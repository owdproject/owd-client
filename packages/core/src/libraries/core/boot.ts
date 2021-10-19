import {initializeAppStore} from "../../store";
import {initializeAppRouter} from "../../plugins/router";
import {initializeAppPlugins} from "./plugins";
import {initializeAppI18n} from "../../plugins/i18n";
import {initializeAppAssets} from "./assets";
import {initializeAppTerminal} from "./terminal";

import {initializeDesktopApps, initializeDesktopModules} from "./modules";
import {initializeDesktopAssets} from "./assets";

/**
 * Initialize app
 */
export function initializeApp(context: any) {
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

    initializeAppPlugins({
        app: context.app,
        plugins: context.extensions.plugins
    })

    initializeAppI18n(context.app)

    initializeAppAssets({
        app: context.app,
        extensions: context.extensions
    })

    context.terminal = initializeAppTerminal()

    // app loaded
    context.booted.app = true
    if (debug) console.log('[owd] initialized app.')
}

/**
 * Initialize desktop
 */
export function initializeDesktop(context: any) {
    initializeDesktopAssets({
        app: context.app,
        extensions: context.extensions
    })

    context.modules = {
        desktop: initializeDesktopModules({
            app: context.app,
            extensions: context.extensions,
            store: context.store,
            terminal: context.terminal
        }),
        app: initializeDesktopApps({
            app: context.app,
            extensions: context.extensions,
            store: context.store,
            terminal: context.terminal
        })
    }

    // desktop loaded
    context.booted.desktop = true
    if (debug) console.log('[owd] initialized desktop.')
}