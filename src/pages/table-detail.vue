<template>
  <div class="details">
    <el-tabs>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-view"></i> Overview</span>
        <div class="basic-info">
          <h2>Basic Info</h2>
          <el-table :data="tableBasicInfos" style="width: 100%;margin:20px 0 30px;">
            <el-table-column prop="key" label="Configuration Item" width="200">
            </el-table-column>
            <el-table-column prop="value" label="Value">
            </el-table-column>
          </el-table>
          <h2>Table Schema</h2>
          <el-input style="margin-top:20px;" type="textarea" :rows="20" :disabled="true" v-model="tableJsonSchema">
          </el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-document"></i> Item</span>
        <div>
          <el-row style="margin:10px 0">
            <el-button type="success" plain @click="createItem">Create item</el-button>
            <el-button type="warning" plain @click="deleteItems(multipleSelection)" :disabled="multipleSelection.length === 0">Delete items</el-button>
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
              <el-row>
                <el-col :span="4">
                  <el-select v-model="method">
                    <el-option label="Scan" value="scan">
                    </el-option>
                    <el-option label="Query" value="query">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="15">
                  <el-select v-model="schemaIndex" class="schema-select">
                    <el-option v-for="(item,index) in schemaOptions" :key="`schema${index}`" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px;">
                <el-form :model="itemSearch" :rules="itemSearchRules" ref="itemSearch" label-position="left" label-width="200px" size="mini" v-show="method === 'query' && tableIndex[parseInt(schemaIndex)]">
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
                      <el-col :span="9">
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
                      <el-col :span="9" v-if="itemSearch.rk.calculate !== 'BETWEEN'">
                        <el-input v-model="itemSearch.rk.value"></el-input>
                      </el-col>
                      <el-col :span="9" v-else>
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
              </el-row>
              <el-row style="margin:10px 0">
                <el-button type="primary" plain @click="search(true)">Search</el-button>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-table :data="tableItems" @selection-change="handleSelectionChange" @cell-click="editItem" cell-class-name="table-item" stripe style="width: 100%;height:46vh;overflow:scroll">
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
        <el-button type="success" plain @click="openAddIndexDialog('addTableIndexRuleForm')">Create Index</el-button>
        <el-button type="warning" plain @click="deleteTableIndex(currentSelectIndex)" :disabled="deleteIndexDisabled">Delete Index</el-button>
        <el-table :data="secondIndex" style="width: 100%;margin-top:10px;" size="mini" stripe highlight-current-row @current-change="handleIndexSelectionChange">
          <el-table-column prop="indexName" label="Name">
          </el-table-column>
          <el-table-column prop="indexType" label="Type">
          </el-table-column>
          <el-table-column prop="keySchema[0].AttributeName" label="Partition Key">
            <template slot-scope="scope">
              {{ scope.row.keySchema[0].AttributeName + ' (' + getAttributeType(scope.row.keySchema[0].AttributeName,tableSchema) + ')' }}
            </template>
          </el-table-column>
          <el-table-column prop="keySchema[1].AttributeName" label="Sort Key">
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
    <el-dialog id="add-index" title="Add Index" :visible.sync="table_add_index_dialogVisible" width="40%">
      <el-form :model="newTableIndex" :rules="addTableIndexRules" ref="addTableIndexRuleForm" label-position="right" label-width="150px" size="mini">
        <el-form-item label="Partition Key" prop="partitionKey">
          <el-row>
            <el-col :span="17">
              <el-input v-model="newTableIndex.partitionKey"></el-input>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-select v-model="newTableIndex.partitionKeyType" placeholder="type">
                <el-option v-for="item in dataTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;margin-top: -10px;">
          <el-checkbox v-model="newTableIndex.hasSortKey">Add sort key</el-checkbox>
        </el-form-item>
        <el-form-item label="Sort Key" prop="sortKey" v-show="newTableIndex.hasSortKey">
          <el-row>
            <el-col :span="17">
              <el-input v-model="newTableIndex.sortKey"></el-input>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-select v-model="newTableIndex.sortKeyType" placeholder="type">
                <el-option v-for="item in dataTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="Index Name" prop="indexName">
          <el-row>
            <el-col :span="17">
              <el-input v-model="newTableIndex.indexName"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="Projected Attributes" prop="projectionType">
          <el-row>
            <el-col :span="17">
              <el-select v-model="newTableIndex.projectionType" placeholder="type">
                <el-option v-for="item in projectionTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;margin-top: -10px;">
          <el-checkbox v-model="newTableIndex.indexType" true-label="LSI" false-label="GSI" disabled>Create as Local Secondary Index</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTableIndex(newTableIndex, 'addTableIndexRuleForm')">Add</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
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
      table_add_index_dialogVisible: false,
      newTableIndex: {
        partitionKey: '',
        partitionKeyType: 'S',
        hasSortKey: false,
        sortKey: '',
        sortKeyType: 'S',
        indexName: '',
        projectionType: 'ALL',
        nonKeyAttributes: [],
        indexType: 'GSI'
      },
      addTableIndexRules: {
        partitionKey: [
          { required: true, message: 'please input partition key' }
        ],
        indexName: [{ required: true, message: 'please input index name' }]
      },
      currentSelectIndex: '',
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
      projectionTypes: [
        {
          label: 'All',
          value: 'ALL'
        },
        {
          label: 'Keys only',
          value: 'KEYS_ONLY'
        },
        {
          label: 'Include',
          value: 'INCLUDE'
        }
      ],
      tableBasicInfos: []
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
      delete obj.TableStatus
      delete obj.CreationDateTime
      delete obj.ProvisionedThroughput.LastIncreaseDateTime
      delete obj.ProvisionedThroughput.LastDecreaseDateTime
      delete obj.ProvisionedThroughput.NumberOfDecreasesToday
      delete obj.TableSizeBytes
      delete obj.ItemCount
      delete obj.TableArn
      if (obj.GlobalSecondaryIndexes) {
        obj.GlobalSecondaryIndexes.forEach((gsi) => {
          delete gsi.IndexStatus
          delete gsi.IndexSizeBytes
          delete gsi.ItemCount
          delete gsi.IndexArn
        })
      }
      if (obj.LocalSecondaryIndexes) {
        obj.LocalSecondaryIndexes.forEach((lsi) => {
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
    }
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
    }
  },
  methods: {
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
            value: data.ProvisionedThroughput.LastDecreaseDateTime.toString()
          },
          {
            key: 'Last increase time',
            value: data.ProvisionedThroughput.LastIncreaseDateTime.toString()
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
          console.log(item)
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
      this.table_add_index_dialogVisible = true
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    validAndAddAttributeDefinitions(
      attributeDefinitions,
      attributeName,
      attributeType
    ) {
      for (var attributeDefinition of attributeDefinitions) {
        if (
          attributeDefinition.AttributeName === attributeName &&
          attributeDefinition.AttributeType !== attributeType
        ) {
          this.$message({
            message:
              ' Type of ' +
              attributeName +
              ' does not match existing data type',
            type: 'warning'
          })
          return false
        }
      }
      attributeDefinitions.push({
        AttributeName: attributeName,
        AttributeType: attributeType
      })
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
            this.table_add_index_dialogVisible = false
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
    addTableIndex(tableIndex, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var attributeDefinitions = Utils.clone(
            this.tableSchema.AttributeDefinitions
          )
          if (
            this.validAndAddAttributeDefinitions(
              attributeDefinitions,
              tableIndex.partitionKey,
              tableIndex.partitionKeyType
            )
          ) {
            return
          }
          var keySchema = [
            {
              AttributeName: tableIndex.partitionKey,
              KeyType: 'HASH'
            }
          ]
          if (tableIndex.hasSortKey && Utils.isNotEmpty(tableIndex.sortKey)) {
            if (
              this.validAndAddAttributeDefinitions(
                attributeDefinitions,
                tableIndex.sortKey,
                tableIndex.sortKeyType
              )
            ) {
              return
            }
            keySchema.push({
              AttributeName: tableIndex.sortKey,
              KeyType: 'RANGE'
            })
          }
          var params = {
            TableName: this.tableName,
            AttributeDefinitions: attributeDefinitions,
            GlobalSecondaryIndexUpdates: [
              {
                Create: {
                  IndexName: tableIndex.indexName,
                  KeySchema: keySchema,
                  Projection: {
                    // NonKeyAttributes: [],
                    ProjectionType: tableIndex.projectionType
                  },
                  ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                  }
                }
              }
            ]
          }
          console.log(params)
          this.$dynamoDB.updateTable(params, res => {
            this.$message({
              message: 'Add index success!',
              type: 'success'
            })
            this.table_add_index_dialogVisible = false
            this.describeTable(this.tableName)
          })
        } else {
          return false
        }
      })
    },
    ...mapMutations({
      SET_SHOWEDITOR: 'SET_SHOWEDITOR',
      SET_TEXT: 'SET_TEXT'
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
</style>
