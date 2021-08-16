import {App} from "vue";

import WindowComponent from "../../../../src/components/window/Window.vue";
import WindowAppComponent from "../../../../src/components/window/app/WindowApp.vue";

import {initializeVuetify} from "@owd-client/core/src/plugins/vuetify";
import {OwdCoreAssetsContext} from "@owd-client/types";

export function initializeAppAssets(context: OwdCoreAssetsContext) {
  // initialize vuetify
  initializeVuetify(context.app)
}

export function initializeDesktopAssets(context: OwdCoreAssetsContext) {
  // import core styles
  import('@owd-client/core/src/assets/css/app.scss')

  // set theme name to $owd globalProperties
  context.app.config.globalProperties.$owd.desktop = {
    theme: context.extensions.desktop.name
  }

  // initialize global components
  initializeDesktopGlobalComponents(context.app)

  // append desktop-environment and theme to #app classes
  const appElement = document.getElementById('app')

  if (appElement) {
    appElement.setAttribute('data-theme', context.extensions.desktop.name)
  }
}

function initializeDesktopGlobalComponents(app: App) {
  app.component('Window', WindowComponent)
  app.component('WindowApp', WindowAppComponent)
}