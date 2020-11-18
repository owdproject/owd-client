import {OwdDeviceDetector} from "../../types";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $device: OwdDeviceDetector;
  }
}
