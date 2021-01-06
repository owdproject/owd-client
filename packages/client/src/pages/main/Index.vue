<template>
  <Desktop>
    <Logo :title="$store.state['core/client'].title" />
    <Menu />

    <WindowsContainer />

    <Notifications />
    <NoticePressToExitFullScreen />
  </Desktop>
</template>

<script>
import Desktop from '@owd-client/core/src/components/desktop/Desktop'
import Logo from '@owd-client/core/src/components/logo/Logo'
import Menu from '@owd-client/core/src/components/menu/Menu'
import Notifications from '@owd-client/core/src/components/notification/NotificationList'
import WindowsContainer from '@owd-client/core/src/components/window/container/WindowsContainer'
import NoticePressToExitFullScreen from '@owd-client/core/src/components/notice/NoticePressToExitFullScreen'

export default {
  name: 'Index',
  components: {
    Desktop,
    Logo,
    Menu,
    WindowsContainer,
    Notifications,
    NoticePressToExitFullScreen
  }
}
</script>