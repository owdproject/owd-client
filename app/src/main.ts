import { createApp } from '@owd-client/core'
import { name, version } from '../package.json'

// configuration
import config from '../client.config'
import extensions from '../client.extensions'

// main vue component
import App from './App.vue'

if (debug) console.log(`[owd] ${name} ${version}`)

// create an Open Web Desktop instance
createApp({
  component: App,
  config,
  extensions
}).then(() => {
  // app loaded
})