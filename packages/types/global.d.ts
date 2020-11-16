import { StateType, OwdClientConfigurationIcons } from './index'
import { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import { Store } from 'vuex'

import {IDeviceDetector} from "@owd-client/core/src/lib/device-detector/deviceDetector.class";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<StateType>
    $route: RouteLocationNormalizedLoaded
    $router: Router
    $device: IDeviceDetector
    $owd: {
      config: {
        debug: boolean
        icons: OwdClientConfigurationIcons
      }
    }
  }
}