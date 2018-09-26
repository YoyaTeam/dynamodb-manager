<template>
  <el-dialog id="add-index"
    title="Add Index"
    :visible.sync="showIndexDialog"
    @close="closeIndex"
    width="40%">
    <el-form :model="newTableIndex"
      :rules="addTableIndexRules"
      ref="addTableIndexRuleForm"
      label-position="right"
      label-width="150px"
      size="mini">
      <el-form-item label="Partition Key"
        prop="partitionKey">
        <el-row>
          <el-col :span="17">
            <el-input v-model="newTableIndex.partitionKey"></el-input>
          </el-col>
          <el-col :span="6"
            :offset="1">
            <el-select v-model="newTableIndex.partitionKeyType"
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
        <el-checkbox v-model="newTableIndex.hasSortKey">Add sort key</el-checkbox>
      </el-form-item>
      <el-form-item label="Sort Key"
        prop="sortKey"
        v-show="newTableIndex.hasSortKey">
        <el-row>
          <el-col :span="17">
            <el-input v-model="newTableIndex.sortKey"></el-input>
          </el-col>
          <el-col :span="6"
            :offset="1">
            <el-select v-model="newTableIndex.sortKeyType"
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
            <el-input v-model="newTableIndex.indexName"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="Projected Attributes"
        prop="projectionType">
        <el-row>
          <el-col :span="17">
            <el-select v-model="newTableIndex.projectionType"
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
        <el-checkbox v-model="newTableIndex.indexType"
          true-label="LSI"
          false-label="GSI"
          disabled>Create as Local Secondary Index</el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer"
      class="dialog-footer">
      <el-button type="primary"
        @click="addTableIndex(newTableIndex, 'addTableIndexRuleForm')">Add</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import Utils from '@/utils/utils'

export default {
  props: ['tableName'],
  data() {
    return {
      newTableIndex: {
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
      addTableIndexRules: {
        partitionKey: [
          { required: true, message: 'please input partition key' }
        ],
        indexName: [{ required: true, message: 'please input index name' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      showIndexDialog: 'showIndexDialog',
      indexAttributeDefinitions: 'indexAttributeDefinitions'
    })
  },
  methods: {
    closeIndex() {
      this.SET_SHOWINDEXDIALOG(false)
    },
    validAndAddAttributeDefinitions(
      attributeDefinitions,
      attributeName,
      attributeType
    ) {
      for (var attributeDefinition of attributeDefinitions) {
        if (
          attributeDefinition.AttributeName === attributeName &&
          attributeDefinition.AttributeType !== attributeType
        ) {
          this.$message({
            message:
              ' Type of ' +
              attributeName +
              ' does not match existing data type',
            type: 'warning'
          })
          return false
        }
      }
      attributeDefinitions.push({
        AttributeName: attributeName,
        AttributeType: attributeType
      })
    },
    addTableIndex(tableIndex, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var attributeDefinitions = Utils.clone(this.indexAttributeDefinitions)
          if (
            this.validAndAddAttributeDefinitions(
              attributeDefinitions,
              tableIndex.partitionKey,
              tableIndex.partitionKeyType
            )
          ) {
            return
          }
          var keySchema = [
            {
              AttributeName: tableIndex.partitionKey,
              KeyType: 'HASH'
            }
          ]
          if (tableIndex.hasSortKey && Utils.isNotEmpty(tableIndex.sortKey)) {
            if (
              this.validAndAddAttributeDefinitions(
                attributeDefinitions,
                tableIndex.sortKey,
                tableIndex.sortKeyType
              )
            ) {
              return
            }
            keySchema.push({
              AttributeName: tableIndex.sortKey,
              KeyType: 'RANGE'
            })
          }
          var params = {
            TableName: this.tableName,
            AttributeDefinitions: attributeDefinitions,
            GlobalSecondaryIndexUpdates: [
              {
                Create: {
                  IndexName: tableIndex.indexName,
                  KeySchema: keySchema,
                  Projection: {
                    // NonKeyAttributes: [],
                    ProjectionType: tableIndex.projectionType
                  },
                  ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                  }
                }
              }
            ]
          }
          console.log(params)
          this.$dynamoDB.updateTable(params, res => {
            this.$message({
              message: 'Add index success!',
              type: 'success'
            })
            this.SET_SHOWINDEXDIALOG(false)
            this.SET_UPDATEINDEXSUCCESS(true)
          })
        } else {
          return false
        }
      })
    },
    ...mapMutations({
      SET_SHOWINDEXDIALOG: 'SET_SHOWINDEXDIALOG',
      SET_UPDATEINDEXSUCCESS: 'SET_UPDATEINDEXSUCCESS'
    })
  }
}
</script>
