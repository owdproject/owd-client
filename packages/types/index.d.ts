//import { AppStateType } from '@/store/modules/app/state'
//import { ConsoleStateType } from '@/store/modules/console/state'

// vue
import { createApp } from 'vue'
import {Store} from "vuex";

// vuex
type ModuleType = any //{ app: AppStateType; console: ConsoleStateType }

export type App = ReturnType<typeof createApp> & {
  config: {
    owd: OwdClientConfiguration
  }
}

export type StateType = ModuleType

// DEVICE DETECTOR

export interface OwdDeviceDetector {
  ios: boolean;
  iphone: boolean;
  iphoneX: boolean;
  iphoneXR: boolean;
  iphoneXSMax: boolean;
  ipod: boolean;
  ipad: boolean;
  android: boolean;
  androidPhone: boolean;
  windows: boolean;
  mac: boolean;
  unix: boolean;
  linux: boolean;
  mobile: boolean;
}

// OWD CLIENT

export interface OwdClientConfiguration {
  debug: boolean
  theme: string
  routes: any[]
  sse: OwdClientConfigurationSse
  modules: OwdClientConfigurationModules
  desktop: OwdClientConfigurationDesktop
  icons: OwdClientConfigurationIcons
  vuetify: any
}

export interface OwdClientConfigurationModules {
  type: string
  modulesEnabled: OwdClientConfigurationModulesEnabled
}

export interface OwdClientConfigurationIcons {
  [key: string]: any
}

export interface OwdClientConfigurationSse {
  enabled: boolean
}

export interface OwdClientConfigurationDesktop {
  SystemBar: {
    modules: string[],
    options: {
      enabled: boolean,
      position: 'top' | 'bottom',
      modules: {[key: string]: any}
    }
  }
}

export interface OwdClientConfigurationModulesEnabled {
  [key: string]: {
    name: string
    version: string
    url: string
  };
}

// OWD CORE

export interface OwdCoreBootContext {
  app: App
  config: OwdClientConfiguration
}

// modulesExtend.class
export interface OwdCoreModulesContext {
  app: App
  config: OwdClientConfiguration
  store: any
  terminal: any
}

// module.class
export interface OwdModuleAppContext extends OwdCoreModulesContext {
  moduleInfo: OwdModuleAppInfo
}

// OWD MODULES APP

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
  version: string
  license?: string
  homepage?: string
  author?: {
    name?: string
    email?: string
    url?: string
  }

  config: boolean
  singleton?: boolean

  windows: OwdModuleAppWindowConfig[]
  dependencies?: {[key: string]: string}
}

export interface OwdModuleAppLoadCommandsContext {
  store?: Store<any>,
  terminal?: any
}

export interface OwdModuleAppCommands {
  [key: string]: any
}

export interface OwdModuleAppLoadSseEventsContext {
  store?: Store<any>,
  terminal?: any
}

export interface OwdModuleAppSseEvents {
  [key: string]: any
}

export interface OwdModuleAppLoadStoreContext {
  store?: Store<any>,
  terminal?: any
}

export interface OwdModuleAppWindowConfig {
  name: string
  category: string
  title: string
  titleApp?: string
  titleShort: string
  icon: string|OwdModuleAppWindowConfigIcon

  size: OwdModuleAppWindowConfigSize
  position: OwdModuleAppWindowConfigPosition
  favorite?: boolean
  menu?: boolean
  resizable?: boolean
  minimized?: boolean
  maximized?: boolean
  maximizable?: boolean
  borderless?: boolean
  noContentSpacing?: boolean
  autoOpen?: boolean
  autoCloseBeforePageUnload?: boolean
  autoDestroyBeforePageUnload?: boolean

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
  dummy?: boolean
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
  maximize(): void
  unmaximize(): void

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
  focused: boolean
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
  }
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