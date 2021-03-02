<template>
  <div id="logo">
    <h2>
      <vue-typer
        :text="title"
        shuffle
        :repeat="0"
        :type-delay="50"
        erase-style="select-back"
      />
    </h2>
  </div>
</template>

<script>
import {VueTyper} from 'vue-typer'

export default {
  name: 'Logo',
  components: {
    VueTyper
  },
  props: {
    title: {
      type: String,
      default: 'owd-client'
    }
  }
}
</script>

<style lang="scss">
  #logo {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px;
    cursor: default;
    user-select: none;
    transition: transform 1s;

    @media (max-width: 768px) {
      padding: 17px 24px;
      display: none;
    }

    @media (max-width: 560px) {
      padding: 26px 24px;
      display: block;
    }

    @media (min-width: 561px) and (max-width: 768px) and (max-height: 414px) {
      display: none;
    }

    @media (max-width: 430px) {
      display: none;
    }

    h2 {
      position: relative;
      display: block;
      color: #DCDCDC;
      height: 24px;
      line-height: 24px;
      margin: 0 0 0 -1px;
      font-size: 28px;

      sup {
        color: #3C3C3C;
        font-size: 12px;
        font-weight: bold;
        position: absolute;
        height: 11px;
        line-height: 11px;
        top: -5px;
        margin-left: 5px;
      }

      .typed {
        color: white;
      }
    }
  }
</style>
