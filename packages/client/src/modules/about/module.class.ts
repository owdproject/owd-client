import {ModuleApp} from '@owd-client/core';
import {OwdModuleApp} from "@owd-client/types";

export default class AboutModule extends ModuleApp {
  constructor(context: OwdModuleApp) {
    super(context)
  }

  loadStore() {}

  loadStoreInstance() {}

  loadCommands() {}

  loadSseEvent() {}
}