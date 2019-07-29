<template>
  <div class="payReview">
    <pay-com goDetailName='VERIFY' processStatusCom='待复核' urlName='payReview'></pay-com>
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

