<template>
  <div id="table-list">
    <div class="table-action">
      <el-button style="width: 45%;padding: 7px 4px;" size="mini" type="primary" @click="openCreateTableDialog">{{$t('table.table_list.button_create_table')}}</el-button>
      <el-button style="width: 45%;padding: 7px 4px;" size="mini" type="warning" :disabled="!currentRow" @click="deleteTable">{{$t('table.table_list.button_delete_table')}}</el-button>
    </div>
    <div class="table-search">
      <el-input v-model="search" size="mini" :placeholder="$t('table.table_list.input_search_placeholder')" />
    </div>
    <el-table id="table-name-list" v-loading="loading" height="90%" ref="singleTable" :data="tableNames.filter(data => !search || data.tableName.toLowerCase().includes(search.toLowerCase()))" highlight-current-row @current-change="handleCurrentChange" style="width:100%;overflow-y:auto;margin-top:6%">
      <el-table-column type="index" width="40">
      </el-table-column>
      <el-table-column property="tableName" :label="$t('table.table_list.table_header_table_name')" sortable>
      </el-table-column>
    </el-table>
    <add-table :isShow="showAddTable" @createdTable="createdTable" @addTableClose="addTableClose"></add-table>
  </div>
</template>

<script>
import table from '@/mixins/table'
import AddTable from '@/components/dialog/_add_table'
import { mapGetters } from 'vuex'
import { GLOBAL_SETTINGS_FAVORITE_TABLE_TAB } from '@/constants'
export default {
  components: {
    AddTable
  },
  data() {
    return {
      search: '',
      tableNames: [],
      currentRow: null,
      loading: false,
      showAddTable: false
    }
  },
  mixins: [table],
  computed: {
    ...mapGetters({
      tableName: 'tableName',
      config: 'config'
    }),
    routeTableName() {
      return this.$route.params.tableName || this.tableName
    }
  },
  mounted: function() {
    if (this.$route.path === '/table') {
      this.$router.push({
        path: `/table/${this.tableName}`
      })
    }
  },
  methods: {
    initConfigFinished() {
      this.listTables()
    },
    async listTables() {
      if (this.$utils.isEmpty(this.config)) {
        this.tableNames = []
        return
      }
      this.loading = true
      this.tableNames = []
      this.listTableByLastEvaluatedTableName()
    },
    openCreateTableDialog() {
      this.showAddTable = true
    },
    deleteTable() {
      let tableName = this.currentRow.tableName
      this.$prompt(
        this.$t('confirm.delete_table').replace('{table_name}', tableName),
        this.$t('confirm.title'),
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('confirm.button_yes'),
          cancelButtonText: this.$t('confirm.button_cancel')
        }
      )
        .then(({ value }) => {
          if (value !== tableName) {
            this.$message.warning(this.$t('message.cancel.delete_table'))
            return
          }
          this.$dynamodb.deleteTable(tableName, res => {
            this.$message.success(this.$t('message.success.delete_table').replace('{table_name}', tableName))
            this.listTables()
          })
        })
        .catch(() => {
          this.$message.info(this.$t('message.cancel.delete'))
        })
    },
    addTableClose() {
      this.showAddTable = false
    },
    listTableByLastEvaluatedTableName(lastEvaluatedTableName) {
      var params = {
        ExclusiveStartTableName: lastEvaluatedTableName
      }
      this.$dynamodb.listTables(params, res => {
        if (res.data) {
          for (let tableName of res.data.TableNames) {
            this.tableNames.push({
              tableName: tableName
            })
          }
          if (
            this.routeTableName &&
            this.tableNames.indexOf({ tableName: this.routeTableName })
          ) {
            this.handleCurrentChange({ tableName: this.routeTableName })
          }
          if (res.data.LastEvaluatedTableName) {
            this.listTableByLastEvaluatedTableName(
              res.data.LastEvaluatedTableName
            )
          } else {
            this.loading = false
          }
        }
      })
    },
    handleCurrentChange(val) {
      if (!val) {
        return
      }
      this.currentRow = val
      console.log(val)
      this.UPDATE_TABLE_NAME(val.tableName)
      this.$router.push({
        path: `/table/${val.tableName}`,
        query: {
          tabActive: this.$route.query.tabActive || localStorage.getItem(GLOBAL_SETTINGS_FAVORITE_TABLE_TAB)
        }
      })
    },
    createdTable(params) {
      this.$dynamodb.createTable(params, res => {
        this.$message.success(this.$t('message.success.delete_table').replace('{table_name}', params.TableName))
        this.showAddTable = false
        this.listTables()
      })
    }
  }
}
</script>

<style lang="sass">
#table-list
  background-color: #fefeff
  height: 100%
  padding: 0 5px
  .table-action
    text-align: left
    padding: 10px 5px 5px
    height: 2%
  .table-search
    padding: 10px 5px 5px
    height: 2%
    margin-top: 5px
.el-table__body tr
  cursor: pointer
</style>
