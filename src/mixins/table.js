import {
  mapGetters,
  mapMutations
} from 'vuex'
export default {
  computed: {
    ...mapGetters({
      config: 'config',
      tableName: 'tableName'
    }),
    tabActive() {
      return this.$route.query.tabActive
    },
    tableName() {
      return this.$route.params.tableName
    }
  },
  mounted: function() {
    if (this.$utils.isEmpty(this.$tableSchema.schema) && this.$utils.isNotEmpty(this.tableName)) {
      this.initTableName(this.tableName)
    }
  },
  watch: {
    config: {
      handler(val) {
        this.$dynamodb.config = val
        this.initConfigFinished(val)
      },
      deep: true
    },
    tableName(val) {
      this.initTableName(val)
    },
    tabActive(val) {
      console.log('---' + val)
      if (this.$utils.isEmpty(this.$tableSchema.schema) && this.$utils.isNotEmpty(this.tableName)) {
        this.initTableName(this.tableName)
      }
      this.autoInit(val)
    }
  },
  methods: {
    ...mapMutations({
      UPDATE_TABLE_NAME: 'UPDATE_TABLE_NAME'
    }),
    autoInit(val) {
      console.log('auto init')
    },
    initConfigFinished() {
      console.log('init config finished')
    },
    initTableName(tableName) {
      console.log('init table name : ' + tableName)
      this.describeTable(tableName)
    },
    tableRefreshFinished() {
      console.log('table refresh finished')
      this.autoInit()
    },
    describeTable(tableName) {
      console.log('desc table')
      if (this.$utils.isEmpty(this.config.region)) {
        return
      }
      this.$dynamodb.describeTable(tableName, res => {
        console.log(res)
        this.$tableSchema.schema = res.data.Table
        this.tableRefreshFinished(tableName)
      })
    }
  }

}
