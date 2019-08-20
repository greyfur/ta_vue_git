<template>
  <div class="viewInvalidate">
    <!-- <receipt-com goDetailName='CLOSE' processStatusCom='暂挂待销' urlName='viewInvalidate'></receipt-com> -->
    <receipt-com goDetailName='COMPLETE' processStatusCom='暂挂待销' urlName='viewInvalidate'></receipt-com>
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

