import Vue from 'vue'
import Router from 'vue-router'
import MySelect from '@/components/MySelect/select'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'vue-tree',
      component: MySelect
    }
  ]
})
