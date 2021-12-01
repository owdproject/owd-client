import {OwdCoreContext} from "@owd-client/types";

import Icon from "../../../../src/components/icon/Icon.vue";
import Button from "../../../../src/components/button/Button.vue";
import WindowComponent from "../../../../src/components/window/Window.vue";
import WindowAppComponent from "../../../../src/components/window/app/WindowApp.vue";

import {loadLocaleMessages} from "@owd-client/core/src/plugins/i18n";

// @ts-ignore
import vClickOutside from "click-outside-vue3"

export function initializeDesktopAssets(context: OwdCoreContext) {
  // import core styles
  import('@owd-client/core/src/assets/css/app.scss')

  // register global directives
  context.app.use(vClickOutside)

  // register global components
  context.app.component('owd-icon', Icon)
  context.app.component('owd-btn', Button)
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