import {
  DEFAULT_GLOBAL_SETTING
} from '@/constants'

/**
 * 初始化全局配置。
 */
export function initGlobalSetting(reset = false) {
  for (var key in DEFAULT_GLOBAL_SETTING) {
    if (!localStorage.getItem(key) || reset) {
      localStorage.setItem(key, DEFAULT_GLOBAL_SETTING[key])
    }
  }
}
