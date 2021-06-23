import {createDesktop} from '@owd-client/core/index'
import { name, version } from '../package.json'

// main vue component
import App from './App.vue'

// client configuration
import config from '../client.config'
import extensions from '../client.extensions'

// create an Open Web Desktop instance
createDesktop({
  component: App,
  config,
  extensions
}).then(() => {
  console.log(`[owd] initialize ${name} ${version}`)
})