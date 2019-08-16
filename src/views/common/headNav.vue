<template>
  <div class="headNav">
    <div class="verticalParent">
      <div class="vertical" :class="{'widthNum':fold}" ref="vertical">
        <div class="logo">
          <img :class="{'marginImg':fold}" src="@/assets/img/ball.png" alt="">
          <span class="word" v-show="!fold">
            <span style="font-size:16px;display: inline-block;transform: scale(.9);">中再产险</span><br/> 
            <span class="enWord">CHINA RE P&C</span>
          </span>
          <span class="line" v-show="!fold"></span>
          <span class="word" v-show="!fold">
            <span style="font-size:15px;display: inline-block;transform: scale(.9);">账单结算管理</span><br/> 
            <span class="enWord">Accounts/Settlement</span>
          </span>
        </div>
        <el-menu
          router
          unique-opened
          :collapse="fold"
          :collapse-transition="transtionflag"
          :default-active="$route.name"
          class="el-menu-vertical-demo"
          background-color="#005C8D"
          text-color="#fff"
          @open="handleOpen"
          active-text-color="#fff">
          <el-submenu :index="el.name" v-for="(el,index) in urlArr" :key="index" class="navFirst">
            <template slot="title">
              <i style="color:#fff;" :class="iconEmnu[el.name]"></i>
              <span>{{el.title}}</span>
            </template>
              <el-menu-item v-for="(item,i) in el.children" :key="i" :index="item.name" :class="{'is-active':$route.name == item.name}">
                <span slot="title">{{item.title}}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="logOut">
      <span style="color:#999;">
        <i class="el-icon-user-solid"></i><span style="color:rgba(0,0,0,0.65);">{{UName}}</span>
      </span>
      <span class="logOutWord" @click="logOut">
        <i class="el-icon-switch-button" style="margin-right:4px;"></i>退出
      </span>
    </div>
  </div>
</template>
 
<script>
import cip from '../../../config/dev.env.js'
import cookie from 'js-cookie' 
import {computeNavbar} from '@/assets/js/util.js'
import {computeName} from '@/assets/js/util.js'
  export default {
    data() {
      return {
        name: '',
        urlArr:[],
        firstName:'',
        UName:'',
        fold:true,
        transtionflag:false,
        iconEmnu:{
          'bill':'iconfont iconzhangdan',
          'receipt':'iconfont iconshoukuan',
          'pay':'iconfont iconfukuan',
          'integratedQuery':'iconfont iconzonghechaxun',
          'admin':'iconfont iconguanliyuan',
        }
      };
    },
    created() {  // 获取公共数据
      this.UName = sessionStorage.getItem('userCName')
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
      if(this.$route.name === 'detailEntry' || this.$route.name === 'detailCred' || this.$route.name === 'detailPay'){
        this.fold = true;
      } else{ this.fold = false; }

      this.urlArr = computeNavbar(this.$store.state.deFineRout);
      if(computeName(this.$route.name,this.$store.state.deFineRout)){
        this.name = computeName(this.$route.name,this.$store.state.deFineRout);
      } else{
        window.location.href = `${window.location.href}${this.firstName}`
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        this.$router.push({name:key})
      },
      handleOpen(){

      },
      change(){
        this.fold=!this.fold;
      },
      logOut() {
        sessionStorage.removeItem('resMenuList');
        sessionStorage.removeItem('roleIdList');
        cookie.remove('jwttoken');
        cookie.remove('jwttokenInfo');
        window.location.href = `http://${cip.loginUrl}:2222/logout?service=http://${cip.currentIp}:${cip.currentPort}/indexPage`;
      }
    },
    watch:{
      $route(to,from){
        this.name = computeName(to.name,this.$store.state.deFineRout);
        if(to.name === 'detailEntry' || to.name === 'detailCred' || to.name === 'detailPay'){
          this.fold = true;
        } else{ this.fold = false; }
      },
      '$store.state.deFineRout':function(n,o){
      }
    }
  }
</script>
<style>
  .vertical{
    height: -webkit-fill-available;
    width: 256px;
    background-color:#005C8D;
    position: fixed;
    z-index: 10
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
    margin-left: -11px;
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
  .logOut{
    color: #fff;
    font-size: 14px;
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #D9D9D9;
    text-align: right;
    padding-right: 30px;
    line-height: 60px;
    margin-bottom: 10px;
  }
  .logOutWord {
    margin-left: 20px;
    color:#1A6C98;
    cursor: pointer;
    font-weight: 700;
  }
</style>
