<template>
  <div class="credReview">
    <receipt-com goDetailName='VERIFY' processStatusCom='待复核' urlName='credReview'></receipt-com>
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

