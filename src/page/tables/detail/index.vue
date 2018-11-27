<template>
  <div id="table-info">
    <div class="container">
      <el-tabs v-model="activeName" :tab-position="tabPosition" @tab-click="tabClick">
        <el-tab-pane name="info">
          <span slot="label">
            <i class="fa fa-info-circle"></i> {{$t('table.tab_nav.table_info')}}</span>
          <table-info ref="info"></table-info>
        </el-tab-pane>
        <el-tab-pane name="search">
          <span slot="label">
            <i class="fa fa-search"></i> {{$t('table.tab_nav.item_search')}}</span>
          <data-search ref="search"></data-search>
        </el-tab-pane>
        <el-tab-pane name="index">
          <span slot="label">
            <i class="fa fa-tags"></i> {{$t('table.tab_nav.table_index')}}</span>
          <table-index ref="index"></table-index>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import table from '@/mixins/table'
import TableInfo from './info'
import DataSearch from './search'
import TableIndex from './indexs'
import { GLOBAL_SETTINGS_FAVORITE_TABLE_TAB } from '@/constants'
export default {
  components: {
    TableInfo,
    DataSearch,
    TableIndex
  },
  mixins: [table],
  data() {
    return {
      tabPosition: 'right',
      activeName: localStorage.getItem(GLOBAL_SETTINGS_FAVORITE_TABLE_TAB)
    }
  },
  // computed: {
  //   tableName() {
  //     return this.$route.params.tableName
  //   }
  // },
  mounted: function() {
    this.activeName = this.$route.query.tabActive || this.activeName
    if (this.activeName === localStorage.getItem(GLOBAL_SETTINGS_FAVORITE_TABLE_TAB)) {
      this.$nextTick(() => {
        this.initTableName(this.tableName)
      })
    }
  },
  methods: {
    autoInit() {
      console.log(this.activeName)
      this.$refs[this.activeName].autoInit()
    },
    initConfigFinished() {
      this.initTableName(this.tableName)
    },
    tableRefreshFinished() {
      this.$refs[this.activeName].tableRefreshFinished()
    },
    tabClick(val) {
      this.$router.push({
        query: {
          tabActive: this.activeName
        }
      })
    }
  }
}
</script>

<style lang="sass">
#table-info
  background-color: #f6f5f7
  text-align: left
#table-info .container
  padding: 0 20px
  height: 100vh
  overflow-y: scroll
#table-info .container .el-tabs
  padding: 40px 0
#table-info .el-table__body-wrapper
  background-color: #f6f5f7
#table-info .el-table th,
#table-info .el-table tr
  background-color: #f6f5f7
#table-info .el-tabs__header
  position: fixed !important
  right: 20px !important
  top: 40px !important
  height: auto !important
  z-index: 1000
#table-info .el-tabs__content
  padding-right: 150px
</style>
