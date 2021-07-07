import {App} from "vue";

import WindowComponent from "../../../../src/components/window/Window.vue";
import WindowAppComponent from "../../../../src/components/window/app/WindowApp.vue";

// import basic fonts
import {initializeVuetify} from "@owd-client/core/src/plugins/vuetify";
import {OwdCoreAssetsContext} from "@owd-client/types";

export function initializeAssets(context: OwdCoreAssetsContext) {
  context.app.config.globalProperties.$owd.desktop = {
    theme: context.extensions.desktop.name
  }

  // initialize vuetify
  initializeVuetify(context.app)

  // initialize global components
  initializeGlobalComponents(context.app)

  // import core styles
  import('@owd-client/core/src/assets/css/app.scss')

  // append desktop-environment and theme to #app classes
  const appElement = document.getElementById('app')

  if (appElement) {
    appElement.setAttribute('data-theme', context.extensions.desktop.name)
  }
}

function initializeGlobalComponents(app: App) {
  app.component('Window', WindowComponent)
  app.component('WindowApp', WindowAppComponent)
}