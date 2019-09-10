<template>
  <div class="receipt">
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
      <!-- <el-menu-item index="financialCreat">
        <i class="el-icon-document"></i>
        <span slot="title">财务创建</span>
      </el-menu-item>
      <el-menu-item index="taskClaim">
        <i class="el-icon-document"></i>
        <span slot="title">任务认领</span>
      </el-menu-item>
      <el-menu-item index="credOperation">
        <i class="el-icon-document"></i>
        <span slot="title">收款操作</span>
      </el-menu-item>
      <el-menu-item index="credReview">
        <i class="el-icon-document"></i>
        <span slot="title">收款复核</span>
      </el-menu-item>
      <el-menu-item index="credVerification">
        <i class="el-icon-document"></i>
        <span slot="title">收款核销</span>
      </el-menu-item>
      <el-menu-item index="collectiongEnd">
        <i class="el-icon-document"></i>
        <span slot="title">收款完结</span>
      </el-menu-item>
      <el-menu-item index="viewInvalidate">
        <i class="el-icon-document"></i>
        <span slot="title">暂挂待销</span>
      </el-menu-item> -->
    <!-- </el-menu> -->
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
      this.urlArr = computeSidebar('结算收款',this.$store.state.deFineRout);
    },
    mounted(){
      
    },
    methods: {
      handleChange(key, keyPath){
        this.$router.push({name:key});
      }
    }
  }
</script>
<style>
.receipt{
  /* margin-left: 180px; */
  height: 100%;
  /* overflow:hidden; */ /* 9.10露出滚动条 */
}
.left-content{
  margin-left: 20px;
  height: 100%;
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
