<template>
  <div class="closeAccount">
    <el-form label-width="140px">
      <el-form-item label="账期设置">
        <el-radio-group v-model="radio" @change="onChange">
          <el-radio :label="0">开账</el-radio>
          <el-radio :label="1">关账</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱锁定状态设置">
        <el-radio-group v-model="radio2" @change="onChange2">
          <el-radio :label="1">锁定状态</el-radio>
          <el-radio :label="0">解锁状态</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传受款公司信息">
        <el-upload action :before-upload="beforeAvatarUpload" :auto-upload="true" :http-request='upload' :file-list="fileList">
          <el-button size="small" plain type="primary">上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="审批是否发送邮件">
        <el-radio-group v-model="radio3" @change="onChange3">
          <el-radio :label="true">开账</el-radio>
          <el-radio :label="false">关账</el-radio>
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
        radio2:null,
        radio3:null,
        fileList:[],
        file:[],
      };
    },
    mounted(){
      this.$http.get(`api/pay/activitiForPay/updateSendEmailsign`).then(res =>{
        if(res.status === 200 && res.data.code == 0) {
          this.radio3 = res.data.signSendEmail;
        }
      }) 
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
      onChange3(){
        this.$http.get(`api/pay/activitiForPay/updateSendEmailsign`).then(res =>{
        if(res.status === 200 && res.data.code == 0) {
          this.$message({ message: res.data.msg, type: 'success'});
          this.radio3 = res.data.signSendEmail;
        } else if(res.data.code ==1 && res.data.msg) { 
          this.$message.error(res.data.msg);
        }
      }) 
      },
      beforeAvatarUpload(file){
        this.file.push(file);
      },
      upload(file) {
        let resFile = new FormData();
        resFile.append('file', this.file[0]);
        this.$http.post(`uploadApi/othersDO/bscBankInfo/batchAdd `,resFile,{headers:{ 'Content-Type': "application/json;charset=UTF-8" }}).then(res =>{
          if(res.status === 200){
            if(res.data.code == 0){
              this.$message({type: "success",message: res.data.msg});
            } else {
              this.$message.error(res.data.msg);
            }
              this.file = [];
              this.fileList = [];
          } else{
            this.file = [];
            this.fileList = [];
          }
        })
    },
    }
  }
</script>