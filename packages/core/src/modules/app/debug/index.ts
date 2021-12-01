import {ModuleApp} from '@owd-client/core/index';

// window components
import WindowDebug from "./windows/WindowDebug.vue";

export default class DebugModuleApp extends ModuleApp {
  setup() {
    return {
      "name": "debug",
      "singleton": true,
      "windows": [
        {
          "component": WindowDebug,
          "name": "WindowDebug",
          "category": "system-tools",
          "title": "Debug",
          "icon": {
            "name": "mdi mdi-bug",
            "offset": {
              "x": -1,
              "y": 0
            }
          },
          "resizable": false,
          "size": {
            "width": 448,
            "height": 240
          },
          "position": {
            "x": -1,
            "y": 0,
            "z": 0
          },
          "theme": {}
        }
      ]
    }
  }
}