<template>
  <div class="closeAccount">
    <div>账期设置</div>
    <el-radio-group v-model="radio" @change="onChange">
      <el-radio :label="0">开账</el-radio>
      <el-radio :label="1">关账</el-radio>
    </el-radio-group>
    <div>邮箱锁定设置</div>
    <el-radio-group v-model="radio2" @change="onChange2">
      <el-radio :label="1">锁定</el-radio>
      <el-radio :label="0">解锁</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        radio:null,
        radio2:null
      };
    },
    mounted(){
      this.$http.get(`api/administrator/conifg/acountquery`).then(res =>{
        if(res.status === 200) {
          this.radio = +res.data.accountCloseFlag;
         }
      }) 
      this.$http.get(`api/modify/emailLockQuery`).then(res =>{
        if(res.status === 200) {
          this.radio2 = +res.data.accountCloseFlag;
         }
      }) 
    },
    methods:{
      // 邮箱
      onChange2(){
        this.$http.post(`api/modify/unlockEmail`,{value:this.radio2,modifiedBy:this.$store.state.userName}).then(res =>{
        if(res.status === 200 && res.data.code ==0) {
          this.$message({
          message: '操作成功',
          type: 'success'
        });
        } else if(res.data.code ==1 && res.data.msg){       
          this.$message.error(res.data.msg);
         }
      }) 
      },
      // 开关账
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
      },
    }
  }
</script>