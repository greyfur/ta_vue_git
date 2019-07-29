<template>
  <div class="taskCreation">
    <pay-com goDetailName='' processStatusCom='已创建' urlName='taskCreation'></pay-com>
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

