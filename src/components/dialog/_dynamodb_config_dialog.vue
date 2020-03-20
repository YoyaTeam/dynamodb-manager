<template>
  <el-dialog :title="$t('config.dialog_title')" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false" @close="close">
    <el-form id="config-dialog-form" :model="config" :rules="rules" ref="ruleForm" label-position="left" label-width="100px">
      <el-form-item :label="$t('config.table_header_alias')" prop="alias" :show-message="false" required>
        <el-input v-model="config.alias"></el-input>
      </el-form-item>
      <el-form-item :label="$t('config.table_header_endpoint')" prop="endpoint" :show-message="false" required>
        <el-autocomplete v-model="config.endpoint" popper-class="my-autocomplete" :fetch-suggestions="querySearch" placeholder="http://127.0.0.1:8000" @select="endpointHandleSelect" style="width:100%">
          <template slot-scope="{ item }">
            <span class="region-name">{{ item.regionName }}</span>
            <span class="endpoint">{{ item.endpoint }}</span>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item :label="$t('config.table_header_region')" prop="region" :show-message="false" required>
        <el-select allow-create filterable v-model="config.region" placeholder="us-east-1" style="width:100%" @visible-change="$forceUpdate()">
          <el-option-group v-for="group in endpointsAndRegions" :key="group.region" :label="group.region">
            <el-option v-for="item in group.options" :key="item.region" :label="`${item.regionName}   -   ${item.region}`" :value="item.region">
              <span style="float: left">{{ item.regionName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.region }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('config.table_header_access_key')" prop="accessKeyId" :show-message="false" required>
        <el-input v-model="config.accessKeyId"></el-input>
      </el-form-item>
      <el-form-item :label="$t('config.table_header_secret_key')" prop="secretAccessKey" :show-message="false" required>
        <el-input v-model="config.secretAccessKey" :type="seePassword ? 'text' : 'password'">
          <i slot="suffix" class="fa" :class="seePassword ? 'fa-eye-slash' : 'fa-eye'" style="margin-right:5px;" @click="eyeCLick"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogVisible = false">{{$t('config.dialog_button_test_connection')}}</el-button> -->
      <el-button type="primary" @click="save(config)">{{$t('config.dialog_button_save')}}</el-button>
      <el-button type="primary" @click="save(config, true)">{{$t('config.dialog_button_save_and_apply')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import uuid4 from 'uuid/v4'
export default {
  props: {
    config: {
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      endpointsAndRegions: this.$t('dynamodb_endpoints_regions'),
      dialogVisible: this.visible,
      rules: {},
      seePassword: false
    }
  },
  computed: {
    endpoint() {
      return this.config.endpoint
    },
    endpoints() {
      let endpoints = []
      for (let group of this.endpointsAndRegions) {
        for (let option of group.options) {
          endpoints.push({
            endpoint: option.endpoint,
            regionName: option.regionName,
            region: option.region,
            value: option.endpoint
          })
        }
      }
      return endpoints
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val && this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields()
      }
    },
    endpoint(val, oldVal) {
      // 如何 alias 未设置，则与 endpoint 保持一致
      if (this.config.alias === oldVal) {
        this.config.alias = val
      }
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var endpoints = this.endpoints
      var results = queryString
        ? endpoints.filter(this.createFilter(queryString))
        : endpoints
      cb(results)
    },
    createFilter(queryString) {
      return endpoint => {
        return (
          endpoint.endpoint.toLowerCase().indexOf(queryString.toLowerCase()) >
          -1
        )
      }
    },
    endpointHandleSelect(item) {
      if (this.$utils.isEmpty(this.config.region)) {
        this.config.region = item.region
      }
    },
    save(config, apply = false) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          config.createdTime = config.createdTime || new Date()
          config.id = config.id || uuid4()
          this.$emit('config-save', config, apply)
        } else {
          return false
        }
      })
    },
    close() {
      this.seePassword = false
      this.$emit('close')
    },
    eyeCLick() {
      this.seePassword = !this.seePassword
    }
  }
}
</script>

<style lang="sass" scoped>
.my-autocomplete li
  line-height: normal
  padding: 7px

.my-autocomplete li .endpoint
  text-overflow: ellipsis
  overflow: hidden
  float: right
  color: rgb(132, 146, 166)
  font-size: 13px

.my-autocomplete li .highlighted .region-name
  color: #ddd
</style>
