<template>
  <div id="menu">
    <ul class="menu-group">
      <slot name="prepend" />

      <template v-for="groupName of Object.keys(windowInstances)">
        <template v-for="windowInstance of windowInstances[groupName]">
          <MenuItem
            :window="windowInstance"
            :data-menu-id="windowInstance.uniqueID"
            :key="groupName + '-' + windowInstance.uniqueID"
          />
        </template>
      </template>

      <slot name="append" />
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MenuItem from './MenuItem.vue'

export default {
  name: 'Menu',
  components: {
    MenuItem
  },
  computed: {
    ...mapGetters({
      windowInstances: 'core/windows/windowInstances'
    })
  }
}
</script>

<style lang="scss">
$colorDefault: #4987c1;

#menu {
  position: fixed;
  top: 0;
  left: 24px;
  padding: 0;
  margin: 24px 0;
  z-index: 9;
  user-select: none;
  transition: transform 0.25s ease-in-out;

  &:hover {
    z-index: 12;
  }

  &:not(:hover).autohide {
    @media (min-width: 560px) {
      transform: translateX(-80px);
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;

    li {
      color: #EEE;
      height: 48px;
      line-height: 48px;
      margin-bottom: 4px;
      padding: 0;
      font-family: "Oswald", Tahoma, sans-serif;
      font-size: 17px;
      text-align: left;
      cursor: pointer;

      .menu-square {
        width: 48px;
        height: 100%;
        font-size: 24px;
        text-align: center;
        border-radius: 2px;
        background: darken($colorDefault, 7.5%);
        transition: background 0.6s ease-in-out;
        will-change: background;
        //box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.055), inset 0 -1px 0 0 rgba(0, 0, 0, 0.085);
        float: left;

        .v-icon {
          color: white;
          vertical-align: 1px;
        }
      }

      .name {
        background: #212121;
        transition: width 0.3s ease-in-out;
        overflow: hidden;
        float: left;
        width: 0;
        height: 100%;
        line-height: 47px;
        border-radius: 2px;
        word-spacing: -1px;
        font-size: 18px;
        margin-left: 4px;

        .name-inner {
          padding: 0 12px;
        }
      }

      &[data-window="project_southernwars"] {
        span {
          font-size: 28px;
        }
      }

      &[data-window="paint"] {
        span {
          vertical-align: -2px;
          font-size: 27px;
        }
      }

      &:after {
        display: block;
        content: '';
        clear: both;
      }

      @media (min-width: 559px) {
        &:hover {
          .name {
            width: 148px;
          }
        }
      }

      &.active .square {
        background: $colorDefault;
      }
    }
  }

  @media (max-width: 560px) {
    top: auto;
    left: 15px;
    right: 15px;
    bottom: 15px;
    margin: 0;
    padding: 0;

    ul {
      float: right;

      li {
        height: 48px;
        line-height: 48px;
        float: left;
        margin: 4px 0 0 0;

        .menu-square {
          position: relative !important;
          width: 48px;
          z-index: 3;
          float: none;
          margin: 0 0 0 4px;
          box-shadow: -4px 0 0 0 #171717;
        }

        .name {
          position: fixed;
          left: 15px;
          right: 15px;
          bottom: 15px;
          margin: 0;
          box-shadow: 1px 0 0 0 #141416, -20px 0 15px 0 #141416;
          transition: none;
          color: #EEE;
          width: auto;
          height: 48px;
          line-height: 48px;
          display: none;
        }

        &:hover {
          .name {
            display: block;
          }
        }
      }
    }
  }
}
</style>
