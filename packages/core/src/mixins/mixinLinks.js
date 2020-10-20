export default {
  computed: {
    appAuthor() {
      return process.env.VUE_APP_USER
    },
    appName() {
      return process.env.VUE_APP_NAME
    }
  },
  methods: {
    socialUrl(social) {
      const username = process.env[`VUE_APP_SOCIAL_${social.toUpperCase()}_USER`]
      let url

      switch(social) {
      case 'patreon':
        url = `https://patreon.com/${username}`
        break
      case 'twitter':
        url = `https://twitter.com/${username}`
        break
      case 'twitch':
        url = `https://twitch.tv/${username}`
        break
      }

      return url
    }
  }
}
