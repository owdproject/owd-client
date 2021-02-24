import {OwdDeviceDetector} from "@owd-client/types";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $device: OwdDeviceDetector;
  }
}
