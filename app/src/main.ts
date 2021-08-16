import {createApp} from '@owd-client/core/index'
import { name, version } from '../package.json'

// main vue component
import App from './App.vue'

// client configuration
import config from '../client.config'
import extensions from '../client.extensions'

console.log(`[owd] ${name} ${version}`)

// create an Open Web Desktop instance
createApp({
  component: App,
  config,
  extensions
}).then(() => {
  // app loaded
})