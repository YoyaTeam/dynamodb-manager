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
                    @click="putItem">确 定</el-button>
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
      console.log('show', document.getElementById('editor'))
      if (val && document.getElementById('editor') && !this.editor) {
        this.initEditor()
      }
    },
    editorText(val) {
      if (!this.editor) {
        this.initEditor()
        return
      }
      if (val.trim() !== '' && this.editor) {
        this.setValue(val)
      }
    }
  },
  methods: {
    initEditor() {
      console.log(document.getElementById('editor'))
      if (!document.getElementById('editor')) {
        return
      }
      this.$nextTick(() => {
        if (this.editor) {
          return
        }
        this.editor = ace.edit(null, {
          maxLines: 50,
          minLines: 10,
          value: this.editorText,
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
      this.SET_SHOWEDITOR(false)
    },
    putItem() {
      console.log(this.editor.getValue())
      const params = {
        TableName: 'Movies',
        Item: JSON.parse(this.editor.getValue())
      }
      this.$dynamoDB.client = 'docClient'
      this.$dynamoDB.putItem(params, res => {
        console.log(res)
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
