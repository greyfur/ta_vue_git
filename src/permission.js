import router from "./router";
import cip from '../config/dev.env.js'
import { constantRouterMap } from './router'
import axios from 'axios'
import store from "./store/index";
import { Message } from "element-ui";
import cookie from 'js-cookie' 
import routData from '@/assets/js/arrRoute.js'

let detailArr = routData.root.filter(el=>{ return !el.level; });

window.document.title = "账单结算管理系统";

router.beforeEach((to, from, next) => {
  //  1.首先判断有没有ticket 
  if(window.location.href.indexOf("ticket=") == -1) {
    window.location.href = `${cip.loginUrl}/login?service=http://${cip.currentIp}:${cip.currentPort}/indexPage`;
  }  
  else {
    // 2.判断有没有jwttoken
    if(!cookie.get('jwttokenInfo')){
      let url = window.location.href.split('#');
      axios.get(`api/loginCas`,{params:{uri:url[0]}}).then(res=>{
        if(res.data.code == 0) {
          sessionStorage.setItem('userCName',res.data.userCName);
          sessionStorage.setItem('nameList',JSON.stringify(res.data.usernameInfo));
          // store.dispatch('AnameList',JSON.parse(res.data.usernameInfo));
          cookie.set('jwttokenInfo',res.data);
          store.dispatch('AuserName',res.data.userName);
          // 3.获取权限列表
          axios.get('api/sys/menu/list').then(res =>{
            if(res.status == 200 && res.data.data && res.data.data.length){
              sessionStorage.setItem('mobile',res.data.mobile);
              sessionStorage.setItem('email',res.data.email);
              sessionStorage.setItem('resMenuList',JSON.stringify(res.data.data));
              sessionStorage.setItem('roleIdList',JSON.stringify(res.data.roleIdList));
              let allRoute = detailArr.concat(menuTree(routData.root,res.data.data));
              store.dispatch('AdeFineRout',allRoute);
                 // 判断路由加载次数
                //  setTimeout(()=>{
                if(!store.state.reLoad) {
                  let arr = constantRouterMap.concat(allRoute);
                  router.options.routes = arr;
                  router.addRoutes(arr);
                  console.log(store.state.deFineRout,'/menu/list---a');
                  store.dispatch('AreLoad',1);
                  next({ ...to, replace: true })
                  } else{
                    next();
                    console.log(store.state.deFineRout,'/menu/list---a--else');
                  }
                // },1000)
            } else{
              // 跳转到登录页面，清空缓存
            }
          })
        }
      }).catch(err=>{
        console.log(err,'err')
      })
    } else{ //判断有没有jwttoken
      if(!sessionStorage.getItem('resMenuList')){
        axios.get('api/sys/menu/list').then(res =>{
          if(res.status == 200 && res.data.data && res.data.data.length){
            sessionStorage.setItem('mobile',res.data.mobile);
            sessionStorage.setItem('email',res.data.email);
            sessionStorage.setItem('resMenuList',JSON.stringify(res.data.data));
            sessionStorage.setItem('roleIdList',JSON.stringify(res.data.roleIdList));
            let allRoute = detailArr.concat(menuTree(routData.root,res.data.data));
            store.dispatch('AdeFineRout',allRoute);
               // 判断路由加载次数
                if(!store.state.reLoad) {
                  let arr = constantRouterMap.concat(allRoute);
                  router.options.routes = arr;
                  router.addRoutes(arr);
                  console.log(store.state.deFineRout,'/menu/list---b');
                  store.dispatch('AreLoad',1);
                  next({ ...to, replace: true })
                  } else{
                    next();
                    console.log(store.state.deFineRout,'/menu/list---b--else');
                  }
          } else{
            // 跳转到登录页面，清空缓存
          }
        })
      }
      // 判断路由加载次数
      store.dispatch('AuserName',JSON.parse(cookie.get('jwttokenInfo')).userName);
      if(!store.state.reLoad) {
        let resMenuList = JSON.parse(sessionStorage.getItem('resMenuList'));
        let allRoute = detailArr.concat(menuTree(routData.root,resMenuList));
        store.dispatch('AdeFineRout',allRoute);
        let arr = constantRouterMap.concat(allRoute);
        router.options.routes = arr;
        router.addRoutes(arr);
        store.dispatch('AreLoad',1);
        next({ ...to, replace: true })
        } else{
          next(); 
        }
    }
 
  }  //判断有没有ticket

})   //router.beforEach

function menuTree(all,part){
  let lastArr = [];
  if(part){
    part.forEach((el,i)=>{
      if(all && all.length){
        all.forEach(al=>{
          if(al.title == el.title){
            if(al.level && al.children){
              let Obj = al.children.filter(afl=>{
                return afl.title == el.childrens[0].title;
              })
              if(Obj && Object.keys(Obj).length){
                al['redirect'] = Obj[0]['path'];
              } 
              else{ Message.error('route role 有误！叫你title严格匹配，你偏不！'); }
            }
            lastArr.push(al); 
          }
        })
      }
      if(el.childrens && el.childrens.length){
        if(lastArr[i]){
          lastArr[i]['children'] = menuTree(lastArr[i]['children'],el.childrens);
        }
      }
    })
  }
  
  return lastArr;
}

