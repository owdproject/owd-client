import TerminalExtend from './terminalExtend'

let terminal: any

/**
 * Initialize OWD terminal support
 */
export function initializeAppTerminal() {
  terminal = new TerminalExtend()

  return terminal
}

export function useAppTerminal() {
  return terminal
}