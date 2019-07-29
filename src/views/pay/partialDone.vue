<template>
  <div class="partialDone">
    <pay-com goDetailName='COMPLETE' processStatusCom='待补录' urlName='partialDone'></pay-com>
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

