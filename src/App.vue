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
  methods:{
    logOut() {
      sessionStorage.removeItem('resMenuList');
      sessionStorage.removeItem('roleIdList');
      cookie.remove('jwttoken');
      cookie.remove('jwttokenInfo');
      window.location.href = `http://${cip.loginUrl}:2222/logout?service=http://${cip.currentIp}:${cip.currentPort}/indexPage`;
    }
  }
}
</script>

<style scoped>
  
</style>
