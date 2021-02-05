<template>
  <Window :title="data.config.title" :window="data">
    <div class="owd-window__content__debug">
      <div class="options">

        <div>
          <label>
            <input type="checkbox" v-model="data.config.maximizable" />
            Maximizable
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="data.config.resizable" />
            Resizable
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="data.config.borderless" />
            Borderless
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="data.config.noContentSpacing" />
            No content spacing
          </label>
        </div>

      </div>

      <div class="values">

        <div class="position">
          <b>Position</b>
          <ul>
            <li>x: {{data.storage.position.x}}</li>
            <li>y: {{data.storage.position.y}}</li>
            <li>z: {{data.storage.position.z}}</li>
          </ul>
        </div>

        <div class="size">
          <b>Size</b>
          <ul>
            <li>width: {{data.storage.size.width}}</li>
            <li>height: {{data.storage.size.height}}</li>
          </ul>
        </div>

      </div>
    </div>
  </Window>
</template>

<script>
import Window from "@owd-client/core/src/components/window/Window";

export default {
  name: "WindowDebug",
  components: {Window},
  props: {
    data: Object
  }
}
</script>

<style scoped lang="scss">
.owd-window__content__debug {
  display: grid;
  grid-template-columns: 60% 40%;

  .options {
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