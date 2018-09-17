import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/table'
    },
    {
      path: '/table',
      name: 'table',
      component: () =>
        import('pages/table.vue'),
      children: [{
        path: ':name',
        name: 'tableName',
        component: () =>
          import('pages/table-detail.vue')
      }]
    }
  ]
})
