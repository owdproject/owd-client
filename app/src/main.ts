import { createApp } from '@owd-client/core'
import { name, version } from '../package.json'

// configuration
import config from '../client.config'
import extensions from '../client.extensions'

// vue entry point
import App from './App.vue'

// create an Open Web Desktop instance
createApp({
  component: App,
  config,
  extensions
}).then(() => {
  if (debug) console.log(`[owd] ${name} ${version}`)

  // app loaded
})