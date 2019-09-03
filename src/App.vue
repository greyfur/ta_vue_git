<template>
  <div id="app">
    <el-container>
      <el-header style="height: 64px;">
          <router-view name="headNav"/>
      </el-header>
      <el-container class="appMain">
        <el-aside :width="this.flod?'64px':'180px'">
            <router-view name="asideMenu"/>
        </el-aside>
        <el-main >
          <div class="rightList" style="width:100%;height:100%;">
            <router-view/>
          </div>
        </el-main>
      </el-container>
    </el-container>
    
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: 'App',
  computed:{
    ...mapState({
      flod:state=>state.flod
    })
  },
  data() {
    return {
      UName:'',
    };
  },
  created() {  // 获取公共数据
    this.UName = sessionStorage.getItem('userCName');
  },
}
</script>

<style scoped>
#app{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* overflow: hidden; */
}
.el-container{
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex:1;
  overflow: hidden; /*9.3样式*/
}
.el-container .is-vertical{
  width: 100%;
  height: 100%;
  display: flex !important;
  flex-direction: column !important;
}
.el-header{
  height: 64px;
  width: 100%;
  display: flex;
  line-height: 64px;
  background:linear-gradient(270deg,rgba(0,149,193,1) 0%,rgba(1,81,124,1) 88%,rgba(0,92,141,1) 100%);
}
.el-container .appMain{
  display: flex;
  width: 100%;
  flex: 1;
  flex-shrink: 0;
}
.rightList{
  width: 100%;
  flex:1;
}
</style>
