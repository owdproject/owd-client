import deviceDetector from '../libraries/deviceDetector/deviceDetector.class'

export default {
  install: (app: any) => {
    // assign to $device
    app.config.globalProperties.$device = new deviceDetector()

    // append device classes to document body
    app.config.globalProperties.$device
      .getBodyClassList()
      .forEach((deviceClass: string) => {
        window.document.body.classList.add(deviceClass)
      })
  }
}