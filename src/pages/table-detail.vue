<template>
  <div class="details">
    <el-tabs>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-view"></i> Overview</span>
        <el-row style="margin-top:15px;"
          v-for="(value,key) in tableDetails"
          :gutter="40"
          :key="key">
          <el-col :span="10"
            class="key-name">{{key}}</el-col>
          <el-col :span="14">{{value}}</el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-document"></i> Item</span>
        <div>
          <el-row style="margin:10px 0">
            <el-button type="success"
              plain
              @click="createItem">Create item</el-button>
          </el-row>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="tableSearch">
              <template slot="title">
                {{ tableSearchTitle || 'Click search to scan table' }}
                <i class="header-icon el-icon-info"></i>
                <div class="detail-pagination">
                  <i class="el-icon-arrow-left"
                    v-show="startIndex > 1"
                    @click.stop="search(false, 'prev')"></i>
                  <span v-show="startIndex>0">Viewing {{(startIndex -1) * limit}} to {{(startIndex-1) * limit + total}} Items</span>
                  <i class="el-icon-arrow-right"
                    v-show="exclusiveStartKeys.length > 0"
                    @click.stop="search(false, 'next')"></i>
                </div>
              </template>
              <el-row>
                <el-col :span="4">
                  <el-select v-model="method">
                    <el-option label="Scan"
                      value="scan">
                    </el-option>
                    <el-option label="Query"
                      value="query">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="15">
                  <el-select v-model="schemaIndex"
                    class="schema-select">
                    <el-option v-for="(item,index) in schemaOptions"
                      :key="`schema${index}`"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px;">
                <el-form :model="itemSearch"
                  :rules="itemSearchRules"
                  ref="itemSearch"
                  label-position="left"
                  label-width="200px"
                  size="mini"
                  v-show="method === 'query' && tableIndex[parseInt(schemaIndex)]">
                  <el-form-item label="Partition Key"
                    prop="hk.value">
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
                  <el-form-item label="Sort Key"
                    prop="sortKeyValue"
                    v-show="method === 'query' && tableIndex[parseInt(schemaIndex)] && tableIndex[parseInt(schemaIndex)].keySchema[1]">
                    <el-row :gutter="10">
                      <el-col :span="4">
                        <span class="field_value">{{ itemSearch.rk.name }}</span>
                      </el-col>
                      <el-col :span="2">
                        <span class="field_value">{{ itemSearch.rk.type }}</span>
                      </el-col>
                      <el-col :span="3">
                        <el-select v-model="itemSearch.rk.calculate">
                          <el-option v-for="(type,index) in queryTypes"
                            class="field_value"
                            :key="`query${index}`"
                            :label="type"
                            :value="type"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="9"
                        v-if="itemSearch.rk.calculate !== 'BETWEEN'">
                        <el-input v-model="itemSearch.rk.value"></el-input>
                      </el-col>
                      <el-col :span="9"
                        v-else>
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
                <el-button type="primary"
                  plain
                  @click="search(true)">Search</el-button>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-table :data="tableItems"
            @cell-click="editItem"
            cell-class-name="table-item"
            stripe
            style="width: 100%;height:46vh;overflow:scroll">
            <el-table-column v-for="header in tableHeaders"
              :key="header"
              :prop="header"
              :label="header"
              min-width="180">
            </el-table-column>

          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-sort"></i> Index</span>
        <el-table :data="secondIndex"
          style="width: 100%;margin-top:10px;"
          size="mini">
          <el-table-column prop="indexName"
            label="Name">
          </el-table-column>
          <el-table-column prop="indexType"
            label="Type">
          </el-table-column>
          <el-table-column prop="keySchema[0].AttributeName"
            label="Partition Key">
            <template slot-scope="scope">
              {{ scope.row.keySchema[0].AttributeName + ' (' + getAttributeType(scope.row.keySchema[0].AttributeName,tableSchema) + ')' }}
            </template>
          </el-table-column>
          <el-table-column prop="keySchema[1].AttributeName"
            label="Sort Key">
            <template slot-scope="scope">
              {{ scope.row.keySchema[1].AttributeName }}
              <span v-show="scope.row.keySchema[1].AttributeName">({{ getAttributeType(scope.row.keySchema[1].AttributeName,tableSchema) }})</span>
            </template>
          </el-table-column>
          <el-table-column prop="projection.ProjectionType"
            label="Projection Type">
          </el-table-column>
          <el-table-column prop="indexStatus"
            label="Index Status">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
const LIMIT = 100
// const TYPES = ['L', 'S', 'N', 'B', 'SS', 'NS', 'BS', 'M', 'NULL', 'BOOL']
const QUERY_TYPES = ['=', '<', '<=', '>', '>=', 'BETWEEN']

export default {
  data() {
    return {
      activeNames: 'tableSearch',
      tableDetails: {},
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
      editorData: ''
    }
  },
  created() {
    this.describeTable(this.tableName)
  },
  computed: {
    tableName() {
      return this.$route.params.name
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
      // }
      // if (this.tableSchema.primary.length > 0) {
      //   const key = this.getSchemaOption(this.tableSchema.primary)
      //   options.push({
      //     label: `[Table] ${this.tableName}: ${key}`,
      //     value: 'primary'
      //   })
      // }
      // if (this.tableSchema && this.tableSchema.index.length > 0) {
      //   for (const item of this.tableSchema.index) {
      //     const key = this.getSchemaOption(item.value)
      //     options.push({
      //       label: `[index] ${item.name}: ${key}`,
      //       value: item.name
      //     })
      //   }
      // }
      // this.schema = options[0]
      return options
    }
  },
  watch: {
    tableName(val) {
      this.describeTable(val)
      this.tableItems = []
    },
    schemaOptions: function(newValue, oldValue) {
      this.schemaIndex = '0'
    },
    schemaIndex: function(newValue, oldValue) {
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
    }
  },
  methods: {
    describeTable(tableName) {
      const table = {}
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
        table['Table Name'] = data.TableName
        table['Primary Partition Key'] = `${HashKey} (${HashType})`
        table['Primary Sort Key'] = `${RangeKey} (${RangeType})`
        table['Table Status'] = data.TableStatus
        table['Item Count'] = data.ItemCount
        table['Read Capacity'] = data.ProvisionedThroughput.ReadCapacityUnits
        table['Write Capacity'] = data.ProvisionedThroughput.WriteCapacityUnits
        table['Table Arm'] = data.TableArn
        table['Table Size Bytes'] = data.TableSizeBytes

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
        console.log(this.itemSearch)
        this.tableDetails = table
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
    async dynamodbQuery(type) {
      const validResult = await this.$refs.itemSearch.validate()
      if (!validResult) {
        return
      }
      const hkv = {}
      const index = type === 'next' ? this.startIndex : this.startIndex - 2

      hkv[this.itemSearch.hk.type] = this.itemSearch.hk.value
      const params = {
        TableName: this.tableName,
        // IndexName: this.tableIndex[parseInt(this.schemaIndex)].indexName,
        KeyConditionExpression: '#hk = :hkv',
        ExpressionAttributeNames: {
          '#hk': this.itemSearch.hk.name
        },
        ExpressionAttributeValues: {
          ':hkv': hkv
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

        const rkv = {}
        rkv[this.itemSearch.rk.type] = this.itemSearch.rk.value
        params.ExpressionAttributeValues[':rkv'] = rkv
        if (this.itemSearch.rk.calculate === 'BETWEEN') {
          params.KeyConditionExpression += ' and :rkv2'
          const rkv2 = {}
          rkv2[this.itemSearch.rk.type] = this.itemSearch.rk.behindValue
          params.ExpressionAttributeValues[':rkv2'] = rkv2
        }
      }
      if (this.tableIndex[parseInt(this.schemaIndex)].type === 'Index') {
        params.IndexName = this.tableIndex[parseInt(this.schemaIndex)].indexName
      }
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
    // doc client query
    async query(type) {
      const validResult = await this.$refs.itemSearch.validate()
      if (!validResult) {
        return
      }
      const index = type === 'next' ? this.startIndex : this.startIndex - 2

      const params = {
        TableName: this.tableName,
        // IndexName: this.tableIndex[parseInt(this.schemaIndex)].indexName,
        KeyConditionExpression: '#hk = :hkey',
        ExpressionAttributeNames: {
          '#hk': this.itemSearch.hk.name
        },
        ExpressionAttributeValues: {
          ':hkey': parseInt(this.itemSearch.hk.value)
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

        const rkv = {}
        rkv[this.itemSearch.rk.type] = this.itemSearch.rk.value
        params.ExpressionAttributeValues[':rkv'] = rkv
        if (this.itemSearch.rk.calculate === 'BETWEEN') {
          params.KeyConditionExpression += ' and :rkv2'
          const rkv2 = {}
          rkv2[this.itemSearch.rk.type] = this.itemSearch.rk.behindValue
          params.ExpressionAttributeValues[':rkv2'] = rkv2
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
      this.tableHeaders = []
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
