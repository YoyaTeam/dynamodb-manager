import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import Table from '@/page/tables'
import Config from '@/page/config'
import Setting from '@/page/setting'
import TableDetail from '@/page/tables/detail'

Vue.use(Router)

const routes = [{
  path: '/',
  name: 'Index',
  component: Index,
  redirect: '/config',
  children: [{
    path: 'table',
    name: 'Table',
    component: Table,
    children: [{
      path: ':tableName',
      name: 'TableDetail',
      component: TableDetail
    }]
  }, {
    path: 'config',
    name: 'Config',
    component: Config
  }, {
    path: 'setting',
    name: 'Setting',
    component: Setting
  }]
}]

const router = new Router({
  mode: 'history',
  scrollBehavior: function(to, from, savedPosition) {
    return savedPosition || {
      x: 0,
      y: 0
    }
  },
  routes
})

export default router
