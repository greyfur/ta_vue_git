<template>
  <div class="asideMenu">
    <div class="verticalParent">
      <div class="vertical" :class="{'widthNum':this.flod}" ref="vertical">
        <!-- <div class="logo" style="margin-left:2px;">
          <img :class="{'marginImg':fold}" src="@/assets/img/ball.png" style="transform: scale(.9);" alt="error">
          <span class="word" v-show="!fold">
            <span style="font-size:15px;display: inline-block;transform: scale(.9);width:80px;">中再产险</span>
            <span class="enWord">CHINA RE P&C</span>
          </span>
          <span class="line" v-show="!fold"></span>
          <span class="word" v-show="!fold" style="margin-left:-15px;">
            <span style="font-size:15px;display: inline-block;transform: scale(.9);width:90px;">账单结算管理</span>
            <span class="enWord">Accounts/Settlement</span>
          </span>
        </div> -->
        <el-menu
          style="overflow:hidden;"
          router
          unique-opened
          :collapse-transition="transtionflag"
          :collapse="this.flod"
          :default-active="$route.name"
          class="el-menu-vertical-demo"
          background-color="#005C8D"
          text-color="#fff"
          @open="handleOpen"
          active-text-color="#fff">
          <el-submenu v-if="$route.name==='detailEntry'|| $route.name==='detailCred'||$route.name==='detailPay'" style="background:#005C8D !important;" key="hyd" index="hyd">
            <template slot="title">
              <router-link :to="{name:$route.query.tag}">
                <i class="iconfont iconleft-circle-o" style="color:#fff;"></i>
              </router-link>
              <router-link :to="{name:$route.query.tag}">
                <span style="color:#fff;">返回</span>
              </router-link>
            </template>
            <el-menu-item>
              <router-link :to="{name:$route.query.tag}">
              </router-link>
              <router-link :to="{name:$route.query.tag}">
                <span style="color:#fff;">返回</span>
              </router-link>
            </el-menu-item>
          </el-submenu>
          <el-submenu :index="el.name" v-for="(el,index) in urlArr" :key="index" class="navFirst">
            <template slot="title">
              <i style="color:#fff;" :class="iconEmnu[el.name]"></i>
              <span>{{el.title}}</span>
            </template>
              <el-menu-item v-for="(item,i) in el.children" :key="i" :index="item.name" :class="{'is-active':$route.name == item.name}">
                <el-badge :value="item.redPoint" class="item" :hidden="item.redPoint==0">
                  <div>{{item.title}}</div>
                  <!-- <span slot="title"></span> -->
                </el-badge>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div :class="this.flod?'changeExtends':'changeExtend'">
      <span @click.stop="changeExtend('伸')" style="margin-left:-3px;" v-if="this.flod===false">
        <img src="@/assets/img/leftExtend@2x.png" alt="">  
      </span>
      <span @click.stop="changeExtend('缩')" v-else-if="this.flod===true">
         <img src="@/assets/img/rightExtend@2x.png" alt="">  
      </span>
    </div>
    <!-- <div class="logOut">
      <span style="color:#999;">
        <i class="el-icon-user-solid"></i><span style="color:rgba(0,0,0,0.65);">{{UName}}</span>
      </span>
      <span class="logOutWord" @click="logOut">
        <i class="el-icon-switch-button" style="margin-right:4px;"></i>退出
      </span>
    </div> -->
  </div>
</template>
 
<script>
const devEnv = require('../../../config/dev.env.js');
import cip from '../../../config/dev.env.js'
import cookie from 'js-cookie' 
import {computeNavbar} from '@/assets/js/util.js'
import {computeName} from '@/assets/js/util.js'
import { mapState } from "vuex";
  export default {
    computed:{
       ...mapState({
         flod:state=>state.flod
       })
    },
    data() {
      return {
        name: '',
        urlArr:[],
        firstName:'',
        // UName:'',
        // fold:true,
        ws: null,
        transtionflag:false,
        iconEmnu:{
          'bill':'iconfont iconzhangdan',
          'receipt':'iconfont iconshoukuan',
          'pay':'iconfont iconfukuan',
          'integratedQuery':'iconfont iconzonghechaxun',
          'admin':'iconfont iconguanliyuan',
        },
      }
    },
    created() {  // 获取公共数据
      if(typeof(WebSocket)=='function'){
        this.initWebSocket();
      } else{
        this.$message.error('浏览器不支持webSocket');
      }
      // 获取币制
      if(!sessionStorage.getItem('CurrencyList')){
        this.$http.post('api/sics/basis/getCurrencyList').then(res =>{
          if(res.status === 200){
            sessionStorage.setItem('CurrencyList',JSON.stringify(res.data));
          }
        })
      }

      // 获取集团产再
      if(!sessionStorage.getItem('baseCompany')){
        this.$http.get('api/sics/basis/getBaseCompanyList').then(res =>{
          if(res.status === 200){
            sessionStorage.setItem('baseCompany',JSON.stringify(res.data));
          }
        })
      }
      // 获取国际国内
      if(!sessionStorage.getItem('businessOrigin')){
        this.$http.get('api/sics/basis/getBusinessOriginList').then(res =>{
          if(res.status === 200){
            sessionStorage.setItem('businessOrigin',JSON.stringify(res.data));
          }
        })
      }
      // 获取账单类型
      if(!sessionStorage.getItem('wsType')){
        this.$http.get('api/sics/basis/getWorkShetTypeList').then(res =>{
          if(res.status === 200){
            if(res.data){
                res.data.forEach((el,i)=> {
                if(el.code=='NONE'){
                  res.data.splice(i,1);
                }
              })
            }
            sessionStorage.setItem('wsType',JSON.stringify(res.data));
          }
        })
      }
      // 获取银行账户列表
      if(!sessionStorage.getItem('AllBankAccountList')){
        this.$http.post('api/sics/basis/getReceiptBankAccountList',{}).then(res =>{
          if(res.status === 200){
            sessionStorage.setItem('AllBankAccountList',JSON.stringify(res.data));
          }
        })
      }
      // 获取BrokerType账户列表
      if(!sessionStorage.getItem('BrokerBankList')){
        this.$http.post('api/sics/basis/getCedentListByReceiptBank',{codeType:'BrokerType'}).then(res =>{
          if(res.status === 200){
            sessionStorage.setItem('BrokerBankList',JSON.stringify(res.data));
          } 
        })
      }
      // 获取再保险人
      if(!sessionStorage.getItem('ReinsurerList')){
        this.$http.post('api/sics/basis/getCedentListByReceiptBank',{codeType:'ReinsurerType'}).then(res =>{
          if(res.status === 200){
            sessionStorage.setItem('ReinsurerList',JSON.stringify(res.data));
          }
        })
      }
      // 获取CedentType账户列表
      if(!sessionStorage.getItem('CedentBankList')){
        this.$http.post('api/sics/basis/getCedentListByReceiptBank',{codeType:'CedentType'}).then(res =>{
          if(res.status === 200){
            sessionStorage.setItem('CedentBankList',JSON.stringify(res.data));
          }
        })
      }
      // 获取分出人信息
      if(!sessionStorage.getItem('CedentType')){
        this.$http.post('api/sics/basis/getCedentList',{codeType:'CedentType'}).then(res =>{
          if(res.status === 200){
            sessionStorage.setItem('CedentType',JSON.stringify(res.data));
          }
        })
      }
      // 获取经纪人信息
      if(!sessionStorage.getItem('BrokerType')){
        this.$http.post('api/sics/basis/getCedentList',{codeType:'BrokerType'}).then(res =>{
          if(res.status === 200){
            sessionStorage.setItem('BrokerType',JSON.stringify(res.data));
          }
        })
      }
      if(this.$store.state.deFineRout){
        let arr = this.$store.state.deFineRout;
        for(let i = 0; i < arr.length; i++){
          if(arr[i].children && arr[i].children.length){
              this.name = arr[i]['name']; 
              this.firstName = arr[i]['children'][0]['name'];
              return false;
            }
        }        
      }
    },
    mounted(){
      this.urlArr = computeNavbar(this.$store.state.deFineRout);
      if(computeName(this.$route.name,this.$store.state.deFineRout)){
        this.name = computeName(this.$route.name,this.$store.state.deFineRout);
      } else{
        window.location.href = `${window.location.href}${this.firstName}`
      }
    },
    // destroyed () {
    //   this.ws.close() ;
    // },
    methods: {
      handleSelect(key, keyPath) {
        this.$router.push({name:key})
      },
      handleOpen(){

      },
      changeExtend(str){
        if(str==='伸'){
          this.$store.commit('ChangeFlod',true)
        }else if(str==='缩'){
           this.$store.commit('ChangeFlod',false)
        }
      },
      initWebSocket () { // 初始化weosocket
        this.ws = new WebSocket(devEnv.webSocketUrl);
        this.ws.onmessage = this.websocketonmessage;
        this.ws.onopen = this.websocketonopen;
        this.ws.onerror = this.websocketonerror;
        this.ws.onclose = this.websocketclose;
        },
      websocketonopen () { // 连接建立之后执行send方法发送数据
        // if(this.ws.readyState==1){
          // this.ws.send(this.$store.state.userName);
        // }
      },
      websocketonerror () {
        console.log( "WebSocket连接发生错误" + ',状态码：' + this.ws.readyState)
      },
      websocketonmessage (e) { // 数据接收
        console.log('数据接收状态码'+this.ws.readyState);
        if(e.data && e.data.substr(0,1)=='{' && e.data.substr(1,1)=='"'){
          let upcomingObj = JSON.parse(e.data)[this.$store.state.userName];
          let arrurl = computeNavbar(this.$store.state.deFineRout);
          arrurl.forEach(el=>{
            if(upcomingObj[el.title]){
              el.children.forEach(al=>{
                al['redPoint'] = upcomingObj[el.title][al.num];
              })
            }
          })
          this.urlArr = arrurl;
          console.log(upcomingObj);
        }
      },
      websocketclose (e) {  // 关闭
        console.log('已关闭连接',e);
      }
    },
    watch:{
      $route(to,from){
        this.name = computeName(to.name,this.$store.state.deFineRout);
         if(this.$route.name == 'detailEntry' || this.$route.name == 'detailCred' || this.$route.name == 'detailPay'){
        this.$store.commit('ChangeFlod',true)
      } else{ this.$store.commit('ChangeFlod',false) }
      },
      // '$store.state.deFineRout':function(n,o){
      // }
    }
  }
</script>
<style>
div.asideMenu::-webkit-scrollbar{
  width:0px;
  height:0px;
}
div.asideMenu::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:2px;
}
div.asideMenu::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:10px;
}
div.asideMenu::-webkit-scrollbar-thumb:hover{
  background: #bfbfbf
}
div.asideMenu::-webkit-scrollbar-corner{
  background: #bfbfbf;
}
div::-webkit-scrollbar{
  width:15px;
  height:15px;
}
div::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:2px;
}
div::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:10px;
}
div::-webkit-scrollbar-thumb:hover{
  background: #bfbfbf
}
div::-webkit-scrollbar-corner{
  background: #bfbfbf;
}
.el-badge__content{
  /* padding: 0 3px; */
  border: none;
  font-size: 12px;
}
.el-badge__content.is-fixed{
  top: 25px;
  right: -6px;
}
  .asideMenu{
    height:100%;
    background-color:#005C8D;
    overflow: hidden;
    overflow-y: auto;
  }
  .vertical{
    height: -webkit-fill-available;
    
    /* width: 256px; */
    width: 180px;
    background-color:#005C8D;
    /* position: fixed; */
    /* z-index: 10 */
  }
  .transverse{
    width: 100%;
    height: 60px;
  }
  .logo {
    height: 30px;
    display: flex;
    align-items: center;
    margin:16px 22px;
    width: 100%;
    padding-top: 40px;
    margin-top: 0;
    margin-bottom: 30px;
  }
  .logo .word{
    color: #fff;
    font-family:PingFangSC-Regular;
    height: 30px;
    line-height: 15px;
    padding-top: 2px;
  }
  .logo .word .enWord{
    font-size: 12px;
    transform: scale(0.7);
    display: inline-block;
    margin-left: -15px;
  }
  .logo img {
    height: 30px;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-right: 6px;
  }
  .el-menu-head{
    width: max-content;
    margin-left: 50px;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .el-menu{
    border-right:none;
  }
  .logo .line{
    height: 30px;
    width: 1px;
    background-color:rgba(255,255,255,1);
    border-radius:1px;
    opacity:0.2587;
    margin-left: -7px;
    /* margin-right: 3px; */
  }
  .el-submenu__title,.el-submenu__title>i{
    color: rgba(255,255,255,.65)!important;
  }
  .vertical .is-active .el-submenu__title,.vertical .is-active .el-submenu__title>i{
    color: rgba(255,255,255,1)!important;
  }
  .vertical .is-opened .el-submenu__title,.vertical .is-opened .el-submenu__title>i{
    color: rgba(255,255,255,1)!important;
  }
  .el-menu-item{
    background-color: #01517C!important;
    background: #01517C!important;
    color: rgba(255,255,255,.65)!important;
  }
  .vertical .is-active{
    /* background: linear-gradient(270deg,rgba(0,72,111,1) 0%,rgba(64,152,195,0.37) 31%,rgba(64,152,195,0.37) 71%,rgba(0,72,111,1) 100%)!important; */
    background-color: #014366 !important;
    /* background-color: linear-gradient(270deg,rgba(0,72,111,1) 0%,rgba(64,152,195,0.37) 31%,rgba(64,152,195,0.37) 71%,rgba(0,72,111,1) 100%)!important; */
    color: rgba(255,255,255,1)!important;
  }

  .fold{
    position: absolute;
    top: 30px;
    left: 266px;
    z-index:1000;
  }
  .widthNum{
    width: 64px;
  }
  .marginImg{ margin-right: 20px !important; }
  .marginFold{ left: 74px !important; }
  .changeExtend{
    position: absolute;
    left: 180px;
    top: 80px;
    cursor: pointer;
  }
  .changeExtends{
     position: absolute;
    left: 64px;
    top: 80px;
    cursor: pointer;
  }
  .el-submenu:nth-child(1) .el-submenu__title{
    box-shadow:0 1px 3px inset rgba(0,0,0,.4);
  }
</style>
