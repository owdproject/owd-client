import store from '../../store'

export function storeInstanceCreate(storePath, storeDefaults) {
  const localModule = {
    namespaced: true,
    ...storeDefaults
  }

  // we initialize the new dynamic module in the global store:
  store.registerModule(storePath, localModule)
}

export function storeInstanceDestroy(storePath) {
// If you want to remove the dynamic module
  store.unregisterModule(storePath)
}