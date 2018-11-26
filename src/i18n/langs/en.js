const en = {
  nav: {
    setting: 'Setting',
    setting_global_setting: 'Global Setting',
    setting_global_setting_children: 'Preferences',
    table: 'Table',
    table_connection: 'Table Connection',
    table_connection_config: 'Connection Config',
    table_table: 'Table'
  },
  setting_form: {
    label_language: 'Language',
    label_language_en: 'English',
    label_language_zh: 'Chinese',
    label_favorite_table_tab: 'Favorite table tab',
    label_auto_scan: 'Automatic scan operation when accessing the items tab',
    label_page_size: 'Items tab page size',
    default: 'Default'
  },
  config: {
    button_add_config: 'Add Connection',
    button_edit: 'Edit',
    button_remove: 'Remove',
    button_apply: 'Apply',
    table_header_alias: 'Alias',
    table_header_endpoint: 'Endpoint',
    table_header_region: 'Region',
    table_header_created_time: 'Created Time',
    table_header_action: 'Actions',
    table_header_access_key: 'Access Key',
    table_header_secret_key: 'Secret Key',
    dialog_title: 'Config',
    dialog_button_test_connection: 'Test Connection',
    dialog_button_save: 'Save'
  },
  table: {
    table_list: {
      button_create_table: 'Create Table',
      button_delete_table: 'Delete Table',
      input_search_placeholder: 'Search table',
      table_header_table_name: 'Table Name'
    },
    tab_nav: {
      table_info: 'Table Info',
      item_search: 'Item Search',
      table_index: 'Table Index'
    },
    table_info: {
      tab_basic_info: 'Basic Info',
      tab_table_schema: 'Table Schema'
    },
    item_search: {
      button_create_item: 'Create Item',
      button_delete_item: 'Delete Item',
      button_start_search: 'Start Search',
      button_cancel_change: 'Cancel Change',
      search_default_title: 'Click search to scan table',
      search_result_title: 'Viewing {start} to {end} Items',
      search_type_scan: 'Scan',
      search_type_query: 'Query',
      search_add_filter: 'Add filter',
      search_filter: 'Filter',
      search_filter_relate: 'And',
      placeholder_enter_attribute: 'Enter attribute',
      placeholder_entry_value: 'Enter value',
      label_partition_key: 'Partition Key',
      label_sort_key: 'Sort Key',
      label_extra_sort: 'Sort',
      sort_ascending: 'Ascending',
      sort_descending: 'Descending',
      update_header_show_dialog_title: 'Header Setting'
    },
    index: {
      button_created_index: 'Create Index',
      button_delete_index: 'Delete Index',
      title_gsi_index: 'GSI Index',
      title_lsi_index: 'Table And LSI Index',
      table_header_name: 'Name',
      table_header_type: 'Type',
      table_header_partition_key: 'Partition Key',
      table_header_sort_key: 'Sort Key',
      table_header_projection_type: 'Projection Type',
      table_header_index_status: 'Status'
    },
    create_table_dialog: {
      title: 'Create Dynamodb Table',
      field_table_name: 'Table Name',
      field_index_name: 'Index Name',
      field_second_index: 'Second Index',
      field_projected_attributes: 'Projected Attributes',
      button_add_sort_key: 'Add sort key',
      button_add_index: 'Add Index',
      button_add: 'Add',
      button_as_lsi: 'Create As Local Secondary Index'
    }
  },
  confirm: {
    title: 'Confirm',
    button_cancel: 'Cancel',
    button_yes: 'Yes, delete it!',
    delete_index: 'please input the index name <i style="color: teal">{index_name}</i> you want delete',
    delete_table: 'please input the table name <i style="color: teal">{table_name}</i> you want delete',
    delete_config: 'This action will permanently delete the configuration, continue to delete?',
    delete_item: '<i style="color: teal"> {length} </i> items selected, you want to delete ?'
  },
  message: {
    cancel: {
      delete: 'Delete operation canceled!',
      delete_table: 'the table name is wrong, delete operation canceled!'
    },
    failure: {
      config_apply: 'Configuration is not in effect',
      config_update: 'Configuration update failed',
      index_exist: 'index {index_name} already exist!',
      delete_index: 'the index name is wrong, delete operation canceled!',
      attribute_name_not_match: 'Type of {attribute_name} does not match existing data type',
      copy: 'Can not copy!',
      filter: 'Filter attribute and value must not be empty!'
    },
    success: {
      delete: 'Delete Success!',
      config_apply: 'Configuration has taken effect!',
      config_update: 'Configuration update succeeded!',
      config_create: 'Configuration create succeeded!',
      delete_table: 'Delete table {table_name} succeeded!',
      create_table: 'Create table {table_name} succeeded!',
      add_index: 'Add index {index_name} succeeded!',
      delete_index: 'Delete index {index_name} succeeded!',
      copy: 'Added to pasteboard!'
    }
  },
  dynamodb_endpoints_regions: [{
    region: 'US',
    options: [{
      regionName: 'US East (N. Virginia)',
      region: 'us-east-1',
      endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
    }, {
      regionName: 'US East (Ohio)',
      region: 'us-east-2',
      endpoint: 'https://dynamodb.us-east-2.amazonaws.com'
    }, {
      regionName: 'US West (N. California)',
      region: 'us-west-1',
      endpoint: 'https://dynamodb.us-west-1.amazonaws.com'
    }, {
      regionName: 'US West (Oregon)',
      region: 'us-west-2',
      endpoint: 'https://dynamodb.us-west-2.amazonaws.com'
    }]
  }, {
    region: 'Asia Pacific',
    options: [{
      regionName: 'Asia Pacific (Mumbai)',
      region: 'ap-south-1',
      endpoint: 'https://dynamodb.ap-south-1.amazonaws.com'
    }, {
      regionName: 'Asia Pacific (Singapore)',
      region: 'ap-southeast-1',
      endpoint: 'https://dynamodb.ap-southeast-1.amazonaws.com'
    }, {
      regionName: 'Asia Pacific (Sydney)',
      region: 'ap-southeast-2',
      endpoint: 'https://dynamodb.ap-southeast-2.amazonaws.com'
    }, {
      regionName: 'Asia Pacific (Tokyo)',
      region: 'ap-northeast-1',
      endpoint: 'https://dynamodb.ap-northeast-1.amazonaws.com'
    }, {
      regionName: 'Asia Pacific (Seoul)',
      region: 'ap-northeast-2',
      endpoint: 'https://dynamodb.ap-northeast-2.amazonaws.com'
    }, {
      regionName: 'Asia Pacific (Osaka-Local)',
      region: 'ap-northeast-3',
      endpoint: 'https://dynamodb.ap-northeast-3.amazonaws.com'
    }]
  }, {
    region: 'Canada',
    options: [{
      regionName: 'Canada (Central)',
      region: 'ca-central-1',
      endpoint: 'https://dynamodb.ca-central-1.amazonaws.com'
    }]
  }, {
    region: 'China',
    options: [{
      regionName: 'China (Beijing)',
      region: 'cn-north-1',
      endpoint: 'https://dynamodb.cn-north-1.amazonaws.com'
    }, {
      regionName: 'China (Ningxia)',
      region: 'cn-northwest-1',
      endpoint: 'https://dynamodb.cn-northwest-1.amazonaws.com'
    }]
  }, {
    region: 'EU',
    options: [{
      regionName: 'EU (Frankfurt)',
      region: 'eu-central-1',
      endpoint: 'https://dynamodb.eu-central-1.amazonaws.com'
    }, {
      regionName: 'EU (Ireland)',
      region: 'eu-west-1',
      endpoint: 'https://dynamodb.eu-west-1.amazonaws.com'
    }, {
      regionName: 'EU (London)',
      region: 'eu-west-2',
      endpoint: 'https://dynamodb.eu-west-2.amazonaws.com'
    }, {
      regionName: 'EU (Paris)',
      region: 'eu-west-3',
      endpoint: 'https://dynamodb.eu-west-3.amazonaws.com'
    }]
  }, {
    region: 'South America',
    options: [{
      regionName: 'South America (São Paulo)',
      region: 'sa-east-1',
      endpoint: 'https://dynamodb.sa-east-1.amazonaws.com'
    }]
  }, {
    region: 'AWS GovCloud',
    options: [{
      regionName: 'AWS GovCloud (US-East)',
      region: 'us-gov-east-1',
      endpoint: 'https://dynamodb.us-gov-east-1.amazonaws.com'
    }, {
      regionName: 'AWS GovCloud (US)',
      region: 'us-gov-west-1',
      endpoint: 'https://dynamodb.us-gov-west-1.amazonaws.com'
    }]
  }]
}

export default en
