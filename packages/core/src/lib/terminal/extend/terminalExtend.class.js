const validColors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
const validTextFormat = ['b', 's', 'o', 'i', 'u', 'g']

export default class {
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
   * todo
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
   * Add global command to terminal
   *
   * @param name
   * @param fn
   */
  addCommand(name, fn) {
    this.commands[name] = fn
  }

  /**
   * Does terminal global command exists?
   *
   * @param name
   */
  existCommand(name) {
    return typeof this.commands[name] === 'function'
  }

  /**
   * Run terminal global command
   *
   * @param name
   * @param args
   */
  execCommand(name, args) {
    if (this.existCommand(name)) {
      this.commands[name](...args)
    }
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
    return process.env.VUE_APP_API_BASE_URL + url
  }
}
