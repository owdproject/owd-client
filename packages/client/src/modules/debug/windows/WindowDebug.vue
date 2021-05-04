<template>
  <Window :window="window">
    <div class="container">
      <div class="options">

        <div>
          <label>
            <input type="checkbox" v-model="window.config.noContentSpacing" />
            No content spacing
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="window.config.maximizable" />
            Maximizable
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="window.config.fullscreenable" />
            Fullscreenable
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="window.config.resizable" />
            Resizable
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="window.config.borderless" />
            Borderless
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="window.config.dense" value="1" />
            Dense
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" onclick="return false" :checked="window.storage.focused" />
            Focused
          </label>
        </div>

      </div>

      <div class="values">

        <div class="position">
          <b>Position</b>
          <ul>
            <li>x: {{window.storage.position.x}}</li>
            <li>y: {{window.storage.position.y}}</li>
            <li>z: {{window.storage.position.z}}</li>
          </ul>
        </div>

        <div class="size">
          <b>Size</b>
          <ul>
            <li>width: {{window.storage.size.width}}</li>
            <li>height: {{window.storage.size.height}}</li>
          </ul>
        </div>

      </div>
    </div>
  </Window>
</template>

<script setup>
import Window from "@owd-client/core/src/components/window/Window"
import {useStore} from "vuex"

const store = useStore()

const props = defineProps({
  window: Object
})

const window = props.window
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: 60% 40%;

  .options {
    line-height: 20px;

    .position {
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
      padding: 12px;
    }

    .size {
      position: absolute;
      top: 90px;
      right: 0;
      width: 120px;
      padding: 12px;
    }

    input {
      vertical-align: -2px;
      margin-right: 4px;
    }
  }

  .values {
    > div {
      margin-bottom: 16px;

      ul {
        margin: 5px 0 0 0;
        padding: 0;
        list-style-type: none;
        line-height: 18px;
      }
    }
  }
}
</style>