// import app style
import './assets/css/app.scss'
import '../assets/css/app.scss'

// register service worker
import './registerServiceWorker'

// import device detector
import './plugins/deviceDetector'

// import fonts
import './plugins/fonts'

// import terminal plugin
import Terminal from './plugins/terminal'

import extend from './plugins/extend'

// import vuetify
import './plugins/vuetify'

export default function({ Vue, store }) {
  const terminal = new Terminal()
  Vue.prototype.$terminal = terminal

  // extend owd-client
  Vue.prototype.$modules = extend({ store, terminal })
}
