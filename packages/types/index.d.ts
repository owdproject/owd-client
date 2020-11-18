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

export interface OwdClientConfigurationModulesEnabled {
  [key: string]: {
    name: string
    version: string
    url: string
  };
}

export interface OwdClientConfigurationModules {
  type: string
  modulesEnabled: OwdClientConfigurationModulesEnabled
}

export interface OwdClientConfigurationIcons {
  [key: string]: any
}

export interface OwdClientConfiguration {
  debug: boolean
  routes: any[]
  modules: OwdClientConfigurationModules
  icons: OwdClientConfigurationIcons
  vuetify: any
}

// OWD CORE

export interface OwdCoreBootContext {
  app: App
  config: any
}

// modulesExtend.class
export interface OwdCoreModulesContext {
  config: OwdClientConfiguration
  app: App
  store: any
  terminal: any
}

// module.class
export interface OwdModuleContext extends OwdCoreModulesContext {
  moduleInfo: OwdModuleInfo
}

// OWD MODULES

export interface OwdModuleWindowIcon {
  name?: string
  offset?: {
    x?: number
    y?: number
  }
}

export interface OwdModuleWindow {
  name: string
  title: string
  titleShort: string
  icon: string|OwdModuleWindowIcon
  config: {
    menu: boolean
    closed: boolean
    hidden: boolean
    resizable: boolean
    size: {
      width: number
      height: number
    }
    position: {
      x: number
      y: number
      z: number
    }
  }
}

export interface OwdModuleInfo {
  name: string
  version: string

  license?: string
  homepage?: string
  author?: {
    name: string
    url: string
  }

  config: boolean
  singleton: boolean
  autostart: boolean

  windows: OwdModuleWindow[]
}

export interface OwdModuleCommands {
  [key: string]: any
}