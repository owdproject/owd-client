import { App } from 'vue'
// @ts-ignore
import { Vuetify, createVuetify } from 'vuetify/dist/vuetify.js'

import 'vuetify/dist/vuetify.min.css';

let vuetify: Vuetify

export function initializeVuetify(app: App) {
  vuetify = createVuetify(app.config.globalProperties.$owd.vuetify)

  app.use(vuetify)
}