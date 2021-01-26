import ModuleDesktopSystemBar from "../../../../libraries/modules-desktop/extend/modulesDesktopExtend.class";
import ApplicationMenu from './components/ApplicationMenu.vue'
import ApplicationMenuContent from './components/ApplicationMenuContent.vue'

ModuleDesktopSystemBar.registerModule({
  name: 'ApplicationMenu',
  area: 'SystemBar',
  position: 'left',
  opened: false
}, {
  menu: ApplicationMenu,
  content: ApplicationMenuContent
});