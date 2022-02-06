// import core styles
import('@owd-client/core/src/assets/css/app.scss')

import Icon from "../../../src/components/icon/Icon.vue";
import Button from "../../../src/components/button/Button.vue";
import Desktop from "../../../src/components/desktop/DesktopBase.vue";
import Window from "../../../src/components/window/Window.vue";
import WindowApp from "../../../src/components/window/app/WindowApp.vue";

import CoreModule from "../core.module";
import {Component} from "vue";

export default class CoreAssets extends CoreModule {
  private readonly defaultDesktopComponents = {
    'Desktop': Desktop,
    'Window': Window,
    'WindowApp': WindowApp,
    'owd-icon': Icon,
    'owd-btn': Button
  }

  private readonly registeredDesktopComponents: string[] = []

  constructor(ctx) {
    super(ctx)
  }

  public initialize() {
    this.registerDesktopComponents()

    this.loadThemeLocales()
    this.setThemeNameInAppAttribute()
  }

  public terminate() {
    this.unregisterDesktopComponents()
  }

  public registerDesktopComponents() {
    if (
        !Object.prototype.hasOwnProperty.call(this.theme, 'components') ||
        typeof this.theme !== 'object'
    ) {
      return false
    }

    // register custom components
    this.registerCustomDesktopComponents()

    // register default components
    this.registerDefaultDesktopComponents()
  }

  public unregisterDesktopComponents() {
    if (this.registeredDesktopComponents.length > 0) {
      this.registeredDesktopComponents.map(name => {
        this.unregisterComponent(name)
      })
    }
  }

  /**
   * Register custom global desktop components (defined under theme.extensions.components)
   *
   * @private
   */
  private registerCustomDesktopComponents() {
    const customDesktopComponentNames: string[] = Object.keys(this.theme.components)

    if (customDesktopComponentNames.length > 0) {
      customDesktopComponentNames.map(name => {
        this.registerComponent(name, this.theme.components[name])

        // remove from default desktop components
        if (Object.prototype.hasOwnProperty.call(this.defaultDesktopComponents, name)) {
          delete this.defaultDesktopComponents[name]
        }

        // add name to registeredDesktopComponents
        this.registeredDesktopComponents.push(name)
      })
    }
  }

  /**
   * Register default global desktop components
   * (those not already registered in registerCustomDesktopComponents)
   *
   * @private
   */
  private registerDefaultDesktopComponents() {
    const defaultDesktopComponentNames: string[] = Object.keys(this.defaultDesktopComponents)

    if (defaultDesktopComponentNames.length > 0) {
      defaultDesktopComponentNames.map(name => {
        this.registerComponent(name, this.defaultDesktopComponents[name])

        // add name to registeredDesktopComponents
        this.registeredDesktopComponents.push(name)
      })
    }
  }

  /**
   * Register vue component globally
   *
   * @param name
   * @param component
   */
  public registerComponent(name: string, component: Component) {
    this.app.component(name, component)
  }

  /**
   * Unregister vue component globally
   *
   * @param name
   */
  public unregisterComponent(name: string) {
    delete this.app._instance.appContext.components[name]
  }

  /**
   * Set theme name to #app data-theme property
   */
  public setThemeNameInAppAttribute() {
    const appElement = document.getElementById('app')

    if (appElement) {
      appElement.setAttribute('data-theme', this.theme.name)
    }
  }

  public loadThemeLocales() {
    if (Object.prototype.hasOwnProperty.call(this.theme, 'locales')) {
      this.i18n.loadLocaleMessages(this.theme.locales)
    }
  }
}