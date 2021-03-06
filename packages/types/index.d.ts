import { App, Component } from 'vue'
import { Store, ModuleTree } from 'vuex'
import {RouteRecordRaw} from "vue-router";

// OWD CLIENT

export interface OwdClientConfiguration {
  debug: boolean
  ui: {
    de: string
    theme: string
  }
  sse: OwdClientConfigurationSse
  i18n: OwdClientConfigurationI18n
  store: OwdClientConfigurationStore
  vuetify: any
}

export interface OwdClientConfigurationStore {
  strict?: boolean
  devtools: boolean
}

export interface OwdClientConfigurationI18n {
  locale: string
  fallbackLocale: string
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
    component: Component
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
  modules: ModuleTree<any>
}

export interface OwdCoreRouterContext {
  app: App
  routes: RouteRecordRaw[]
}

export interface OwdCorePluginsContext {
  app: App
  plugins: any
}

export interface OwdCoreBootContext {
  component: Component
  config: OwdClientConfiguration
  extensions: OwdClientConfigurationExtensions
}

// modulesExtend.class
export interface OwdCoreModuleContext {
  app: App
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
  app: App
  store: Store<any>
  moduleInfo: OwdModuleAppInfo
  moduleStore: any
  moduleStoreConfig: any;
  moduleStoreInstance: any
  windowInstances: OwdModuleAppWindowsInstances;
  registerModuleStoreInstance(storeName: string): void;
  unregisterModuleStoreInstance(storeName: string): void;
  hasModuleStoreInstance(): boolean;
  isSingleton: boolean;
  addWindow(config: OwdModuleAppWindowConfig, storage?: OwdModuleAppWindowStorage): OwdModuleAppWindowInstance;
  restoreOrAddWindow(config: OwdModuleAppWindowConfig): OwdModuleAppWindowInstance;
  createWindow(config: OwdModuleAppWindowConfig, storage?: OwdModuleAppWindowStorage): OwdModuleAppWindowInstance;
  restoreOrCreateWindow(config: OwdModuleAppWindowConfig): OwdModuleAppWindowInstance;
  windowGroupInstancesCount(windowName: string): number;
  windowGroupInstancesFirstInstance(windowName: string): OwdModuleAppWindowInstance|boolean;
}

export interface OwdModuleAppInfo {
  name: string

  config?: boolean
  singleton?: boolean

  windows?: OwdModuleAppWindowConfig[]
  dependencies?: {[key: string]: string}
}

export interface OwdModuleAppSetupContext {
  app: App
}

export interface OwdModuleAppSetupAssetsContext {
  app: App,
  config: OwdModuleAppInfo,
  store: Store<any>
}

export interface OwdModuleAppSetupCommandsContext {
  app: App,
  config: OwdModuleAppInfo,
  store: Store<any>,
  terminal: any
}

export interface OwdModuleAppSetupSseEventsContext {
  app: App,
  config: OwdModuleAppInfo,
  store: Store<any>,
  terminal: any
}

export interface OwdModuleAppSetupStoreContext {
  app: App,
  config: OwdModuleAppInfo,
  store: Store<any>,
  terminal: any
}

export interface OwdModuleAppCommands {
  [key: string]: any
}

export interface OwdModuleAppSseEvents {
  [key: string]: any
}

export interface OwdModuleAppWindowConfig {
  component: Component
  name: string
  category?: string
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
  module: OwdModuleApp
  config: OwdModuleAppWindowConfig
  storage?: OwdModuleAppWindowStorage
}

export interface OwdModuleAppWindowInstance extends OwdModuleAppWindowCreateInstanceData {
  config: OwdModuleAppWindowConfig
  storage: OwdModuleAppWindowStorage
  module: OwdModuleApp
  windowName: string
  moduleName: string
  uniqueID: string
  uniqueName: string
  create(): boolean
  restore(): boolean
  destroy(): boolean
  open(focus?: boolean): boolean
  close(): void
  minimize(): boolean
  minimizeToggle(): boolean
  maximize(toggle: boolean): boolean
  fullscreen(toggle: boolean): void

  focus(): void
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
  uniqueID: string,
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