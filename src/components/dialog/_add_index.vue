<template>
<el-dialog id="add-index" :close-on-click-modal="false" style="text-align:left" :title="$t('table.create_table_dialog.button_add_index')" :visible.sync="isShow" width="40%" @closed="close">
  <el-form :model="tableIndex" ref="addIndexRuleForm" label-position="right" label-width="150px" size="mini" :show-message="false">
    <el-form-item :label="$t('table.index.table_header_partition_key')" prop="partitionKey" required>
      <el-row>
        <el-col :span="17">
          <el-input v-model="tableIndex.partitionKey" :disabled="tableIndex.indexType === 'LSI'"></el-input>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-select v-model="tableIndex.partitionKeyType" placeholder="type" :disabled="tableIndex.indexType === 'LSI'">
            <el-option v-for="item in dataTypes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item style="margin-bottom: 0px;margin-top: -10px;">
      <el-checkbox v-model="tableIndex.hasSortKey">{{$t('table.create_table_dialog.button_add_sort_key')}}</el-checkbox>
    </el-form-item>
    <el-form-item :label="$t('table.index.table_header_sort_key')" prop="sortKey" v-show="tableIndex.hasSortKey" :required="tableIndex.hasSortKey">
      <el-row>
        <el-col :span="17">
          <el-input v-model="tableIndex.sortKey"></el-input>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-select v-model="tableIndex.sortKeyType" placeholder="type">
            <el-option v-for="item in dataTypes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item :label="$t('table.create_table_dialog.field_index_name')" prop="indexName" required>
      <el-row>
        <el-col :span="17">
          <el-input v-model="tableIndex.indexName"></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item :label="$t('table.create_table_dialog.field_projected_attributes')" prop="projectionType">
      <el-row>
        <el-col :span="17">
          <el-select style="width:100%" v-model="tableIndex.projectionType" placeholder="type">
            <el-option v-for="item in projectionTypes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="" prop="nonKeyAttributes" required v-if="tableIndex.projectionType === 'INCLUDE'">
      <el-row>
        <el-col :span="17">
          <el-select style="width:100%" v-model="tableIndex.nonKeyAttributes" multiple filterable allow-create default-first-option placeholder="enter fields">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item style="margin-bottom: 0px;margin-top: -10px;">
      <el-checkbox :disabled="!allowLSI" v-model="tableIndex.indexType" true-label="LSI" false-label="GSI" @change="indexTypeChange">{{$t('table.create_table_dialog.button_as_lsi')}}</el-checkbox>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addIndex(tableIndex)">{{$t('table.create_table_dialog.button_add')}}</el-button>
        </span>
</el-dialog>
</template>

<script>
import {
  DYNAMODB_KEY_TYPE,
  DYNAMODB_PROJECTED_ATTRIBUTES
} from '@/constants'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    allowLSI: {
      type: Boolean,
      default: false
    },
    tableHashKey: {
      type: String,
      default: ''
    },
    tableHashKeyType: {
      type: String,
      default: 'S'
    }
  },
  watch: {
    dialogVisible(val) {
      this.isShow = val
      this.tableIndex = {
        partitionKey: '',
        partitionKeyType: 'S',
        hasSortKey: false,
        sortKey: '',
        sortKeyType: 'S',
        indexName: '',
        projectionType: 'ALL',
        nonKeyAttributes: [],
        provisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        },
        indexType: 'GSI'
      }
      if (this.$refs.addIndexRuleForm) {
        this.$refs.addIndexRuleForm.resetFields()
      }
    }
  },
  data() {
    return {
      isShow: false,
      tableIndex: {
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
      dataTypes: DYNAMODB_KEY_TYPE,
      projectionTypes: DYNAMODB_PROJECTED_ATTRIBUTES,
      options: []
    }
  },
  methods: {
    addIndex(tableIndex) {
      this.$refs.addIndexRuleForm.validate(valid => {
        if (valid) {
          let index = {
            indexName: tableIndex.indexName,
            indexType: tableIndex.indexType,
            partitionKey: tableIndex.partitionKey,
            partitionKeyType: tableIndex.partitionKeyType,
            hasSortKey: tableIndex.hasSortKey,
            sortKey: tableIndex.sortKey,
            sortKeyType: tableIndex.sortKeyType,
            projectionType: tableIndex.projectionType,
            nonKeyAttributes: tableIndex.nonKeyAttributes
          }
          this.$emit('addIndex', index)
        } else {
          return false
        }
      })
    },
    close() {
      this.$emit('indexDialogClose')
    },
    indexTypeChange(val) {
      if (val === 'LSI') {
        this.tableIndex.partitionKey = this.tableHashKey
        this.tableIndex.partitionKeyType = this.tableHashKeyType
      }
    }
  }
}
</script>
