<template>
  <div>
    <div class="header">
      <el-menu class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <h1>Dynamodb Manager</h1>
        <el-submenu index="setting">
          <template slot="title">Setting</template>
          <el-menu-item index="add_database">Add Database</el-menu-item>
          <el-menu-item index="create_table">Create Table</el-menu-item>
          <el-menu-item index="open_config">Open Config</el-menu-item>
        </el-submenu>
        <el-submenu index="region">
          <template slot="title">{{ this.$store.state.aws.config.region || 'Region' }}</template>
          <el-menu-item v-for="(item, index) in regions"
            :index="item"
            :key="index">{{ item }}</el-menu-item>
        </el-submenu>
        <el-submenu index="endpoint">
          <template slot="title">{{ this.$store.state.aws.config.endpoint || 'Endpoint' }}</template>
          <el-menu-item v-for="(item, index) in endpoints"
            :index="item"
            :key="index">{{ item }}</el-menu-item>
        </el-submenu>
      </el-menu>

    </div>
    <el-dialog id="add-database"
      title="Add Database"
      :visible.sync="dialogVisible"
      width="35%">
      <el-form :model="newConfig"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="120px">
        <el-form-item label="Endpoint"
          prop="endpoint">
          <el-input v-model="newConfig.endpoint"
            placeholder="http://127.0.0.1:80"></el-input>
        </el-form-item>
        <el-form-item label="Region"
          prop="region">
          <el-select v-model="newConfig.region"
            placeholder="us-east-1">
            <el-option v-for="(item, index) in regions"
              :key="index"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Access Key"
          prop="accessKeyId">
          <el-input v-model="newConfig.accessKeyId"
            placeholder="patsnap"></el-input>
        </el-form-item>
        <el-form-item label="Secret Key"
          prop="secretAccessKey">
          <el-input v-model="newConfig.secretAccessKey"
            placeholder="patsnap"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
        class="dialog-footer">
        <el-button @click="testConnection(newConfig, 'ruleForm')">Test Connection</el-button>
        <el-button type="primary"
          @click="addDatabase(newConfig, 'ruleForm')"
          :disabled="add_disabled">Add</el-button>
      </span>
    </el-dialog>
    <el-dialog id="create-table"
      title="Create DynamoDB Table"
      :visible.sync="add_table_dialogVisible"
      width="55%">
      <el-form :model="tableSchema"
        :rules="tableSchemaRules"
        ref="tableSchemaRuleForm"
        size="mini"
        label-position="right"
        label-width="120px">
        <el-form-item label="Table Name"
          prop="tableName">
          <el-col :span="10">
            <el-input v-model="tableSchema.tableName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="Partition Key"
          prop="partitionKey">
          <el-row>
            <el-col :span="10">
              <el-input v-model="tableSchema.partitionKey"></el-input>
            </el-col>
            <el-col :span="6"
              :offset="1">
              <el-select v-model="tableSchema.partitionKeyType"
                placeholder="type">
                <el-option v-for="item in dataTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;margin-top: -10px;">
          <el-checkbox v-model="tableSchema.hasSortKey">Add sort key</el-checkbox>
        </el-form-item>
        <el-form-item label="Sort Key"
          prop="sortKey"
          v-show="tableSchema.hasSortKey">
          <el-row>
            <el-col :span="10">
              <el-input v-model="tableSchema.sortKey"></el-input>
            </el-col>
            <el-col :span="6"
              :offset="1">
              <el-select v-model="tableSchema.sortKeyType"
                placeholder="type">
                <el-option v-for="item in dataTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="Second Index">
          <el-button type="primary"
            @click="openAddIndexDialog('addIndexRuleForm')">Add Index</el-button>
          <el-table :data="secondIndex"
            style="width: 100%"
            size="mini">
            <el-table-column prop="indexName"
              label="Name">
            </el-table-column>
            <el-table-column prop="indexType"
              label="Type">
            </el-table-column>
            <el-table-column prop="partitionKey"
              label="Partition Key">
              <template slot-scope="scope">
                {{ scope.row.partitionKey + ' (' + scope.row.partitionKeyType + ')' }}
              </template>
            </el-table-column>
            <el-table-column prop="sortKey"
              label="Sort Key">
              <template slot-scope="scope">
                {{ scope.row.sortKey }}
                <span v-show="scope.row.sortKey">({{ scope.row.sortKeyType }})</span>
              </template>
            </el-table-column>
            <el-table-column prop="projectionType"
              label="Projection Type">
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button size="mini"
                  type="danger"
                  @click="indexHandleDelete(scope.$index, scope.row)">delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer"
        class="dialog-footer">
        <el-button size="mini"
          type="primary"
          @click="createTable(tableSchema, secondIndex, 'tableSchemaRuleForm')">Create Table</el-button>
      </span>
    </el-dialog>
    <el-dialog id="add-index"
      title="Add Index"
      :visible.sync="add_index_dialogVisible"
      width="40%">
      <el-form :model="tableIndex"
        :rules="addIndexRules"
        ref="addIndexRuleForm"
        label-position="right"
        label-width="150px"
        size="mini">
        <el-form-item label="Partition Key"
          prop="partitionKey">
          <el-row>
            <el-col :span="17">
              <el-input v-model="tableIndex.partitionKey"></el-input>
            </el-col>
            <el-col :span="6"
              :offset="1">
              <el-select v-model="tableIndex.partitionKeyType"
                placeholder="type">
                <el-option v-for="item in dataTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;margin-top: -10px;">
          <el-checkbox v-model="tableIndex.hasSortKey">Add sort key</el-checkbox>
        </el-form-item>
        <el-form-item label="Sort Key"
          prop="sortKey"
          v-show="tableIndex.hasSortKey">
          <el-row>
            <el-col :span="17">
              <el-input v-model="tableIndex.sortKey"></el-input>
            </el-col>
            <el-col :span="6"
              :offset="1">
              <el-select v-model="tableIndex.sortKeyType"
                placeholder="type">
                <el-option v-for="item in dataTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="Index Name"
          prop="indexName">
          <el-row>
            <el-col :span="17">
              <el-input v-model="tableIndex.indexName"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="Projected Attributes"
          prop="projectionType">
          <el-row>
            <el-col :span="17">
              <el-select v-model="tableIndex.projectionType"
                placeholder="type">
                <el-option v-for="item in projectionTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;margin-top: -10px;">
          <el-checkbox v-model="tableIndex.indexType"
            true-label="LSI"
            false-label="GSI"
            disabled>Create as Local Secondary Index</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="addIndex(tableIndex, 'addIndexRuleForm')">Add</el-button>
      </span>
    </el-dialog>
    <el-dialog id="config"
      title="AWS Config"
      :visible.sync="config_dialogVisible"
      width="30%">
      <el-form label-position="left"
        label-width="120px">
        <el-form-item label="Region">
          {{ this.$store.state.aws.config.region }}
        </el-form-item>
        <el-form-item label="Endpoint"
          prop="endpoint">
          {{ this.$store.state.aws.config.endpoint }}
        </el-form-item>
        <el-form-item label="Access Key"
          prop="accessKeyId">
          {{ this.$store.state.aws.config.accessKeyId }}
        </el-form-item>
        <el-form-item label="Secret Key"
          prop="secretAccessKey">
          {{ this.$store.state.aws.config.secretAccessKey }}
        </el-form-item>
      </el-form>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="config_dialogVisible = false">Close</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import Utils from '@/utils/utils'
import { mapMutations } from 'vuex'
var AWS = require('aws-sdk')
export default {
  name: 'Nav',
  data() {
    return {
      activeIndex: '1',
      endpoints: [],
      regions: [
        'us-east-1',
        'us-east-2',
        'us-west-1',
        'us-west-2',
        'ap-northeast-1',
        'ap-northeast-2',
        'ap-northeast-3',
        'ap-south-1',
        'ap-southeast-1',
        'ap-southeast-2',
        'ca-central-1',
        'cn-north-1',
        'cn-northwest-1',
        'eu-central-1',
        'eu-west-1',
        'eu-west-2',
        'eu-west-3',
        'sa-east-1',
        'us-gov-west-1'
      ],
      dialogVisible: false,
      add_table_dialogVisible: false,
      config_dialogVisible: false,
      add_index_dialogVisible: false,
      newConfig: {},
      rules: {
        region: [{ required: true, message: 'please input region' }],
        endpoint: [{ required: true, message: 'please input endpoint' }]
      },
      tableSchemaRules: {
        tableName: [
          { required: true, message: 'please input table name' },
          { min: 3, message: 'valid range: 3-inf', trigger: 'blur' }
        ],
        partitionKey: [
          { required: true, message: 'please input partition key' }
        ]
      },
      addIndexRules: {
        partitionKey: [
          { required: true, message: 'please input partition key' }
        ],
        indexName: [{ required: true, message: 'please input index name' }]
      },
      add_disabled: true,
      dataTypes: [
        {
          label: 'String',
          value: 'S'
        },
        {
          label: 'Binary',
          value: 'B'
        },
        {
          label: 'Numble',
          value: 'N'
        }
      ],
      projectionTypes: [
        {
          label: 'All',
          value: 'ALL'
        },
        {
          label: 'Keys only',
          value: 'KEYS_ONLY'
        },
        {
          label: 'Include',
          value: 'INCLUDE'
        }
      ],
      schema_hashKey: {
        attributeName: '',
        attributeType: 'S',
        keyType: 'HASH'
      },
      schema_rangeKey: {
        attributeName: '',
        attributeType: 'S',
        keyType: 'RANGE'
      },
      secondIndex: [],
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
      tableSchema: {
        tableName: '',
        partitionKey: '',
        partitionKeyType: 'S',
        hasSortKey: false,
        sortKey: '',
        sortKeyType: 'S',
        provisionedThroughput: {
          readCapacityUnits: 5,
          writeCapacityUnits: 5
        }
      }
    }
  },
  mounted: function() {
    this.refreshEndpoint()
  },
  methods: {
    refreshEndpoint() {
      const endpoints = localStorage.getItem('endpoints')
      if (endpoints) {
        this.endpoints = endpoints.split(',')
        const endpoint = localStorage.getItem('endpoint')
        this.UPDATE_ENDPOINT(endpoint || this.endpoints[0])
        this.UPDATE_REGION(localStorage.getItem('region') || this.regions[0])
      } else {
        this.endpoints = []
        this.openAddDatabaseDialog()
      }
    },
    handleSelect(key, keyPath) {
      if (keyPath[0] === 'region') {
        this.UPDATE_REGION(key)
        localStorage.setItem('region', key)
      } else if (keyPath[0] === 'endpoint') {
        this.UPDATE_ENDPOINT(key)
        localStorage.setItem('endpoint', key)
      } else if (keyPath[0] === 'setting') {
        if (keyPath[1] === 'add_database') {
          this.openAddDatabaseDialog()
        } else if (keyPath[1] === 'create_table') {
          this.add_table_dialogVisible = true
        } else if (keyPath[1] === 'open_config') {
          this.config_dialogVisible = true
        }
      }
    },
    openAddDatabaseDialog() {
      this.newConfig = {
        region: this.regions[0],
        endpoint: '',
        accessKeyId: '',
        secretAccessKey: ''
      }
      this.add_disabled = true
      this.dialogVisible = true
    },
    testConnection(config, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          config.httpOptions = {
            timeout: 5000
          }
          var dynamodb = new AWS.DynamoDB(config)
          dynamodb.listTables({}, (err, data) => {
            if (err) {
              // console.log(err)
              this.$notify.error({
                title: 'connect failure!',
                message: err.message
              })
            } else {
              this.add_disabled = false
              this.$notify.success({
                title: 'connect success!'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    addDatabase(config, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const endpoints = localStorage.getItem('endpoints')
          localStorage.setItem(
            'endpoints',
            endpoints ? endpoints + ',' + config.endpoint : config.endpoint
          )
          localStorage.setItem('region', config.region)
          localStorage.setItem('endpoint', config.endpoint)
          this.refreshEndpoint()
          this.dialogVisible = false
          // var dynamodb = new AWS.DynamoDB(config)
          // dynamodb.listTables({}, (err, data) => {
          //   if (err)
          //     // console.log(err)
          //     this.$notify.error({
          //       title: 'connect failure!',
          //       message: err.message
          //     })
          //   else {
          //     this.add_disabled = false
          //     this.$notify.success({
          //       title: 'connect success!'
          //     })
          //   }
          // })
        } else {
          return false
        }
      })
    },
    openAddIndexDialog(formName) {
      this.add_index_dialogVisible = true
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    addIndex(tableIndex, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.secondIndex.push({
            indexName: tableIndex.indexName,
            indexType: tableIndex.isLSI ? 'LSI' : 'GSI',
            partitionKey: tableIndex.partitionKey,
            partitionKeyType: tableIndex.partitionKeyType,
            hasSortKey: tableIndex.hasSortKey,
            sortKey: tableIndex.sortKey,
            sortKeyType: tableIndex.sortKeyType,
            projectionType: tableIndex.projectionType
          })
          this.add_index_dialogVisible = false
        } else {
          return false
        }
      })
    },
    indexHandleDelete(index, row) {
      this.secondIndex.splice(index, 1)
    },
    addAttributeDefinitions(
      attributeDefinitions,
      attributeName,
      attributeType
    ) {
      for (var i = 0; i < attributeDefinitions.length; i++) {
        if (attributeDefinitions.AttributeName === attributeName) {
          return false
        }
      }
      attributeDefinitions.push({
        AttributeName: attributeName,
        AttributeType: attributeType
      })
    },
    createTable(tableSchema, secondIndex, formName) {
      // var tableSchema = Utils.clone(newTableSchema)
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = {
            TableName: tableSchema.tableName,
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5
            },
            KeySchema: [
              {
                AttributeName: tableSchema.partitionKey,
                KeyType: 'HASH'
              }
            ],
            AttributeDefinitions: [
              {
                AttributeName: tableSchema.partitionKey,
                AttributeType: tableSchema.partitionKeyType
              }
            ]
          }
          if (tableSchema.hasSortKey && Utils.isNotEmpty(tableSchema.sortKey)) {
            params.KeySchema.push({
              AttributeName: tableSchema.sortKey,
              KeyType: 'RANGE'
            })
            params.AttributeDefinitions.push({
              AttributeName: tableSchema.sortKey,
              AttributeType: tableSchema.sortKeyType
            })
          }
          console.log(secondIndex)
          console.log(params.GlobalSecondaryIndexes)
          if (Utils.isNotEmpty(secondIndex)) {
            secondIndex.forEach((value, index) => {
              var si = {
                IndexName: value.indexName,
                Projection: {
                  NonKeyAttributes: value.nonKeyAttributes,
                  ProjectionType: value.projectionType
                },
                ProvisionedThroughput: {
                  ReadCapacityUnits: 5,
                  WriteCapacityUnits: 5
                },
                KeySchema: [
                  {
                    AttributeName: value.partitionKey,
                    KeyType: 'HASH'
                  }
                ]
              }
              this.addAttributeDefinitions(
                params.AttributeDefinitions,
                value.partitionKey,
                value.partitionKeyType
              )
              if (value.hasSortKey && Utils.isNotEmpty(value.sortKey)) {
                si.KeySchema.push({
                  AttributeName: value.sortKey,
                  KeyType: 'RANGE'
                })
                this.addAttributeDefinitions(
                  params.AttributeDefinitions,
                  value.sortKey,
                  value.sortKeyType
                )
              }
              if (value.indexType === 'GSI') {
                if (Utils.isEmpty(params.GlobalSecondaryIndexes)) {
                  params.GlobalSecondaryIndexes = []
                }
                params.GlobalSecondaryIndexes.push(si)
              } else if (value.indexType === 'LSI') {
                if (Utils.isEmpty(params.LocalSecondaryIndexes)) {
                  params.LocalSecondaryIndexes = []
                }
                params.LocalSecondaryIndexes.push(si)
              }
            })
          }
          console.log(params)
          var dynamodb = new AWS.DynamoDB()
          dynamodb.createTable(params, (err, data) => {
            if (err) {
              this.$notify.error({
                title: 'create table failure!',
                message: err.message
              })
            } else {
              this.$notify.success({
                title: 'create table  success!'
              })
              this.add_table_dialogVisible = false
            }
          })
        } else {
          return false
        }
      })
    },
    ...mapMutations({
      UPDATE_ENDPOINT: 'UPDATE_ENDPOINT',
      UPDATE_REGION: 'UPDATE_REGION'
    })
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 101;
}
.header h1 {
  margin: 15px;
  float: left;
  font-size: 1.5em;
  line-height: 32px;
  color: rgb(255, 255, 255);
  font-family: Arial, sans-serif;
  font-weight: 300;
}
.el-menu--horizontal > .el-submenu,
.el-menu-item {
  float: right;
}
#add-database .el-select,
#add-index .el-select {
  width: 100%;
}
</style>
