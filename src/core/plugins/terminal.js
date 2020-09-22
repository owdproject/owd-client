import Vue from 'vue';

const validColors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
const validTextFormat = ['b', 's', 'o', 'i', 'u', 'g'];

export default class Terminal {
  constructor() {
    // owd terminal instance
    this.instance = null;
    // jquery-terminal, xterm, etc
    this.type = ''

    // all commands are stored here
    this.commands = {};

    this.defaultColors = {
      menu: 'cyan'
    };

    this.account = {
      logged: false,
      color: "white"
    }
  }

  /**
   * Set terminal instance
   *
   * @param terminal
   */
  setInstance(terminal) {
    this.instance = terminal;
  }

  /**
   * Set terminal type
   *
   * @param type
   */
  setType(type) {
    this.type = type;
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
    return process.env.VUE_APP_USER + " console :: Version " + process.env.VUE_APP_VERSION + "\n" +
      "Copyright (c) " + new Date().getFullYear() + " " + process.env.VUE_APP_WEBSITE + "\n\n" +
      "Welcome, " + this.username + ". " +
      "Type " + this.textColor('help', 'white') + " to list available commands\n"
  }

  /**
   * Exec command
   *
   * @param command
   */
  exec(command) {
    console.log(this.type)

    switch(this.type) {
      case "jquery-terminal":
        this.instance.exec(command)
        break;
      case "xterm":

        break;
    }
  }

  /**
   * Destroy terminal
   */
  destroy() {
    switch(this.type) {
      case "jquery-terminal":
        this.instance.destroy()
        break;
      case "xterm":

        break;
    }
  }

  /**
   * Set input command
   *
   * @param command
   */
  setCommand(command) {
    switch(this.type) {
      case "jquery-terminal":
        this.instance.set_command(command)
        break;
      case "xterm":

        break;
    }
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
      textFormat = '';
    } else {
      textFormat = '!' + textFormat;
    }

    if (!validColors.includes(color)) {
      color = '';
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
    return process.env.VUE_APP_SERVER_API_BASE_URL + url;
  }
}
