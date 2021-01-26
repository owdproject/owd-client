import ModuleDesktopSystemBar from "../../../../libraries/modules-desktop/extend/modulesDesktopExtend.class";
import NotificationTime from './components/NotificationTime.vue'
import NotificationContent from './components/NotificationContent.vue'

ModuleDesktopSystemBar.registerModule({
  name: 'NotificationMenu',
  area: 'SystemBar',
  position: 'center',
  opened: false
}, {
  menu: NotificationTime,
  content: NotificationContent
});