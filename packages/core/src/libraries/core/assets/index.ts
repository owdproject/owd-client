import {App} from "vue";
import {OwdCoreModuleContext} from "@owd-client/types";

import WindowComponent from "../../../../src/components/window/Window.vue";
import WindowAppComponent from "../../../../src/components/window/app/WindowApp.vue";

// import basic fonts
import '@fontsource/jetbrains-mono'
import '@fontsource/cantarell'

/**
 * Initialize OWD assets
 */
export default function initializeAssets(context: OwdCoreModuleContext) {
  initializeGlobalComponents(context.app)

  // import core styles
  import('@owd-client/core/src/assets/css/app.scss')

  // import custom theme styles from owd-client/app
  try {
    import(/* @vite-ignore */ `/@/../src/assets/themes/${context.config.ui.de}/${context.config.ui.theme}/index.scss`)
  } catch(e) {
    console.error('Error while loading theme styles')
  }

  // append desktop-environment and theme to #app classes
  const appElement = document.getElementById('app')

  if (appElement) {
    appElement.setAttribute('os-name', context.config.ui.de.split('/')[0])
    appElement.setAttribute('os-version', context.config.ui.de.split('/')[1])
    appElement.setAttribute('theme', context.config.ui.theme)
  }
}

function initializeGlobalComponents(app: App) {
  app.component('Window', WindowComponent)
  app.component('WindowApp', WindowAppComponent)
}