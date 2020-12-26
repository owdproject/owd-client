import {Module} from '@owd-client/core';
import {OwdModule} from "../../../../types";

export default class SampleModule extends Module {
  constructor(context: OwdModule) {
    super(context)
    Object.setPrototypeOf(this, new.target.prototype);
  }

  loadStore() {}

  loadStoreInstance() {}

  loadCommands() {}

  loadSseEvent() {}
}