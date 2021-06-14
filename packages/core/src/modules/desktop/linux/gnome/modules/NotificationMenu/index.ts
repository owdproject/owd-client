import NotificationTime from './components/NotificationTime.vue'
import NotificationContent from './components/NotificationContent.vue'

export default {
  config: {
    name: 'NotificationMenu',
    area: 'SystemBar',
    position: 'center',
    opened: false
  },
  components: {
    menu: NotificationTime,
    content: NotificationContent
  }
}