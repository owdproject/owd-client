// register service worker
import './lib/service-worker/registerServiceWorker'

// import device detector
import './plugins/deviceDetector'

import owdTerminalExtend from './lib/terminal/extend/terminalExtend.class'
import owdModulesExtend from './lib/modules/extend/modulesExtend.class'
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
      config: this.config,
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

    // assign vuetify config to $vuetify
    Vue.prototype.$vuetify = this.config.vuetify
  }

  /**
   * Initialize global terminal support
   * @param Vue
   */
  initializeTerminal(Vue) {
    const terminalExtend = new owdTerminalExtend()

    // pre assign terminal to $owd (for module integrations)
    Vue.prototype.$owd = { terminal: terminalExtend }

    return terminalExtend
  }

  /**
   * Initialize modules
   */
  initializeModules() {
    return new owdModulesExtend({
      config: this.config,
      terminal: this.terminal,
      store: this.store
    })
  }

  initializeRouter() {
    return owdRouter(this.config)
  }
}
