<template>
<div class="json-editor">
  <el-dialog title="Edit Item" :visible.sync="isShow" width="70%" top="5vh" :before-close="handleClose" :close-on-click-modal="false">
    <div id="jsoneditor"></div>
    <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="putItem">Save Item</el-button>
      </span>
  </el-dialog>

</div>
</template>

<script>
/* eslint-disable */
import ace from 'ace-builds'
import jsoneditor from 'jsoneditor'
import {
  GLOBAL_SETTINGS_ITEM_EDIT_TYPE
} from '@/constants'

export default {
  props: {
    showEditor: {
      type: Boolean,
      default: false
    },
    editorText: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      editor: null,
      isShow: false
    }
  },
  watch: {
    showEditor(val) {
      this.isShow = val
      if (val && !this.editor) {
        this.initEditor()
      }
    },
    editorText(val) {
      if (!this.editor) {
        return
      }
      this.setValue(val)
    }
  },
  methods: {
    initEditor() {
      this.$nextTick(() => {
        var container = document.getElementById('jsoneditor')
        var options = {
          modes: ['text', 'code', 'tree', 'form', 'view'],
          mode: localStorage.getItem(GLOBAL_SETTINGS_ITEM_EDIT_TYPE) || 'form',
          ace: ace,
          indentation: 4
        }
        this.editor = new jsoneditor(container, options, this.editorText);
      })
    },
    setValue(data) {
      this.editor.set(data)
    },
    handleClose(done) {
      this.$emit('close')
    },
    putItem() {
      const params = {
        TableName: this.$tableSchema.tableName,
        Item: this.editor.get()
      }

      this.$dynamodb.putItem(params, res => {
        this.handleClose()
        this.$message.success('Put Item Success!')
        this.$emit('refresh')
      })
    }
  }
}
</script>

<style lang="sass">
@import 'jsoneditor/dist/jsoneditor.css'

.json-editor
  .el-dialog__body
    padding: 0 10px
#jsoneditor
  height: 700px
  .ace-jsoneditor.ace_editor
    font-family: 'Avenir', Helvetica, Arial, sans-serif
    line-height: 1.3
    background-color: #fff
    font-weight: 500
    font-size: 11pt !important
    color: #1A1A1A
  .ace-jsoneditor .ace_text-layer
    color: #1A1A1A
  div.jsoneditor-contextmenu ul li button.jsoneditor-selected
    background-color: #2F4056
</style>

<style src="@/assets/css/jsoneditor.css">

</style>
