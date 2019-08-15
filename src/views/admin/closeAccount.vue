<template>
  <div class="closeAccount">
    <el-form label-width="140px">
      <el-form-item label="账期设置：">
        <el-radio-group v-model="radio" @change="onChange">
          <el-radio :label="0">开账</el-radio>
          <el-radio :label="1">关账</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱锁定状态设置：">
        <el-radio-group v-model="radio2" @change="onChange2">
          <el-radio :label="1">锁定状态</el-radio>
          <el-radio :label="0">解锁状态</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
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
      this.$http.get(`api/administrator/conifg/emailLockQuery`).then(res =>{
        if(res.status === 200) {
          this.radio2 = +res.data.emailLockFlag;
         }
      }) 
    },
    methods:{
      // 邮箱
      onChange2(){
        this.$http.post(`api/administrator/conifg/unlockEmail`,{value:this.radio2,modifiedBy:this.$store.state.userName}).then(res =>{
        if(res.status === 200 && res.data.code ==0) {
          this.$message({
          message: '操作成功',
          type: 'success'
        });
        } else if(res.data.code ==1 && res.data.msg){       
          this.$message.error(res.data.msg);
         }
         this.$http.get(`api/administrator/conifg/emailLockQuery`).then(res =>{
          if(res.status === 200) {
            this.radio2 = +res.data.emailLockFlag;
          }
      }) 
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