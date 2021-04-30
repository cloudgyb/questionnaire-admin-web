<template>
  <el-menu
    :default-active="currMenuPath"
    :router="true"
    :collapse="iscollapse"
    :default-openeds="openedMenus"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item v-for="item in noSubMenu" :index="item.path" :key="item.id" @click="selectMenu(item)">
      <i :class="item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu v-for="item in hasSubMenu" :index="item.path" :key="item.id" :show-timeout="300">
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </template>
      <el-menu-item v-for="subItem in item.subMenu" :index="subItem.path" :key="subItem.id" @click="selectMenu(subItem)">
        {{ subItem.label }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'CommonAside',
  data() {
    return {
      menuData: []
    }
  },
  props: {},
  methods: {
    selectMenu(item) {
      this.$store.commit('selectMenu', item)
    },
    getMenuData() {
      let cachedMenuStr = sessionStorage.getItem('menu')
      if (cachedMenuStr !== null) {
        this.menuData = JSON.parse(cachedMenuStr)
        return
      }
      let _self = this
      this.$http.get('/sys/menu/nav').then(resp => {
        if (resp.data && resp.data.code !== 0) {
          return
        }
        let menuList = resp.data.menuList
        console.log(menuList)
        menuList.forEach(d => {
          let m = {
            id: d.menuId,
            path: d.url,
            label: d.name,
            icon: d.icon,
            open: d.open
          }
          if (d.list && d.list.length > 0) {
            m['subMenu'] = []
            d.list.forEach(sub => {
              m.subMenu.push({
                id: sub.menuId,
                path: sub.url,
                label: sub.name,
                icon: sub.icon,
                open: sub.open
              })
            })
          }
          _self.menuData.push(m)
        })
        //将菜单数据缓存起来
        sessionStorage.setItem('menu', JSON.stringify(_self.menuData))
      })
    }
  },
  created() {
    this.getMenuData()
  },
  computed: {
    ...mapState({
      iscollapse: state => state.menuCollapseState.isCollapse
    }),
    hasSubMenu() {
      return this.menuData.filter(item => {
        return item.subMenu !== undefined
      })
    },
    noSubMenu() {
      return this.menuData.filter(item => {
        return item.subMenu === undefined
      })
    },
    currMenuPath() {
      return this.$route.path
    },
    openedMenus() {
      let openedMenus = []
      this.menuData.forEach(e => {
        if (e.open) {
          openedMenus.push(e.path)
        }
      })
      return openedMenus
    }
  }
}
</script>
<style lang="scss" scoped>
.el-menu {
  height: 100%;
  border-right: 0;
  i {
    color: #fff;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
