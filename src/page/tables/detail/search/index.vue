<template>
  <div id="table-data-search">
    <el-row style="margin:10px 0">
      <el-button size="mini" type="success" @click="createItem">{{$t('table.item_search.button_create_item')}}</el-button>
      <el-button size="mini" type="info" @click="fileDialogVisible = true">{{$t('table.item_search.button_inport_file')}}</el-button>
      <el-button size="mini" type="warning" @click="deleteItems(multipleSelection)" :disabled="multipleSelection.length === 0">{{$t('table.item_search.button_delete_item')}}</el-button>
    </el-row>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="searchParams">
        <template slot="title">
          {{ searchTitle || $t('table.item_search.search_default_title') }}
          <i class="fa fa-info-circle"></i>
          <div class="detail-pagination">
            <i class="fa fa-angle-double-left" v-show="startIndex >= 1" @click.stop="pagingQuery('prev')"></i>
            <span>{{$t('table.item_search.search_result_title').replace('{start}', start).replace('{end}', end)}}</span>
            <i class="fa fa-angle-double-right" v-show="exclusiveStartKeys[startIndex]" @click.stop="pagingQuery('next')"></i>
          </div>
        </template>
        <!-- search params -->
        <search-params ref="searchParams" :limit="limit" :tableSchema="tableSchema" :items="tableHeaders" @updateGroupIndex="updateGroupIndex" @search="search" @initSearch="initSearch"></search-params>
      </el-collapse-item>
    </el-collapse>
    <div class="data-list">
      <div class="consumed-capacity" v-if="consumedCapacity">
        <span>Consumed Capacity:</span>
        <span>{{consumedCapacity}}</span>
      </div>
      <div class="table-setting">
        <el-tooltip class="item" effect="dark" :content="$t('table.item_search.i_refresh')" placement="top">
          <i class="fa fa-refresh" @click="refreshTable"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('table.item_search.i_setting')" placement="top">
          <i class="fa fa-gear" @click="headerSelectDialogShow = true"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('table.item_search.i_download')" placement="top">
          <i class="fa fa-cloud-download" @click="download(tableItems)"></i>
        </el-tooltip>
      </div>
      <el-table border resizable v-loading="loading" :data="tableItems" tooltip-effect="dark" cell-class-name="table-item" style="width: 100%;height:100%;overflow:auto"
        @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column sortable v-for="header in tableHeaders" :key="header" :prop="header" :label="header" :min-width="header === $tableSchema.hashKey ? 200 : 180"  show-overflow-tooltip>
          <template slot-scope="scope">
              <i class="fa fa-clipboard" aria-hidden="true" v-if="header === $tableSchema.hashKey" @click="copy(scope.row[header])"></i>
              <span v-if="header !== $tableSchema.hashKey" @dblclick="copy(scope.row[header])">{{ typeof scope.row[header] === 'object' ? JSON.stringify(scope.row[header]) : scope.row[header] }}</span>
              <span style="color:#409EFF;width:250px" v-else @click="editItem(scope.row)">{{ scope.row[header] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <file-import :visible="fileDialogVisible" @close="fileDialogVisible = false"></file-import>
    <json-editor :showEditor="showEditor" :editorText="editorText" @close="editorClose" @refresh="refreshTable"></json-editor>
    <header-select :data="itemsShow" :visible="headerSelectDialogShow" @updateSelectedHeader="updateSelectedHeader" @close="headerSelectDialogShow = false"></header-select>
  </div>
</template>

<script>
import SearchParams from './_search_params'
import HeaderSelect from '@/components/dialog/_table_header_select'
import JsonEditor from '@/components/editor/json-editor'
import FileImport from '@/components/dialog/_json_file_import'
import FileSaver from 'file-saver'
import {
  GLOBAL_SETTINGS_AUTO_SCAN,
  GLOBAL_SETTINGS_PAGE_SIZE
} from '@/constants'
export default {
  components: {
    SearchParams,
    JsonEditor,
    HeaderSelect,
    FileImport
  },
  data() {
    return {
      activeNames: 'searchParams',
      multipleSelection: [],
      searchTitle: '',
      limit: parseInt(localStorage.getItem(GLOBAL_SETTINGS_PAGE_SIZE)),
      exclusiveStartKeys: [],
      tableSchema: {},
      tableItems: [],
      tableHeaders: [],
      searchParams: '',
      startIndex: 0,
      start: 0,
      end: 0,
      type: 'scan',
      loading: false,
      showEditor: false,
      editorText: {},
      autoScan: localStorage.getItem(GLOBAL_SETTINGS_AUTO_SCAN),
      itemsShow: [],
      headerSelectDialogShow: false,
      groupIndexes: [],
      fileDialogVisible: false,
      consumedCapacity: null
    }
  },
  computed: {
    defaultTableHeader() {
      const header = [this.$tableSchema.hashKey]
      if (this.$tableSchema.rangeKey) {
        header.push(this.$tableSchema.rangeKey)
      }
      return header
    }
  },
  methods: {
    autoInit() {
      console.log('search init')
      this.tableRefreshFinished()
    },
    autoSearch() {
      this.items_show = []
      if (this.autoScan === 'true') {
        this.$refs.searchParams.search()
      }
    },
    tableRefreshFinished() {
      this.tableSchema = this.$tableSchema
      console.log(this.tableSchema)
      this.tableHeaders = this.defaultTableHeader
      this.tableItems = []
      this.itemsShow = []
      this.$nextTick(() => {
        this.autoSearch()
      })
    },
    updateGroupIndex(indexes) {
      this.groupIndexes = indexes
    },
    createItem() {
      let item = {
        [this.$tableSchema.hashKey]:
          this.$tableSchema.hashKeyType === 'N' ? 0 : ''
      }
      if (this.$tableSchema.rangeKey) {
        item[this.$tableSchema.rangeKey] =
          this.$tableSchema.rangeKeyType === 'N' ? 0 : ''
      }
      this.editorText = item
      this.showEditor = true
    },
    deleteItems(rows) {
      if (rows.length <= 0) {
        return
      }
      this.$confirm(
        this.$t('confirm.delete_item').replace('{length}', rows.length),
        this.$t('confirm.title'),
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('confirm.button_yes'),
          cancelButtonText: this.$t('confirm.button_cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          let hashKey = this.$tableSchema.hashKey
          let rangeKey = this.$tableSchema.rangeKey
          rows.forEach(row => {
            const key = {}
            key[hashKey] = row[hashKey]
            if (rangeKey) {
              key[rangeKey] = row[rangeKey]
            }
            var params = {
              TableName: this.$tableSchema.tableName,
              Key: key
            }
            this.$dynamodb.deleteItem(params)
          })
          this.$message.success(this.$t('message.success.delete'))
          this.search(this.searchParams, this.type, () => {})
        })
        .catch(() => {
          this.$message.info(this.$t('message.cancel.delete'))
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    pagingQuery(direction) {
      let index = direction === 'prev' ? this.startIndex - 2 : this.startIndex
      let exclusiveStartKey = this.exclusiveStartKeys[index]
      this.searchParams.ExclusiveStartKey = exclusiveStartKey
      this.search(this.searchParams, this.type, result => {
        if (direction === 'prev') {
          this.end = this.start
          this.start = this.end - result.Count
          this.startIndex--
        } else {
          this.start = this.end
          this.end = this.start + result.Count
          this.startIndex++
        }
      })
    },
    initSearch() {
      this.tableItems = []
      this.exclusiveStartKeys = []
      this.startIndex = 0
      this.start = 0
      this.end = 0
    },
    updateSearchTitle(params, type) {
      console.log(params)
      let titleType = this.$t('table.item_search.search_type_' + type)
      let indexName = this.$utils.isEmpty(params.IndexName) ? params.TableName : params.IndexName
      console.log(this.groupIndexes)
      console.log(titleType, indexName)
      let indexTitle
      this.groupIndexes.forEach(group => {
        group.datas.forEach(index => {
          if (index.indexName === indexName) {
            indexTitle = `[${group.type}] ${index.indexName}: ${index.keySchema.hashKey}${index.keySchema.rangeKey ? ', ' + index.keySchema.rangeKey : ''}`
          }
        })
      })
      this.searchTitle = `${titleType}: ${indexTitle}`
    },
    search(
      params,
      type,
      callback = result => {
        if (this.exclusiveStartKeys.length === 0 || JSON.stringify(result.LastEvaluatedKey) !== JSON.stringify(this.exclusiveStartKeys[this.startIndex])) {
          this.start = this.end
          this.end = this.start + result.Count
        }
      }
    ) {
      this.updateSearchTitle(params, type)
      this.$refs.searchParams.searchStart()
      this.tableItems = []
      this.loading = true
      this.consumedCapacity = null
      this.type = type
      this.$dynamodb[`${type}Table`](
        params,
        res => {
          console.log(res)
          const result = res.data
          callback(result)
          this.exclusiveStartKeys.splice(
            this.startIndex,
            1,
            result.LastEvaluatedKey
          )
          this.searchParams = this.$utils.clone(params)
          // this.searchParams.ExclusiveStartKey = result.LastEvaluatedKey
          console.log(result.Count)
          // console.log(result.ConsumedCapacity.CapacityUnits)
          console.log(result.ScannedCount)
          this.getTableItemsAndHeaders(result.Items)
          if (result.ConsumedCapacity) {
            this.consumedCapacity = result.ConsumedCapacity.CapacityUnits
          }
          this.$refs.searchParams.searchFinished()
        },
        () => {
          this.loading = false
          this.$refs.searchParams.searchFinished()
        }
      )
    },
    getTableItemsAndHeaders(datas) {
      this.tableItems = []
      this.tableHeaders = this.defaultTableHeader
      datas.forEach(item => {
        this.tableItems.push(this.formatItem(item))
      })
      this.tableHeaders.forEach(key => {
        if (this.itemsShow.filter(item => item.key === key).length === 0) {
          this.itemsShow.push({
            key: key,
            show: true
          })
        }
      })
      console.log(this.itemsShow)
    },
    formatItem(item) {
      const temp = {}
      Object.keys(item).forEach(key => {
        if (this.tableHeaders.indexOf(key) === -1 && this.itemsShow.filter(item => item.key === key).length === 0) {
          this.tableHeaders.push(key)
        }
        // if (typeof item[key] === 'object') {
        //   temp[key] = JSON.stringify(item[key])
        // } else {
        //   temp[key] = item[key]
        // }
        temp[key] = item[key]
      })
      return temp
    },
    editItem(item) {
      const copyRow = this.$utils.clone(item)
      for (const key in copyRow) {
        try {
          // 将数组或对象扁平化，变成json 字符串
          if (
            (copyRow[key] instanceof Array) |
            (copyRow[key] instanceof Object)
          ) {
            copyRow[key] = JSON.parse(copyRow[key])
          }
        } catch (e) {}
      }
      this.editorText = copyRow
      this.showEditor = true
    },
    editorClose() {
      this.showEditor = false
    },
    refreshTable() {
      console.log('refresh table')
      this.search(this.searchParams, this.type, () => {})
    },
    cellDblclick(row, column, cell, event) {
      console.log(row)
      console.log(column)
      console.log(cell)
      console.log(event)
    },
    copy(val) {
      let text = val
      if (val instanceof Array || val instanceof Object) {
        text = JSON.stringify(val)
      }
      this.$copyText(text).then(
        res => {
          this.$message.success(this.$t('message.success.copy'))
        },
        err => {
          console.log(err)
          this.$message.error(this.$t('message.failure.copy'))
        }
      )
    },
    updateSelectedHeader(datas) {
      for (let item of this.itemsShow) {
        let index = this.tableHeaders.indexOf(item.key)
        if (datas.filter(entry => entry.key === item.key).length === 0) {
          item.show = false
          if (index > -1) {
            this.tableHeaders.splice(index, 1)
          }
        } else {
          item.show = true
          if (index === -1) {
            this.tableHeaders.push(item.key)
          }
        }
      }
      this.headerSelectDialogShow = false
      console.log('update success')
      console.log(this.itemsShow)
      console.log(this.tableHeaders)
    },
    download(datas) {
      var file = new File([JSON.stringify(datas, null, 4)], `${this.$tableSchema.tableName}.json`, {type: 'text/plain;charset=utf-8'})
      FileSaver.saveAs(file)
    }
  }
}
</script>

<style lang="sass">
#table-data-search
  .el-collapse-item__header
    color: rgb(64, 158, 255)
  .table-item
    .cell
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
  .detail-pagination
    float: right
    margin-right: 20px
  .data-list
    .consumed-capacity
      display: inline
      float: left
      font-size: 13px
      margin-top: 10px
      color: #2F4056
      font-weight: 500
    .table-setting
      float: right
      margin-top: 10px
    i
      margin-right: 5px
      cursor: pointer
</style>
