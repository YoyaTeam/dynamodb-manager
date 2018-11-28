<template>
  <div id="search-params">
    <el-row :gutter="10" class="search-header">
      <el-col :span="3">
        <el-select v-model="method">
          <el-option :label="$t('table.item_search.search_type_scan')" value="Scan">
          </el-option>
          <el-option :label="$t('table.item_search.search_type_query')" value="Query">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="21">
        <el-select v-model="indexSelected" placeholder="please select...">
          <el-option-group v-for="group in tableGroupIndex" :key="group.type" :label="group.type">
            <el-option v-for="item in group.datas" :key="item.indexName" :label="`[${item.type}] ${item.indexName}: ${item.keySchema.hashKey}${item.keySchema.rangeKey ? ', ' + item.keySchema.rangeKey : ''}`" :value="item.indexName">
            </el-option>
          </el-option-group>
        </el-select>
      </el-col>
    </el-row>
    <!-- key search params -->
    <el-row :gutter="10">
      <el-col>
        <el-form :model="keySearchParams" ref="keySearchParamsForm" :show-message="false" label-position="right" label-width="12.5%" size="mini" v-show="method === 'Query' && indexSelected">
          <el-form-item :label="$t('table.item_search.label_partition_key')" prop="hashKeyParams.value" required>
            <el-row :gutter="10">
              <el-col :span="5">
                <span class="disabled">{{ keySearchParams.hashKeyParams.name }}</span>
              </el-col>
              <el-col :span="3">
                <span class="disabled">{{ keySearchParams.hashKeyParams.type }}</span>
              </el-col>
              <el-col :span="4">
                <span class="disabled">{{ keySearchParams.hashKeyParams.calculate }}</span>
              </el-col>
              <el-col :span="11">
                <el-input v-model="keySearchParams.hashKeyParams.value" :placeholder="$t('table.item_search.placeholder_entry_value')"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('table.item_search.label_sort_key')" prop="rangeKeyParams.value" v-show="keySearchParams.rangeKeyParams.name">
            <el-row :gutter="10">
              <el-col :span="5">
                <span class="disabled">{{ keySearchParams.rangeKeyParams.name }}</span>
              </el-col>
              <el-col :span="3">
                <span class="disabled">{{ keySearchParams.rangeKeyParams.type }}</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="keySearchParams.rangeKeyParams.calculate">
                  <el-option v-for="item in rangeKeyDataTypecClculates[keySearchParams.rangeKeyParams.type]" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="11" v-if="keySearchParams.rangeKeyParams.calculate !== 'Between'">
                <el-input v-model="keySearchParams.rangeKeyParams.value" :placeholder="$t('table.item_search.placeholder_entry_value')"></el-input>
              </el-col>
              <el-col :span="11" v-else>
                <el-row>
                  <el-col :span="10">
                    <el-input v-model="keySearchParams.rangeKeyParams.value" :placeholder="$t('table.item_search.placeholder_entry_value')"></el-input>
                  </el-col>
                  <el-col :span="4" style="text-align:center;">
                    <span> And </span>
                  </el-col>
                  <el-col :span="10">
                    <el-input v-model="keySearchParams.rangeKeyParams.behindValue" :placeholder="$t('table.item_search.placeholder_entry_value')"></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- filter search params -->
    <el-row :gutter="10">
      <el-col>
        <el-form :model="filterSearchParams" label-position="right" label-width="12.5%" size="mini">
          <el-form-item v-for="(filter, index) in filterSearchParams.filters" :key="index" :label="index === 0 ? $t('table.item_search.search_filter') : $t('table.item_search.search_filter_relate')">
            <el-row :gutter="10">
              <el-col :span="5" style="padding-left:0px;">
                <!-- <el-input v-model="filter.name" :placeholder="$t('table.item_search.placeholder_enter_attribute')" required></el-input> -->
                <el-autocomplete class="inline-input" v-model="filter.name" :fetch-suggestions="querySearch" :placeholder="$t('table.item_search.placeholder_enter_attribute')" required></el-autocomplete>
              </el-col>
              <el-col :span="3">
                <el-select v-model="filter.type" @change="filter.calculate = dataTypeCalculate[filter.type][0]">
                  <el-option v-for="item in dataTypes" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-select v-model="filter.calculate">
                  <el-option v-for="item in dataTypeCalculate[filter.type]" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="11" v-if="filter.calculate !== 'Between'" v-show="['Exists', 'Not exists'].indexOf(filter.calculate) === -1">
                <el-input v-model="filter.value" :placeholder="$t('table.item_search.placeholder_entry_value')"></el-input>
              </el-col>
              <el-col :span="11" v-else v-show="['Exists', 'Not exists'].indexOf(filter.calculate) === -1">
                <el-row>
                  <el-col :span="10">
                    <el-input v-model="filter.value" :placeholder="$t('table.item_search.placeholder_entry_value')"></el-input>
                  </el-col>
                  <el-col :span="4" style="text-align:center;">
                    <span> And </span>
                  </el-col>
                  <el-col :span="10">
                    <el-input v-model="filter.behindValue" :placeholder="$t('table.item_search.placeholder_entry_value')"></el-input>
                  </el-col>
                </el-row>
              </el-col>
              <i class="fa fa-minus-square pointer" @click="removeFilter(filterSearchParams, filter)"></i>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :offset="3">
        <i class="fa fa-plus-square pointer" @click="addFilter(filterSearchParams)"> {{$t('table.item_search.search_add_filter')}}</i>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="21" :offset="3" class="divide-line">
      </el-col>
    </el-row>
    <!-- sort -->
    <el-row :gutter="10" v-show="method === 'Query'">
      <el-col>
        <el-form :model="extraParams" label-position="right" label-width="12.5%" size="mini">
          <el-form-item :label="$t('table.item_search.label_extra_sort')">
            <el-radio v-model="extraParams.scanIndexForward" :label="true">{{$t('table.item_search.sort_ascending')}}</el-radio>
            <el-radio v-model="extraParams.scanIndexForward" :label="false">{{$t('table.item_search.sort_descending')}}</el-radio>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row v-show="method === 'Query'">
      <el-col :span="21" :offset="3" class="divide-line">
      </el-col>
    </el-row>
    <!-- button -->
    <el-row :gutter="10">
      <el-col :span="8" :offset="3">
        <el-button type="primary" :disabled="isSearching" @click="search"><i class="el-icon-loading" v-show="isSearching"></i> {{$t('table.item_search.button_start_search')}}</el-button>
        <el-button type="text" @click="reset">{{$t('table.item_search.button_cancel_change')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  DYNAMODB_DATA_TYPE,
  DYNAMODB_DATA_TYPE_MAP,
  DYNAMODB_RABGE_KEY_TYPE_CALCULATE,
  DYNAMODB_DATA_TYPE_CALCULATE
} from '@/constants'
export default {
  props: {
    tableSchema: {
      type: Object,
      default: () => {}
    },
    limit: {
      type: Number,
      default: 100
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isSearching: false,
      method: 'Scan',
      tableGroupIndex: '',
      indexSelected: '',
      keySearchParams: {
        hashKeyParams: {
          name: '',
          type: '',
          calculate: '=',
          value: ''
        },
        rangeKeyParams: {
          name: '',
          type: '',
          calculate: '=',
          value: '',
          behindValue: ''
        }
      },
      filterSearchParams: {
        filters: []
      },
      defaultFilter: {
        type: DYNAMODB_DATA_TYPE[0],
        calculate: DYNAMODB_DATA_TYPE_CALCULATE[DYNAMODB_DATA_TYPE[0]][0]
      },
      extraParams: {
        scanIndexForward: true
      },
      dataTypes: DYNAMODB_DATA_TYPE,
      dataTypeCalculate: DYNAMODB_DATA_TYPE_CALCULATE,
      rangeKeyDataTypecClculates: DYNAMODB_RABGE_KEY_TYPE_CALCULATE
    }
  },
  watch: {
    tableSchema: {
      handler(tableSchema) {
        this.init()
        this.refreshGroupIndex(tableSchema.tableIndex)
      },
      deep: true
    },
    indexSelected: {
      handler(val) {
        if (val) {
          let indexSchema = this.tableSchema.tableIndex.filter(
            index => index.indexName === val
          )[0].keySchema
          this.keySearchParams = {
            hashKeyParams: {
              name: indexSchema.hashKey,
              type: DYNAMODB_DATA_TYPE_MAP[indexSchema.hashKeyType],
              calculate: '='
            },
            rangeKeyParams: {
              name: indexSchema.rangeKey,
              type: DYNAMODB_DATA_TYPE_MAP[indexSchema.rangeKeyType],
              calculate: '='
            }
          }
        }
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.filterSearchParams.filters = []
    },
    refreshGroupIndex(tableIndex) {
      var groupIndex = []
      var map = {}
      for (let index of tableIndex) {
        if (!map[index.type]) {
          groupIndex.push({
            type: index.type,
            datas: [index]
          })
          map[index.type] = index
        } else {
          groupIndex.forEach(group => {
            if (group.type === index.type) {
              group.datas.push(index)
            }
          })
        }
      }
      this.tableGroupIndex = groupIndex
      if (this.tableGroupIndex.length > 0) {
        this.indexSelected = this.tableGroupIndex[0].datas[0].indexName
      }
      this.$emit('updateGroupIndex', groupIndex)
    },
    addFilter(filterSearchParams) {
      filterSearchParams.filters.push(this.$utils.clone(this.defaultFilter))
    },
    removeFilter(filterSearchParams, filter) {
      let index = filterSearchParams.filters.indexOf(filter)
      if (index !== -1) {
        filterSearchParams.filters.splice(index, 1)
      }
    },
    reset() {
      this.filterSearchParams.filters = []
      this.keySearchParams.hashKeyParams.value = ''
      this.keySearchParams.rangeKeyParams.calculate = '='
      this.keySearchParams.rangeKeyParams.value = ''
    },
    searchStart() {
      this.isSearching = true
    },
    searchFinished() {
      this.isSearching = false
    },
    search() {
      this.$emit('initSearch')
      this.exclusiveStartKeys = ''
      this[this.method]()
    },
    Scan() {
      var params = {
        Limit: this.limit,
        TableName: this.tableSchema.tableName,
        ReturnConsumedCapacity: 'INDEXES'
      }
      if (this.indexSelected !== this.tableSchema.tableName) {
        params['IndexName'] = this.indexSelected
      }
      for (let index in this.filterSearchParams.filters) {
        let filter = this.filterSearchParams.filters[index]
        // filter value can not be empty
        if (
          this.$utils.isEmpty(filter.name) ||
          (this.$utils.isEmpty(filter.value) &&
            ['Exists', 'Not exists'].indexOf(filter.calculate) === -1) ||
          (filter.calculate === 'Between' &&
            this.$utils.isEmpty(filter.behindValue))
        ) {
          this.$message.warning(this.$t('message.failure.filter'))
          return
        }
        let expression = this.buildExpression(filter, index)
        params.FilterExpression =
          (params.FilterExpression ? `${params.FilterExpression} and ` : '') +
          expression.Expression
        params.ExpressionAttributeNames = Object.assign(
          params.ExpressionAttributeNames || {},
          expression.ExpressionAttributeNames
        )
        if (this.$utils.isNotEmpty(expression.ExpressionAttributeValues)) {
          params.ExpressionAttributeValues = Object.assign(
            params.ExpressionAttributeValues || {},
            expression.ExpressionAttributeValues
          )
        }
      }
      this.$emit('search', params, 'scan')
      console.log(params)
    },
    async Query() {
      const validResult = await this.$refs.keySearchParamsForm.validate()
      if (!validResult) {
        return
      }
      var params = {
        Limit: this.limit,
        TableName: this.tableSchema.tableName,
        ReturnConsumedCapacity: 'INDEXES',
        ScanIndexForward: this.extraParams.scanIndexForward
      }
      if (this.indexSelected !== this.tableSchema.tableName) {
        params['IndexName'] = this.indexSelected
      }
      for (let index in this.filterSearchParams.filters) {
        let filter = this.filterSearchParams.filters[index]
        // filter value can not be empty
        if (
          this.$utils.isEmpty(filter.name) ||
          (this.$utils.isEmpty(filter.value) &&
            ['Exists', 'Not exists'].indexOf(filter.calculate) === -1) ||
          (filter.calculate === 'Between' &&
            this.$utils.isEmpty(filter.behindValue))
        ) {
          this.$message.warning(this.$t('message.failure.filter'))
          return
        }
        let expression = this.buildExpression(filter, index)
        params.FilterExpression =
          (params.FilterExpression ? `${params.FilterExpression} and ` : '') +
          expression.Expression
        params.ExpressionAttributeNames = Object.assign(
          params.ExpressionAttributeNames || {},
          expression.ExpressionAttributeNames
        )
        if (this.$utils.isNotEmpty(expression.ExpressionAttributeValues)) {
          params.ExpressionAttributeValues = Object.assign(
            params.ExpressionAttributeValues || {},
            expression.ExpressionAttributeValues
          )
        }
      }
      let keyFilters = [
        this.keySearchParams.hashKeyParams,
        this.keySearchParams.rangeKeyParams
      ]
      for (let index in keyFilters) {
        let filter = keyFilters[index]
        console.log(filter)
        if (this.$utils.isNotEmpty(filter.value)) {
          let expression = this.buildExpression(
            filter,
            index + this.filterSearchParams.filters.length
          )
          params.KeyConditionExpression =
            (params.KeyConditionExpression
              ? `${params.KeyConditionExpression} and `
              : '') + expression.Expression
          params.ExpressionAttributeNames = Object.assign(
            params.ExpressionAttributeNames || {},
            expression.ExpressionAttributeNames
          )
          if (this.$utils.isNotEmpty(expression.ExpressionAttributeValues)) {
            params.ExpressionAttributeValues = Object.assign(
              params.ExpressionAttributeValues || {},
              expression.ExpressionAttributeValues
            )
          }
        }
      }
      this.$emit('search', params, 'query')
      console.log(params)
    },
    buildExpression(filter, index) {
      var expression = ''
      var expressionAttributeNames = {}
      var expressionAttributeValues = {}
      if (filter.calculate === 'Between') {
        expression = `#name${index} between :value${index} and :valueB${index}`
        expressionAttributeNames[`#name${index}`] = filter.name
        expressionAttributeValues[`:value${index}`] =
          filter.type === 'Number' ? parseInt(filter.value) : filter.value
        expressionAttributeValues[`:valueB${index}`] =
          filter.type === 'Number'
            ? parseInt(filter.behindValue)
            : filter.behindValue
      } else if (filter.calculate === 'Begins with') {
        expression = `begins_with(#name${index}, :value${index})`
        expressionAttributeNames[`#name${index}`] = filter.name
        expressionAttributeValues[`:value${index}`] = filter.value
      } else if (filter.calculate === 'Exists') {
        expression = `attribute_exists(#name${index})`
        expressionAttributeNames[`#name${index}`] = filter.name
      } else if (filter.calculate === 'Not exists') {
        expression = `attribute_not_exists(#name${index})`
        expressionAttributeNames[`#name${index}`] = filter.name
      } else if (filter.calculate === 'Contains') {
        expression = `contains(#name${index}, :value${index})`
        expressionAttributeNames[`#name${index}`] = filter.name
        expressionAttributeValues[`:value${index}`] = filter.value
      } else if (filter.calculate === 'Not contains') {
        expression = `NOT contains(#name${index}, :value${index})`
        expressionAttributeNames[`#name${index}`] = filter.name
        expressionAttributeValues[`:value${index}`] = filter.value
      } else {
        expression = `#name${index} ${filter.calculate} :value${index}`
        expressionAttributeNames[`#name${index}`] = filter.name
        expressionAttributeValues[`:value${index}`] =
          filter.type === 'Number' ? parseInt(filter.value) : filter.value
      }

      return {
        Expression: expression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      }
    },
    querySearch(queryString, cb) {
      var items = this.loadItems()
      var results = queryString
        ? items.filter(this.createFilter(queryString))
        : items
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return item => {
        console.log(item)
        return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    loadItems() {
      var options = []
      this.items.forEach(item => {
        options.push({
          label: item,
          value: item
        })
      })
      return options
    }
  }
}
</script>

<style lang="sass">
#search-params .el-select
  width: 100%
#search-params .search-header
  margin-bottom: 10px
#search-params .el-row .disabled
  color: #909399
#search-params .divide-line
  margin-top: 10px
  margin-bottom: 10px
  border-top: 1px solid #dcdfe6
</style>
