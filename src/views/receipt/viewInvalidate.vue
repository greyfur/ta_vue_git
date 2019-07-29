<template>
  <div class="viewInvalidate">
    <receipt-com goDetailName='CLOSE' processStatusCom='暂挂待销' urlName='credVerification'></receipt-com>
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

