<template>
  <div class="reportForms">
      <div class="area">
        <span>请选择年月：</span>
        <el-date-picker
            value-format="timestamp"
            v-model="oYearMonth"
            type="month"
            placeholder="选择年月">
          </el-date-picker>
          <span>选择报表：</span>
          <el-select clearable filterable v-model="reportType" placeholder="请选择">
            <el-option v-for="(item,index) in ReportFormArr" :key="'h'+index" :label="item.name" :value="item.type">
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
          <div class="do">操作： <p class="btn" @click="sure">确定</p></div>
         
      </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        oYearMonth:new Date().getTime(),
        ReportFormArr:[{
          name:'报表名称1',
          type:'1'
        },{
          name:'报表名称2',
          type:'2'
        },{
          name:'报表名称3',
          type:'3'
        },{
          name:'报表名称4',
          type:'4'
        },{
          name:'报表名称5',
          type:'5'
        },{
          name:'报表名称6',
          type:'6'
        }],
        reportType:null
      };
    },
    updated(){
      // /reportform
      console.log(new Date(this.oYearMonth).toLocaleString())
      console.log(this.reportType)
    },
    methods:{
      sure(){
        if(this.reportType===null||this.oYearMonth===null){
          this.$message.error('请选择年月和报表类型')
        }else{
          // this.$http({
          //   url:`api/reportform`,
          //   method:'POST',
          //   headers:{
          //     responseType: "blob"
          //   },
          //   data:{
          //     reportType:this.reportType,
          //   }
          // }).then(res=>{
          //   console.log(res)
          // })
          this.$http.post(`api/reportform`,{
            reportType:this.reportType,
            wsUwYear:this.oYearMonth
          }, { responseType: "blob" }).then(res=>{
            if(res.status===200){
              console.log(res)
              this.path = this.getObjectURL(res.data);
              console.log(this.path)
              if (res.data) {
                  var a = document.createElement("a");
                  if (typeof a.download === "undefined") {
                    window.location = this.path;
                  } else {
                    a.href = this.path;
                    a.download = new Date().getTime();
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }
                }
            }
            // console.log(res)
          })
        }
      },
      getObjectURL(file) {
        let url = null;
        if (window.createObjectURL != undefined) {
          // basic
          url = window.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
          // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        } else if (window.URL != undefined) {
          // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        }
        return url;
      }
    }
  };
</script>
<style scoped>
.reportForms{
 width: 100%;
 height: 100%;
}
.area{
  width: 100%;
  height: 50px;
  background: #fafafa;
  display: flex;
  align-items: center;
}
.area span{
  margin: 0 20px;
}
.do{
  height: 50px;
  display: flex;
  align-content: center;
  line-height: 50px;
  margin-left: 20px;
}
.btn{
  width: 80px;
  height: 30px;
  background: orange;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  text-align: center;
  line-height: 30px;
}
</style>

