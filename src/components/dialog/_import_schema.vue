<template>
<el-dialog id="add-index" :close-on-click-modal="false" style="text-align:left" :title="$t('table.create_table_dialog.button_import_scheam')" :visible.sync="dialogVisible" width="40%" @closed="close">
  <el-form :model="form" ref="schemaRuleForm" :rules="rules" label-position="top" label-width="150px" size="mini" :show-message="false">
    <el-form-item label="Schema" prop="schema" required>
      <el-row>
        <el-col :span="24">
          <el-input type="textarea" :rows="20" v-model="form.schema"></el-input>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save(form.schema)">{{$t('table.create_table_dialog.button_add')}}</el-button>
        </span>
</el-dialog>
</template>

<script>
import DynamodbTableSchema from '@/utils/table_schema'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateJsonPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('please input schema'))
      }
      if (typeof value === 'string') {
        try {
          var obj = JSON.parse(value)
          if (typeof obj === 'object' && obj) {
            callback()
          } else {
            callback(new Error('please input json'))
          }
        } catch (e) {
          callback(new Error('please input json'))
        }
      }
    }
    return {
      dialogVisible: false,
      form: {
        schema: ''
      },
      rules: {
        schema: [{
          validator: validateJsonPass,
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.form.schema = ''
      }
    }
  },
  methods: {
    save(scheam) {
      this.$refs.schemaRuleForm.validate((valid) => {
        if (valid) {
          var tableSchema = new DynamodbTableSchema()
          tableSchema.schema = JSON.parse(scheam)
          if (this.$utils.isNotEmpty(tableSchema.tableName) && this.$utils.isNotEmpty(tableSchema.hashKey) && this.$utils.isNotEmpty(tableSchema.hashKeyType)) {
            this.$emit('importSchema', tableSchema)
          } else {
            this.$message.warning('Incorrect format')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    close() {
      this.$emit('colse')
    }
  }
}
</script>
