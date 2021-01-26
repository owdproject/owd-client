<template>
  <Desktop>
    <Logo :title="$store.state['core/client'].title" />
    <Menu />

    <WindowsContainer />

    <NoticePressToExitFullScreen />
  </Desktop>
</template>

<script>
import Desktop from '@owd-client/core/src/components/desktop/Desktop'
import Logo from '@owd-client/core/src/components/logo/Logo'
import Menu from '@owd-client/core/src/components/menu/Menu'
import WindowsContainer from '@owd-client/core/src/components/window/container/WindowsContainer'
import NoticePressToExitFullScreen from '@owd-client/core/src/components/notice/NoticePressToExitFullScreen'

export default {
  name: 'Index',
  components: {
    Desktop,
    Logo,
    Menu,
    WindowsContainer,
    NoticePressToExitFullScreen
  }
}
</script>