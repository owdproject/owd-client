import moment from 'moment'

export default {
  install: (app: any) => {
    // assign to $moment
    app.config.globalProperties.$moment = moment
  }
}