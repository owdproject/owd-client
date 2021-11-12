import {Module, Mutation, Action, VuexModule} from "vuex-class-modules";
import {loadStorage, saveStorage} from "../../helpers/helperStorage";
import {generateUniqueID} from "../../helpers/helperStrings";

@Module
export default class StoreBackground extends VuexModule {
  private current: string = ''
  private list: { [key: string]: string[] } = {}
  private overview: boolean = false

  get workspaceActive() {
    return this.current
  }

  get workspaceOverview() {
    return this.overview
  }

  get workspaces() {
    return this.list
  }

  get workspacesIds() {
    return Object.keys(this.list)
  }

  get workspaceCount() {
    return Object.keys(this.list).length
  }

  @Mutation
  SET_CURRENT_WORKSPACE(id: string) {
    if (this.workspacesIds && !this.workspacesIds.includes(id)) {
      throw Error(`[owd] this workspace doesn't exists.`)
    }

    this.current = id
  }

  @Mutation
  SET_OVERVIEW(toggle: boolean) {
    this.overview = toggle
  }

  @Mutation
  SET_WORKSPACES(workspaces: any) {
    this.list = workspaces
  }

  /**
   * Load workspace status from local storage
   */
  @Action
  initialize() {
    const workspaceStorage = loadStorage('workspace')

    if (workspaceStorage) {
      // update current workspace
      this.SET_CURRENT_WORKSPACE(workspaceStorage.current)

      // restore previous workspaces status
      this.SET_WORKSPACES(workspaceStorage.list)
    } else {
      this.SET_WORKSPACES({
        [generateUniqueID()]: []
      })
      this.save()
    }
  }

  /**
   * Add workspace
   */
  @Action
  async addWorkspace() {
    const workspaceId = generateUniqueID()

    this.SET_WORKSPACES({
      ...this.list,
      [workspaceId]: []
    })

    if (this.workspaceCount === 1) {
      this.SET_CURRENT_WORKSPACE(workspaceId)
    }

    // update workspace storage
    await this.save()
  }

  /**
   * Remove latest workspace
   */
  @Action
  async removeWorkspace() {
    if (this.workspaceCount < 2) {
      throw Error('[owd] cannot remove the first workspace.')
    }

    const workspaces = this.list
    delete workspaces[Object.keys(workspaces)[Object.keys(workspaces).length - 1]]
    this.SET_WORKSPACES(workspaces)

    // update workspace storage
    await this.save()
  }

  /**
   * Add window uniqueID to workspace uniqueID
   *
   * @param data
   */
  @Action
  async addWindowToWorkspace(data: { windowId: string, workspaceId: string }) {
    if (!Object.prototype.hasOwnProperty.call(this.list, data.workspaceId)) {
      this.list[data.workspaceId] = []
    }

    this.list[data.workspaceId].push(data.windowId)

    // update workspace storage
    await this.save()
  }

  /**
   * Remove window uniqueID from workspace uniqueID
   *
   * @param data
   */
  @Action
  async removeWindowFromWorkspace(data: { windowId: string, workspaceId: string }) {
    if (data.workspaceId && this.list[data.workspaceId]) {
      const index = this.list[data.workspaceId].indexOf(data.windowId)

      if (index > -1) {
        this.list[data.workspaceId].splice(index, 1)
      }

      // update workspace storage
      await this.save()
    }
  }

  @Action
  async cleanupEmptyWorkspaces() {
    let firstEmptyWorkspaceExcluded = false

    for (const workspaceId of this.workspacesIds) {
      console.log('XXX', this.workspacesIds.indexOf(this.workspaceActive), 'YYY', this.workspaceCount)

      if (this.workspacesIds.indexOf(workspaceId) <= this.workspacesIds.indexOf(this.workspaceActive)) {
        continue
      }

      if (this.list[workspaceId].length > 0) {
        continue
      }

      if (!firstEmptyWorkspaceExcluded) {
        firstEmptyWorkspaceExcluded = true
      } else {
        delete this.list[workspaceId]
      }
    }
  }

  /**
   * Set current workspace
   *
   * @param id
   */
  @Action
  async setCurrentWorkspace(id: string) {
    this.SET_CURRENT_WORKSPACE(id)

    // cleanup unused workspaces
    this.cleanupEmptyWorkspaces()

    // update background storage
    await this.save()
  }

  /**
   * Update workspace storage
   */
  @Action
  save() {
    saveStorage('workspace', {
      current: this.current,
      list: this.list
    })
  }
}