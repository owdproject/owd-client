import {Module, Mutation, VuexModule} from "vuex-class-modules";
import {OwdDock, OwdModuleApp, OwdModuleAppWindowConfig, OwdModuleAppWindowInstance} from "@owd-client/types";

@Module
export default class StoreDock extends VuexModule {
  private dock: OwdDock = {
    apps: {},
    list: []
  }

  /**
   * Return dock apps (config, module, list of windows)
   */
  get apps() {
    return this.dock.apps
  }

  /**
   * Return dock list of windows
   */
  get list() {
    return this.dock.list
  }

  @Mutation
  ADD_CATEGORY(data: { config: OwdModuleAppWindowConfig, module: OwdModuleApp }) {
    this.dock.apps[data.config.name] = {
      config: data.config,
      module: data.module,
      list: []
    }
  }

  @Mutation
  ADD(windowInstance: OwdModuleAppWindowInstance) {
    const dockWindow = this.dock.apps[windowInstance.config.name]

    if (windowInstance) {
      if (Array.isArray(dockWindow.list)) {

        // add to dock.apps[WindowAbout].list
        dockWindow.list.push(windowInstance)

        // add to dock.list
        this.dock.list.push(windowInstance)
      }
    }
  }

  @Mutation
  REMOVE(windowInstance: OwdModuleAppWindowInstance) {
    const dockWindow = this.dock.apps[windowInstance.config.name]

    // delete from dock.apps[WindowAbout].list
    dockWindow.list.splice(dockWindow.list.indexOf(windowInstance), 1)

    // delete from dock.list
    this.dock.list.splice(this.dock.list.indexOf(windowInstance), 1)
  }
}