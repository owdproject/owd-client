import ModuleDesktopSystemBar from "@owd-client/core/src/libraries/moduleDesktop/extend/moduleDesktopExtend.class";
import ApplicationMenu from './components/ApplicationMenu.vue'
import ApplicationMenuContent from './components/ApplicationMenuContent.vue'

ModuleDesktopSystemBar.registerDesktopModule({
  name: 'ApplicationMenu',
  area: 'SystemBar',
  position: 'left',
  opened: false
}, {
  menu: ApplicationMenu,
  content: ApplicationMenuContent
});