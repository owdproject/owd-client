import {StateType, OwdClientConfiguration} from './index'
import { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<StateType>
    $route: RouteLocationNormalizedLoaded
    $router: Router
    $owd: {
      config: OwdClientConfiguration
    }
  }
}