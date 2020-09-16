// Import app style
import '../css/app.scss'
import '../../css/app.scss'

// Service worker
import '../registerServiceWorker'

// Import device detector
import '../plugins/deviceDetector'

// Import fonts
import '../plugins/fonts'

// Import owd-client unified shell
import Shell from '../plugins/shell'

import extend from '../plugins/extend'

export default function({ Vue, store }) {
  const shell = new Shell();
  Vue.prototype.$shell = shell;

  // assign loaded modules to $modules
  Vue.prototype.$modules = extend({ store, shell });
}
