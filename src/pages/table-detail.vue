<template>
  <div class="details">
    <el-tabs>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-document"></i> Basic Info</span>
        <div class="basic-info">
          <el-table :data="tableBasicInfos" style="width: 100%;margin:20px 0 30px;">
            <el-table-column prop="key" label="Configuration Item" width="300">
            </el-table-column>
            <el-table-column prop="value" label="Value">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-edit-outline"></i> Table Schema</span>
        <div class="basic-info">
          <el-input style="margin-top:20px;" type="textarea" autosize :disabled="true" v-model="tableJsonSchema">
          </el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-search"></i> Item</span>
        <div>
          <el-row style="margin:10px 0">
            <el-button type="success" @click="createItem">Create item</el-button>
            <el-button type="warning" @click="deleteItems(multipleSelection)" :disabled="multipleSelection.length === 0">Delete items</el-button>
          </el-row>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="tableSearch">
              <template slot="title">
                {{ tableSearchTitle || 'Click search to scan table' }}
                <i class="header-icon el-icon-info"></i>
                <div class="detail-pagination">
                  <i class="el-icon-arrow-left" v-show="startIndex > 1" @click.stop="search(false, 'prev')"></i>
                  <span v-show="startIndex>0">Viewing {{(startIndex -1) * limit}} to {{(startIndex-1) * limit + total}} Items</span>
                  <i class="el-icon-arrow-right" v-show="exclusiveStartKeys.length > 0" @click.stop="search(false, 'next')"></i>
                </div>
              </template>
              <el-row :gutter="10">
                <el-col :span="2">
                  <el-select v-model="method">
                    <el-option label="Scan" value="scan">
                    </el-option>
                    <el-option label="Query" value="query">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="16">
                  <el-select v-model="schemaIndex" class="schema-select">
                    <el-option v-for="(item,index) in schemaOptions" :key="`schema${index}`" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px;">
                <el-form :model="itemSearch" :rules="itemSearchRules" ref="itemSearch" label-position="right" label-width="9%" size="mini" v-show="method === 'query' && tableIndex[parseInt(schemaIndex)]">
                  <el-form-item label="Partition Key" prop="hk.value">
                    <el-row :gutter="10">
                      <el-col :span="4">
                        <span class="field_value">{{ itemSearch.hk.name }}</span>
                      </el-col>
                      <el-col :span="2">
                        <span class="field_value">{{ itemSearch.hk.type }}</span>
                      </el-col>
                      <el-col :span="3">
                        <span class="field_value text-center">{{ itemSearch.hk.calculate }}</span>
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="itemSearch.hk.value"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="Sort Key" prop="sortKeyValue" v-show="method === 'query' && tableIndex[parseInt(schemaIndex)] && tableIndex[parseInt(schemaIndex)].keySchema[1]">
                    <el-row :gutter="10">
                      <el-col :span="4">
                        <span class="field_value">{{ itemSearch.rk.name }}</span>
                      </el-col>
                      <el-col :span="2">
                        <span class="field_value">{{ itemSearch.rk.type }}</span>
                      </el-col>
                      <el-col :span="3">
                        <el-select v-model="itemSearch.rk.calculate">
                          <el-option v-for="(type,index) in queryTypes" class="field_value" :key="`query${index}`" :label="type" :value="type"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8" v-if="itemSearch.rk.calculate !== 'BETWEEN'">
                        <el-input v-model="itemSearch.rk.value"></el-input>
                      </el-col>
                      <el-col :span="8" v-else>
                        <el-col :span="11">
                          <el-input v-model="itemSearch.rk.value"></el-input>
                        </el-col>
                        <el-col :span="2">
                          <span>And</span>
                        </el-col>
                        <el-col :span="11">
                          <el-input v-model="itemSearch.rk.behindValue"></el-input>
                        </el-col>

                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-form>
                <el-form :model="searchFilter" :rules="filterRules" ref="itemSearch" label-position="right" size="mini" label-width="9%">
                  <el-row v-for="(filter, index) in searchFilter.filters" :key="index" :gutter="10">
                    <el-form-item :label="index === 0 ? 'Filter' : 'And'">
                      <el-col :span="4">
                        <el-input v-model="filter.field" placeholder="Enter attribute"></el-input>
                      </el-col>
                      <el-col :span="2">
                        <el-select v-model="filter.type">
                          <el-option v-for="item in dataTypes" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="3">
                        <el-select v-model="filter.calculate">
                          <el-option v-for="item in operatiors" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8" v-if="filter.calculate !== 'BETWEEN'">
                        <el-input v-model="filter.valueA" placeholder="Enter value"></el-input>
                      </el-col>
                      <el-col :span="8" v-else>
                        <el-col :span="11">
                          <el-input v-model="filter.valueA" placeholder="Enter value"></el-input>
                        </el-col>
                        <el-col :span="2">
                          <span>And</span>
                        </el-col>
                        <el-col :span="11">
                          <el-input v-model="filter.valueB" placeholder="Enter value"></el-input>
                        </el-col>
                      </el-col>
                      <el-col :span="2">
                        <el-button type="text" icon="el-icon-circle-close-outline" @click="deleteFilter(searchFilter, index)">Delete</el-button>
                      </el-col>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-col :offset="2">
                      <el-button type="text" icon="el-icon-circle-plus" @click="addFilter(searchFilter)">Add filter</el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </el-row>
              <el-row>
                <el-col :offset="2">
                  <el-button type="primary" @click="search(true)">Start search</el-button>
                  <el-button type="text" @click="search(true)">Cancel chages</el-button>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-table :data="tableItems" @selection-change="handleSelectionChange" @cell-click="editItem" cell-class-name="table-item" stripe style="width: 100%;height:100%;overflow:scroll">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column v-for="header in tableHeaders" :key="header" :prop="header" :label="header" min-width="180">
            </el-table-column>

          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-sort"></i> Index</span>
        <el-button type="success" @click="openAddIndexDialog('addTableIndexRuleForm')">Create Index</el-button>
        <el-button type="warning" @click="deleteTableIndex(currentSelectIndex)" :disabled="deleteIndexDisabled">Delete Index</el-button>
        <el-table :data="secondIndex" v-if="secondIndex.length >0" style="width: 100%;margin-top:10px;" size="mini" stripe highlight-current-row @current-change="handleIndexSelectionChange">
          <el-table-column prop="indexName" label="Name">
          </el-table-column>
          <el-table-column prop="indexType" label="Type">
          </el-table-column>
          <el-table-column prop="keySchema[0].AttributeName" label="Partition Key">
            <template slot-scope="scope">
              {{ scope.row.keySchema[0].AttributeName + ' (' + getAttributeType(scope.row.keySchema[0].AttributeName,tableSchema) + ')' }}
            </template>
          </el-table-column>
          <el-table-column v-if="secondIndex.keySchema && secondIndex.keySchema.length > 1" prop="keySchema[1].AttributeName" label="Sort Key">
            <template slot-scope="scope">
              {{ scope.row.keySchema[1].AttributeName }}
              <span v-show="scope.row.keySchema[1].AttributeName">({{ getAttributeType(scope.row.keySchema[1].AttributeName,tableSchema) }})</span>
            </template>
          </el-table-column>
          <el-table-column prop="projection.ProjectionType" label="Projection Type">
          </el-table-column>
          <el-table-column prop="indexStatus" label="Index Status">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import Utils from '@/utils/utils'
const LIMIT = 100
// const TYPES = ['L', 'S', 'N', 'B', 'SS', 'NS', 'BS', 'M', 'NULL', 'BOOL']
const QUERY_TYPES = ['=', '<', '<=', '>', '>=', 'BETWEEN']

export default {
  data() {
    return {
      activeNames: 'tableSearch',
      tableIndex: [],
      secondIndex: [],
      tableSchema: {},
      startIndex: 0,
      exclusiveStartKeys: [],
      total: 0,
      limit: LIMIT,
      method: 'scan',
      schemaIndex: 0,
      tableItems: [],
      tableHeaders: [],
      queryTypes: QUERY_TYPES,
      itemSearchRules: {
        'hk.value': [{ required: true, message: ' ', trigger: 'blur' }]
      },
      filterRules: {},
      itemSearch: {
        hk: {
          name: '',
          type: '',
          calculate: '=',
          value: ''
        },
        rk: {
          name: '',
          type: '',
          calculate: '=',
          value: '',
          behindValue: ''
        }
      },
      defaultItem: {},
      curSchemaIndex: 0,
      tableSearchTitle: '',
      showEditor: false,
      editorData: '',
      multipleSelection: [],
      currentSelectIndex: '',
      tableBasicInfos: [],
      searchFilter: {
        filters: []
      },
      queryFilter: {
        filters: []
      },
      dataTypes: [
        {
          label: 'String',
          value: 'S'
        },
        {
          label: 'Binary',
          value: 'B'
        },
        {
          label: 'Numble',
          value: 'N'
        }
      ],
      operatiors: [
        {
          label: '=',
          value: '='
        },
        {
          label: '≠',
          value: '≠'
        },
        {
          label: '<=',
          value: '<='
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '>=',
          value: '>='
        },
        {
          label: '>',
          value: '>'
        },
        {
          label: 'Between',
          value: 'BETWEEN'
        },
        {
          label: 'Begins with',
          value: 'BEGINS_WITH'
        }
      ]
    }
  },
  created() {
    this.describeTable(this.tableName)
  },
  computed: {
    tableName() {
      return this.$route.params.name
    },
    tableJsonSchema() {
      const obj = Utils.clone(this.tableSchema)
      if (!obj || JSON.stringify(obj) === '{}') return
      delete obj.TableStatus
      delete obj.CreationDateTime
      delete obj.ProvisionedThroughput.LastIncreaseDateTime
      delete obj.ProvisionedThroughput.LastDecreaseDateTime
      delete obj.ProvisionedThroughput.NumberOfDecreasesToday
      delete obj.TableSizeBytes
      delete obj.ItemCount
      delete obj.TableArn
      if (obj.GlobalSecondaryIndexes) {
        obj.GlobalSecondaryIndexes.forEach(gsi => {
          delete gsi.IndexStatus
          delete gsi.IndexSizeBytes
          delete gsi.ItemCount
          delete gsi.IndexArn
        })
      }
      if (obj.LocalSecondaryIndexes) {
        obj.LocalSecondaryIndexes.forEach(lsi => {
          delete lsi.IndexStatus
          delete lsi.IndexSizeBytes
          delete lsi.ItemCount
          delete lsi.IndexArn
        })
      }
      return JSON.stringify(obj, null, '\t')
    },
    schemaOptions() {
      const options = []
      for (var index in this.tableIndex) {
        const item = this.tableIndex[index]
        const key = this.getSchemaOption(item.keySchema)
        options.push({
          label: `[${item.type}] ${item.indexName}: ${key}`,
          value: index
        })
      }
      return options
    },
    defaultTableHeader() {
      const header = []
      for (var key in this.defaultItem) {
        header.push(key)
      }
      return header
    },
    deleteIndexDisabled() {
      return Utils.isEmpty(this.currentSelectIndex)
    },
    ...mapGetters({
      updateIndexSuccess: 'updateIndexSuccess'
    })
  },
  watch: {
    tableName(val) {
      console.log('table change')
      this.describeTable(val)
      this.tableItems = []
    },
    schemaOptions: function(newValue, oldValue) {
      this.schemaIndex = '0'
      this.updateItemSearch()
    },
    schemaIndex: function(newValue, oldValue) {
      this.updateItemSearch()
    },
    updateIndexSuccess(val) {
      if (val) {
        this.describeTable(this.tableName)
        this.SET_UPDATEINDEXSUCCESS(false)
      }
    }
  },
  methods: {
    addFilter(filters) {
      filters.filters.push({
        field: '',
        type: 'S',
        calculate: '=',
        valueA: '',
        valusB: ''
      })
    },
    deleteFilter(filters, index) {
      filters.filters.splice(index, 1)
    },
    updateItemSearch() {
      this.itemSearch = {
        hk: {
          name: this.tableIndex[parseInt(this.schemaIndex)]
            ? this.tableIndex[parseInt(this.schemaIndex)].keySchema[0]
                .AttributeName
            : '',
          type: this.tableIndex[parseInt(this.schemaIndex)]
            ? this.getAttributeType(
                this.tableIndex[parseInt(this.schemaIndex)].keySchema[0]
                  .AttributeName,
                this.tableSchema
              )
            : '',
          calculate: '=',
          value: ''
        },
        rk: {
          name:
            this.tableIndex[parseInt(this.schemaIndex)] &&
            this.tableIndex[parseInt(this.schemaIndex)].keySchema[1]
              ? this.tableIndex[parseInt(this.schemaIndex)].keySchema[1]
                  .AttributeName
              : '',
          type:
            this.tableIndex[parseInt(this.schemaIndex)] &&
            this.tableIndex[parseInt(this.schemaIndex)].keySchema[1]
              ? this.getAttributeType(
                  this.tableIndex[parseInt(this.schemaIndex)].keySchema[1]
                    .AttributeName,
                  this.tableSchema
                )
              : '',
          calculate: '=',
          value: ''
        }
      }
    },
    describeTable(tableName) {
      this.$dynamoDB.describeTable(tableName, res => {
        if (!res.data) {
          return
        }
        const data = res.data.Table
        const HashKey = this.getSchemaKey(data.KeySchema, 'HASH')
        const RangeKey = this.getSchemaKey(data.KeySchema, 'RANGE')
        const HashType = this.getAttributeType(HashKey, data)
        const RangeType = RangeKey ? this.getAttributeType(RangeKey, data) : ''
        this.tableSchema = data
        this.tableBasicInfos = [
          {
            key: 'Table name',
            value: data.TableName
          },
          {
            key: 'Primary partition key',
            value: `${HashKey} (${HashType})`
          },
          {
            key: 'Primary sort key',
            value: Utils.isNotEmpty(RangeKey)
              ? `${RangeKey} (${RangeType})`
              : '-'
          },
          {
            key: 'Table status',
            value: data.TableStatus
          },
          {
            key: 'Creation date',
            value: data.CreationDateTime.toString()
          },
          {
            key: 'Item count',
            value: data.ItemCount
          },
          {
            key: 'Storage size (in bytes)',
            value: data.TableSizeBytes
          },
          {
            key: 'Provisioned read capacity units',
            value: data.ProvisionedThroughput.ReadCapacityUnits
          },
          {
            key: 'Provisioned write capacity units',
            value: data.ProvisionedThroughput.WriteCapacityUnits
          },
          {
            key: 'Last decrease time',
            value: data.ProvisionedThroughput.LastDecreaseDateTime
              ? data.ProvisionedThroughput.LastDecreaseDateTime.toString()
              : ''
          },
          {
            key: 'Last increase time',
            value: data.ProvisionedThroughput.LastIncreaseDateTime
              ? data.ProvisionedThroughput.LastIncreaseDateTime.toString()
              : ''
          },
          {
            key: 'Table Arm',
            value: data.TableArn
          }
        ]
        this.tableIndex = []
        this.tableIndex.push({
          type: 'Table',
          indexName: data.TableName,
          keySchema: data.KeySchema
        })
        this.defaultItem = {}
        this.defaultItem[HashKey] = HashType === 'N' ? 0 : ''
        if (RangeKey) {
          this.defaultItem[RangeKey] = RangeType === 'N' ? 0 : ''
        }
        this.secondIndex = []
        if (data.GlobalSecondaryIndexes) {
          for (const key of data.GlobalSecondaryIndexes) {
            this.tableIndex.push({
              type: 'Index',
              indexName: key.IndexName,
              keySchema: key.KeySchema
            })
            this.secondIndex.push({
              indexType: 'GSI',
              indexStatus: key.IndexStatus,
              indexSizeBytes: key.IndexSizeBytes,
              itemCount: key.ItemCount,
              indexName: key.IndexName,
              keySchema: key.KeySchema,
              projection: key.Projection
            })
          }
        }
        this.tableHeaders = this.defaultTableHeader
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
    getIndexKeys(data) {
      if (!data) {
        return
      }
      const schemas = []
      for (const key of data) {
        const index = {
          name: key.IndexName,
          value: key.KeySchema
        }
        schemas.push(index)
      }
      return schemas
    },
    getSchemaOption(data) {
      let hash = ''
      let range = false
      for (const item of data) {
        item.KeyType === 'HASH'
          ? (hash = item.AttributeName)
          : (range = item.AttributeName)
      }
      return range ? `${hash}, ${range}` : hash
    },
    getAttributeType(attributeName, data) {
      for (const item of data.AttributeDefinitions) {
        if (item.AttributeName === attributeName) {
          return item.AttributeType
        }
      }
    },
    buildExpression(filter, index, params) {
      if (Utils.isNotEmpty(params.FilterExpression)) {
        params.FilterExpression += ' and '
      } else {
        params.FilterExpression = ''
      }
      if (filter.calculate === 'BETWEEN') {
        params.FilterExpression +=
          '#k' + index + ' between :va' + index + ' and :vb' + index
        params.ExpressionAttributeNames['#k' + index] = filter.field
        params.ExpressionAttributeValues[':va' + index] =
          filter.type === 'N' ? parseInt(filter.valueA) : filter.valueA
        params.ExpressionAttributeValues[':vb' + index] =
          filter.type === 'N' ? parseInt(filter.valueB) : filter.valueB
      } else if (filter.calculate === 'BEGINS_WITH') {
        params.FilterExpression +=
          'begins_with(#k' + index + ', :va' + index + ')'
        params.ExpressionAttributeNames['#k' + index] = filter.field
        params.ExpressionAttributeValues[':va' + index] =
          filter.type === 'N' ? parseInt(filter.valueA) : filter.valueA
      } else {
        params.FilterExpression +=
          '#k' + index + ' ' + filter.calculate + ' :va' + index
        params.ExpressionAttributeNames['#k' + index] = filter.field
        params.ExpressionAttributeValues[':va' + index] =
          filter.type === 'N' ? parseInt(filter.valueA) : filter.valueA
      }
    },
    scan(type) {
      const params = {
        Limit: this.limit,
        TableName: this.tableName
      }
      const index = type === 'next' ? this.startIndex : this.startIndex - 2

      if (this.tableIndex[parseInt(this.schemaIndex)].type === 'Index') {
        params.IndexName = this.tableIndex[parseInt(this.schemaIndex)].indexName
      }

      if (this.exclusiveStartKeys.length > 0 && index >= 0) {
        params.ExclusiveStartKey = this.exclusiveStartKeys[index]
      }
      if (index < 0) {
        this.startIndex = 0
        this.exclusiveStartKeys = [null]
      }
      if (this.searchFilter.filters.length > 0) {
        params.ExpressionAttributeNames = {}
        params.ExpressionAttributeValues = {}
        this.searchFilter.filters.forEach((filter, index) => {
          this.buildExpression(filter, index, params)
        })
      }

      this.$dynamoDB.scanTable(params, res => {
        type === 'prev' ? this.startIndex-- : this.startIndex++

        this.exclusiveStartKeys.splice(
          this.startIndex,
          1,
          res.data.LastEvaluatedKey || null
        )
        this.total = res.data.Count

        this.getTableItemsAndHeaders(res.data.Items)
      })
      this.updateTableSearchTitle()
    },
    // doc client query
    async query(type) {
      const validResult = await this.$refs.itemSearch.validate()
      if (!validResult) {
        return
      }
      const index = type === 'next' ? this.startIndex : this.startIndex - 2
      console.log(this.itemSearch)
      const params = {
        TableName: this.tableName,
        KeyConditionExpression: '#hk = :hkv',
        ExpressionAttributeNames: {
          '#hk': this.itemSearch.hk.name
        },
        ExpressionAttributeValues: {
          ':hkv':
            this.itemSearch.hk.type === 'N'
              ? parseInt(this.itemSearch.hk.value)
              : this.itemSearch.hk.value
        },
        Limit: this.limit
      }
      if (this.exclusiveStartKeys.length > 0 && index >= 0) {
        params.ExclusiveStartKey = this.exclusiveStartKeys[index]
      }
      if (index < 0) {
        this.startIndex = 0
        this.exclusiveStartKeys = [null]
      }

      if (this.itemSearch.rk.value) {
        params.KeyConditionExpression += ` and #rk ${
          this.itemSearch.rk.calculate
        } :rkv`
        params.ExpressionAttributeNames['#rk'] = this.itemSearch.rk.name
        params.ExpressionAttributeValues[':rkv'] =
          this.itemSearch.rk.type === 'N'
            ? parseInt(this.itemSearch.rk.value)
            : this.itemSearch.rk.value
        if (this.itemSearch.rk.calculate === 'BETWEEN') {
          params.KeyConditionExpression += ' and :rkv2'
          params.ExpressionAttributeValues[':rkv2'] =
            this.itemSearch.rk.type === 'N'
              ? parseInt(this.itemSearch.rk.behindValue)
              : this.itemSearch.rk.behindValue
        }
      }
      if (this.tableIndex[parseInt(this.schemaIndex)].type === 'Index') {
        params.IndexName = this.tableIndex[parseInt(this.schemaIndex)].indexName
      }
      if (this.searchFilter.filters.length > 0) {
        this.searchFilter.filters.forEach((filter, index) => {
          this.buildExpression(filter, index, params)
        })
      }
      console.log(params)
      this.$dynamoDB.queryTable(params, res => {
        type === 'prev' ? this.startIndex-- : this.startIndex++

        this.exclusiveStartKeys.splice(
          this.startIndex,
          1,
          res.data.LastEvaluatedKey || null
        )
        this.total = res.data.Count
        this.getTableItemsAndHeaders(res.data.Items)
        console.log(res)
      })
      this.updateTableSearchTitle()
    },
    getTableItemsAndHeaders(data) {
      this.tableItems = []
      this.tableHeaders = this.defaultTableHeader
      try {
        for (const item of data) {
          // const info = item.info.M
          let temp = {}
          this.formatItems(item, temp)
          // this.formatItems(info, temp)
          this.tableItems.push(temp)
        }
      } catch (error) {
        console.error(`getTableItemsAndHeaders ERROR`, error)
      }
    },
    formatItems(data, temp) {
      Object.keys(data).forEach(value => {
        if (this.tableHeaders.indexOf(value) === -1) {
          this.tableHeaders.push(value)
        }
        // eslint-disable-next-line
        if (typeof data[value] === 'object') {
          temp[value] = JSON.stringify(data[value])
        } else {
          temp[value] = data[value]
        }
        // Object.keys(data[value]).forEach(subKey => {
        //   if (TYPES.indexOf(subKey) > -1) {
        //     if (typeof subKey === 'Object') {
        //       temp[value] = JSON.stringify(data[value][subKey])
        //     } else {
        //       temp[value] = data[value][subKey]
        //     }
        //   }
        // })
      })
    },
    updateTableSearchTitle() {
      this.tableSearchTitle =
        this.method +
        '  ' +
        this.schemaOptions[parseInt(this.schemaIndex)].label
    },
    search(firstSearch, type) {
      if (firstSearch) {
        this.startIndex = 0
        this.exclusiveStartKeys = [null]
      }
      this[this.method](type)
    },
    createItem() {
      this.SET_SHOWEDITOR(true)
      this.SET_TEXT(this.defaultItem)
    },
    editItem(row, column) {
      const copyRow = JSON.parse(JSON.stringify(row))
      for (const key in copyRow) {
        try {
          copyRow[key] = JSON.parse(copyRow[key])
        } catch (e) {}
      }
      this.SET_SHOWEDITOR(true)
      this.SET_TEXT(copyRow)
    },
    deleteItems(rows) {
      if (rows.length <= 0) {
        return
      }
      this.$confirm(
        '<i style="color: teal">' +
          rows.length +
          '</i> items selected, you want to delete ?',
        'Confirm',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: 'Yes, delete it',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          rows.forEach(row => {
            const key = {}
            key[this.itemSearch.hk.name] = row[this.itemSearch.hk.name]
            if (this.itemSearch.rk.name) {
              key[this.itemSearch.rk.name] = row[this.itemSearch.rk.name]
            }
            var params = {
              TableName: this.tableName,
              Key: key
            }
            this.$dynamoDB.deleteItem(params)
          })
          this.$message({
            type: 'success',
            message: 'delete items success!'
          })
          this.search(true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancelled'
          })
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection.length === 0)
    },
    handleIndexSelectionChange(val) {
      this.currentSelectIndex = val
    },
    openAddIndexDialog(formName) {
      this.SET_INDEXATTRIBUTEDEFINITIONS(this.tableSchema.AttributeDefinitions)
      this.SET_SHOWINDEXDIALOG(true)
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    deleteTableIndex(tableIndex) {
      this.$prompt(
        'please input the index name <i style="color: teal">' +
          tableIndex.indexName +
          '</i> you want delete',
        'Confirm',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: 'Yes, delete it',
          cancelButtonText: 'Cancle'
        }
      )
        .then(({ value }) => {
          if (value !== tableIndex.indexName) {
            this.$message({
              type: 'warning',
              message: 'the index name is wrong, delete cancle!'
            })
            return
          }
          var params = {
            TableName: this.tableName,
            GlobalSecondaryIndexUpdates: [
              {
                Delete: {
                  IndexName: tableIndex.indexName
                }
              }
            ]
          }
          this.$dynamoDB.updateTable(params, res => {
            this.$message({
              message: 'Delete index success!',
              type: 'success'
            })
            this.SET_SHOWINDEXDIALOG(false)
            this.describeTable(this.tableName)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancelled'
          })
        })
    },
    ...mapMutations({
      SET_SHOWEDITOR: 'SET_SHOWEDITOR',
      SET_TEXT: 'SET_TEXT',
      SET_SHOWINDEXDIALOG: 'SET_SHOWINDEXDIALOG',
      SET_INDEXATTRIBUTEDEFINITIONS: 'SET_INDEXATTRIBUTEDEFINITIONS',
      SET_UPDATEINDEXSUCCESS: 'SET_UPDATEINDEXSUCCESS'
    })
  }
}
</script>

<style lang="scss" scoped>
.details {
  padding: 20px;
  .key-name {
    text-align: right;
    margin-bottom: 10px;
    font-weight: 900;
    text-transform: capitalize;
  }
  .schema-select {
    margin-left: 10px;
    width: 600px;
  }
  .detail-pagination {
    float: right;
    margin-right: 10px;
    text-align: right;
    margin-bottom: 10px;
    color: #333;
    i {
      cursor: pointer;
    }
  }
  .el-select {
    width: 100%;
  }
  .field_value {
    opacity: 0.5;
  }
}
.basic-info {
  margin: 10px;

  h2 {
    margin-left: 10px;
    color: inherit;
    font-size: 20px;
  }
}
</style>
<style lang="scss">
.table-item {
  .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.basic-info {
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: initial !important;
    color: black;
    opacity: .6;
    font-size: 14px;
  }
}
</style>
