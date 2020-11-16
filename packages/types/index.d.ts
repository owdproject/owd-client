//import { AppStateType } from '@/store/modules/app/state'
//import { ConsoleStateType } from '@/store/modules/console/state'

// vue
import { createApp } from 'vue'

// vuex
type ModuleType = any //{ app: AppStateType; console: ConsoleStateType }

export type App = ReturnType<typeof createApp>
export type StateType = ModuleType

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

export interface OwdCoreBootContext {
  app: App
  config: any
}