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
    this._client = dynamodb
  }

  get config() {
    return this._config
  }

  set config(config) {
    this._config = config
    this.refresh(config)
  }

  get client() {
    return this._client
  }

  set client(name) {
    name === 'dynamodb' ? this._client = dynamodb : this._client = docClient
  }

  refresh(config) {
    AWS.config.update(config)
    dynamodb = new AWS.DynamoDB()
    docClient = new AWS.DynamoDB.DocumentClient()
    this.client = 'dynamodb'
  }

  async listTables(params, successCallback, completeCallback) {
    console.log(this.client)
    const res = await this.client.listTables(params || this.params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        errNotify('List Table Err', err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }

  async describeTable(TableName, successCallback, completeCallback) {
    const res = await this.client.describeTable({
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
    const res = await this.client.scan(params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        errNotify(`Scan Table Err`, err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }

  async queryTable(params, successCallback, completeCallback) {
    const res = await this.client.query(params)
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
    console.log(this.client)
    const res = await this.client.query(params)
    res
      .on('success', successCallback || defaultCallback)
      .on('error', (err) => {
        console.log(err)
        errNotify(`putItem Table Err`, err.message)
      })
      .on('complete', completeCallback || defaultCallback)
      .send()
  }
}

export default DynamoDBInstance
