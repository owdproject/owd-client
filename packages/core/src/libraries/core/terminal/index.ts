import TerminalExtend from './extend/terminalExtend'
import {OwdCoreTerminalContext} from "@owd-client/types";

let terminal: any

/**
 * Initialize OWD terminal support
 */
export function initializeDesktopTerminal(context: OwdCoreTerminalContext) {
  terminal = new TerminalExtend()

  return terminal
}

export function useDesktopTerminal() {
  return terminal
}