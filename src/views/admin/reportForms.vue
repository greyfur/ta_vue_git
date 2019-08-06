<template>
  <div class="reportForms">
      <div class="container">
      </div>
        <div class="container">
        <div class="block">
          <span class="demonstration">选择年月</span>
          <el-date-picker
            v-model="oYearMonth"
            type="month"
            placeholder="选择年月">
          </el-date-picker>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        oYearMonth: ''
      };
    },
    updated(){
      console.log(new Date().toLocaleDateString())
      console.log(this.oYearMonth)
      console.log(this.oYearMonth.toLocaleDateString())
    }
  };
</script>
