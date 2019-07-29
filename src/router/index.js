import Vue from 'vue'
import Router from 'vue-router'
// import routData from '@/assets/js/arrRoute.js'
Vue.use(Router)

export const constantRouterMap = [
  {
    level:1,
    path: '/',
    name: 'indexPage',
    components:{
      default:() => import("@/components/indexPage"),
      head:() => import("@/views/common/headNav"),
    },
  },
]
// constantRouterMap.contact(routData.root);
export default new Router({
  routes:constantRouterMap,
})
