export default {
  computed: {
    isServerAvailable() {
      return process.env.VUE_APP_SERVER === 'true'
    }
  }
}
