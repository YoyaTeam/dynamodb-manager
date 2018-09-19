import {
  Notification
} from 'element-ui'
const AWS = require('aws-sdk')
let dynamodb = new AWS.DynamoDB()
let docClient = new AWS.DynamoDB.DocumentClient()

const defaultCallback = () => {}

const errNotify = (title, message) => {
  Notification.warning({
    title,
    message
  })
}

class DynamoDBInstance {
  constructor(config) {
    this._config = config
    this.params = {}
  }

  get config() {
    return this._config
  }

  set config(config) {
    this._config = config
    this.refresh(config)
  }

  refresh(config) {
    AWS.config.update(config)
    dynamodb = new AWS.DynamoDB()
    docClient = new AWS.DynamoDB.DocumentClient()
  }

  async listTables(params, successCallback, completeCallback) {
    const res = await dynamodb.listTables(params || this.params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        errNotify('List Table Err', err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }

  async describeTable(TableName, successCallback, completeCallback) {
    const res = await dynamodb.describeTable({
      TableName
    })
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        errNotify(`Describe Table: ${TableName} Err`, err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }

  async scanTable(params, successCallback, completeCallback) {
    const res = await docClient.scan(params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        errNotify(`Scan Table Err`, err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }

  async queryTable(params, successCallback, completeCallback) {
    const res = await docClient.query(params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        console.log(err)
        errNotify(`Query Table Err`, err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }

  async putItem(params, successCallback, completeCallback) {
    const res = await docClient.put(params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        errNotify(`putItem Table Err`, err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }
}

export default DynamoDBInstance
