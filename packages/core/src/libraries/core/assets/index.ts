import {App} from "vue";
import {OwdCoreContext} from "@owd-client/types";

import WindowComponent from "../../../../src/components/window/Window.vue";
import WindowAppComponent from "../../../../src/components/window/app/WindowApp.vue";

import {initializeVuetify} from "@owd-client/core/src/plugins/vuetify";
import {loadLocaleMessages} from "@owd-client/core/src/plugins/i18n";

export function initializeAppAssets(context: OwdCoreContext) {
  // initialize vuetify
  initializeVuetify(context.app)
}

export function initializeDesktopAssets(context: OwdCoreContext) {
  // import core styles
  import('@owd-client/core/src/assets/css/app.scss')

  // register global components
  context.app.component('Desktop', context.extensions.desktop.component)
  context.app.component('Window', WindowComponent)
  context.app.component('WindowApp', WindowAppComponent)

  // append desktop-environment and theme to #app classes
  const appElement = document.getElementById('app')

  if (appElement) {
    appElement.setAttribute('data-theme', context.extensions.desktop.name)
  }

  // load desktop locales
  loadLocaleMessages(context.extensions.desktop.locales)
}