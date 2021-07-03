export default class {
  public commands: any = {}
  public events: any = {}

  constructor() {
    this.commands = {}
    this.events = {}
  }

  /**
   * Add command to terminal
   *
   * @param name
   * @param fn
   */
  addCommand(name: string, fn: any) {
    if (this.hasCommand(name)) {
      console.error(`[owd] command "${name}" was already defined, it has been overwritten`)
    }

    this.commands[name] = fn
  }

  /**
   * Does terminal command exists?
   *
   * @param name
   */
  hasCommand(name: string) {
    return typeof this.commands[name] === 'function'
  }

  /**
   * Run terminal command
   *
   * @param instance
   * @param name
   * @param args
   */
  execCommand(instance: any, name: string, args: string[] = []) {
    this.commands[name](instance, args)
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
}
