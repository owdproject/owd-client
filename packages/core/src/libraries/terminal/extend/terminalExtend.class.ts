export default class {
  public commands: any = {}
  public events: any = {}

  public defaultColors = {
    menu: 'cyan'
  }

  private readonly validColors: string[] = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
  private readonly validTextFormat: string[] = ['b', 's', 'o', 'i', 'u', 'g']


  constructor() {
    this.commands = {}
    this.events = {}
  }

  /**
   * Add global command to terminal
   *
   * @param name
   * @param fn
   */
  addCommand(name: string, fn: any) {
    if (this.existCommand(name)) {
      return console.error(`[OWD] Cannot add "${name}" command, already defined`)
    }

    this.commands[name] = fn
  }

  /**
   * Does terminal global command exists?
   *
   * @param name
   */
  existCommand(name: string) {
    return typeof this.commands[name] === 'function'
  }

  /**
   * Run terminal global command
   *
   * @param instance (localEcho)
   * @param name
   * @param args
   */
  execCommand(instance: any, name: string, args: any) {
    // @ts-ignore
    this.echo = function(msg) {
      if (instance) {
        instance.println(msg + '\n\r')
      }
    }

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
  addEvent(event: string, fn: any) {
    if (typeof this.events[event] === 'undefined') {
      this.events[event] = []
    }

    this.events[event].push(fn)
  }

  /**
   * Color helper
   * todo move to owd-terminal module
   *
   * @param text
   * @param color
   * @param textFormat
   * @returns {string}
   */
  textColor(text: string, color: string, textFormat: string) {
    if (!this.validTextFormat.includes(textFormat)) {
      textFormat = ''
    } else {
      textFormat = '!' + textFormat
    }

    if (!this.validColors.includes(color)) {
      color = ''
    }

    return '[[' + textFormat + ';' + color + ';]' + text + ']'
  }

  /**
   * API base url helper
   *
   * @param path
   * @returns {*}
   */
  apiBaseUrl(path: string) {
    return process.env.VUE_APP_API_BASE_URL + path
  }
}
