<template>
  <div class="pay">
    <!-- <el-menu
      :default-active="$route.name"
      class="el-menu-sidebar"
      @select = "handleChange"
      background-color="#2c3e50"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item v-for="(item,i) in urlArr" :key="i" :index="item.name" :route="item.path">
        <i class="el-icon-document"></i>
        <span slot="title">{{item.title}}</span>
      </el-menu-item> -->
      
      <!-- <el-menu-item index="taskCreation">
        <i class="el-icon-document"></i>
        <span slot="title">任务创建</span>
      </el-menu-item>
      <el-menu-item index="payOperation">
        <i class="el-icon-document"></i>
        <span slot="title">付款操作</span>
      </el-menu-item>
      <el-menu-item index="payVerification">
        <i class="el-icon-document"></i>
        <span slot="title">付款审批</span>
      </el-menu-item>
      <el-menu-item index="approvalDone">
        <i class="el-icon-document"></i>
        <span slot="title">付款支票</span>
      </el-menu-item>
      <el-menu-item index="payReview">
        <i class="el-icon-document"></i>
        <span slot="title">付款复核</span>
      </el-menu-item>
      <el-menu-item index="payClose">
        <i class="el-icon-document"></i>
        <span slot="title">付款核销</span>
      </el-menu-item>
      <el-menu-item index="payment">
        <i class="el-icon-document"></i>
        <span slot="title">财务支付</span>
      </el-menu-item>
      <el-menu-item index="instancyPay">
        <i class="el-icon-document"></i>
        <span slot="title">紧急付款</span>
      </el-menu-item>
      <el-menu-item index="partialDone">
        <i class="el-icon-document"></i>
        <span slot="title">partial完结</span>
      </el-menu-item>
      <el-menu-item index="emailNotify">
        <i class="el-icon-document"></i>
        <span slot="title">邮件通知</span>
      </el-menu-item> 
    </el-menu>-->
    <div class="left-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import {computeSidebar} from '@/assets/js/util.js'
  export default {
    data() {
      return {
        urlArr:[],
       };
    },
    created(){
      this.urlArr = computeSidebar('结算付款',this.$store.state.deFineRout);
    },
     mounted(){
      
    },
    methods: {
      handleChange(key, keyPath){
        this.$router.push({name:key});
      },
    },
  }
</script>
<style>
.pay{
  margin-left: 256px;
}
.left-content{
 margin-left: 20px;
}
.el-menu-sidebar {
  position: fixed;
  top: 70px;
  left: 0;
  width: 180px;
  height: -webkit-fill-available;
  padding-top: 20px;
}
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
</style>
