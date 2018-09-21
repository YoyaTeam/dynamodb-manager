<template>
    <div class="json-editor">
        <el-dialog title="Edit Item"
            :visible.sync="showEditor"
            width="50%"
            :before-close="handleClose">
            <div id="editor"></div>
            <span slot="footer"
                class="dialog-footer">
                <el-button type="success"
                    @click="putItem">Save Item</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapMutations } from 'vuex'
import ace from 'ace-builds'
import { Range, EditSession } from 'ace-builds'
import 'ace-builds/src-noconflict/ace'
import 'ace-builds/webpack-resolver'

export default {
  props: {
    tableName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editor: null
    }
  },
  computed: {
    ...mapGetters({
      showEditor: 'showEditor',
      editorText: 'text'
    })
  },
  watch: {
    showEditor(val) {
      if (val && !this.editor) {
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
        console.log('init', document.getElementById('editor'))

        this.editor = ace.edit(null, {
          maxLines: 50,
          minLines: 10,
          value: JSON.stringify(this.editorText, null, '\t'),
          mode: 'ace/mode/json',
          bug: 1
        })

        this.editor.selection.setRange(new Range(0, 0, 0, 3))
        // this.editor.on('change', data => {
        //   console.log('change', data)
        // })
        document.getElementById('editor').appendChild(this.editor.container)
      })
    },
    setValue(data) {
      this.editor.setValue(data)
    },
    handleClose(done) {
      this.SET_SHOWEDITOR(false)
    },
    putItem() {
      const params = {
        TableName: this.tableName,
        Item: JSON.parse(this.editor.getValue())
      }

      this.$dynamoDB.putItem(params, res => {
        this.handleClose()
        this.$notify.success({
          title: 'Put Item Success!'
        })
      })
    },
    ...mapMutations({
      SET_SHOWEDITOR: 'SET_SHOWEDITOR',
      SET_TEXT: 'SET_TEXT'
    })
  }
}
</script>
<style type="text/css" media="screen">
</style>
