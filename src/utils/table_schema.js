class DynamodbTableSchema {
  get schema() {
    return this._schema
  }

  set schema(schema) {
    this._schema = schema
  }

  get tableName() {
    return this._schema.TableName
  }

  get hashKey() {
    return this.getSchemaKey('HASH')
  }

  get hashKeyType() {
    return this.getAttributeType(this.hashKey)
  }

  get rangeKey() {
    return this.getSchemaKey('RANGE')
  }

  get rangeKeyType() {
    return this.getAttributeType(this.rangeKey)
  }

  get tableStatus() {
    return this._schema.TableStatus
  }

  get creationDateTime() {
    return this._schema.CreationDateTime
  }

  get itemCount() {
    return this._schema.ItemCount
  }

  get storageSize() {
    return this._schema.TableSizeBytes
  }

  get readCapacityUnits() {
    return this.ProvisionedThroughput.ReadCapacityUnits
  }

  get writeCapacityUnits() {
    return this.ProvisionedThroughput.WriteCapacityUnits
  }

  get lastDecreaseDateTime() {
    return (this.ProvisionedThroughput.LastDecreaseDateTime || '').toString()
  }

  get lastIncreaseDateTime() {
    return (this.ProvisionedThroughput.LastIncreaseDateTime || '').toString()
  }

  get tableArn() {
    return this._schema.TableArn
  }

  get tableIndex() {
    var tableIndex = [{
      type: 'Table',
      indexName: this.tableName,
      keySchema: {
        hashKey: this.hashKey,
        hashKeyType: this.hashKeyType,
        rangeKey: this.rangeKey,
        rangeKeyType: this.rangeKeyType
      },
      projection: {},
      status: this.tableStatus
    }]
    for (let globalSecondaryIndex of this.GlobalSecondaryIndexes) {
      let hashKey = this.getSchemaKey('HASH', globalSecondaryIndex.KeySchema)
      let rangeKey = this.getSchemaKey('RANGE', globalSecondaryIndex.KeySchema)
      tableIndex.push({
        type: 'GSI Index',
        indexName: globalSecondaryIndex.IndexName,
        keySchema: {
          hashKey: hashKey,
          hashKeyType: this.getAttributeType(hashKey),
          rangeKey: rangeKey,
          rangeKeyType: this.getAttributeType(rangeKey)
        },
        projection: {
          projectionType: globalSecondaryIndex.Projection.ProjectionType,
          nonKeyAttributes: globalSecondaryIndex.Projection.NonKeyAttributes,
          provisionedThroughput: globalSecondaryIndex.Projection.ProvisionedThroughput
        },
        status: globalSecondaryIndex.IndexStatus
      })
    }
    for (let localSecondaryIndex of this.LocalSecondaryIndexes) {
      let hashKey = this.getSchemaKey('HASH', localSecondaryIndex.KeySchema)
      let rangeKey = this.getSchemaKey('RANGE', localSecondaryIndex.KeySchema)
      tableIndex.push({
        type: 'LSI Index',
        indexName: localSecondaryIndex.IndexName,
        keySchema: {
          hashKey: hashKey,
          hashKeyType: this.getAttributeType(hashKey),
          rangeKey: rangeKey,
          rangeKeyType: this.getAttributeType(rangeKey)
        },
        projection: {
          projectionType: localSecondaryIndex.Projection.ProjectionType,
          nonKeyAttributes: localSecondaryIndex.Projection.NonKeyAttributes,
          provisionedThroughput: localSecondaryIndex.Projection.ProvisionedThroughput
        },
        status: this.tableStatus
      })
    }
    return tableIndex
  }

  get ProvisionedThroughput() {
    return this._schema.ProvisionedThroughput
  }

  get KeySchema() {
    return this._schema.KeySchema
  }

  get AttributeDefinitions() {
    return this._schema.AttributeDefinitions || []
  }

  get GlobalSecondaryIndexes() {
    return this._schema.GlobalSecondaryIndexes || []
  }

  get LocalSecondaryIndexes() {
    return this._schema.LocalSecondaryIndexes || []
  }

  getSchemaKey(keyType, keySchemas = this.KeySchema) {
    for (let keySchema of keySchemas) {
      if (keySchema.KeyType === keyType) {
        return keySchema.AttributeName
      }
    }
    return ''
  }

  getAttributeType(attributeName, AttributeDefinitions = this.AttributeDefinitions) {
    for (let attributeDefinition of AttributeDefinitions) {
      if (attributeDefinition.AttributeName === attributeName) {
        return attributeDefinition.AttributeType
      }
    }
    return ''
  }
}

export default DynamodbTableSchema
