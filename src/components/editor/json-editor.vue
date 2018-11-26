<template>
  <div class="json-editor">
    <el-dialog title="Edit Item" :visible.sync="isShow" width="50%" :before-close="handleClose" :close-on-click-modal="false">
      <div id="editor"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="putItem">Save Item</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
/* eslint-disable */
import ace from 'ace-builds'
import { Range, EditSession } from 'ace-builds'

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
      if (!this.editor) {
        this.initEditor()
      }
    },
    editorText(val) {
      if (!this.editor) {
        this.initEditor()
        return
      }
      val = JSON.stringify(val, null, '\t')
      if (val.trim() !== '' && this.editor) {
        this.setValue(val)
      }
    }
  },
  methods: {
    initEditor() {
      this.$nextTick(() => {
        if (this.editor || !document.getElementById('editor')) {
          return
        }

        this.editor = ace.edit(null, {
          maxLines: 50,
          minLines: 10,
          value: JSON.stringify(this.editorText, null, '\t'),
          mode: 'ace/mode/json',
          bug: 1
        })

        this.editor.selection.setRange(new Range(0, 0, 0, 3))
        document.getElementById('editor').appendChild(this.editor.container)
      })
    },
    setValue(data) {
      this.editor.setValue(data)
    },
    handleClose(done) {
      this.$emit('close')
    },
    putItem() {
      const params = {
        TableName: this.$tableSchema.tableName,
        Item: JSON.parse(this.editor.getValue())
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
<style type="text/css" media="screen">
</style>
