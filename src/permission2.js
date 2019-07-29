import router from "./router";
import { constantRouterMap } from './router'
import store from "./store/index";
import routData from '@/assets/js/arrRoute.js'

router.beforeEach((to, from, next) => {
    if(!store.state.reLoad) {
      store.dispatch('AdeFineRout',routData.root);
      let arr = constantRouterMap.concat(routData.root);
      router.options.routes = arr;
      router.addRoutes(arr);
      store.dispatch('AreLoad',1);
      next({ ...to, replace: true })
      } else{
        next(); 
      }
})  


