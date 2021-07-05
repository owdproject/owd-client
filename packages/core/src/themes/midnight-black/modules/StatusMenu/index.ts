import StatusMenu from './components/StatusMenu.vue'
import StatusMenuContent from './components/StatusMenuContent.vue'

export default {
  config: {
    name: 'StatusMenu',
    area: 'SystemBar',
    position: 'right',
    opened: false
  },
  components: {
    menu: StatusMenu,
    content: StatusMenuContent
  }
}