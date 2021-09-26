import {initializeAppStore} from "../../../store";
import {initializeAppRouter} from "../../../plugins/router";
import {initializeAppPlugins} from "../plugins";
import {initializeAppI18n} from "../../../plugins/i18n";
import {initializeAppAssets} from "../assets";
import {initializeAppTerminal} from "../terminal";

import {initializeDesktopApps, initializeDesktopModules} from "../modules";
import {initializeDesktopAssets} from "../assets";

/**
 * Initialize app
 */
export function initializeApp(context: any) {
    if (debug) console.log('[owd] initializing app...')

    context.store = initializeAppStore({
        app: context.app,
        modules: context.extensions.store
    })

    initializeAppRouter({
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
    context.stats.loaded.app = true

    if (debug) console.log('[owd] initialized app.')
}

/**
 * Initialize desktop
 */
export function initializeDesktop(context: any) {
    context.stats.loaded.desktop = true

    initializeDesktopAssets({
        app: context.app,
        extensions: context.extensions
    })

    context.desktopModules = initializeDesktopModules({
        app: context.app,
        extensions: context.extensions,
        store: context.store,
        terminal: context.terminal
    })

    context.desktopApps = initializeDesktopApps({
        app: context.app,
        extensions: context.extensions,
        store: context.store,
        terminal: context.terminal
    })

    // on desktop components ready
    // todo improve dis
    setTimeout(() => {
        context.desktopApps.initialize()

        // initialize client
        context.store.dispatch('core/client/initialize')

        if (debug) console.log('[owd] initialized desktop.')
    }, 50)
}