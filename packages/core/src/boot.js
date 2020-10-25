// register service worker
import './lib/service-worker/registerServiceWorker'

// import device detector
import './plugins/deviceDetector'

import owdTerminal from './lib/terminal/terminal.class'
import owdModulesExtend from './lib/modules/modulesExtend.class'
import owdRouter from './router'

export default class {
  constructor({ Vue, config, store }) {
    this.config = config
    this.store = store
    this.terminal = null
    this.modules = null

    const owdInstance = this.initialize(Vue)

    // assign to $owd
    Vue.prototype.$owd = owdInstance

    return owdInstance
  }

  /**
   * Initialize OWD
   * @param Vue
   */
  initialize(Vue) {
    Vue.config.productionTip = !!this.config.productionTip;

    // assets
    this.initializeAssets(Vue);

    this.terminal = this.initializeTerminal(Vue)
    this.modules = this.initializeModules(Vue)
    this.router = this.initializeRouter(Vue)

    return {
      modules: this.modules,
      terminal: this.terminal,
      router: this.router,
      store: this.store
    }
  }

  /**
   * Initialize assets
   * @param Vue
   */
  initializeAssets(Vue) {
    // import app core styles
    require('./assets/css/app.scss')

    // import app custom styles from owd-client
    require('@/assets/css/app.scss')

    // import Oswald font with typeface
    require('typeface-oswald')

    // import Jetbrains Mono font with typeface
    require('typeface-jetbrains-mono')

    // import mdi icons
    require('@mdi/font/css/materialdesignicons.css')

    // assign vuetify config to $vuetify
    Vue.prototype.$vuetify = this.config.vuetify
  }

  /**
   * Initialize modules
   */
  initializeModules() {
    // load owd modules
    return new owdModulesExtend({
      store: this.store,
      config: this.config,
      terminal: this.terminal
    })
  }

  /**
   * Initialize global terminal support
   * @param Vue
   */
  initializeTerminal(Vue) {
    const terminal = new owdTerminal()

    // pre assign terminal to $owd (for module integrations)
    Vue.prototype.$owd = { terminal }

    return terminal
  }

  initializeRouter() {
    return owdRouter(this.config)
  }
}
