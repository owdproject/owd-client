import {ModuleApp} from '@owd-client/core';
import {OwdModuleApp} from "../../../../types";

export default class SampleModule extends ModuleApp {
  constructor(context: OwdModuleApp) {
    super(context)
    Object.setPrototypeOf(this, new.target.prototype);
  }

  loadStore() {}

  loadStoreInstance() {}

  loadCommands() {}

  loadSseEvent() {}
}