export default class {
  public commands: any = {}
  public events: any = {}

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
    this.commands[name](instance, ...args)
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
   * API base url helper
   *
   * @param path
   * @returns {*}
   */
  apiBaseUrl(path: string) {
    return process.env.VUE_APP_API_BASE_URL + path
  }
}
