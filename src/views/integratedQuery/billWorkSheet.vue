<template>
  <div class="billWorkSheet">
    <div class="btn">
      <el-button type="primary" plain @click="init(0)">刷新</el-button>
      <el-button type="primary" plain @click="handleClick(1)">查询</el-button>
    </div>
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column label="账单号" width="140">
        <template slot-scope="scope">
          <span class="smallHand" @click="goDetail(scope.row)">{{scope.row.wsId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="docId" label="对应文档ID"></el-table-column>
      <el-table-column prop="docPageNum" label="对应文档页码"></el-table-column>
      <el-table-column prop="processId" label="流程编号"></el-table-column>
      <el-table-column prop="sgNum" label="SG号"></el-table-column>
      <el-table-column prop="wsStatus" label="账单状态"></el-table-column>
      <el-table-column prop="wsTitle" label="账单标题"></el-table-column>
      <el-table-column prop="businessId" label="业务编号"></el-table-column>
      <el-table-column prop="section" label="section"></el-table-column>
      <el-table-column prop="uwYear" label="业务年度"></el-table-column>
      <el-table-column prop="businessType" label="任务类型"></el-table-column>
      <el-table-column prop="receiptDate" label="收到账单日期"></el-table-column>
      <el-table-column label="分出公司" width="120">
        <template slot-scope="scope">
          {{scope.row.cedentName}}—{{scope.row.cedentCode}}
        </template>      
      </el-table-column>
      <el-table-column label="经纪公司" width="120">
        <template slot-scope="scope">
          {{scope.row.brokerName}}—{{scope.row.brokerCode}}
        </template>      
      </el-table-column>
      <el-table-column prop="wsType" label="账单类型"></el-table-column>
      <el-table-column prop="wsPeriod" label="账单期"></el-table-column>
      <el-table-column prop="baseCompany" label="Base Company"></el-table-column>
      <el-table-column prop="businessOrigin" label="Business Origin"></el-table-column>
      <el-table-column prop="reportUnit" label="报告单位"></el-table-column>
      <el-table-column prop="dept" label="经营机构"></el-table-column>
      <el-table-column prop="wsCurrency" label="币制"></el-table-column>
      <el-table-column prop="wsAmount" label="金额"></el-table-column>
      <el-table-column prop="createdBy" label="录入人"></el-table-column>
      <el-table-column prop="createdAt" label="录入时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="handleClick(5,scope.row)">踪迹</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="mustData.pageNumber"
      :page-sizes="[20, 50, 80, 100]"
      :page-size="mustData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="mustData.total">      
    </el-pagination>
    <!-- 弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="modal">
      <el-form label-position="right" label-width="140px" :model="billSearch" :rules="rules" ref="billSearch">
        <el-form-item label="Process ID" v-show="title==='查询'">
          <el-input v-model.trim="billSearch.processId" placeholder="请输入内容"></el-input>
        </el-form-item>
        <!--   以上只有查询有 --------->
        <el-form-item label="账单类型" v-show="title==='手工创建' || title==='编辑' || title==='查询'">
          <el-select clearable v-model="billSearch.wsType" placeholder="请选择">
            <el-option v-for="item in ZDoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账期" v-show="title==='手工创建' || title==='编辑'" class="zqForm">
          <!-- <el-date-picker value-format="timestamp" v-model="billSearch.wsPeriod" type="month" placeholder="选择月"></el-date-picker> -->
          <el-input v-model="zq2" placeholder="请输入" class="wsPeriod"></el-input>
          <el-select clearable v-model="zq1" placeholder="请选择" class="wsPeriod">
            <el-option v-for="item in zqList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="流程状态" v-show="title === '查询' && urlName === 'billEntry'">
          <el-select clearable v-model="billSearch.processStatus" placeholder="请选择">
            <el-option v-for="item in ['待处理','已悬停']" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="选择下一任务处理人" v-show="title==='流程提交'">
          <el-select clearable v-model="assignee"  placeholder="请输入关键词">
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-collapse v-show="title=='踪迹'">
        <el-collapse-item title="状态流转图">
          <img :src="picture" style="width:100%">
        </el-collapse-item>
      </el-collapse>
      <el-table :data="track" border style="width: 100%" v-show="title==='踪迹'">
        <el-table-column prop="processId" label="流程编号" width="200"></el-table-column>
        <el-table-column prop="actName" label="操作名称"></el-table-column>
        <el-table-column prop="actOperator" label="任务来源"></el-table-column>
        <el-table-column prop="actTime" label="操作时间"></el-table-column>
        <el-table-column prop="reason" label="操作原因"></el-table-column>
        <el-table-column prop="remark" label="操作备注"></el-table-column>
      </el-table>
      <el-pagination small 
      v-show="title=='踪迹'"
      layout="prev, pager, next" 
      :total="ZJObj.total" 
      :page-size="ZJObj.pageSize"
      @current-change="ZJhandleCurrentChange"  
      :current-page="ZJObj.pageNumber">
      </el-pagination>
      <el-upload
        v-show="title==='上传附件'"
        class="sort-upload"
        action
        :before-upload="beforeAvatarUpload"
        :auto-upload="true"
        :http-request='upload'
        :file-list="fileList">
        <el-button size="small" type="primary">上传</el-button>
      </el-upload>
      <el-table stripe :data="fileData" style="width: 100%" class="document" v-show="title==='上传附件'">
        <el-table-column prop="docName" label="文件名"></el-table-column>
        <el-table-column prop="createdAt" label="时间"></el-table-column>
        <el-table-column prop="createdBy" label="任务来源"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click.stop="detailRemove(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" v-show="title=='手工创建' || title=='查询' || title=='编辑' || title=='流程提交'">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm('billSearch')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import routData from '@/assets/js/arrRoute.js';
export default {
  name: 'billWorkSheet',
  props:{  // urlName页面名称  processStatusCom流程状态  goDetailName详情页tag
    urlName:'',
    processStatusCom:'',
  },
  data() {
    return {
      tableData:[],
      assignee:'',
      modal:false,
      YWoptions:[
        {value: 'T',label: '合约账单'},
        {value: 'F',label: '临分账单'},
        {value: 'O',label: '转分账单'},
        {value: 'C',label: '理赔账单'},
      ],
      YWoptionsObj:{
        'T':'合约账单',
        'F':'临分账单',
        'O':'转分账单',
        'C':'理赔账单',
      },
      zqList:[
        'Variable',
        '10th Of 12',
        '11th Of 12',
        '12th Of 12',
        '1st Of 12',
        '1st Of 2',
        '1st Of 3',
        '1st Of 4',
        '2nd Of 12',
        '2nd Of 2',
        '2nd Of 3',
        '2nd Of 4',
        '3rd Of 12',
        '3rd Of 3',
        '3rd Of 4',
        '4th Of 12',
        '4th Of 4',
        '5th Of 12',
        '6th Of 12',
        '7th Of 12',
        '8th Of 12',
        '9th Of 12',
        'Yearly',
      ],
      options:[],
      TJRoptions:[],
      ZDoptions:[ 
        {value: 'AA',label: 'Additional Account'},
        {value: 'AD',label: 'Adjustment'},
        {value: 'CCA',label: 'Cash Claim Account'},
        {value: 'CA',label: 'Commission Adjustment'},
        {value: 'COMMUTATION',label: 'Commutation'},
        {value: 'CRA',label: 'Correction Account'},
        {value: 'FC',label: 'Fac Claim '},
        {value: 'FP',label: 'Fac Premium'},
        {value: 'INIA',label: 'Initial Account'},
        {value: 'IA',label: 'Internal Account'},
        {value: 'LP',label: 'Loss Participation'},
        {value: 'NCB',label: 'No Claim Bonus'},
        {value: 'OCA',label: 'Outstanding Cash Advance '},
        {value: 'PTF',label: 'Portfolio Transfer'},
        {value: 'PA',label: 'Premium Adjustment'},
        {value: 'PC',label: 'Profit Commission'},
        {value: 'RA',label: 'Regular Account'},
        {value: 'RCA',label: 'Regular Claim Account'},
        {value: 'RPA',label: 'Regular Premium Account'},
        {value: 'RP',label: 'Reinstatement Premium'},
        {value: 'SA',label: 'Supplementary Account'},
        {value: 'SCA',label: 'Supplementary Claim Account'},
        {value: 'SCRA',label: 'Supplementary Claim Reserve Account'},
        {value: 'SPA',label: 'Supplementary Premium Account'},
        {value: 'XLMDP',label: 'XL MDP'},
      ],
      ZDoptionsObj:{
        'AA':'Additional Account',
        'AD':'Adjustment',
        'CCA':'Cash Claim Account',
        'CA':'Commission Adjustment',
        'COMMUTATION': 'Commutation',
        'CRA': 'Correction Account',
        'FC': 'Fac Claim ',
        'FP': 'Fac Premium',
        'INIA': 'Initial Account',
        'IA': 'Internal Account',
        'LP': 'Loss Participation',
        'NCB': 'No Claim Bonus',
        'OCA': 'Outstanding Cash Advance ',
        'PTF': 'Portfolio Transfer',
        'PA': 'Premium Adjustment',
        'PC': 'Profit Commission',
        'RA': 'Regular Account',
        'RCA': 'Regular Claim Account',
        'RPA': 'Regular Premium Account',
        'RP': 'Reinstatement Premium',
        'SA': 'Supplementary Account',
        'SCA': 'Supplementary Claim Account',
        'SCRA': 'Supplementary Claim Reserve Account',
        'SPA': 'Supplementary Premium Account',
        'XLMDP': 'XL MDP',
      },
      title:'',
      hide:false,
      dialogFormVisible: false,
      billSearch: {
        processId:null,
        processStatus:null,
        wsType:null,
        wsPeriod:null,
        wsBusinessType:null,
        wsCedentCode:null,
        wsCedentName:null,
        wsBrokerCode:null,
        wsBrokerName:null,
        wsReceiptDate:null,
      },
      mustData:{
        actOperator:null,
        wsType:null,
        // wsType:['WorkSheet'],
        // processStatus:'',
        pageNumber:1,  // 页数
        pageSize:20,  //页面一次要展示的条数
        total:0, //总条数
      },
      fileList:[],
      file:[],
      chooseRow:{},
      dialogState:0,
      track:[],
      setTime:null,
      fileData:[],
      picture:'',
      cedentList:[],
      brokerList:[],
      brokerModel:null,
      cedentModel:null,
      ZJObj:{
        total:50,
        pageNumber:1,  // 页数
        pageSize:10,  //页面一次要展示的条数
      },
      ZJprocessId:'',
      zq1:'',
      zq2:'',
      rules:{
        wsBusinessType: [
          { required: true, message: '请选择任务类型', trigger: 'blur' }
        ],
      },
      pendingFlag:false,
    };
  },
  created(){
    this.mustData.processStatus = this.processStatusCom;
    this.mustData.actOperator = this.$store.state.userName;
  },
  mounted(){
    this.$http.post('api/activiti/getAssigneeName',{roleName:'账单录入'}).then(res =>{
      if(res.status === 200){
        this.TJRoptions = res.data;
      }
    })
    this.init();
    setTimeout(()=>{
      // 分出人
      this.cedentList = JSON.parse(sessionStorage.getItem('CedentType'));
      // 经纪人
      this.brokerList = JSON.parse(sessionStorage.getItem('BrokerType'));
    },1000)
  },
  methods: {
    handleSizeChange(val) {
      this.mustData.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.mustData.pageNumber = val;
      this.init();
    },
    ZJhandleCurrentChange(val) {
      this.ZJObj.pageNumber = val;
      this.getZJData(this.ZJprocessId);
    },
    init(tag) {
      // 进首页查询
      this.$http.post('api/integeratedQuery/Worksheetlist',Object.assign({},this.mustData,{actName:this.$store.state.userName,actOperator:this.$store.state.userName})).then(res =>{
       console.log(res,',,,');
       if(res.status === 200 ) {
          this.tableData = res.data.rows;
          this.mustData.total = res.data.total;
          if(tag == 0){
            this.$message({type: 'success', message: '刷新成功'}); 
          }
        }
      })
    },
    confirm(formName){
      if(this.title==='手工创建' || this.title==='编辑'){
        if(this.zq2 && this.zq1){
          this.billSearch.wsPeriod = `${this.zq2}-${this.zq1}`;
        }
      }
      if(this.cedentModel != null){
        let obj = this.cedentList[this.cedentModel];
        this.billSearch.wsCedentCode = obj.codecode;
        this.billSearch.wsCedentName = obj.codeName;
      }
      if(this.brokerModel != null){
        let obj = this.brokerList[this.brokerModel];
        this.billSearch.wsBrokerCode = obj.codecode;
        this.billSearch.wsBrokerName = obj.codeName;
      }
      switch(this.dialogState){
        case 0:    // 创建
          this.$refs[formName].validate((valid) => {
            console.log(valid,'valid');
            if(valid) {
              this.$http.post('api/worksheet/wSEntry/save',Object.assign({},this.mustData,this.billSearch)).then(res =>{
              if(res.status === 200 && res.data.msg === '操作成功'){
                this.dialogFormVisible = false;
                this.init();
                }
              })
            } 
          })
          
          break;
        case 1:    // 查询
        if(this.zq2 && this.zq1){
          this.billSearch.wsPeriod = `${this.zq2}-${this.zq1}`;
        }
        // if(!this.billSearch.processStatus){ this.billSearch.processStatus = this.processStatusCom; }
        let params = Object.assign({},this.mustData,this.billSearch,{curOperator:this.$store.state.userName});
        delete params['actOperator'];
          this.$http.post('api/integeratedQuery/Worksheetlist',params).then(res =>{
              if(res.status === 200){
                if(!res.data.rows.length){
                  this.$message({type: 'warning', message: '未查询出数据'}); 
                } else{
                  this.tableData = res.data.rows;
                  this.mustData.total = res.data.total;
                  this.dialogFormVisible = false;
                }
                
              }
            })
          break;
        case 2:  // 编辑
        this.$http.post('api/worksheet/wSEntry/update',Object.assign({},this.billSearch,this.mustData,{processId:this.chooseRow.processId})).then(res =>{
            if(res.status === 200 && res.data.msg === '操作成功'){
              this.dialogFormVisible = false;
              this.init();
            }
          })
          break;
        case 3:   // 流程提交
          this.$http.post('api/worksheet/activitiForWorksheet/commonActivitiForWorksheet',{processId:this.chooseRow.processId, procInstId:this.chooseRow.processInstId, assignee:this.assignee, type:'ACTIVE',actOperator:this.$store.state.userName,}).then(res =>{
            if(res.status === 200 && res.data.errorCode == 1){
              this.dialogFormVisible = false;
              this.$message({type: 'success', message: '提交成功!'});  
              this.init();
            }
          })
          // 出弹窗
          break;
        case 5: // 踪迹待定
           this.dialogFormVisible = false;
          break;
      }
    },
    handleClick(tag,row){
      this.dialogState = tag;
      this.chooseRow = row;
      console.log(this.tableData,'tableData');
      switch(tag){
        case 0: 
          for(let k in this.billSearch){
            this.billSearch[k] = null;
          }
          this.zq2 = null;
          this.zq1 = null;
          this.brokerModel = null;
          this.cedentModel = null;
          this.dialogFormVisible = true;
          this.title = '手工创建';
          break;
        case 1: 
        for(let k in this.billSearch){
            this.billSearch[k] = null;
          }
          this.zq2 = null;
          this.zq1 = null;
          this.brokerModel = null;
          this.cedentModel = null;
          this.dialogFormVisible = true;
          this.title = '查询';
          break;
        case 2: 
          // 账单类型
            if(row.wsType){ this.billSearch.wsType = row.wsType;  }
          // 任务类型
            if(row.wsBusinessType){ this.billSearch.wsBusinessType = row.wsBusinessType;  }
          // 账单收到日期
          if(row.wsReceiptDate){
            this.billSearch.wsReceiptDate = new Date(row.wsReceiptDate).valueOf();
          }
          //  分出人cedentModel  cedentList        
          if(row.wsCedentCode){
            this.cedentList.forEach((el,i)=>{
              if(el.codecode == row.wsCedentCode){
                this.cedentModel = i;
              }
            })
           }
          // 经纪人brokerModel   brokerList
          if(row.wsBrokerCode){
            this.brokerList.forEach((el,i)=>{
              if(el.codecode == row.wsBrokerCode){
                this.brokerModel = i;
              }
            })
           }
          // 账期
          if(row.wsPeriod){
            let arr = row.wsPeriod.split('-');
            this.zq2 = arr[0];
            this.zq1 = arr[1];
          }
          this.dialogFormVisible = true;
          this.title= '编辑';
          break; 
        case 3:   // 流程提交
          this.dialogFormVisible = true;
          this.title = '流程提交';
          // 出弹窗
          break;
        case 4: // 删除
          this.$confirm(`确认删除${row.processId} process?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('api/worksheet/wSEntry/remove',{processId:row.processId}).then(res =>{
              if(res.status === 200 && res.data.code == 0){
                  this.$message({type: 'success', message: '删除成功!'});  
                  this.init();             
              }
            })
          })
          break;
        case 5: // 踪迹待定
          this.title = '踪迹'; 
          this.ZJprocessId = row.processId;
          this.getZJData(row.processId);
          this.$http.post('api/activiti/getProcPicture',{procInstId:row.processInstId},{responseType:'blob'}).then(res =>{
            if(res.status === 200 ) {
              this.picture = window.URL.createObjectURL(res.data);
              console.log(res,'流程图');
            }
          })
          
          break;
        case 6: // 上传附件
          this.$http.get(`api/worksheet/wSEntry/edit/${row.processId}`).then(res =>{
          if(res.status === 200) {
            this.fileData = res.data.bscDocumentVOlist;
            this.dialogFormVisible = true;
            this.title = '上传附件';
          }
        })
         break;
      }  
    },
    getZJData(id){
      this.$http.post('api/othersDO/bscProcessAction/list',Object.assign({},{processId:id,actOperator:this.$store.state.userName},this.ZJObj)).then(res =>{
        console.log(res,'踪迹列表');
        if(res.status === 200 ) {
          this.track = res.data.rows;
          this.ZJObj.total=res.data.total;
          this.dialogFormVisible = true;
        }
      })
    },
    detailRemove(row){
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { 
        this.$http.post('api/anyShare/fileOperation/deleteFilesForPage',
        {docPath:row.docPath, docName:row.docName, processId:this.chooseRow.processId, actOperator:this.$store.state.userName})
        .then(res =>{
          if(res.status === 200 && res.data.errorCode == 1) {
            this.$http.get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`).then(res =>{
              if(res.status === 200) {
                this.fileData = res.data.bscDocumentVOlist;
              }
            })
          }
        })
      })
    },
    refresh(){ window.location.reload(); },
    beforeAvatarUpload(file){
      this.file.push(file);
      clearTimeout(this.setTime);
    },
    upload(file) {
      this.setTime=setTimeout(()=>{
        let resFile = new FormData();
        this.file.forEach(el=>{
          resFile.append('file',el);
        })
        resFile.append('actOperator',this.$store.state.userName);
        resFile.append('processId', this.chooseRow.processId);
        this.$http.post('api/anyShare/fileOperation/uploadFilesForPage',resFile,{headers:{ 'Content-Type': "application/json;charset=UTF-8" }}).then(res =>{
          if(res.status === 200 && res.data.errorCode == 1){
            this.fileList = [];
            this.file = [];
            this.$http.get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`).then(res =>{
              if(res.status === 200) {
                this.fileData = res.data.bscDocumentVOlist;
              }
            })
          } else{
            if(res.data.errorMessage){
              this.$message.error(res.data.errorMessage);
            }
            this.fileList = [];
            this.file = [];
          }
        })
      },500)
    },
    goDetail(row){
      let routeData = this.$router.resolve({
          name: 'detailEntry',
          query: {
            tag: 'billWorkSheet',
            num: row.processId,
            row: JSON.stringify(row),
            SIGNBACK: row.wsSignbackFlag
            }
        });
        window.open(routeData.href, '_blank');
    },
  }
}
</script>

<style scoped>
.billWorkSheet {
  padding-right: 30px;
}
.btn {
  text-align: right;
  margin-bottom: 20px;
}
.el-pagination{
  text-align: right;
  margin-top: 20px;
}
.el-input .el-input__inner{
  width: 220px;
}
.detail-ul{
  margin-left: 10px;
}
.detail-ul li{
  margin-bottom: 10px;
}
.detail-ul li .detail-content{
  color: #999;
}
.sort-upload{
  margin-bottom: 20px;
}
.el-collapse-item:last-child{
  margin-bottom: 20px;
}
.el-select, .el-select-dropdown__list{
  width: 194px;
}
.el-radio-group .el-radio{
  margin-bottom: 10px;
}
.zqForm .el-form-item__content{
  display: flex;
  border: 1px solid #DCDFE6;
  width: fit-content;
}
.wsPeriod{
  width: 120px;
}
.billWorkSheet .el-input{
  width: 196px;
}
.smallHand {
  cursor: pointer;
  color:#409EFF;
}
</style>