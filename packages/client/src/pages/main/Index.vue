<template>
  <Desktop :system-bar="systemBar">

    <Logo :title="$store.state.core.client.title" />
    <Menu />

    <WindowsList />

    <Notifications />
    <NoticePressToExitFullScreen />

  </Desktop>
</template>

<script>
import Desktop from '@owd-client/core/src/components/desktop/Desktop'
import Logo from '@owd-client/core/src/components/logo/Logo'
import Menu from '@owd-client/core/src/components/menu/Menu'
import Notifications from '@owd-client/core/src/components/notification/NotificationList'
import WindowsList from '@owd-client/core/src/components/module/ModulesContainer'
import NoticePressToExitFullScreen from '@owd-client/core/src/components/notice/NoticePressToExitFullScreen'

export default {
  name: 'Index',
  components: {
    Desktop,
    Logo,
    Menu,
    WindowsList,
    Notifications,
    NoticePressToExitFullScreen
  },
  data() {
    return {
      systemBar: {
        enabled: false,
        dark: true
      }
    }
  }
}
</script>