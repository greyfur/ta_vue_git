<template>
  <div class="payClose">
    <pay-com goDetailName='PAYING' processStatusCom='待核销,已悬停' urlName='payClose'></pay-com>
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

