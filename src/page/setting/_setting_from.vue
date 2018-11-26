<template>
  <div id="setting">
    <el-col :span="12">
      <el-form ref="form" :model="setting" label-position="left" label-width="150px">
        <el-form-item :label="$t('setting_form.label_language')">
          <el-radio-group v-model="setting.language" @change="languageChange">
            <el-radio label="en">{{$t('setting_form.label_language_en')}} ({{$t('setting_form.default')}})</el-radio>
            <el-radio label="zh">{{$t('setting_form.label_language_zh')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('setting_form.label_favorite_table_tab')">
          <el-radio-group v-model="setting.favoriteTableTab" @change="favoriteTableTabChange">
            <el-radio label="info">{{$t('table.tab_nav.table_info')}}</el-radio>
            <el-radio label="search">{{$t('table.tab_nav.item_search')}} ({{$t('setting_form.default')}})</el-radio>
            <el-radio label="index">{{$t('table.tab_nav.table_index')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('setting_form.label_page_size')">
          <el-radio-group v-model="setting.pageSize" @change="pageSizeChange">
            <el-radio label="50">50</el-radio>
            <el-radio label="100">100 ({{$t('setting_form.default')}})</el-radio>
            <el-radio label="200">200</el-radio>
            <el-radio label="500">500</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('setting_form.label_auto_scan')">
          <el-radio-group v-model="setting.autoScan" @change="autoScanChange">
            <el-radio label="true">Yes ({{$t('setting_form.default')}})</el-radio>
            <el-radio label="false">No</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import {
  GLOBAL_SETTINGS_LANGUAGE,
  GLOBAL_SETTINGS_FAVORITE_TABLE_TAB,
  GLOBAL_SETTINGS_AUTO_SCAN,
  GLOBAL_SETTINGS_PAGE_SIZE
} from '@/constants'
export default {
  data() {
    return {
      setting: {
        language: localStorage.getItem(GLOBAL_SETTINGS_LANGUAGE),
        favoriteTableTab: localStorage.getItem(
          GLOBAL_SETTINGS_FAVORITE_TABLE_TAB
        ),
        autoScan: localStorage.getItem(GLOBAL_SETTINGS_AUTO_SCAN),
        pageSize: localStorage.getItem(GLOBAL_SETTINGS_PAGE_SIZE)
      }
    }
  },
  methods: {
    languageChange(val) {
      localStorage.setItem(GLOBAL_SETTINGS_LANGUAGE, val)
      this.$i18n.locale = val
    },
    favoriteTableTabChange(val) {
      localStorage.setItem(GLOBAL_SETTINGS_FAVORITE_TABLE_TAB, val)
    },
    autoScanChange(val) {
      localStorage.setItem(GLOBAL_SETTINGS_AUTO_SCAN, val)
    },
    pageSizeChange(val) {
      localStorage.setItem(GLOBAL_SETTINGS_PAGE_SIZE, val)
    }
  }
}
</script>

<style scoped>
#setting {
  padding: 50px 50px;
  text-align: left;
}
</style>
