<template>
  <div class="instancyPay">
    <pay-com goDetailName='CONDITIONALCOMPLETE' processStatusCom='待支付' urlName='instancyPay'></pay-com>
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
      
    }
  }
}
</script>

