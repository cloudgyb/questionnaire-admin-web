<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { setWindowTitle } from '@/utils'
export default {
  name: 'App',
  created() {
    setWindowTitle('问卷Online后台管理系统')
  }
}
</script>
<style lang="scss" scoped>
#app {
  color: $theme-color;
  height: 100vh;
}
</style>
