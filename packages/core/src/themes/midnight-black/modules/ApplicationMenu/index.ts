import ApplicationMenu from './components/ApplicationMenu.vue'
import ApplicationMenuContent from './components/ApplicationMenuContent.vue'

export default {
  config: {
    name: 'ApplicationMenu',
    area: 'SystemBar',
    position: 'left',
    opened: false
  },
  components: {
    menu: ApplicationMenu,
    content: ApplicationMenuContent
  }
}