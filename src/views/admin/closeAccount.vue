<template>
  <div class="closeAccount">
    <el-radio-group v-model="radio" @change="onChange">
      <el-radio :label="0">开账</el-radio>
      <el-radio :label="1">关账</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        radio:null,
      };
    },
    mounted(){
      this.$http.get(`api/administrator/conifg/acountquery`).then(res =>{
        if(res.status === 200) {
          this.radio = +res.data.accountCloseFlag;
         }
      }) 
    },
    methods:{
      onChange(){
        this.$http.post(`api/administrator/conifg/modify`,{variable:'Closing_Accounts',value:this.radio,modifiedBy:this.$store.state.userName+''}).then(res =>{
        if(res.status === 200 && res.data.code ==0) {
          this.$message({
          message: '操作成功',
          type: 'success'
        });
        } else if(res.data.code ==1 && res.data.msg){ 
          this.$message.error(res.data.msg);
         }
      }) 
      }
    }
  }
</script>