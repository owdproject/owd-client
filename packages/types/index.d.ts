//import { AppStateType } from '@/store/modules/app/state'
//import { ConsoleStateType } from '@/store/modules/console/state'

// vue
import { createApp } from 'vue'

// vuex
type ModuleType = any //{ app: AppStateType; console: ConsoleStateType }

export type App = ReturnType<typeof createApp>
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
  routes: any[]
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

export interface OwdClientConfigurationDesktop {
  offset: {
    top: number,
    left: number,
    right: number,
    bottom: number
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
export interface OwdModuleContext extends OwdCoreModulesContext {
  moduleInfo: OwdModuleInfo
}

// OWD MODULES

export interface OwdModule {
  moduleInfo: OwdModuleInfo
  moduleStore: any
  moduleStoreConfig: any;
  moduleStoreInstance: any
  windowsInstances: OwdModuleWindowsInstances;
  registerModuleStoreInstance(storeName: string): void;
}

export interface OwdModuleInfo {
  name: string
  version: string

  config: boolean
  singleton: boolean
  autostart: boolean

  windows: OwdModuleWindowConfig[]
}

export interface OwdModuleCommands {
  [key: string]: any
}

export interface OwdModuleSseEvents {
  [key: string]: any
}

export interface OwdModuleWindowConfig {
  name: string
  category: string
  title: string
  titleShort: string
  icon: string|OwdModuleWindowConfigIcon

  menu: boolean
  closed: boolean
  hidden: boolean
  resizable: boolean
  minimized: boolean
  maximized: boolean
  maximizable: boolean
  autoCloseBeforePageUnload?: boolean
  autoDestroyBeforePageUnload?: boolean
  size: OwdModuleWindowConfigSize
  position: OwdModuleWindowConfigPosition
}

export interface OwdModuleWindowConfigSize {
  width: number
  height: number
}

export interface OwdModuleWindowConfigPosition {
  x: number
  y: number
  z?: number
}

export interface OwdModuleWindowCreateInstanceData {
  name?: string
  uniqueID?: string
  module: OwdModule
  config: OwdModuleWindowConfig
  storage?: any
}

export interface OwdModuleWindowInstance extends OwdModuleWindowCreateInstanceData {
  uniqueID?: string
}

export interface OwdModuleWindowsInstances {
  // WindowSample
  [key: string]: {
    // uniqueID
    [key: string]: OwdModuleWindowInstance
  }
}

export interface OwdModuleWindowsStorage {
  // WindowSample
  [key: string]: {
    // uniqueID
    [key: string]: {
      position: OwdModuleWindowConfigPosition
      size: OwdModuleWindowConfigSize
      closed: boolean
      minimized: boolean
      maximized: boolean
    }
  }
}

export interface OwdModuleWindowConfigIcon {
  name?: string
  offset?: {
    x?: number
    y?: number
  }
}