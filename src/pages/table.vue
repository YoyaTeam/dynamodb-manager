<template>
  <div class="main">
    <el-row>
      <el-col :span="5">
        <el-input v-model="search_table_input"
          prefix-icon="el-icon-search"
          placeholder="search table"></el-input>
      </el-col>
      <el-col :span="5"
        style="float: right;">
        <el-button type="danger"
          icon="el-icon-delete"
          style="float: right;margin:0 10px;"
          circle
          @click="deleteTable(selectTable)"></el-button>
        <el-button type="success"
          icon="el-icon-refresh"
          style="float: right;margin:0 10px;"
          circle
          @click="listTables"></el-button>
      </el-col>
    </el-row>
    <el-row style="margin:10px 0;">
      <el-col :span="24">
        <el-table :data="tables"
          style="width: 100%"
          highlight-current-row
          @current-change="handleCurrentChange">
          <el-table-column type="index"
            width="40">
          </el-table-column>
          <el-table-column prop="tableName"
            label="Table Name">
            <template slot-scope="scope">
              <span class="table-name"
                @click="showDetails(scope.row.tableName)">{{ scope.row.tableName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="hashKey"
            label="Hash Key">
          </el-table-column>
          <el-table-column prop="rangekey"
            label="Range Key">
          </el-table-column>
          <el-table-column prop="itemCount"
            label="Item Count">
          </el-table-column>
          <el-table-column prop="ReadCapacity"
            label="Read Capacity">
          </el-table-column>
          <el-table-column prop="WriteCapacity"
            label="Write Capacity">
          </el-table-column>
          <el-table-column prop="status"
            label="Table Status">
          </el-table-column>
          <!-- <el-table-column prop="creationDateTime" label="Creation Date Time">
        </el-table-column> -->
        </el-table>
      </el-col>
    </el-row>
    <div class="text-right">
      <el-pagination @current-change="pageChange"
        background
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>

    <transition name="slide-fade">
      <div class="table-details"
        :style="dragStyle"
        v-if="controlTableDetails">
        <div class="drag-part"
          @mousedown="handleMouseDown"></div>
        <div class="drag-title">
          <span>{{$route.params.tableName}}</span>
          <el-button type="text"
            @click="controlTableDetails=false">Close</el-button>
        </div>
        <router-view/>
      </div>
    </transition>
    <json-editor :tableName="tableName"></json-editor>
    <index-dialog :tableName="tableName"></index-dialog>
  </div>
</template>

<script>
import JsonEditor from '@/components/json-editor'
import IndexDialog from '@/components/index-dialog'
import Utils from '@/utils/utils'
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()
const PAGE_SIZE = 2
export default {
  components: { JsonEditor, IndexDialog },
  data() {
    return {
      tables: [],
      search_table_input: '',
      selectTable: {},
      controlTableDetails: false,
      startDrag: false,
      pageX: 300,
      dynamoDB: null,
      currentPage: 1,
      total: 0,
      pageSize: PAGE_SIZE,
      tableNames: []
    }
  },
  computed: {
    tableName() {
      return this.$route.params.name || ''
    },
    config: function() {
      return this.$store.state.aws.config
    },
    dragStyle: function() {
      let width = document.body.clientWidth - this.pageX
      width = width > 200 ? width : 200
      return { width: `${width}px` }
    }
  },
  mounted() {
    this.listenBodyMouse()
    if (
      Utils.isNotEmpty(this.config.region) &&
      Utils.isNotEmpty(this.config.endpoint)
    ) {
      this.listTables()
    }
  },
  watch: {
    config: {
      handler(newValue, oldvalue) {
        if (
          Utils.isNotEmpty(newValue.region) &&
          Utils.isNotEmpty(newValue.endpoint)
        ) {
          this.listTables()
        }
      },
      deep: true
    },
    search_table_input(val) {
      this.tables = []
      for (const tableName of this.tableNames) {
        if (tableName.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          this.tables.push({ tableName })
        }
      }
    }
  },
  methods: {
    setLang(lang) {
      if (this.$store.state.locale === lang) {
        return
      }
      this.$store.commit('SET_LANG', lang)
    },
    showDetails(name) {
      this.controlTableDetails = true
      this.$router.push(`/table/${name}`)
    },
    listTables() {
      this.$dynamoDB.config = this.config
      var params = {
        Limit: 10,
        ExclusiveStartTableName: this.exclusiveStartTableName
      }
      this.$dynamoDB.listTables(params, res => {
        if (res.data) {
          this.exclusiveStartTableName = res.LastEvaluatedTableName
          this.tableNames = res.data.TableNames
          this.total = this.tableNames.length
          this.renderTables()
        }
      })
    },
    renderTables() {
      const startIndex = (this.currentPage - 1) * PAGE_SIZE
      this.tables = []
      this.tableNames.forEach((tableName, index) => {
        if (index >= startIndex && index < startIndex + PAGE_SIZE) {
          this.describeTable(tableName)
        }
      })
    },
    describeTable(tableName) {
      const table = { tableName }
      this.$dynamoDB.describeTable(tableName, res => {
        const data = res.data
        if (!data) {
          return
        }
        table.status = data.Table.TableStatus
        table.itemCount = data.Table.ItemCount
        table.ReadCapacity = data.Table.ProvisionedThroughput.ReadCapacityUnits
        table.WriteCapacity =
          data.Table.ProvisionedThroughput.WriteCapacityUnits
        table.hashKey = this.getSchemaKey(data.Table.KeySchema, 'HASH')
        table.rangekey = this.getSchemaKey(data.Table.KeySchema, 'RANGE')
        this.tables.push(table)
      })
    },
    getSchemaKey(keySchema, keyType) {
      for (var index in keySchema) {
        if (keySchema[index].KeyType === keyType) {
          return keySchema[index].AttributeName
        }
      }
      return ''
    },
    deleteTable(table) {
      console.log(table)
      let tableName = table.tableName
      if (!tableName) {
        this.$message({
          type: 'warning',
          message: 'please select the table you want to delete!'
        })
        return
      }
      this.$prompt(
        'please input the table name <i style="color: teal">' +
          tableName +
          '</i> you want delete',
        'Confirm',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancle'
        }
      )
        .then(({ value }) => {
          if (value !== tableName) {
            this.$message({
              type: 'warning',
              message: 'the table name is wrong, delete cancle!'
            })
            return
          }
          var params = {
            TableName: tableName
          }
          dynamodb.deleteTable(params, (err, data) => {
            if (err) {
              this.$notify.error({
                title: 'delete table ' + value + ' failure!',
                message: err.message
              })
            } else {
              this.$notify.success({
                title: 'delete table ' + value + ' success!'
              })
              this.listTables()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancelled'
          })
        })
    },
    handleCurrentChange(val) {
      this.selectTable = val
    },
    handleMouseDown(e) {
      this.pageX = e.pageX
      this.startDrag = true
    },
    listenBodyMouse() {
      document.body.addEventListener('mousemove', e => {
        if (this.startDrag) {
          this.pageX = e.pageX
        }
      })
      document.body.addEventListener('mouseup', e => {
        if (this.startDrag) {
          this.pageX = e.pageX
          this.startDrag = false
        }
      })
    },
    pageChange(val) {
      this.currentPage = val
      this.renderTables()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/variable';
.main {
  padding: 20px 30px;
  .table-name {
    cursor: pointer;
    color: $primary;
  }
}

.table-details {
  position: absolute;
  right: 0;
  top: 63px;
  min-height: 100vh;
  z-index: 100;
  background: #fff;
  .drag-part {
    position: absolute;
    top: 0;
    left: 0px;
    bottom: 0;
    width: 3px;
    background: black;
    cursor: ew-resize;
    &:after {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
    }
  }
  .drag-title {
    margin: 5px 10px;
    span {
      font-weight: 500;
      margin-right: 10px;
    }
  }
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  bottom: 0;
  transition: all 0.6s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
}
</style>
<style lang="scss">
.el-pagination.is-background .el-pager li,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .btn-next {
  background: #fff;
}
</style>
