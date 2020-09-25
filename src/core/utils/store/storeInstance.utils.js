import store from '../../store'

export function storeInstanceCreate(storePath, storeDefaults) {
  const localModule = {
    namespaced: true,
    ...storeDefaults
  };

  // we initialize the new dynamic module in the global store:
  store.registerModule(storePath, localModule);

  // get access to the module context
  // const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers(path);
}

export function storeInstanceDestroy(storePath) {
// If you want to remove the dynamic module
  store.unregisterModule(storePath);
}