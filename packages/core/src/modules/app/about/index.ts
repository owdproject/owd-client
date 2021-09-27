import {ModuleApp} from '@owd-client/core/index';

// window components
import WindowAbout from "./windows/WindowAbout.vue";

export default class AboutModuleApp extends ModuleApp {
  setup() {
    return {
      name: "about",
      singleton: true,
      windows: [
        {
          component: WindowAbout,
          name: "WindowAbout",
          category: "system-tools",
          title: "About",
          titleApp: "About",
          titleShort: "Open Web Desktop",
          icon: "mdi-hexagon-multiple-outline",
          favorite: true,
          resizable: false,
          size: {
            width: 448,
            height: 240
          },
          position: {
            x: -1,
            y: 0,
            z: 0
          },
          theme: {
            rounded: true
          }
        }
      ]
    }
  }
}