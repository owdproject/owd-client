import {App} from "vue";

import WindowComponent from "../../../../src/components/window/Window.vue";
import WindowAppComponent from "../../../../src/components/window/app/WindowApp.vue";

// import basic fonts
import {initializeVuetify} from "@owd-client/core/src/plugins/vuetify";

export function initializeAssets(app: App) {
  const config = app.config.globalProperties.$owd.ui

  // initialize vuetify
  initializeVuetify(app)

  // initialize global components
  initializeGlobalComponents(app)

  // import core styles
  import('@owd-client/core/src/assets/css/app.scss')

  // import custom theme styles from owd-client/app
  try {
    import(/* @vite-ignore */ `/@/../src/assets/themes/${config.de}/${config.theme}/index.scss`)
  } catch(e) {
    console.error('Error while loading theme styles')
  }

  // append desktop-environment and theme to #app classes
  const appElement = document.getElementById('app')

  if (appElement) {
    appElement.setAttribute('os-name', config.de.split('/')[0])
    appElement.setAttribute('os-version', config.de.split('/')[1])
    appElement.setAttribute('theme', config.theme)
  }
}

function initializeGlobalComponents(app: App) {
  app.component('Window', WindowComponent)
  app.component('WindowApp', WindowAppComponent)
}