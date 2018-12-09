<template>
<div id="json-import">
<el-dialog :title="uploading ? $t('table.json_file_import.uploading_title') : $t('table.json_file_import.import_title')" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
  <div v-if="!uploading">
  <el-upload class="upload-demo" action="" :show-file-list="false" :before-upload="beforeUpload" drag style="text-align:center">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">{{$t('table.json_file_import.upload_text_first')}} <em>{{$t('table.json_file_import.upload_text_second')}}</em></div>
    <div class="el-upload__tip" slot="tip">{{$t('table.json_file_import.comment')}}</div>
  </el-upload>
  </div>
  <div v-else>
    <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" style="margin: 10px 0"></el-progress>
    <div class="result">
      <span style="color:#5FB878; margin-right:15px">{{success}} success</span>
      <span style="color:#FF5722">{{error}} error</span>
    </div>
  </div>
</el-dialog>
</div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      uploading: false,
      success: 0,
      error: 0,
      percentage: 0
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.uploading = false
        this.percentage = 0
        this.success = 0
        this.error = 0
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    beforeUpload(file) {
      console.log(file)
      const isJSON = file.type === 'application/json'
      if (!isJSON) {
        this.$message.warning(this.$t('message.failure.only_json_file'))
        return
      }
      this.processFile(file)
      return false
    },
    processFile(file) {
      let _this = this
      var r = new FileReader()
      r.onload = function(e) {
        var contents = e.target.result
        try {
          var datas = JSON.parse(contents)
        } catch (e) {
          _this.$message.warning(_this.$t('message.failure.error_json'))
          return
        }
        if (_this.$utils.isEmpty(datas)) {
          _this.$message.warning(_this.$t('message.failure.no_data'))
          return
        }
        _this.uploading = true
        const length = datas.length
        let index = 1
        let errors = []
        datas.forEach(data => {
          const params = {
            TableName: _this.$tableSchema.tableName,
            Item: data
          }
          _this.$dynamodb.putItem(params, res => {
            _this.success++
          }, err => {
            console.log(err)
            _this.error++
            errors.push(params.Item)
          }, () => {
            _this.percentage = (index++ / length).toFixed(2) * 100
            if (index === length) {
              if (errors.length > 0) {
                _this.$message.warning(_this.$t('message.failure.import_failure').replace('{success}', _this.success).replace('{error}', _this.error))
                _this.handleClose()
                var file = new File([JSON.stringify(errors, null, 4)], `error.json`, {type: 'text/plain;charset=utf-8'})
                FileSaver.saveAs(file)
              } else {
                _this.$message.success(_this.$t('message.success.import_success'))
                _this.handleClose()
              }
            }
          })
        })
      }
      r.readAsText(file)
    }
  }
}
</script>

<style lang="sass">
#json-import
  .result
    text-align: center
</style>
