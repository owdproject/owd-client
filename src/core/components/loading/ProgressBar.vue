<template>
  <div class="progressbar v-progress-linear">
    <div class="v-progress-linear--background" />
    <div class="v-progress-linear--bar">
      <div class="v-progress-linear--bar--indeterminate">
        <div class="v-progress-linear--bar--indeterminate long" />
        <div class="v-progress-linear--bar--indeterminate short" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ProgressBar"
  }
</script>

<style scoped lang="scss">
  // styles from Vuetify
  .v-progress-linear {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 7px;
    z-index: 999;
    overflow: hidden;

    .v-progress-linear--background {
      transition: 0.3s ease-in;
      background: rgba(33, 33, 33, .3);
    }

    .v-progress-linear--bar {
      width: 100%;
      height: inherit;
      position: relative;
      transition: 0.2s cubic-bezier(0.4, 0, 0.6, 1);
      z-index: 1;

      .v-progress-linear--bar--indeterminate > div {
        height: inherit;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        will-change: left, right;
        width: auto;
        background: #373737;

        &.long {
          animation: indeterminate;
          animation-duration: 2.2s;
          animation-iteration-count: infinite;
        }

        &.short {
          animation: indeterminate-short;
          animation-duration: 2.2s;
          animation-iteration-count: infinite;
        }
      }
    }
  }

  @keyframes indeterminate {
    0% {
      left: -90%;
      right: 100%;
    }
    60% {
      left: -90%;
      right: 100%;
    }
    100% {
      left: 100%;
      right: -35%;
    }
  }

  @keyframes indeterminate-short {
    0% {
      left: -200%;
      right: 100%;
    }
    60% {
      left: 107%;
      right: -8%;
    }
    100% {
      left: 107%;
      right: -8%;
    }
  }
</style>
