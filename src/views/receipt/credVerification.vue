<template>
  <div class="credVerification">
    <receipt-com goDetailName='CLOSE' processStatusCom='待核销,已悬停' urlName='credVerification'></receipt-com>
  </div>
</template>
<script>
import receiptCom from '@/components/receiptCom.vue'
export default {
  components:{
    receiptCom
  },
  data() {
    return {
      
    }
  }
}
</script>
