<template>
  <div id="config-list">
    <el-button size="mini" type="success" icon="el-icon-circle-plus" @click="handleAdd">{{$t('config.button_add_config')}}</el-button>
    <el-table :data="configs" v-loading="loading" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="alias" :label="$t('config.table_header_alias')">
      </el-table-column>
      <el-table-column :label="$t('config.table_header_endpoint')">
        <template slot-scope="scope">
          <i class="fa fa-rocket"></i>
          <span style="margin-left: 2px">{{ scope.row.endpoint }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('config.table_header_region')" width="100px">
        <template slot-scope="scope">
          <i class="fa fa-life-bouy"></i>
          <span style="margin-left: 2px">{{ scope.row.region }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('config.table_header_created_time')" width="230px">
        <template slot-scope="scope">
          <i class="fa fa-clock-o"></i>
          <span style="margin-left: 2px">{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('config.table_header_action')" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)"><i class="fa fa-edit"></i> {{$t('config.button_edit')}}</el-button>
          <el-button size="mini" type="warning" @click="handleDelete(scope.$index, scope.row)"><i class="fa fa-trash-o"></i> {{$t('config.button_remove')}}</el-button>
          <el-button size="mini" type="success" :disabled="isApplied(scope.row)" @click="handleApply(scope.$index, scope.row)"><i class="fa fa-bookmark"></i> {{$t('config.button_apply')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <config-dialog :config="currentConfig" :visible="configVisivle" @config-save="config_save" @close="configVisivle = false"></config-dialog>
  </div>
</template>

<script>
import ConfigDialog from '@/components/dialog/_dynamodb_config_dialog'
import {
  LOCAL_STORAGE_DYNAMODB_CONFIGS,
  LOCAL_STORAGE_CURRENT_APPLY_CONFIG
} from '@/constants'
import { mapMutations } from 'vuex'
import DynamodbInstance from '@/utils/dynamodb'
export default {
  components: {
    ConfigDialog
  },
  data() {
    return {
      configs: [],
      currentConfig: {},
      configVisivle: false,
      applyConfig:
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENT_APPLY_CONFIG)) ||
        {},
      loading: false
    }
  },
  mounted: function() {
    this.configs =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_DYNAMODB_CONFIGS)) || []
  },
  watch: {
    configs(val) {
      localStorage.setItem(LOCAL_STORAGE_DYNAMODB_CONFIGS, JSON.stringify(val))
    },
    applyConfig(val) {
      localStorage.setItem(
        LOCAL_STORAGE_CURRENT_APPLY_CONFIG,
        JSON.stringify(val)
      )
      this.UPDATE_CONFIG(val)
    }
  },
  methods: {
    ...mapMutations({
      UPDATE_CONFIG: 'UPDATE_CONFIG',
      UPDATE_TABLE_NAME: 'UPDATE_TABLE_NAME'
    }),
    /**
     * 当前配置是否已生效。
     */
    isApplied(config) {
      return config.id === this.applyConfig.id
    },
    tableRowClassName({ row, rowIndex }) {
      return this.isApplied(row) ? 'success-row' : ''
    },
    handleAdd() {
      this.currentConfig = {}
      this.configVisivle = true
    },
    handleEdit(index, row) {
      this.currentConfig = this.$utils.clone(row)
      this.configVisivle = true
    },
    handleDelete(index, row) {
      this.$confirm(
        this.$t('confirm.delete_config'),
        this.$t('confirm.title'),
        {
          confirmButtonText: this.$t('confirm.button_yes'),
          cancelButtonText: this.$t('confirm.button_cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.configs.splice(index, 1)
          this.$message.success(this.$t('message.success.delete_success'))
        })
        .catch(() => {
          this.$message.info(this.$t('message.cancel.delete'))
        })
    },
    handleApply(index, row) {
      this.loading = true
      var dynamodb = new DynamodbInstance(row)
      dynamodb.listTables(
        {},
        res => {
          this.applyConfig = row
          this.UPDATE_TABLE_NAME('')
          console.log(res)
          this.$message.success(this.$t('message.success.config_apply'))
        },
        err => {
          console.log(err)
          this.$message.error(this.$t('message.failure.config_apply'))
        },
        () => {
          this.loading = false
        }
      )
    },
    config_save(config) {
      let tempConfig = this.$utils.clone(config)
      this.configVisivle = false
      for (var index in this.configs) {
        if (this.configs[index].id === tempConfig.id) {
          this.configs.splice(index, 1, tempConfig)
          this.$message.success(this.$t('message.success.config_update'))
          return
        }
      }
      this.configs.unshift(tempConfig)
      this.$message.success(this.$t('message.success.config_update'))
    }
  }
}
</script>

<style scoped>
#config-list {
  padding: 50px 50px;
  text-align: left;
}
</style>

<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>
