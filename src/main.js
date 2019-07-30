import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import store from './store'
import http from '@/assets/js/http.js' 
import '@/assets/css/font/iconfont.css'
// import filters from '@/assets/js/filter.js' 

// 遍历注册全局过滤器
// Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

Vue.use(http);
// import '@/permission.js' // 权限控制
import '@/permission2.js' // 权限控制

Vue.use(ElementUI);

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import '@/assets/css/reset.css'
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
