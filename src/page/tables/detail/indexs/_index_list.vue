<template>
    <div id="index-list">
        <div class="gsi-index-list">
        <h3>{{$t('table.index.title_gsi_index')}}</h3>
        <el-table :data="indexes.filter(index => index.type === 'GSI Index')" style="width: 100%;margin-top:10px;" size="mini" stripe highlight-current-row @current-change="handleIndexSelectionChange">
            <el-table-column prop="indexName" :label="$t('table.index.table_header_name')" width="200">
            </el-table-column>
            <el-table-column prop="type" :label="$t('table.index.table_header_type')">
            </el-table-column>
            <el-table-column prop="hashKey" :label="$t('table.index.table_header_partition_key')">
                <template slot-scope="scope">
                    {{ `${scope.row.keySchema.hashKey} (${scope.row.keySchema.hashKeyType})` }}
                </template>
            </el-table-column>
            <el-table-column prop="rangeKey" :label="$t('table.index.table_header_sort_key')">
                <template slot-scope="scope">
                    {{ `${scope.row.keySchema.rangeKey} ${scope.row.keySchema.rangeKeyType ? '(' + scope.row.keySchema.rangeKeyType + ')' : scope.row.keySchema.rangeKeyType}` }}
                </template>
            </el-table-column>
            <el-table-column prop="projectionType" :label="$t('table.index.table_header_projection_type')">
                <template slot-scope="scope">
                    {{ scope.row.projection.projectionType }}
                    <el-tooltip placement="top" v-if="scope.row.projection.projectionType === 'INCLUDE'">
                        <div slot="content">{{ scope.row.projection.nonKeyAttributes.join(', ') }}</div>
                        <i class="fa fa-info-circle"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('table.index.table_header_index_status')">
            </el-table-column>
        </el-table>
        </div>
        <div class="local-index-list">
            <h3>{{$t('table.index.title_lsi_index')}}</h3>
            <el-table :data="indexes.filter(index => index.type !== 'GSI Index')" style="width: 100%;margin-top:10px;" size="mini" stripe>
                <el-table-column prop="indexName" :label="$t('table.index.table_header_name')" width="200">
                </el-table-column>
                <el-table-column prop="type" :label="$t('table.index.table_header_type')">
                </el-table-column>
                <el-table-column prop="hashKey" :label="$t('table.index.table_header_partition_key')">
                    <template slot-scope="scope">
                        {{ `${scope.row.keySchema.hashKey} (${scope.row.keySchema.hashKeyType})` }}
                    </template>
                </el-table-column>
                <el-table-column prop="rangeKey" :label="$t('table.index.table_header_sort_key')">
                    <template slot-scope="scope">
                        {{ `${scope.row.keySchema.rangeKey} ${scope.row.keySchema.rangeKeyType ? '(' + scope.row.keySchema.rangeKeyType + ')' : scope.row.keySchema.rangeKeyType}` }}
                    </template>
                </el-table-column>
                <el-table-column prop="projectionType" :label="$t('table.index.table_header_projection_type')">
                    <template slot-scope="scope">
                        {{ scope.row.projection.projectionType }}
                        <el-tooltip placement="top" v-if="scope.row.projection.projectionType === 'INCLUDE'">
                            <div slot="content">{{ scope.row.projection.nonKeyAttributes.join(', ') }}</div>
                            <i class="fa fa-info-circle"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="status" :label="$t('table.index.table_header_index_status')">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    indexes: {
      type: Array,
      default: () => {}
    }
  },
  methods: {
    handleIndexSelectionChange(val) {
      this.currentRow = val
      this.$emit('handleChange', val)
    }
  }
}
</script>

<style>
#index-list .local-index-list {
  margin-top: 50px;
}
</style>
