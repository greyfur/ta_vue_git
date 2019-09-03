<template>
  <div class="payOperation">
    <pay-com goDetailName='APPROVE' processStatusCom='待处理,已悬停' urlName='payOperation'></pay-com>
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
  },
}
</script>

