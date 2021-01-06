import ModuleDesktopSystemBar from "../../../../lib/modules/extend/modulesDesktop.class";
import NotificationsTime from './components/NotificationsTime.vue'

ModuleDesktopSystemBar.registerModule({
  name: 'notifications',
  area: 'system-bar',
  position: 'center',
  opened: false
}, {
  menu: NotificationsTime
});