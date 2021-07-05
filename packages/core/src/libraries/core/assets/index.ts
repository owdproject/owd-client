import {App} from "vue";

import WindowComponent from "../../../../src/components/window/Window.vue";
import WindowAppComponent from "../../../../src/components/window/app/WindowApp.vue";

// import basic fonts
import {initializeVuetify} from "@owd-client/core/src/plugins/vuetify";

export function initializeAssets(app: App) {
  // initialize vuetify
  initializeVuetify(app)

  // initialize global components
  initializeGlobalComponents(app)

  // import core styles
  import('@owd-client/core/src/assets/css/app.scss')

  // append desktop-environment and theme to #app classes
  const appElement = document.getElementById('app')

  if (appElement) {
    // todo get the active theme name somewhere
    // appElement.setAttribute('data-theme', themeName)
  }
}

function initializeGlobalComponents(app: App) {
  app.component('Window', WindowComponent)
  app.component('WindowApp', WindowAppComponent)
}