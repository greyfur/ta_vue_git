<template>
  <div class="billReportForms">
      <p class="title">账单流程汇总报表</p>
      <div class="area">
        <!-- <span>账单报表：</span>
        <el-select clearable filterable v-model="reportType" placeholder="请选择">
          <el-option v-for="(item,index) in ReportFormArr" :key="'h'+index" :label="item.name" :value="item.type">
            <span>{{ item.name }}</span>
          </el-option>
        </el-select> -->
        <span>请选择年月：</span>
        <el-date-picker
            value-format="timestamp"
            v-model="oYearMonth"
            type="month"
            placeholder="请选择">
        </el-date-picker>
          <div class="do">操作： <p class="btn" @click="sure('one')">下载</p></div>
      </div>
      <!-- <div class="area">
        <span>结算报表：</span>
          <el-select clearable filterable v-model="reportTypes" placeholder="请选择">
            <el-option v-for="(item,index) in ReportFormArrs" :key="'h'+index" :label="item.name" :value="item.type">
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
          <span class="slable">录入时间段：</span>
          <el-date-picker
            style="width:220px;margin-bottom:-10px;"
            value-format="timestamp"
            v-model="startDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        <div class="do">操作： <p class="btn" @click="sure('two')">下载</p></div>
      </div>
      <div class="area">
        <span>财务报表：</span>
          <el-select clearable filterable v-model="financialStatementsType" placeholder="请选择">
            <el-option v-for="(item,index) in financialStatements" :key="'h'+index" :label="item.name" :value="item.type">
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
          <span>请选择年月：</span>
          <el-date-picker
              value-format="timestamp"
              v-model="financialStatementsMonth"
              type="month"
              placeholder="请选择">
          </el-date-picker>
        <div class="do">操作： <p class="btn" @click="sure('three')">下载</p></div>
      </div> -->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        oYearMonth:new Date().getTime(),
        financialStatementsMonth:new Date().getTime(),
        startDate:null,
        ReportFormArr:[{
          name:'流程统计报表',
          type:'1'
        },{
          name:'未关闭流程统计报表',
          type:'2'
        },{
          name:'悬停报表',
          type:'3'
        },{
          name:'复核驳回报表',
          type:'4'
        },{
          name:'流程对应账单清单报表',
          type:'5'
        },{
          name:'账单流程汇总报表',
          type:'7'
        }],
        ReportFormArrs:[{
          name:'结算Process汇总报表',
          type:'结算'
        },{
          name:'Partial流程报表',
          type:'Partial'
        },{
          name:'暂挂待销报表',
          type:'暂挂待销'
        },{
          name:'紧急付款报表',
          type:'紧急付款'
        }],
        financialStatements:[{
          name:'收款',
          type:'收款'
        },{
          name:'付款',
          type:'付款'
        }],
        reportType:null,
        reportTypes:null,
        financialStatementsType:null
      };
    },
    methods:{
      sure(str){
        if(str==='one'){
          this.$http.post(`api/reportform`,{
            // reportType:this.reportType,
            reportType:7,
            wsUwYear:this.oYearMonth
          }, { responseType: "blob" }).then(res=>{
            if(res.status===200){
              this.path = this.getObjectURL(res.data);
              if (res.data) {
                  var a = document.createElement("a");
                  if (typeof a.download === "undefined") {
                    window.location = this.path;
                  } else {
                    a.href = this.path;
                    let formatString = escape(res.headers['content-disposition'].split(';')[1].split('=')[1]);
                    a.download =  decodeURI(formatString);
                    //  a.download = new Date().getTime();
                    // a.download = this.ReportFormArr[this.reportType].name;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }
                }
            }
          })
        }else if(str==='two'){
          this.$http.post(`api/reportform/settlement`,{
            reportType:this.reportTypes,
            startDate:this.startDate[0],
            endDate:this.startDate[1]
          }, { responseType: "blob" }).then(res=>{
            if(res.status===200){
              this.path = this.getObjectURL(res.data);
              if (res.data) {
                  var a = document.createElement("a");
                  if (typeof a.download === "undefined") {
                    window.location = this.path;
                  } else {
                    a.href = this.path;
                    let formatString = escape(res.headers['content-disposition'].split(';')[1].split('=')[1]);
                    a.download =  decodeURI(formatString);
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }
                }
            }
          })
        }else if(str==='three'){
          this.$http.post(`api/reportform/finance`,{
            reportType:this.financialStatementsType,
            wsUwYear:this.financialStatementsMonth
          }, { responseType: "blob" }).then(res=>{
            if(res.status===200){
              this.path = this.getObjectURL(res.data);
              if (res.data) {
                  var a = document.createElement("a");
                  if (typeof a.download === "undefined") {
                    window.location = this.path;
                  } else {
                    a.href = this.path;
                    let formatString = escape(res.headers['content-disposition'].split(';')[1].split('=')[1]);
                    a.download =  decodeURI(formatString);
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }
                }
            }
          })
        }
        // }
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
.billReportForms{
 width: 100%;
 height: 100%;
}
.area{
  width: 100%;
  height: 50px;
  background: #fafafa;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
  background: rgb(0, 92, 141);
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  text-align: center;
  line-height: 30px;
}
.title{
  color: #409EFF;
  padding: 20px;
  font-size: 20px;
}
</style>