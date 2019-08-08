<template>
  <div class="integratedQuery">
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
    created() {
      this.urlArr = computeSidebar('综合查询',this.$store.state.deFineRout);
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
.integratedQuery{
  margin-left: 256px;
  width: 100%;
  height: 100%;
}
.left-content{
  margin-left: 20px;
  width: 100%;
  height: 100%;
}
.el-menu-sidebar {
  position: fixed;
  top: 70px;
  left: 0;
  width: 180px;
  /* height: -webkit-fill-available; */
  height: 100%;
  padding-top: 20px;
}
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
</style>
