import {Module} from '@owd-client/core';

export default class SampleModule extends Module {
  constructor(context) {
    super(context)
  }

  loadStore() {}

  loadStoreInstance() {}

  loadCommands() {}

  loadSseEvent() {}
}