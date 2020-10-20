<template>
  <transition name="fade">
    <div
      :data-name="name"
      :class="['notice', `notice-service-${service}`]"
      v-show="visible"
    >
      <div class="notice-icon">
        <v-icon v-text="`mdi-${service}`" />
      </div>
      <div class="notice-text">
        <div
          class="title"
          v-text="text"
        />
        <div
          class="details"
          v-text="details"
        />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'NotificationDetails',
  props: {
    name: String,
    service: String,
    text: String,
    details: String
  },
  data() {
    return {
      visible: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.visible = true
    })
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: all .15s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-18px);
}

div.notice {
  width: 260px;
  max-width: 100%;
  height: 52px;
  line-height: 50px;
  padding: 0;
  font-size: 15px;
  border-radius: 3px;
  background: #191919;
  box-shadow: 0 0 0 1px rgba(21, 21, 21, 0.5);
  border: 1px solid #292929;
  cursor: default;

  &.notice-service-patreon {
    .notice-icon > .v-icon {
      color: rgb(232, 91, 70);
    }
  }

  &.notice-service-twitch {
    .notice-icon > .v-icon {
      color: #9147ff;
    }
  }

  .notice-icon {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 52px;
    height: 52px;
    text-align: center;
    font-size: 21px;

    i {
      vertical-align: -1px;
    }

    /*
    .notice-icon-action {
        position: absolute;
        bottom: 14px;
        right: 9px;
        width: 14px;
        height: 14px;
        line-height: 14px;
        color: #CCC;

        > .material-design-icon {
            font-size: 14px;
        }
    }
     */
  }

  .notice-text {
    display: inline-block;
    vertical-align: top;
    width: calc(100% - 70px);
    color: #777;

    .title {
      color: white;
      line-height: 18px;
      margin-top: 9px;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 100%;
      overflow: hidden;
    }

    .details {
      color: #717171;
      line-height: 20px;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 1px;
      margin-top: -1px;
    }
  }
}
</style>
