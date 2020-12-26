import {OwdClientConfiguration} from "../../types";

declare module '@vue/runtime-core' {
  interface AppConfig {
    owd: OwdClientConfiguration;
  }
}
