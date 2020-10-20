<template>
  <div>

    <Logo />
    <Menu />

    <WindowsList />

    <Notifications />
    <NoticePressToExitFullScreen />

  </div>
</template>

<script>
import Logo from '@owd-client/core/src/components/logo/Logo'
import Menu from '@owd-client/core/src/components/menu/Menu'
import Notifications from '@owd-client/core/src/components/notification/NotificationList'
import WindowsList from '@owd-client/core/src/components/module/ModulesContainer'
import NoticePressToExitFullScreen from '@owd-client/core/src/components/notice/NoticePressToExitFullScreen'

export default {
  name: 'Index',
  components: {
    NoticePressToExitFullScreen,
    Logo,
    Menu,
    WindowsList,
    Notifications
  }
}
</script>