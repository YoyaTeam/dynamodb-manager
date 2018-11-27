<template>
  <el-row class="max-height">
    <el-col :span="navWidth" class="max-height">
      <nav-menu :collapse="isCollapsed"></nav-menu>
      <div class="nav-layout-sider-trigger" :class="isCollapsed ? 'nav-layout-sider-trigger-collapseed': ''">
        <i class="el-icon-arrow-left" style="width:100%" @click="isCollapsed = !isCollapsed"></i>
      </div>
    </el-col>
    <el-col :span="24 - navWidth" class="max-height">
      <router-view></router-view>
    </el-col>
    <div class="github">
      <a href="https://github.com/YoyaTeam/dynamodb-manager" target="_blank"><img width="30" height="30" src="@/assets/img/github.svg"></a>
    </div>
  </el-row>
</template>

<script>
import NavMenu from './navigation'
import { initGlobalSetting } from '@/utils/init'
export default {
  components: {
    NavMenu
  },
  data() {
    return {
      isCollapsed: true,
      navWidth: 1
    }
  },
  watch: {
    isCollapsed(val) {
      val ? (this.navWidth = 1) : (this.navWidth = 3)
    }
  },
  computed: {
    menuitemClasses: function() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    }
  },
  mounted() {
    initGlobalSetting()
  }
}
</script>

<style>
.max-height {
  height: 100%;
}
.nav-layout-sider-trigger {
  width: 12.4%;
  position: fixed;
  bottom: 0;
  text-align: center;
  cursor: pointer;
  height: 48px;
  line-height: 48px;
  color: #fff;
  background: #515a6e;
  z-index: 1000;
  -webkit-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
}
.nav-layout-sider-trigger-collapseed {
  width: 60px;
  transition: none;
}
.nav-layout-sider-trigger-collapseed .el-icon-arrow-left {
  transform: rotateZ(180deg);
}
.github {
  cursor: pointer;
  position: fixed;
  right: 20px;
  bottom: 10px;
}
</style>
