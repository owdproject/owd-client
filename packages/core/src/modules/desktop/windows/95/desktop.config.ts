// desktop component
import Desktop from './components/Desktop.vue'

// desktop modules
import ApplicationMenu from "./modules/ApplicationMenu";
import DockMenu from "./modules/DockMenu";
import StatusMenu from "./modules/StatusMenu";

export default {
  component: Desktop,

  modules: [
    ApplicationMenu,
    DockMenu,
    StatusMenu
  ],

  options: {
    Logo: {
      enabled: true
    },
    Window: {
      icons: {
        minimize: 'mdi-color-helper',
        maximize: 'mdi-window-maximize',
        fullscreen: 'mdi-fullscreen',
        close: 'mdi-window-close'
      }
    },
    SystemBar: {
      enabled: true,
      position: 'bottom',
      icons: {
        'battery': 'mdi-battery',
        'battery-0': 'mdi-battery-alert-variant-outline',
        'battery-20': 'mdi-battery-20',
        'battery-40': 'mdi-battery-40',
        'battery-60': 'mdi-battery-60',
        'battery-80': 'mdi-battery-80',
        'battery-100': 'mdi-battery'
      }
    },
    StatusMenu: {
      menu: {
        dateFormat: 'MMM D',
        timeFormat: 'HH:mm'
      },
      calendar: {
        header: {
          dayOfWeekFormat: 'dddd',
          dateFormat: 'MMMM D YYYY'
        }
      }
    }
  }
}