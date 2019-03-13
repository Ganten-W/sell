import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=> import("@/pages/home"),
      children:[
        {
          path: '/',
          name: 'goods',
          component:()=> import("@/pages/goods/goods")
        },
        {
          path: '/ratings',
          name: 'ratings',
          component:()=> import("@/pages/ratings/ratings")
        },
        {
          path: '/seller',
          name: 'seller',
          component:()=> import("@/pages/seller/seller")
        }
      ]
    }
  ]
})
