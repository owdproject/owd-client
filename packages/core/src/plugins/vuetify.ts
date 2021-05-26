// @ts-ignore
import { createVuetify } from 'vuetify/dist/vuetify.js'
import {App} from "@owd-client/types";

import 'vuetify/dist/vuetify.min.css';

export const owdCreateVuetify = function(app: App) {
  return createVuetify(app.config.owd.vuetify)
}