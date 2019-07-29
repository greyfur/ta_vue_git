<template>
  <div class="payVerification">
    <pay-com goDetailName='APPROVED' :processStatusCom='processStatus' urlName='payVerification'></pay-com>
  </div>
</template>
<script>
import payCom from '@/components/payCom.vue'
export default {
  components:{
    payCom
  },
  data() {
    return {
      emnuRole:{
        86:'一',
        87:'二',
        88:'三',
        89:'四',
        90:'五',
      },
      processStatus:'',
    }
  },
  created(){
    let list = JSON.parse(sessionStorage.getItem('roleIdList'));
    list.forEach(el=>{
      if(this.emnuRole[el]){
        this.processStatus += `待${this.emnuRole[el]}级审批,`
      }
    })
    console.log(sessionStorage.getItem('roleIdList'));
    console.log(this.processStatus);
  },
}
</script>














