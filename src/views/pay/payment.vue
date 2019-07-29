<template>
  <div class="payment">
    <pay-com goDetailName='COMPLETE' processStatusCom='待支付' urlName='payment'></pay-com>
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

