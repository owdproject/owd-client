import Vue from 'vue';

const validColors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
const validTextFormat = ['b', 's', 'o', 'i', 'u', 'g'];

export default class Terminal {
  constructor() {
    this.instance = null;
    this.commands = {};

    this.defaultColors = {
      menu: 'cyan'
    };

    this.account = {
      logged: false,
      color: "white"
    }

    // color helper
    this.textColor = (text, color, textFormat) => {
      if (!validTextFormat.includes(textFormat)) {
        textFormat = '';
      } else {
        textFormat = '!' + textFormat;
      }

      if (!validColors.includes(color)) {
        color = '';
      }

      return '[[' + textFormat + ';' + color + ';]' + text + ']'
    };
  }

  get username () {
    if (this.account.logged && this.account.color) {
      if (this.account.logged && this.account.color) {
        return this.textColor(this.account.username, this.account.color)
      }

      return this.account.username
    }

    return 'guest'
  }

  get greetings() {
    return process.env.VUE_APP_USER + " console :: Version " + process.env.VUE_APP_VERSION + "\n" +
      "Copyright (c) " + new Date().getFullYear() + " " + process.env.VUE_APP_WEBSITE + "\n\n" +
      "Welcome, " + this.username + ". " +
      "Type " + this.textColor('help', 'white') + " to list available commands\n"
  }

  setInstance(terminal) {
    this.instance = terminal;
  }

  addCommand(name, fn) {
    this.commands[name] = fn
  }

  isModuleLoaded(module) {
    return Vue.prototype.$modules.isModuleLoaded(module)
  }

  apiBaseUrl(url) {
    return process.env.VUE_APP_SERVER_API_BASE_URL + url;
  }
}
