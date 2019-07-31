<template>
  <div id="app">
    <div class="head">
      <router-view name="head"/>
    </div>
    <div class="leftNav">
      <router-view/>
    </div>
      
  </div>
</template>

<script>
export default {
  name: 'App',
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
  
</style>
