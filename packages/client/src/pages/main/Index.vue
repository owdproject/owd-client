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
import Logo from '~/core/components/logo/Logo'
import Menu from '~/core/components/menu/Menu'
import Notifications from '~/core/components/notification/NotificationList'
import WindowsList from '~/core/components/module/ModulesContainer'
import NoticePressToExitFullScreen from '~/core/components/notice/NoticePressToExitFullScreen'

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