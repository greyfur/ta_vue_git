<template>
  <div class="taskClaim">
    <receipt-com goDetailName='' processStatusCom='待认领' urlName='taskClaim'></receipt-com>
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

