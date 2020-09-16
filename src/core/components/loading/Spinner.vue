<template>
  <div class="loading">
    <div/>
    <div/>
    <div/>
    <div/>
  </div>
</template>

<script>
  export default {
    name: "Spinner"
  }
</script>

<style scoped lang="scss">
  .loading {
    width: 80px;
    height: 80px;
  }

  .loading div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #AAA;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  .loading div:nth-child(1) {
    left: 8px;
    animation: loading-1 0.6s infinite;
  }

  .loading div:nth-child(2) {
    left: 8px;
    animation: loading-2 0.6s infinite;
  }

  .loading div:nth-child(3) {
    left: 32px;
    animation: loading-2 0.6s infinite;
  }

  .loading div:nth-child(4) {
    left: 56px;
    animation: loading-3 0.6s infinite;
  }

  @keyframes loading-1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes loading-2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }

  @keyframes loading-3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
</style>
