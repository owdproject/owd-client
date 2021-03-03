// Device Detector for Vue 3, adapted to OWD
// forked from https://github.com/dreambo8563/vue-device-detector

const appVersion = window.navigator.appVersion.toLowerCase();
const userAgent = window.navigator.userAgent.toLowerCase();
const devicePixelRatio = window.devicePixelRatio || 1;
const ipadOS13Up = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;

export default class DeviceDetector {
  readonly windows: boolean
  readonly mac: boolean
  readonly unix: boolean
  readonly linux: boolean

  readonly ipod: boolean
  readonly ipad: boolean
  readonly iphone: boolean

  readonly iphoneX: boolean
  readonly iphoneXR: boolean
  readonly iphoneXSMax: boolean

  readonly ios: boolean
  readonly android: boolean
  readonly androidPhone: boolean
  readonly mobile: boolean

  constructor() {
    this.windows = DeviceDetector.findUserAgent("windows");
    this.mac = DeviceDetector.findAppVersion("mac");
    this.unix = DeviceDetector.findAppVersion("x11");
    this.linux = DeviceDetector.findAppVersion("linux");

    this.ipod = DeviceDetector.findUserAgent("ipod");
    this.ipad = DeviceDetector.findUserAgent("ipad") || ipadOS13Up;
    this.iphone = !this.windows && DeviceDetector.findUserAgent("iphone");
    this.iphoneX =
      this.iphone &&
      devicePixelRatio === 3 &&
      window.screen.width === 375 &&
      window.screen.height === 812;

    this.iphoneXR =
      this.iphone &&
      devicePixelRatio === 2 &&
      window.screen.width === 414 &&
      window.screen.height === 896;

    this.iphoneXSMax =
      this.iphone &&
      devicePixelRatio === 3 &&
      window.screen.width === 414 &&
      window.screen.height === 896;

    this.ios = this.iphone || this.ipod || this.ipad;
    this.android = !this.windows && DeviceDetector.findUserAgent("android");
    this.androidPhone = this.android && DeviceDetector.findUserAgent("mobile");
    this.mobile = this.androidPhone || this.iphone || this.ipod;
  }

  /**
   * Find in user agent
   *
   * @param needle
   * @private
   */
  static findUserAgent(needle: string) {
    return userAgent.indexOf(needle) !== -1;
  }

  /**
   * Find in app version
   *
   * @param needle
   * @private
   */
  static findAppVersion(needle: string) {
    return appVersion.indexOf(needle) !== -1;
  }

  /**
   * Get device classes for document body
   */
  public getBodyClassList(): string[] {
    const appClasses = []

    // device
    appClasses.push(this.mobile ? 'is-mobile' : 'is-desktop')

    // os
    let os = null
    if (this.windows) os = 'is-windows'
    if (this.mac) os = 'is-mac'
    if (this.unix) os = 'is-unix'
    if (this.linux) os = 'is-linux'

    if (os) {
      appClasses.push(os)
    }

    return appClasses
  }
}