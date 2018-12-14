export const GLOBAL_SETTINGS_LANGUAGE = 'language'
export const GLOBAL_SETTINGS_FAVORITE_TABLE_TAB = 'favoriteTableTab'
export const GLOBAL_SETTINGS_AUTO_SCAN = 'autoScan'
export const GLOBAL_SETTINGS_PAGE_SIZE = 'pageSize'
export const GLOBAL_SETTINGS_ITEM_EDIT_TYPE = 'itemEditType'
export const GLOBAL_SETTINGS_MAX_RETRY = 'maxRetry'
export const GLOBAL_SETTINGS_CONNECTION_TIMEOUT = 'connectionTimeout'

export const DEFAULT_GLOBAL_SETTING = {
  [`${GLOBAL_SETTINGS_LANGUAGE}`]: 'en',
  [`${GLOBAL_SETTINGS_FAVORITE_TABLE_TAB}`]: 'search',
  [`${GLOBAL_SETTINGS_AUTO_SCAN}`]: 'true',
  [`${GLOBAL_SETTINGS_PAGE_SIZE}`]: '100',
  [`${GLOBAL_SETTINGS_ITEM_EDIT_TYPE}`]: 'form',
  [`${GLOBAL_SETTINGS_MAX_RETRY}`]: 1,
  [`${GLOBAL_SETTINGS_CONNECTION_TIMEOUT}`]: 5
}

export const LOCAL_STORAGE_DYNAMODB_CONFIGS = 'dynamodb_configs'
export const LOCAL_STORAGE_CURRENT_APPLY_CONFIG = 'current_apply_config'

export const DYNAMODB_DATA_TYPE = ['String', 'Binary', 'Number', 'Boolean', 'Null']
export const DYNAMODB_KEY_TYPE = [{
  label: 'String',
  value: 'S'
}, {
  label: 'Binary',
  value: 'B'
}, {
  label: 'Number',
  value: 'N'
}]
export const DYNAMODB_PROJECTED_ATTRIBUTES = [{
  label: 'All',
  value: 'ALL'
}, {
  label: 'Keys only',
  value: 'KEYS_ONLY'
}, {
  label: 'Include',
  value: 'INCLUDE'
}]
export const DYNAMODB_DATA_TYPE_MAP = {
  'S': 'String',
  'B': 'Binary',
  'N': 'Number',
  'String': 'S',
  'Binary': 'B',
  'Number': 'N'
}
export const DYNAMODB_RABGE_KEY_TYPE_CALCULATE = {
  'String': ['=', '<=', '<', '>=', '>', 'Between', 'Begins with'],
  'Binary': ['=', '<=', '<', '>=', '>', 'Between', 'Begins with'],
  'Number': ['=', '<=', '<', '>=', '>', 'Between']
}
export const DYNAMODB_DATA_TYPE_CALCULATE = {
  'String': ['=', '<>', '<=', '<', '>=', '>', 'Between', 'Exists', 'Not exists', 'Contains', 'Not contains', 'Begins with'],
  'Binary': ['=', '<>', '<=', '<', '>=', '>', 'Between', 'Exists', 'Not exists', 'Contains', 'Not contains', 'Begins with'],
  'Number': ['=', '<>', '<=', '<', '>=', '>', 'Between', 'Exists', 'Not exists'],
  'Boolean': ['=', '<>', 'Exists', 'Not exists'],
  'Null': ['Exists', 'Not exists']
}
