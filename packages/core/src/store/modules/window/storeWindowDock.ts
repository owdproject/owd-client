import {Module, Mutation, RegisterOptions, VuexModule} from "vuex-class-modules";
import {OwdModuleAppWindowInstance} from "@owd-client/types";

@Module
export default class StoreWindowDock extends VuexModule {
  constructor(
    options: RegisterOptions
  ) {
    super(options);
  }

  @Mutation
  ADD(windowInstance: OwdModuleAppWindowInstance) {}

  @Mutation
  REMOVE(windowInstance: OwdModuleAppWindowInstance) {}
}