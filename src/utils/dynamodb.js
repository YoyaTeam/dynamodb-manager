import {
  Notification
} from 'element-ui'
import {
  GLOBAL_SETTINGS_MAX_RETRY,
  GLOBAL_SETTINGS_CONNECTION_TIMEOUT
} from '@/constants'
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
    config.httpOptions = {
      connectTimeout: 1000 * parseInt(localStorage.getItem(GLOBAL_SETTINGS_CONNECTION_TIMEOUT) || 5),
      timeout: 1000 * parseInt(localStorage.getItem(GLOBAL_SETTINGS_CONNECTION_TIMEOUT) || 5)
    }
    config.maxRetries = parseInt(localStorage.getItem(GLOBAL_SETTINGS_MAX_RETRY) || 1)
    this._config = config
    this.params = {}
    this.refresh(config)
  }

  get config() {
    return this._config
  }

  set config(config) {
    console.log('-----------update config')
    console.log(config)
    this._config = config
    this.refresh(config)
  }

  refresh(config) {
    AWS.config.update(config)
    dynamodb = new AWS.DynamoDB()
    docClient = new AWS.DynamoDB.DocumentClient()
  }

  async listTables(params, successCallback, errorCallback, completeCallback) {
    let defaultErrorCallback = (err) => {
      errNotify('List Table Err', err.message)
    }
    const res = await dynamodb.listTables(params || this.params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', errorCallback || defaultErrorCallback)
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

  async deleteTable(TableName, successCallback, completeCallback) {
    const res = await dynamodb.deleteTable({
      TableName: TableName
    })
    res.on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        errNotify(`Detele Table: ${TableName} Err`, err.message)
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
        errNotify(`Query Table Err`, err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }

  async putItem(params, successCallback, errorCallback = (err) => {
    errNotify(`putItem Table Err`, err.message)
  }, completeCallback) {
    const res = await docClient.put(params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', errorCallback)
      .on('complete', completeCallback || defaultCallback)
      .send()
  }

  async deleteItem(params, successCallback, completeCallback) {
    const res = await docClient.delete(params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        errNotify(`Delete Item Err`, err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }

  async updateTable(params, successCallback, completeCallback) {
    const res = await dynamodb.updateTable(params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        errNotify(`update table Err`, err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }

  async createTable(params, successCallback, completeCallback) {
    const res = await dynamodb.createTable(params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        errNotify(`create table Err`, err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }
}

export default DynamoDBInstance
