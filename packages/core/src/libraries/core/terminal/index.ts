import TerminalExtend from './extend/terminalExtend'

let terminal: any

/**
 * Initialize OWD terminal support
 */
export function initializeDesktopTerminal() {
  terminal = new TerminalExtend()

  return terminal
}

export function useDesktopTerminal() {
  return terminal
}