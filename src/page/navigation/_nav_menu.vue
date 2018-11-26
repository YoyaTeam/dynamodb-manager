<template>
  <div id="navMenu">
    <el-menu id="el-menu" router :default-active="active" class="el-menu-vertical max-height" @open="handleOpen" @close="handleClose" :collapse="collapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="fa fa-cog fa-fw"></i>
          <span slot="title">{{$t('nav.setting')}}</span>
        </template>
        <el-menu-item-group>
          <span slot="title">{{$t('nav.setting_global_setting')}}</span>
          <el-menu-item index="/setting">{{$t('nav.setting_global_setting_children')}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="fa fa-table fa-fw"></i>
          <span slot="title">{{$t('nav.table')}}</span>
        </template>
        <el-menu-item-group>
          <span slot="title">{{$t('nav.table_connection')}}</span>
          <el-menu-item index="/config">{{$t('nav.table_connection_config')}}</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <span slot="title">{{$t('nav.table_table')}}</span>
          <el-menu-item index="/table" :disabled="$utils.isEmpty($dynamodb.config)">{{$t('nav.table_table')}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: '/config'
    }
  },
  computed: {
    routeActive() {
      let path = this.$route.path.substring(1)
      let end = path.indexOf('/')
      return path.substring(0, end === -1 ? path.length : end)
    }
  },
  mounted: function() {
    this.active = '/' + this.routeActive
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style>
#navMenu {
  height: 100%;
  text-align: left;
}
.el-submenu .el-menu-item {
  min-width: 100px;
}
#navMenu ul {
  transition: all 0.5s ease-in-out !important;
}
.el-submenu__title {
  transition: all 0s ease-in-out !important;
}
</style>
