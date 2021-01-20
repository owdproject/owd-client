import ModuleDesktopSystemBar from "../../../../libraries/modules-desktop/extend/modulesDesktopExtend.class";
import NotificationsTime from './components/NotificationsTime.vue'

ModuleDesktopSystemBar.registerModule({
  name: 'notifications',
  area: 'system-bar',
  position: 'center',
  opened: false
}, {
  menu: NotificationsTime
});