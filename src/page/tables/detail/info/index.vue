<template>
  <div id="table-basic-info">
    <el-collapse accordion v-model="activeName">
      <el-collapse-item name="basic-info">
        <template slot="title">
          <span>{{$t('table.table_info.tab_basic_info')}}</span><i class="fa fa-info-circle"></i>
        </template>
        <basic-info :data="tableBasicInfo"></basic-info>
      </el-collapse-item>
      <el-collapse-item>
        <template slot="title">
          <span>{{$t('table.table_info.tab_table_schema')}}</span><i class="fa fa-clone" @click.stop="copySchema"></i>
        </template>
        <table-schema :tableJsonSchema="tableJsonSchema"></table-schema>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import BasicInfo from './_table_basic_info'
import TableSchema from './_table_schema'
export default {
  components: {
    BasicInfo,
    TableSchema
  },
  data() {
    return {
      tableBasicInfo: [],
      tableJsonSchema: {},
      activeName: 'basic-info'
    }
  },
  methods: {
    autoInit() {
      this.tableRefreshFinished()
    },
    tableRefreshFinished() {
      console.log('info init')
      if (this.$utils.isNotEmpty(this.$tableSchema.schema)) {
        this.refreshTableBasicInfo()
        this.refreshTableSchema()
      }
    },
    refreshTableSchema() {
      console.log('__________')
      const schema = this.$utils.clone(this.$tableSchema.schema)
      delete schema.TableStatus
      delete schema.CreationDateTime
      delete schema.ProvisionedThroughput.LastIncreaseDateTime
      delete schema.ProvisionedThroughput.LastDecreaseDateTime
      delete schema.ProvisionedThroughput.NumberOfDecreasesToday
      delete schema.TableSizeBytes
      delete schema.ItemCount
      delete schema.TableArn
      delete schema.TableId

      if (schema.GlobalSecondaryIndexes) {
        schema.GlobalSecondaryIndexes.forEach(gsi => {
          delete gsi.IndexStatus
          delete gsi.IndexSizeBytes
          delete gsi.ItemCount
          delete gsi.IndexArn
          delete gsi.ProvisionedThroughput.LastDecreaseDateTime
          delete gsi.ProvisionedThroughput.NumberOfDecreasesToday
        })
      }
      if (schema.LocalSecondaryIndexes) {
        schema.LocalSecondaryIndexes.forEach(lsi => {
          delete lsi.IndexStatus
          delete lsi.IndexSizeBytes
          delete lsi.ItemCount
          delete lsi.IndexArn
        })
      }
      this.tableJsonSchema = schema
    },
    refreshTableBasicInfo() {
      this.tableBasicInfo = [
        {
          key: 'Table name',
          value: this.$tableSchema.tableName
        },
        {
          key: 'Primary partition key',
          value: `${this.$tableSchema.hashKey} (${this.$tableSchema.hashKeyType})`
        },
        {
          key: 'Primary sort key',
          value: this.$utils.isNotEmpty(this.$tableSchema.rangeKey)
            ? `${this.$tableSchema.rangeKey} (${this.$tableSchema.rangeKeyType})`
            : '-'
        },
        {
          key: 'Table status',
          value: this.$tableSchema.tableStatus
        },
        {
          key: 'Creation date',
          value: this.$tableSchema.creationDateTime.toString()
        },
        {
          key: 'Item count',
          value: this.$tableSchema.itemCount
        },
        {
          key: 'Storage size (in bytes)',
          value: this.$tableSchema.storageSize
        },
        {
          key: 'Provisioned read capacity units',
          value: this.$tableSchema.readCapacityUnits
        },
        {
          key: 'Provisioned write capacity units',
          value: this.$tableSchema.writeCapacityUnits
        },
        {
          key: 'Last decrease time',
          value: this.$tableSchema.lastDecreaseDateTime
        },
        {
          key: 'Last increase time',
          value: this.$tableSchema.lastIncreaseDateTime
        },
        {
          key: 'Table Arm',
          value: this.$tableSchema.tableArn
        }
      ]
    },
    copySchema() {
      this.$copyText(JSON.stringify(this.tableJsonSchema, null, '\t')).then(
        res => {
          this.$message.success(this.$t('message.success.copy'))
        },
        err => {
          console.log(err)
          this.$message.error(this.$t('message.failure.copy'))
        }
      )
    }
  }
}
</script>

<style>
#table-basic-info {
  padding: 0 10px;
}
#table-basic-info .fa {
  margin-left: 5px;
}
.el-carousel__mask,
.el-cascader-menu,
.el-cascader-menu__item.is-disabled:hover,
.el-collapse-item__header,
.el-collapse-item__wrap {
  background-color: transparent !important;
}
</style>
