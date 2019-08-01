<template>
  <div class="billEntry">
    <bill-com processStatusCom='待处理' urlName='billEntry'></bill-com>
  </div>
</template>
<script>
import billCom from '@/components/billCom.vue'
export default {
  components:{
    billCom
  },
  data() {
    return {
      
    }
  }
}
</script>

