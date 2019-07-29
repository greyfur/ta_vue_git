<template>
  <div class="billCheck">
    <bill-com processStatusCom='待复核' urlName='billCheck'></bill-com>
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

