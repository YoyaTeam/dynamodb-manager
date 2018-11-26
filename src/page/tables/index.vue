<template>
  <el-row class="max-height">
    <el-col :span="4" class="max-height">
      <table-list></table-list>
    </el-col>
    <el-col :span="20" class="max-height" v-if="$utils.isNotEmpty(tableName)">
      <!-- <table-detail></table-detail> -->
      <router-view></router-view>
    </el-col>
    <el-col :span="20" class="max-height" v-else style="background-color: #f6f5f7;">
      <div style="margin-top:20vh">
        <img src="@/assets/img/undraw_news_go0e.svg" width="40%">
        <h5>You have not selected a table yet!</h5>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import TableList from './table_list'
import TableDetail from './detail'
import { mapMutations, mapGetters } from 'vuex'
import { LOCAL_STORAGE_CURRENT_APPLY_CONFIG } from '@/constants'
export default {
  components: {
    TableList,
    TableDetail
  },
  computed: {
    ...mapGetters({
      tableName: 'tableName'
    })
  },
  mounted() {
    const config = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_CURRENT_APPLY_CONFIG)
    )
    if (config) {
      this.UPDATE_CONFIG(config)
    }
  },
  methods: {
    ...mapMutations({
      UPDATE_CONFIG: 'UPDATE_CONFIG'
    })
  }
}
</script>

<style>
.el-table {
  color: #303133 !important;
}
</style>
