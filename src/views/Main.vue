<template>
  <el-container style="height:100%">
    <el-aside width="auto">
      <common-aside></common-aside>
    </el-aside>
    <el-container>
      <el-header>
        <common-header></common-header>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import CommonHeader from '../components/CommonHeader.vue'
import CommonAside from '../components/CommonAside.vue'
export default {
  name: 'Main',
  components: {
    CommonHeader,
    CommonAside
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      asideWidth: state => state.menuCollapseState.asideWidth
    })
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  background-color: #000;
}
.el-main {
  padding: 10px;
}
.tab {
  margin-bottom: 10px;
}
</style>
