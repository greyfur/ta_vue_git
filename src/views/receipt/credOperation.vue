<template>
  <div class="credOperation">
    <receipt-com goDetailName='RECHECK' processStatusCom='待处理' urlName='credOperation'></receipt-com>
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

