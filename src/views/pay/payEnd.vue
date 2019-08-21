<template>
  <div class="payEnd">
    <pay-com goDetailName='CLOSE' processStatusCom='已完结' urlName='payEnd'></pay-com>
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