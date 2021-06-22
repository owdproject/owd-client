import { App } from 'vue'
import { Store, ModuleTree } from 'vuex'
import extensions from "owd-client/client.extensions";

// vuex
type ModuleType = any //{ app: AppStateType; console: ConsoleStateType }


export type StateType = ModuleType

// OWD CLIENT

export interface OwdClientConfiguration {
  debug: boolean
  ui: {
    de: string
    theme: string
  }
  sse: OwdClientConfigurationSse
  store: OwdClientConfigurationStore
  vuetify: any
}

export interface OwdClientConfigurationStore {
  strict?: boolean
  devtools: boolean
}

export interface OwdClientConfigurationSse {
  enabled: boolean
  reconnectOnError: boolean
  reconnectTimeout: number
}

export interface OwdClientConfigurationExtensions {
  routes: any[]
  app: {
    modules?: any[]
  },
  desktop: {
    component: any
    modules?: any[]
    options: {
      [key: string]: any
    }
  },
  plugins: any[]
  store: ModuleTree<any>
}

// OWD CORE

export interface OwdCoreStoreContext {
  app: App
  config: OwdClientConfigurationStore
  modules: ModuleTree<any>
}

export interface OwdCoreTerminalContext {
  app: App
}

export interface OwdCoreBootContext {
  component: any
  config: OwdClientConfiguration
  extensions: OwdClientConfigurationExtensions
}

// modulesExtend.class
export interface OwdCoreModuleContext {
  app: App
  config: OwdClientConfiguration
  extensions: OwdClientConfigurationExtensions
  store: any
  terminal: any
}

// module.class
export interface OwdModuleAppContext extends OwdCoreModuleContext {
  moduleInfo: OwdModuleAppInfo
}

// OWD MODULES APP

export interface OwdModulesApp {
  [key: string]: OwdModuleApp[]
}

export interface OwdModuleApp {
  moduleInfo: OwdModuleAppInfo
  moduleStore: any
  moduleStoreConfig: any;
  moduleStoreInstance: any
  windowInstances: OwdModuleAppWindowsInstances;
  registerModuleStoreInstance(storeName: string): void;
  unregisterModuleStoreInstance(storeName: string): void;
  hasModuleStoreInstance(): boolean;
  isSingleton: boolean;
}

export interface OwdModuleAppInfo {
  name: string

  config?: boolean
  singleton?: boolean

  windows: OwdModuleAppWindowConfig[]
  dependencies?: {[key: string]: string}
}

export interface OwdModuleAppLoadCommandsContext {
  store: Store<any>,
  terminal: any
}

export interface OwdModuleAppLoadSseEventsContext {
  store: Store<any>,
  terminal: any
}

export interface OwdModuleAppLoadStoreContext {
  store: Store<any>,
  terminal?: any
}

export interface OwdModuleAppCommands {
  [key: string]: any
}

export interface OwdModuleAppSseEvents {
  [key: string]: any
}

export interface OwdModuleAppWindowConfig {
  component: any
  name: string
  category: string
  title: string
  titleApp?: string
  titleWindow?: string
  titleMenu?: string
  icon: string|OwdModuleAppWindowConfigIcon

  size: OwdModuleAppWindowConfigSize
  position: OwdModuleAppWindowConfigPosition
  favorite?: boolean
  menu?: boolean
  menuApp?: boolean
  resizable?: boolean
  minimized?: boolean
  maximized?: boolean
  maximizable?: boolean
  fullscreenable?: boolean
  borderless?: boolean
  hostname?: string
  autoOpen?: boolean
  autoCloseBeforePageUnload?: boolean
  autoDestroyBeforePageUnload?: boolean
  theme?: {
    dense?: boolean
    rounded?: boolean
    noContentSpacing?: boolean
    preserveMaterial?: boolean
  }

  metaData?: any
}

export interface OwdModuleAppWindowConfigSize {
  width: number
  height: number
}

export interface OwdModuleAppWindowConfigPosition {
  x: number
  y: number
  z?: number
}

export interface OwdModuleAppWindowCreateInstanceData {
  uniqueID?: string
  module: OwdModuleApp
  config: OwdModuleAppWindowConfig
  storage?: OwdModuleAppWindowStorage
}

export interface OwdModuleAppWindowInstance extends OwdModuleAppWindowCreateInstanceData {
  moduleName: string
  uniqueID: string
  uniqueName: string
  storage: OwdModuleAppWindowStorage
  open(): void
  close(): void
  destroy(): void
  minimize(): void
  minimizeToggle(): void
  maximize(toggle: boolean): void
  fullscreen(toggle: boolean): void

  setFocusActive(focused: boolean): void
  getFocusIndex(): void
  setFocusIndex(index: number): void

  getSize(): OwdModuleAppWindowConfigSize
  setSize(size: OwdModuleAppWindowConfigSize): void
  resetSize(): void

  getPosition(): OwdModuleAppWindowConfigPosition
  setPosition(position: OwdModuleAppWindowConfigPosition): void
  resetPosition(): void
  adjustPosition(): void

  setNavTitle(title: string, exclusive?: boolean): void
}

export interface OwdModuleAppWindowsInstances {
  // WindowSample
  [key: string]: {
    // uniqueID
    [key: string]: OwdModuleAppWindowInstance
  }
}

export interface OwdModuleAppWindowStorage {
  title?: string
  position: OwdModuleAppWindowConfigPosition
  size: OwdModuleAppWindowConfigSize
  opened: boolean
  minimized: boolean
  maximized: boolean
  fullscreen?: boolean
  focused: boolean,
  metaData?: any
}

export interface OwdModuleAppWindowsStorage {
  // WindowSample
  [key: string]: {
    // uniqueID
    [key: string]: OwdModuleAppWindowStorage
  }
}

export interface OwdModuleAppWindowConfigIcon {
  name?: string
  offset?: {
    x?: number
    y?: number
  },
  background?: string
  color?: string
  forceMenuAppSvg?: boolean
}

// window details

export interface OwdModuleAppWindowDetail {
  module: OwdModuleApp
  config: OwdModuleAppWindowConfig
}

// OWD MODULES DESKTOP

export interface OwdModulesDesktop {
  [key: string]: {
    [key: string]: OwdModuleDesktop[]
  }
}

export interface OwdModuleDesktop {
  config: OwdModuleDesktopConfig,
  components: {
    [key: string]: any
  }
}

export interface OwdModuleDesktopConfig {
  name: string,
  area: string,
  position: string,
  opened?: boolean
}