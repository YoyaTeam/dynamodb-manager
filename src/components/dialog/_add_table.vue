<template>
  <div id="add-table">
    <el-dialog id="create-table" :close-on-click-modal="false" style="text-align:left" :title="$t('table.create_table_dialog.title')" :visible.sync="add_table_dialogVisible" width="55%" @closed="close">
      <el-form :model="tableSchema" ref="tableSchemaRuleForm" :show-message="false" size="mini" label-position="right" label-width="120px">
        <el-form-item :label="$t('table.create_table_dialog.field_table_name')" prop="tableName" required>
          <el-col :span="10">
            <el-input v-model="tableSchema.tableName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('table.index.table_header_partition_key')" prop="partitionKey" required>
          <el-row>
            <el-col :span="10">
              <el-input v-model="tableSchema.partitionKey"></el-input>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-select v-model="tableSchema.partitionKeyType" placeholder="type">
                <el-option v-for="item in dataTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;margin-top: -10px;">
          <el-checkbox v-model="tableSchema.hasSortKey">{{$t('table.create_table_dialog.button_add_sort_key')}}</el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('table.index.table_header_sort_key')" prop="sortKey" v-show="tableSchema.hasSortKey">
          <el-row>
            <el-col :span="10">
              <el-input v-model="tableSchema.sortKey"></el-input>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-select v-model="tableSchema.sortKeyType" placeholder="type">
                <el-option v-for="item in dataTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('table.create_table_dialog.field_second_index')">
          <el-button type="primary" @click="openAddIndexDialog" :disabled="secondIndex.length >= 5 || $utils.isEmpty(tableSchema.partitionKey)">{{$t('table.create_table_dialog.button_add_index')}}</el-button>
          <el-table :data="secondIndex" style="width: 100%" size="mini">
            <el-table-column prop="indexName" :label="$t('table.index.table_header_name')">
            </el-table-column>
            <el-table-column prop="indexType" :label="$t('table.index.table_header_type')">
            </el-table-column>
            <el-table-column prop="partitionKey" :label="$t('table.index.table_header_partition_key')">
              <template slot-scope="scope">
                {{ scope.row.partitionKey + ' (' + scope.row.partitionKeyType + ')' }}
              </template>
            </el-table-column>
            <el-table-column prop="sortKey" :label="$t('table.index.table_header_sort_key')">
              <template slot-scope="scope">
                {{ scope.row.sortKey }}
                <span v-show="scope.row.sortKey">({{ scope.row.sortKeyType }})</span>
              </template>
            </el-table-column>
            <el-table-column prop="projectionType" :label="$t('table.index.table_header_projection_type')">
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="indexHandleDelete(scope.$index, scope.row)">delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="createTable(tableSchema, secondIndex)">{{$t('table.table_list.button_create_table')}}</el-button>
      </span>
    </el-dialog>
    <add-index :dialogVisible="add_index_dialogVisible" @indexDialogClose="indexDialogClose" @addIndex="addIndex" :allowLSI="true && $utils.isNotEmpty(tableSchema.sortKey)" :tableHashKey="tableSchema.partitionKey" :tableHashKeyType="tableSchema.partitionKeyType"></add-index>
  </div>
</template>

<script>
import { DYNAMODB_KEY_TYPE } from '@/constants'
import AddIndex from '@/components/dialog/_add_index'
export default {
  components: {
    AddIndex
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isShow(val) {
      this.add_table_dialogVisible = val
      this.init()
    }
  },
  data() {
    return {
      tableSchema: {
        tableName: '',
        partitionKey: '',
        partitionKeyType: 'S',
        hasSortKey: false,
        sortKey: '',
        sortKeyType: 'S',
        provisionedThroughput: {
          readCapacityUnits: 5,
          writeCapacityUnits: 5
        }
      },
      secondIndex: [],
      add_table_dialogVisible: this.isShow,
      add_index_dialogVisible: false,
      dataTypes: DYNAMODB_KEY_TYPE
    }
  },
  methods: {
    init() {
      this.tableSchema = {
        tableName: '',
        partitionKey: '',
        partitionKeyType: 'S',
        hasSortKey: false,
        sortKey: '',
        sortKeyType: 'S',
        provisionedThroughput: {
          readCapacityUnits: 5,
          writeCapacityUnits: 5
        }
      }
      this.secondIndex = []
      if (this.$refs.tableSchemaRuleForm) {
        this.$refs.tableSchemaRuleForm.resetFields()
      }
    },
    close() {
      this.$emit('addTableClose')
    },
    indexHandleDelete(index, row) {
      this.secondIndex.splice(index, 1)
    },
    openAddIndexDialog() {
      this.add_index_dialogVisible = true
    },
    createTable(tableSchema, secondIndex) {
      this.$refs.tableSchemaRuleForm.validate(valid => {
        if (valid) {
          var params = {
            TableName: tableSchema.tableName,
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5
            },
            KeySchema: [
              {
                AttributeName: tableSchema.partitionKey,
                KeyType: 'HASH'
              }
            ],
            AttributeDefinitions: [
              {
                AttributeName: tableSchema.partitionKey,
                AttributeType: tableSchema.partitionKeyType
              }
            ]
          }
          if (
            tableSchema.hasSortKey &&
            this.$utils.isNotEmpty(tableSchema.sortKey)
          ) {
            params.KeySchema.push({
              AttributeName: tableSchema.sortKey,
              KeyType: 'RANGE'
            })
            params.AttributeDefinitions.push({
              AttributeName: tableSchema.sortKey,
              AttributeType: tableSchema.sortKeyType
            })
          }

          if (this.$utils.isNotEmpty(secondIndex)) {
            secondIndex.forEach((value, index) => {
              var si = {
                IndexName: value.indexName,
                Projection: {
                  ProjectionType: value.projectionType
                },
                ProvisionedThroughput: {
                  ReadCapacityUnits: 5,
                  WriteCapacityUnits: 5
                },
                KeySchema: [
                  {
                    AttributeName: value.partitionKey,
                    KeyType: 'HASH'
                  }
                ]
              }
              if (this.$utils.isNotEmpty(value.nonKeyAttributes)) {
                si.Projection.NonKeyAttributes = value.nonKeyAttributes
              }
              this.addAttributeDefinitions(
                params.AttributeDefinitions,
                value.partitionKey,
                value.partitionKeyType
              )
              if (value.hasSortKey && this.$utils.isNotEmpty(value.sortKey)) {
                si.KeySchema.push({
                  AttributeName: value.sortKey,
                  KeyType: 'RANGE'
                })
                this.addAttributeDefinitions(
                  params.AttributeDefinitions,
                  value.sortKey,
                  value.sortKeyType
                )
              }
              if (value.indexType === 'GSI') {
                if (this.$utils.isEmpty(params.GlobalSecondaryIndexes)) {
                  params.GlobalSecondaryIndexes = []
                }
                params.GlobalSecondaryIndexes.push(si)
              } else if (value.indexType === 'LSI') {
                if (value.partitionKey !== tableSchema.partitionKey || value.partitionKeyType !== tableSchema.partitionKeyType) {
                  this.$message.warning(`The partitionKey of index ${value.indexName} is not match table's partitionKey`)
                  return
                }
                if (this.$utils.isEmpty(params.LocalSecondaryIndexes)) {
                  params.LocalSecondaryIndexes = []
                }
                delete si.ProvisionedThroughput
                params.LocalSecondaryIndexes.push(si)
              }
            })
          }
          this.$emit('createdTable', params)
          console.log(params)
        } else {
          return false
        }
      })
    },
    addAttributeDefinitions(
      attributeDefinitions,
      attributeName,
      attributeType
    ) {
      for (var i = 0; i < attributeDefinitions.length; i++) {
        if (attributeDefinitions[i].AttributeName === attributeName) {
          return false
        }
      }
      attributeDefinitions.push({
        AttributeName: attributeName,
        AttributeType: attributeType
      })
    },
    indexDialogClose() {
      this.add_index_dialogVisible = false
    },
    addIndex(index) {
      console.log(index)
      for (let entry of this.secondIndex) {
        if (entry.indexName === index.indexName) {
          this.$message.warning(`index ${index.indexName} already exist!`)
          return
        }
      }
      this.secondIndex.push(index)
      this.add_index_dialogVisible = false
    }
  }
}
</script>
