const zh = {
  nav: {
    setting: '设置',
    setting_global_setting: '全局设置',
    setting_global_setting_children: '首选项',
    table: '表',
    table_connection: '连接',
    table_connection_config: '配置',
    table_table: '表'
  },
  setting_form: {
    label_language: '语言',
    label_language_en: '英语',
    label_language_zh: '简体中文',
    label_favorite_table_tab: '首次进入标签页',
    label_auto_scan: '访问项目选项卡时自动执行扫描操作',
    label_page_size: '分页查询数量',
    default: '默认'
  },
  config: {
    button_add_config: '添加链接',
    button_edit: '编辑',
    button_remove: '移除',
    button_apply: '应用',
    table_header_alias: '别名',
    table_header_endpoint: '端点',
    table_header_region: '区域',
    table_header_created_time: '添加时间',
    table_header_action: '操作',
    table_header_access_key: 'Access Key',
    table_header_secret_key: 'Secret Key',
    dialog_title: '配置',
    dialog_button_test_connection: '连接测试',
    dialog_button_save: '添加',
    dialog_button_save_and_apply: '添加并应用'
  },
  table: {
    table_list: {
      button_create_table: '创建表',
      button_delete_table: '删除表',
      input_search_placeholder: '搜索',
      table_header_table_name: '表名'
    },
    tab_nav: {
      table_info: '表信息',
      item_search: '数据搜索',
      table_index: '索引'
    },
    table_info: {
      tab_basic_info: '基础信息',
      tab_table_schema: '表结构'
    },
    item_search: {
      button_create_item: '创建项目',
      button_inport_file: '导入 JSON',
      button_delete_item: '删除项目',
      button_start_search: '开始搜索',
      button_cancel_change: '取消更改',
      search_default_title: '点击搜索按钮开始扫描',
      search_result_title: '正在查看 {start} 到 {end} 个项目',
      search_type_scan: '扫描',
      search_type_query: '查询',
      table: '表',
      index: '索引',
      search_add_filter: '添加筛选条件',
      search_filter: '筛选条件',
      search_filter_relate: '和',
      placeholder_enter_attribute: '输入属性',
      placeholder_entry_value: '输入值',
      label_partition_key: '项目键',
      label_sort_key: '排序键',
      label_extra_sort: '排序方式',
      sort_ascending: '升序',
      sort_descending: '降序',
      update_header_show_dialog_title: '显示/隐藏列',
      update_header_show_dialog_table_header_cloumns: '列',
      i_refresh: '刷新',
      i_setting: '列设置',
      i_download: '下载当前查询结果'
    },
    json_file_import: {
      import_title: '导入 JSON 文件',
      uploading_title: '正在导入中...',
      upload_text_first: '将文件拖到此处，或',
      upload_text_second: '点击上传',
      comment: '只能上传 JSON 文件'
    },
    index: {
      button_created_index: '创建索引',
      button_delete_index: '删除索引',
      title_gsi_index: '全局二级索引',
      title_lsi_index: '表和本地二级索引',
      table_header_name: '索引名',
      table_header_type: '索引类型',
      table_header_partition_key: '项目键',
      table_header_sort_key: '排序键',
      table_header_projection_type: '属性',
      table_header_index_status: '状态'
    },
    create_table_dialog: {
      title: '创建表',
      field_table_name: '表名',
      field_index_name: '索引名',
      field_second_index: '二级索引',
      field_projected_attributes: '投射属性',
      button_add_sort_key: '添加排序键',
      button_add_index: '添加索引',
      button_add: '添加',
      button_as_lsi: '创建为本地二级索引',
      button_import_scheam: '导入 Schema'
    }
  },
  confirm: {
    title: '请确认',
    button_cancel: '取消',
    button_yes: '是的，删除',
    delete_index: '请输入索引名 <i style="color: teal">{index_name}</i> 来进行确认',
    delete_table: '请输入表名 <i style="color: teal">{table_name}</i> 来进行确认',
    delete_config: '此操作将永久删除该配置, 是否继续?',
    delete_item: '<i style="color: teal"> {length} </i> 个数据已选择，是否继续删操作?'
  },
  message: {
    cancel: {
      delete: '删除操作已取消!',
      delete_table: '表名不匹配，删除操作已取消!'
    },
    failure: {
      config_apply: '配置未生效!',
      config_update: '配置更新失败!',
      index_exist: '索引 {index_name} 已经存在!',
      delete_index: '索引名不匹配，删除操作已取消!',
      attribute_name_not_match: '{attribute_name} 和已有类型不匹配!',
      copy: '无法复制到粘贴板!',
      filter: '过滤器属性和值不能为空!',
      only_json_file: '只支持 JSON 文件!',
      error_json: 'Json 格式不正确',
      no_data: '没有有效数据!',
      import_failure: '数据导入完成，成功 {success} 条， 失败 {error} 条，已下载失败数据！'
    },
    success: {
      delete: '删除成功!',
      config_apply: '配置已生效!',
      config_update: '配置更新成功!',
      config_create: '配置创建成功!',
      delete_table: '删除表 {table_name} 成功!',
      create_table: '创建表 {table_name} 成功!',
      add_index: '添加索引 {index_name} 成功!',
      delete_index: '删除索引 {index_name} 成功!',
      copy: '已添加到粘贴板!',
      import_success: '数据导入成功!'
    }
  },
  dynamodb_endpoints_regions: [{
    region: '美国',
    options: [{
      regionName: '美国东部 (弗吉尼亚北部)',
      region: 'us-east-1',
      endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
    }, {
      regionName: '美国东部 (俄亥俄)',
      region: 'us-east-2',
      endpoint: 'https://dynamodb.us-east-2.amazonaws.com'
    }, {
      regionName: '美国西部 (加利福尼亚北部)',
      region: 'us-west-1',
      endpoint: 'https://dynamodb.us-west-1.amazonaws.com'
    }, {
      regionName: '美国西部 (俄勒冈)',
      region: 'us-west-2',
      endpoint: 'https://dynamodb.us-west-2.amazonaws.com'
    }]
  }, {
    region: '亚太',
    options: [{
      regionName: '亚太区域 (孟买)',
      region: 'ap-south-1',
      endpoint: 'https://dynamodb.ap-south-1.amazonaws.com'
    }, {
      regionName: '亚太地区 (新加坡)',
      region: 'ap-southeast-1',
      endpoint: 'https://dynamodb.ap-southeast-1.amazonaws.com'
    }, {
      regionName: '亚太地区 (悉尼)',
      region: 'ap-southeast-2',
      endpoint: 'https://dynamodb.ap-southeast-2.amazonaws.com'
    }, {
      regionName: '亚太地区 (东京)',
      region: 'ap-northeast-1',
      endpoint: 'https://dynamodb.ap-northeast-1.amazonaws.com'
    }, {
      regionName: '亚太区域 (首尔)',
      region: 'ap-northeast-2',
      endpoint: 'https://dynamodb.ap-northeast-2.amazonaws.com'
    }, {
      regionName: '亚太区域(大阪本地)',
      region: 'ap-northeast-3',
      endpoint: 'https://dynamodb.ap-northeast-3.amazonaws.com'
    }]
  }, {
    region: '加拿大',
    options: [{
      regionName: '加拿大（中部)',
      region: 'ca-central-1',
      endpoint: 'https://dynamodb.ca-central-1.amazonaws.com'
    }]
  }, {
    region: '中国',
    options: [{
      regionName: '中国 (北京)',
      region: 'cn-north-1',
      endpoint: 'https://dynamodb.cn-north-1.amazonaws.com.cn'
    }, {
      regionName: '中国 (宁夏)',
      region: 'cn-northwest-1',
      endpoint: 'https://dynamodb.cn-northwest-1.amazonaws.com.cn'
    }]
  }, {
    region: '欧洲',
    options: [{
      regionName: '欧洲 (法兰克福)',
      region: 'eu-central-1',
      endpoint: 'https://dynamodb.eu-central-1.amazonaws.com'
    }, {
      regionName: '欧洲 (爱尔兰)',
      region: 'eu-west-1',
      endpoint: 'https://dynamodb.eu-west-1.amazonaws.com'
    }, {
      regionName: '欧洲 (伦敦)',
      region: 'eu-west-2',
      endpoint: 'https://dynamodb.eu-west-2.amazonaws.com'
    }, {
      regionName: '欧盟 (巴黎)',
      region: 'eu-west-3',
      endpoint: 'https://dynamodb.eu-west-3.amazonaws.com'
    }]
  }, {
    region: '南美洲',
    options: [{
      regionName: '南美洲 (圣保罗)',
      region: 'sa-east-1',
      endpoint: 'https://dynamodb.sa-east-1.amazonaws.com'
    }]
  }, {
    region: 'AWS GovCloud',
    options: [{
      regionName: 'AWS GovCloud (美国) 东部',
      region: 'us-gov-east-1',
      endpoint: 'https://dynamodb.us-gov-east-1.amazonaws.com'
    }, {
      regionName: 'AWS GovCloud（美国）',
      region: 'us-gov-west-1',
      endpoint: 'https://dynamodb.us-gov-west-1.amazonaws.com'
    }]
  }]
}

export default zh
