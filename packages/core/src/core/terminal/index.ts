import TerminalExtend from './terminalExtend'
import {OwdCoreContext} from "@owd-client/types";

let terminal: any

/**
 * Initialize OWD terminal support
 */
export function initializeDesktopTerminal(context: OwdCoreContext) {
  terminal = new TerminalExtend()

  // assign terminal to owd context
  context.terminal = terminal

  return terminal
}

/**
 * Terminate OWD terminal support
 */
export function terminateDesktopTerminal(context: OwdCoreContext) {
  terminal = context.terminal = null
}

export function useDesktopTerminal() {
  return terminal
}