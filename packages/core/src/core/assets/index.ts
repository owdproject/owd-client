import {OwdCoreContext} from "@owd-client/types";

// import core styles
import('@owd-client/core/src/assets/css/app.scss')

import Icon from "../../../src/components/icon/Icon.vue";
import Button from "../../../src/components/button/Button.vue";
import WindowComponent from "../../../src/components/window/Window.vue";
import WindowAppComponent from "../../../src/components/window/app/WindowApp.vue";

import {loadLocaleMessages} from "@owd-client/core/src/plugins/i18n";

export function initializeDesktopAssets(context: OwdCoreContext) {
  // register global components
  context.app.component('owd-icon', Icon)
  context.app.component('owd-btn', Button)
  context.app.component('Desktop', context.extensions.desktop.component)
  context.app.component('Window', WindowComponent)
  context.app.component('WindowApp', WindowAppComponent)

  // set theme name to #app data-theme property
  const appElement = document.getElementById('app')

  if (appElement) {
    appElement.setAttribute('data-theme', context.extensions.desktop.name)
  }

  // load desktop locales
  loadLocaleMessages(context.extensions.desktop.locales)
}

export function terminateDesktopAssets(context: OwdCoreContext) {
  // unregister owd global components
  if (context.app._instance) {
    delete context.app._instance.appContext.components['owd-icon']
    delete context.app._instance.appContext.components['owd-btn']
    delete context.app._instance.appContext.components['Desktop']
    delete context.app._instance.appContext.components['Window']
    delete context.app._instance.appContext.components['WindowApp']
  }
}