// import app core styles
import './assets/css/app.scss'
// import app custom styles
import '@/assets/css/app.scss'

// register service worker
import './registerServiceWorker'

// import device detector
import './plugins/deviceDetector'

// import fonts
import './plugins/fonts'

// import vuetify
import './plugins/vuetify'

import owdTerminal from './plugins/terminal'
import owdExtend from './plugins/extend'
import owdRouter from './router'

export default class {
  constructor({ Vue, config, store }) {
    this.config = config
    this.store = store

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

    // load owd-client terminal commands
    const terminal = new owdTerminal()

    // pre assign terminal to $owd (it can be useful in certain modules)
    Vue.prototype.$owd = { terminal }

    // load owd modules
    const modules = new owdExtend({
      store: this.store,
      config: this.config,
      terminal
    })

    // initialize owd router
    const router = owdRouter(this.config)

    return {
      store: this.store,
      modules,
      terminal,
      router
    }
  }
}
