<template>
  <div class="financialCreat">
    <receipt-com goDetailName processStatusCom="已创建" urlName="financialCreat"></receipt-com>
  </div>
</template>
<script>
import receiptCom from "@/components/receiptCom.vue";
export default {
  components: {
    receiptCom
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
.financialCreat{
  height: 100%;
  padding-left: 20px;
}
</style>