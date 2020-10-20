import Vue from 'vue'

const validColors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
const validTextFormat = ['b', 's', 'o', 'i', 'u', 'g']

export default class Terminal {
  constructor() {
    // all terminal commands
    this.commands = {}

    // all terminal events
    this.events = {}

    this.defaultColors = {
      menu: 'cyan'
    }

    this.account = {
      logged: false,
      color: 'white'
    }
  }

  /**
   * Logged username
   *
   * @returns {string|*}
   */
  get username () {
    if (this.account.logged && this.account.color) {
      if (this.account.logged && this.account.color) {
        return this.textColor(this.account.username, this.account.color)
      }

      return this.account.username
    }

    return 'guest'
  }

  /**
   * Return default greeting
   *
   * @returns {string}
   */
  get greetings() {
    return process.env.VUE_APP_USER + ' console :: Version ' + (process.env.VUE_APP_VERSION || '1.0.0') + '\n' +
      'Copyright (c) ' + new Date().getFullYear() + ' ' + process.env.VUE_APP_WEBSITE + '\n\n' +
      'Welcome, ' + this.username + '. ' +
      'Type ' + this.textColor('help', 'white') + ' to list available commands\n'
  }

  /**
   * Add command to terminal
   *
   * @param name
   * @param fn
   */
  addCommand(name, fn) {
    this.commands[name] = fn
  }

  /**
   * Add event to terminal
   *
   * @param event
   * @param fn
   */
  addEvent(event, fn) {
    if (typeof this.events[event] === 'undefined') {
      this.events[event] = []
    }

    this.events[event].push(fn)
  }

  /**
   * Check if module is loaded
   *
   * @param module
   * @returns {*}
   */

  isModuleLoaded(module) {
    return Vue.prototype.$modules.isModuleLoaded(module)
  }

  /**
   * Color helper
   *
   * @param text
   * @param color
   * @param textFormat
   * @returns {string}
   */
  textColor(text, color, textFormat) {
    if (!validTextFormat.includes(textFormat)) {
      textFormat = ''
    } else {
      textFormat = '!' + textFormat
    }

    if (!validColors.includes(color)) {
      color = ''
    }

    return '[[' + textFormat + ';' + color + ';]' + text + ']'
  }

  /**
   * API base url
   *
   * @param url
   * @returns {*}
   */
  apiBaseUrl(url) {
    return process.env.VUE_APP_SERVER_API_BASE_URL + url
  }
}
