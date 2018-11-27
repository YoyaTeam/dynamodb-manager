<template>
<el-dialog id="table-header-select" :close-on-click-modal="false" style="text-align:left" :title="$t('table.item_search.update_header_show_dialog_title')" :visible.sync="header_select_dialogVisible" width="300px" @closed="close">
  <el-table ref="multipleTable" :data="tableDatas" @selection-change="handleSelectionChange" tooltip-effect="dark" max-height="600" style="width: 100%">
    <el-table-column type="selection" width="55" aria-disabled="true">
    </el-table-column>
    <el-table-column prop="key" :label="$t('table.item_search.update_header_show_dialog_table_header_cloumns')" show-overflow-tooltip>
    </el-table-column>
  </el-table>
  <div style="margin-top: 20px;text-align:right">
    <el-button type="primary" @click="save">{{$t('config.dialog_button_save')}}</el-button>
  </div>
</el-dialog>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      header_select_dialogVisible: this.visible,
      tableDatas: this.data,
      multipleSelection: []
    }
  },
  watch: {
    data(val) {
      this.tableDatas = val
      if (this.visible) {
        this.$nextTick(() => {
          this.selection(val.filter(item => item.show))
        })
      }
    },
    visible(val) {
      this.header_select_dialogVisible = val
      if (val) {
        this.$nextTick(() => {
          this.selection(this.tableDatas.filter(item => item.show))
        })
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    selection(rows) {
      this.multipleSelection = rows
      if (rows) {
        rows.forEach(row => {
          console.log(this.$refs.multipleTable)
          if (this.$refs.multipleTable) {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          }
        })
      }
    },
    save() {
      this.$emit('updateSelectedHeader', this.multipleSelection)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style>
#table-header-select .el-table th,
#table-header-select .el-table tr {
  background-color: #fff;
}
</style>
