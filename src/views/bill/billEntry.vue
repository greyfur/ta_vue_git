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
<style scoped>
    /* .el-select__caret {
    margin-top: 0 !important;
    background: red;
}
 .el-pagination__sizes{
    background: red;
  }
.el-pagination
  > .el-pagination__sizes
  > .el-select
  > .el-input__suffix
  > .el-input__suffix-inner
  > .el-select__caret {
  background: red;
} */

</style>

