import {IDeviceDetector} from "@owd-client/core/src/lib/device-detector/deviceDetector.class";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $device: IDeviceDetector;
  }
}
