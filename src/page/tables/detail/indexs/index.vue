<template>
  <div id="table-index">
    <el-row style="margin:10px 0">
      <el-button size="mini" type="success" @click="openIndexDialog">{{$t('table.index.button_created_index')}}</el-button>
      <el-button size="mini" type="warning" @click="deleteIndex(currentRow)" :disabled="currentRow === ''">{{$t('table.index.button_delete_index')}}</el-button>
    </el-row>
    <index-list :indexes="indexes" @handleChange="handleChange"></index-list>
    <add-index :dialogVisible="add_index_dialogVisible" @indexDialogClose="indexDialogClose" @addIndex="addIndex"></add-index>
  </div>
</template>

<script>
import IndexList from './_index_list'
import AddIndex from '@/components/dialog/_add_index'
export default {
  components: {
    IndexList,
    AddIndex
  },
  data() {
    return {
      indexes: [],
      currentRow: '',
      add_index_dialogVisible: false
    }
  },
  methods: {
    autoInit() {
      console.log('index init')
      this.tableRefreshFinished()
    },
    tableRefreshFinished() {
      this.indexes = this.$tableSchema.tableIndex
      console.log(this.indexes)
    },
    handleChange(val) {
      this.currentRow = val
      console.log(this.currentRow)
    },
    openIndexDialog() {
      this.add_index_dialogVisible = true
    },
    addIndex(tableIndex) {
      console.log(tableIndex)
      for (let entry of this.$tableSchema.tableIndex) {
        if (entry.indexName === tableIndex.indexName) {
          this.$message.warning(this.$t('message.failure.index_exist').replace('{index_name}', tableIndex.indexName))
          return
        }
      }
      var attributeDefinitions = this.$utils.clone(
        this.$tableSchema.AttributeDefinitions
      )
      var keySchema = [
        {
          AttributeName: tableIndex.partitionKey,
          KeyType: 'HASH'
        }
      ]
      if (
        !this.validAndAddAttributeDefinitions(
          attributeDefinitions,
          tableIndex.partitionKey,
          tableIndex.partitionKeyType
        )
      ) {
        return
      }
      if (tableIndex.hasSortKey) {
        if (
          !this.validAndAddAttributeDefinitions(
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
        TableName: this.$tableSchema.tableName,
        AttributeDefinitions: attributeDefinitions,
        GlobalSecondaryIndexUpdates: [
          {
            Create: {
              IndexName: tableIndex.indexName,
              KeySchema: keySchema,
              Projection: {
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
      if (tableIndex.projectionType === 'INCLUDE') {
        params.GlobalSecondaryIndexUpdates[0].Create.Projection.NonKeyAttributes =
          tableIndex.nonKeyAttributes
      }
      console.log(params)
      this.$dynamodb.updateTable(params, res => {
        this.$message.success(this.$t('message.success.add_index').replace('{index_name}', tableIndex.indexName))
        this.add_index_dialogVisible = false
        this.$tableSchema.schema = res.data.TableDescription
        this.autoInit()
      })
    },
    deleteIndex(tableIndex) {
      this.$prompt(
        this.$t('confirm.delete_index').replace('{index_name}', tableIndex.indexName),
        this.$t('confirm.title'),
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('confirm.button_yes'),
          cancelButtonText: this.$t('confirm.button_cancel')
        }
      )
        .then(({ value }) => {
          if (value !== tableIndex.indexName) {
            this.$message.warning(this.$t('message.failure.delete_index'))
            return
          }
          var params = {
            TableName: this.$tableSchema.tableName,
            [`${tableIndex.type === 'GSI Index' ? 'GlobalSecondaryIndexUpdates' : 'LocalSecondaryIndexUpdates'}`]: [
              {
                Delete: {
                  IndexName: tableIndex.indexName
                }
              }
            ]
          }
          this.$dynamodb.updateTable(params, res => {
            this.$message.success(this.$t('message.success.delete_index').replace('{index_name}', tableIndex.indexName))
            console.log(res)
            this.$tableSchema.schema = res.data.TableDescription
            this.autoInit()
          })
        })
        .catch(() => {
          this.$message.info('Cancelled')
        })
    },
    validAndAddAttributeDefinitions(
      attributeDefinitions,
      attributeName,
      attributeType
    ) {
      const sames = attributeDefinitions.filter(attributeDefinition => attributeDefinition.AttributeName === attributeName)
      console.log(sames)
      if (sames.length === 0) {
        attributeDefinitions.push({
          AttributeName: attributeName,
          AttributeType: attributeType
        })
      } else {
        if (sames[0].AttributeName === attributeName &&
          sames[0].AttributeType !== attributeType) {
          this.$message.warning(
            this.$t('message.failure.attribute_name_not_match').replace('{attribute_name}', attributeName)
          )
          return false
        }
      }
      return true
    },
    indexDialogClose() {
      this.add_index_dialogVisible = false
    }
  }
}
</script>
