import { App } from 'vue'
// @ts-ignore
import { createVuetify } from 'vuetify/dist/vuetify.js'

import 'vuetify/dist/vuetify.min.css';

export function owdCreateVuetify(app: App) {
  return createVuetify(app.config.globalProperties.$owd.vuetify)
}