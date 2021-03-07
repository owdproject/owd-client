import ModuleDesktopSystemBar from "@owd-client/core/src/libraries/moduleDesktop/extend/moduleDesktopExtend.class";
import NotificationTime from './components/NotificationTime.vue'
import NotificationContent from './components/NotificationContent.vue'

ModuleDesktopSystemBar.registerDesktopModule({
  name: 'NotificationMenu',
  area: 'SystemBar',
  position: 'center',
  opened: false
}, {
  menu: NotificationTime,
  content: NotificationContent
});