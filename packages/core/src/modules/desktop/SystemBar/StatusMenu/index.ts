import ModuleDesktopSystemBar from "@owd-client/core/src/libraries/moduleDesktop/extend/moduleDesktopExtend.class";
import StatusMenu from './components/StatusMenu.vue'
import StatusMenuContent from './components/StatusMenuContent.vue'

ModuleDesktopSystemBar.registerDesktopModule({
  name: 'StatusMenu',
  area: 'SystemBar',
  position: 'right',
  opened: false
}, {
  menu: StatusMenu,
  content: StatusMenuContent
});