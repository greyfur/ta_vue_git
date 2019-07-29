<template>
  <div class="settlementGroup">
    <div class="btn">
      <el-button type="primary" plain @click="init(0)">刷新</el-button>
      <el-button type="primary" plain @click="handleClick(4)">查询</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.worksheetDOList" style="width: 100%">
            <el-table-column prop="wsId" label="账单号"></el-table-column>
            <el-table-column prop="docId" label="对应文档ID"></el-table-column>
            <el-table-column prop="docPageNum" label="对应文档页码"></el-table-column>
            <el-table-column prop="processId" label="流程编号"></el-table-column>
            <el-table-column prop="sgNum" label="SG号"></el-table-column>
            <el-table-column prop="wsStatus" label="账单状态"></el-table-column>
            <el-table-column prop="wsTitle" label="账单标题"></el-table-column>
            <el-table-column prop="businessId" label="业务编号"></el-table-column>
            <el-table-column prop="section" label="section"></el-table-column>
            <el-table-column prop="uwYear" label="业务年度"></el-table-column>
            <el-table-column prop="businessType" label="业务类型"></el-table-column>
            <el-table-column prop="receiptDate" label="收到账单日期"></el-table-column>
            <el-table-column prop="cedentCode" label="分出公司代码"></el-table-column>
            <el-table-column prop="cedentName" label="分出公司名称"></el-table-column>
            <el-table-column prop="brokerCode" label="经纪公司代码"></el-table-column>
            <el-table-column prop="brokerName" label="经纪公司名称"></el-table-column>
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
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="sgNum" label="SG号"></el-table-column>
      <el-table-column prop="processId" label="流程编号"></el-table-column>
      <el-table-column prop="rmId" label="支票号"></el-table-column>
      <el-table-column prop="bpCode" label="BP number"></el-table-column>
      <el-table-column prop="bpName" label="BP名称"></el-table-column>
      <el-table-column prop="baseCompany" label="集团产再"></el-table-column>
      <el-table-column prop="businessOrigin" label="Business Origin"></el-table-column>
      <el-table-column prop="sgStatus" label="Sg状态"></el-table-column>
      <el-table-column prop="settlementIndicator" label="结算指标"></el-table-column>
      <el-table-column prop="sgCurrency" label="币值"></el-table-column>
      <el-table-column prop="settlementAmount" label="结算总额"></el-table-column>
      <el-table-column prop="unsettlementAmount" label="未结算金额"></el-table-column>
      <el-table-column prop="dueDate" label="应收款日期"></el-table-column>
      <el-table-column prop="bookingYear" label="账单年份"></el-table-column>
      <el-table-column prop="bookingPeriod" label="账期"></el-table-column>
      <el-table-column prop="accYear" label="统计年份"></el-table-column>
      <el-table-column prop="accPeriod" label="统计期"></el-table-column>
      <el-table-column prop="sgType" label="类型"></el-table-column>
      <el-table-column prop="sgReference" label="参考"></el-table-column>
      <el-table-column prop="createdBy" label="创建人"></el-table-column>
      <el-table-column prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-show="!scope.row.rmId" v-if="$route.query.tag === 'approvalDone'" type="text" size="small">创建支票</el-button>
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="modal">
      <el-form :label-position="labelPosition" label-width="140px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign">
        <el-form-item label="结付公司代码">
          <el-select clearable filterable v-model="cedentModel" placeholder="请选择">
            <el-option v-for="(item,index) in cedentList" :key="index" :label="item.codecode+' - '+item.codeName" :value="index">
              <span style="float:left">{{ item.codecode }}</span>
              <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇款人名称">
          <el-input v-model="formLabelAlign.rmSettleCompanyName"></el-input>
        </el-form-item>
        <el-form-item label="汇款到账日期"> 
            <el-date-picker value-format="timestamp" v-model="formLabelAlign.rmReceiptDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <!-- 以上是三个公用字段 -->
        <!-- 以下创建编辑字段 -->
        <el-form-item label="汇款金额" prop="rmAmount" v-show="title==='编辑' || title==='创建'">
          <el-input v-model="formLabelAlign.rmAmount" @input.native="watchInput('rmAmount')"></el-input>
        </el-form-item>
        <el-form-item label="币制" prop="rmCurrency" v-show="title==='创建' || title==='编辑'">     
          <el-select clearable v-model="formLabelAlign.rmCurrency" placeholder="请选择">
            <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Business Origin" prop="businessOrigin" v-show="title==='创建' || title==='编辑'"> 
          <el-select clearable v-model="formLabelAlign.businessOrigin" placeholder="请选择">
            <el-option v-for="item in ['DOM','INT']" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Base Company" v-show="title==='创建' || title==='编辑'" prop="baseCompany">
          <el-select clearable v-model="formLabelAlign.baseCompany" placeholder="请选择">
            <el-option v-for="item in baseCompanyList" :key="item.a" :label="item.a" :value="item.b"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="我司销账编号" v-show="title==='编辑' || title==='创建'">
          <el-input v-model="formLabelAlign.rmWrittenOffNum"></el-input>
        </el-form-item>
        <el-form-item label="结算人员" v-show="title==='编辑' || title==='创建'">
          <el-input v-model="formLabelAlign.rmSettleUser"></el-input>
        </el-form-item>
        <el-form-item label="付款人名称" v-show="title==='编辑' || title==='创建'">
          <el-input v-model="formLabelAlign.payerName"></el-input>
        </el-form-item>
        <el-form-item label="付款人账号" v-show="title==='编辑' || title==='创建'">
          <el-input v-model="formLabelAlign.payerAccountNumber"></el-input>
        </el-form-item>
        <el-form-item label="付款人开户行名" v-show="title==='编辑' || title==='创建'">
          <el-input v-model="formLabelAlign.payerBankName"></el-input>
        </el-form-item>
        <el-form-item label="付款人开户行号" v-show="title==='编辑' || title==='创建'">
          <el-input v-model="formLabelAlign.payerBankNumber"></el-input>
        </el-form-item>
        <el-form-item label="原收款公司名称" v-show="title==='编辑' || title==='创建'">
          <el-input v-model="formLabelAlign.rmOriSettleCompanyName"></el-input>
        </el-form-item> 
        <el-form-item label="原收款公司币制/原收款公司金额" class="curAmountForm" v-show="title==='编辑' || title==='创建'">
          <el-select clearable v-model="formLabelAlign.rmOriCurrency" placeholder="请选择" class="curAmount">
            <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
          </el-select>
          <el-input v-model="formLabelAlign.rmOriAmount" @input.native="watchInput('rmOriAmount')" class="curAmount"></el-input>
        </el-form-item>
        <el-form-item label="手续费币制/手续费金额" class="curAmountForm" v-show="title==='编辑' || title==='创建'">
          <el-select clearable v-model="formLabelAlign.rmChargesCurrency" placeholder="请选择" class="curAmount">
            <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
          </el-select>
          <el-input v-model="formLabelAlign.rmChargesAmount" @input.native="watchInput('rmChargesAmount')" class="curAmount"></el-input>
        </el-form-item>
        <!-- 以下编辑查询字段 -->
        <el-form-item label="Process ID" v-show="title==='查询'">
          <el-input v-model.trim="formLabelAlign.processId"></el-input>
        </el-form-item>
        <!-- <el-form-item label="流程状态" v-show="title === '查询'">
          <el-select clearable v-model="formLabelAlign.processStatus" placeholder="请选择">
            <el-option v-for="item in processStatusList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm('formLabelAlign')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible2" :close-on-click-modal="modal">
      <el-form label-width="140px" v-show="title==='流程提交'">
        <el-form-item label="选择下一任务处理人">
          <el-select v-model="assignee"  placeholder="请输入关键词">
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button @click="dialogFormVisible2 = false">取消</el-button>
        </el-form-item>
      </el-form>
        <!-- 上传附件 -->
        <el-upload
          v-show="title==='上传附件'"
          class="upload-demo"
          action
          :before-upload="beforeAvatarUpload"
          :auto-upload="true"
          :http-request='upload'
          :file-list="fileList">
          <el-button size="small" type="primary">上传</el-button>
        </el-upload>
      <!-- 踪迹 -->
      <el-collapse v-show="title=='踪迹'">
        <el-collapse-item title="状态流转图">
          <img :src="picture" style="width:100%">
        </el-collapse-item>
      </el-collapse>
      <el-table :data="track" border style="width: 100%" v-show="title==='踪迹'">
        <el-table-column prop="processId" label="流程编号" width="120"></el-table-column>
        <el-table-column prop="actName" label="操作名称"></el-table-column>
        <el-table-column prop="actOperator" label="任务来源"></el-table-column>
        <el-table-column prop="actTime" label="操作时间"></el-table-column>
        <el-table-column prop="reason" label="操作原因"></el-table-column>
        <el-table-column prop="remark" label="操作备注"></el-table-column>
      </el-table>
      <!-- 详情 -->
      <ul class="detail-ul" v-show="title=='详情'">
        <li v-for="(item,i) in listData" :key="i" class="detail-item">
          <span class="detail-name">{{item.a}} : </span><span class="detail-content">{{item.b}}</span>
        </li>
      </ul>
      <el-table stripe :data="fileData" style="width: 100%" class="document" v-show="title==='上传附件' || title==='附件查看'">
        <el-table-column prop="docName" label="文件名"></el-table-column>
        <el-table-column prop="createdAt" label="时间"></el-table-column>
        <el-table-column prop="createdBy" label="任务来源"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click.stop="detailRemove(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible3" :close-on-click-modal="modal">
      <el-form :label-position="labelPosition" label-width="140px" :model="email">
        <el-form-item label="收件人姓名">
          <el-input v-model="email.contactName"></el-input>
        </el-form-item>
        <el-form-item label="收件人邮箱">
          <el-input v-model="email.emailAddr"></el-input>
        </el-form-item>
        <el-form-item label="邮件内容"> 
          <el-input v-model="email.emailContent"></el-input>
        </el-form-item>
        <el-form-item label="附件上传"> 
          <el-input v-model="email.documentList"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'settlementGroup',
  props:{  // urlName页面名称  processStatusCom流程状态  goDetailName详情页tag
      urlName:'',
      processStatusCom:'',
      goDetailName:'',
    },
  data() {
      return {
        modal:false,
        tableData:[],
        ZDoptions:[
        ],
        baseCompanyList:[
          {a:'集团',b:'G'},
          {a:'产再',b:'P'},
        ],
        rmCurrencyList:[],
        currentPage3: 5,
        hide:false,
        labelPosition:'right',
        formLabelAlign:{
          rmSettleCompanyCode:null,
          rmSettleCompanyName:null,
          rmCurrency:null,
          rmReceiptDate:null,
          businessOrigin:null,
          baseCompany:null,
          rmAmount:null,
          modifyBy:null,
          rmWrittenOffNum:null,
          rmOriSettleCompanyName:null,
          rmOriCurrency:null,
          rmOriAmount:null,
          rmChargesCurrency:null,
          rmChargesAmount:null,
          rmSettleUser:null,
          payerBankNumber:null,
          payerBankName:null,
          payerAccountNumber:null,
          payerName:null,
          processStatus:null,
        },
        pendingFlag:false,
        TJRoptions:[],
        track:[],
        assignee:'',
        mustData:{
          actOperator:'',
          processStatus:'',
          pageNumber:1,  // 页数
          pageSize:20,  //页面一次要展示的条数
          total:0, //总条数
          // processType:'付款',
        },
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        title:'', 
        tag:'',
        fileList:[],
        file:[],
        fileData:[],
        listData:[
          {
            a:'流程编号',
            b:'',
            c:'processId'
          },
          {
            a:'结付公司代码',
            b:'',
            c:'rmSettleCompanyCode',
          },
          {
            a:'汇款人名称',
            b:'',
            c:'rmSettleCompanyName',
          },
          {
            a:'币制',
            b:'',
            c:'rmCurrency',
          },
          {
            a:'到账日期',
            b:'',
            c:'rmReceiptDate',
          },
          {
            a:'Business Origin',
            b:'',
            c:'businessOrigin'
          },
          {
            a:'汇款金额',
            b:'',
            c:'rmAmount',
          },
          {
            a:'Base Company',
            b:'',
            c:'baseCompany',
          },
          {
            a:'操作员',
            b:'',
            c:'modifiedBy'
          },
          {
            a:'我司销账编号',
            b:'',
            c:'rmWrittenOffNum',
          },

          {
            a:'原收款公司名称',
            b:'',
            c:'rmOriSettleCompanyName',
          },
          {
            a:'原收款币制',
            b:'',
            c:'rmOriCurrency',
          },
          {
            a:'原收款金额',
            b:'',
            c:'rmOriAmount',
          },
          {
            a:'手续费币制',
            b:'',
            c:'rmChargesCurrency',
          },
          {
            a:'手续费金额',
            b:'',
            c:'rmChargesAmount',
          },
          {
            a:'付款人开户行号',
            b:'',
            c:'payerBankNumber',
          },
          {
            a:'结算人员',
            b:'',
            c:'rmSettleUser',
          },
          {
            a:'付款人开户行名',
            b:'',
            c:'payerBankName',
          },
          {
            a:'付款人账号',
            b:'',
            c:'payerAccountNumber',
          },
          {
            a:'付款人名称',
            b:'',
            c:'payerName',
          },
          {
            a:'创建日期',
            b:'',
            c:'createdAt',
          },
          {
            a:'备注',
            b:'',
            c:'remark',
          },
        ],
        chooseRow:{},
        cedentModel:null,
        cedentList:[],
        picture:'',
        singlePId:'',
        rules:{
          baseCompany: [
            { required: true, message: '请选择Base Company', trigger: 'blur' }
          ],
          businessOrigin: [
            { required: true, message: '请选择Business Origin', trigger: 'blur' }
          ],
          rmAmount: [
            { required: true, message: '请选择Business Origin', trigger: 'blur' }
          ],
          rmCurrency: [
            { required: true, message: '请选择Business Origin', trigger: 'blur' }
          ],
        },
        email:{
          contactName:null,
          emailAddr:null,
          emailContent:null,
          documentList:null,
        },
        baseCompanyrules:{P:'产再',G:'集团'},
        dialogFlag:false,
        processStatusList:[],
      };
    },
  created(){
    this.mustData.processStatus = this.processStatusCom;
    if(this.urlName === 'payOperation'){
      this.processStatusList = ['待处理','已悬停'];
    } else if(this.urlName === 'payClose'){
      this.processStatusList = ['待核销','已悬停'];
    }
  },
  mounted(){
    if(this.urlName === 'payment') {
      this.mustData.accountCloseFlag = '0';
    }
    setTimeout(()=>{
      // 分出人+经济人
      let fcArr = JSON.parse(sessionStorage.getItem('CedentType'));
      let jArr = JSON.parse(sessionStorage.getItem('BrokerType'));
      this.cedentList = jArr.concat(fcArr);
    },1000)
     
    this.mustData.actOperator = this.$store.state.userName;
    this.formLabelAlign.modifiedBy = this.$store.state.userName;

    //获取币制
    this.rmCurrencyList = JSON.parse(sessionStorage.getItem('CurrencyList'));

    this.$http.post('api/activiti/getAssigneeName',{roleName:'付款录入'}).then(res =>{
      if(res.status === 200) {
        this.TJRoptions = res.data;
      }
    })
    this.init();
  },
  methods: {
    init(tag){
      // 进首页查询
      this.$http.post('api/integeratedQuery/sglist',Object.assign({},this.mustData,{actName:this.$store.state.userName,actOperator:this.$store.state.userName})).then(res =>{
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
    handleClick(tag,row){
      this.chooseRow = Object.assign({},row);
      this.tag = tag;
      switch(tag){
        case 1: //创建
          for(let k in this.formLabelAlign){
            this.formLabelAlign[k] = null;
          }
          this.cedentModel = null;
          this.title = '创建';
          this.dialogFormVisible = true;
          break;
        case 3: //刷新

          break;
        case 4: //查询
          for(let k in this.formLabelAlign){
            this.formLabelAlign[k] = null;
          }
          this.cedentModel = null;
          this.title = '查询';
          this.dialogFormVisible = true;
          break;
        case 5: //详情
          this.title = '详情';
          this.dialogFormVisible2 = true;
          this.listData.forEach(el=>{
            el['b'] = this.chooseRow[el['c']];
          })
          break;
        case 6: //编辑
          console.log(this.chooseRow,'row');
          this.formLabelAlign = this.chooseRow;
          // 日期回显
          if(this.chooseRow.rmReceiptDate){
            this.formLabelAlign.rmReceiptDate = new Date(this.chooseRow.rmReceiptDate).valueOf();
          }
          // 结付公司代码回显
          if(this.chooseRow.rmSettleCompanyCode){
            this.cedentList.forEach((el,i)=>{
              if(el.codecode == this.chooseRow.rmSettleCompanyCode){
                this.cedentModel = i;
              }
            })
           }

          this.title = '编辑';
          this.dialogFormVisible = true;
          break;
        case 7: //删除
          this.$confirm(`确认删除?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('api/pay/teskClaim/remove',Object.assign({},this.chooseRow,this.mustData)).then(res =>{
              if(res.status === 200 && res.data.code == 0){
                  this.$message({type: 'success', message: '删除成功!'});  
                  this.init();             
              }
            })
          })
          break;
        case 8: //上传附件
          this.title = '上传附件';
          this.singlePId = this.chooseRow.processId;
          this.$http.post('api/worksheet/sortOperation/listDocument'
          ,{actOperator:this.$store.state.userName,
            processId:this.chooseRow.processId,
            pageNumber:1,
            pageSize:100,}).then(res =>{
              if(res.status === 200){
                this.fileData = res.data.rows;
                this.init();
              }
            })
          this.dialogFormVisible2 = true;
          break;
        case 10: //流程提交
          this.title = '流程提交';
          this.dialogFormVisible2 = true;
          break;
        case 11: //踪迹
          this.title = '踪迹';
          this.dialogFormVisible2 = true;
          this.track = this.chooseRow.bscProcessActionVOlist;
          this.$http.post('api/activiti/getProcPicture',{procInstId:this.chooseRow.processInstId},{responseType:'blob'}).then(res =>{
            if(res.status === 200 ) {
              this.picture = window.URL.createObjectURL(res.data);
            }
          })
        break;
        case 12: //流程提交
          this.title = '流程提交';
          this.dialogFormVisible2 = true;
        break;
        case 13: //发送邮件
          this.title = '发送邮件';
          this.dialogFormVisible3 = true;
        break; 
        case 15: //附件查看
          this.$http.post('api/worksheet/sortOperation/listDocument'
            ,{actOperator:this.$store.state.userName,
            processId:this.row.processId,
            pageNumber:1,
            pageSize:100, 
            }).then(res =>{
              if(res.status === 200 && res.data.rows && res.data.rows.length){
                this.fileData = res.data.rows;
              }
            })
          this.title = '附件查看';
          this.dialogFormVisible2 = true;
        break;

      }

    },
    confirm(formName){
      if(this.cedentModel != null){
        let obj = this.cedentList[this.cedentModel];
        this.formLabelAlign.rmSettleCompanyCode = obj.codecode;
      }
      switch(this.tag){
        case 1: //创建
          this.$refs[formName].validate((valid) => {
            console.log(valid,'valid');
            if(valid) {
              this.$http.post('api/pay/teskClaim/save',Object.assign({},{actOperator:this.$store.state.userName},this.mustData,this.formLabelAlign)).then(res =>{
              if(res.status === 200 && res.data.msg === '操作成功'){
                this.dialogFormVisible = false;
                this.init();
                }
              })
            }
          })
          break;
        case 3: //刷新
 
          break;
        case 4: //查询
        // if(!this.formLabelAlign.processStatus){ this.formLabelAlign.processStatus = this.processStatusCom; }
          let params = Object.assign({},this.mustData,this.formLabelAlign,{curOperator:this.$store.state.userName});
          delete params['actOperator'];
          this.$http.post('api/integeratedQuery/sglist',params).then(res =>{
          console.log(res,',,,');
          if(res.status === 200 ) {
              this.tableData = res.data.rows;
              this.mustData.total = res.data.total;
              if(tag == 0){
                this.$message({type: 'success', message: '刷新成功'}); 
              }
            }
          })
          break;
        case 5: //详情

          break;
        case 6: //编辑
          this.$http.post('api/pay/teskClaim/update',Object.assign({},this.mustData,this.formLabelAlign)).then(res =>{
            if(res.status === 200 && res.data.msg === '操作成功'){
              this.dialogFormVisible = false;
              this.init();
            }
          })
          break;
        case 7: //删除

          break;
        case 8: //上传附件

          break;
        case 10: //流程提交
          this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
            ,{processId:this.chooseRow.processId, procInstId:this.chooseRow.processInstId, assignee:this.assignee, type:'ACTIVE',actOperator:this.$store.state.userName})
            .then(res =>{
            if(res.status === 200 && res.data.errorCode == 1){
              this.dialogFormVisible2 = false;
              this.$message({type: 'success', message: '提交成功!'});  
              this.init();
            }
          })
          break;
        case 11: //踪迹

          break;
        case 12: //流程提交---emailNotify
            this.$http.post('api/receipt/activitiForReceipt/commonActivitiForReceipt'
            ,{processId:this.chooseRow.processId, 
            procInstId:this.chooseRow.processInstId, 
            assignee:this.assignee, 
            type:'CLOSE',actOperator:this.$store.state.userName,
            hasNoticedFlag:this.chooseRow.hasNoticedFlag})
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible2 = false;
                this.$message({type: 'success', message: '提交成功!'});  
                this.init();
              }
            })
          break;

      }
    },
    beforeAvatarUpload(file){
      this.file.push(file);
    },
    handleSizeChange(val) {
      this.mustData.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.mustData.pageNumber = val;
      this.init();
    },
    upload(file) {
      let resFile = new FormData();
      resFile.append('file', this.file[0]);
      resFile.append('actOperator', this.mustData.actOperator);
      resFile.append('processId', this.chooseRow.processId);
      this.$http.post(`api/anyShare/fileOperation/uploadFilesForPage`,resFile,{headers:{ 'Content-Type': "application/json;charset=UTF-8" }}).then(res =>{
        if(res.status === 200){
          if(res.data.errorCode && res.data.errorCode == 1){
            this.dialogFormVisible2 = false;
            this.handleClick(8,{processId:this.singlePId})
            } else if(res.data.errorCode && res.data.errorCode == 0){
              this.$message.error(res.data.errorMessage);
            }
            this.file = [];
            this.fileList = [];
        } else{
          this.file = [];
          this.fileList = [];
        }
      })
    },
    detailRemove(row) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { 
        this.$http.post('api/anyShare/fileOperation/deleteFilesForPage',
        {docPath:row.docPath, docName:row.docName, processId:row.processId, actOperator:this.$store.state.userName})
        .then(res =>{
          this.handleClick(8,{processId:this.singlePId})
        })
      })
    },
    goDetail(row){
      if(this.urlName === 'taskCreation' || this.urlName === 'emailNotify'){
        return;
      }
      // let routeData = this.$router.resolve({
      this.$router.push({
          name: 'detailPay',
          query: {
            tag: this.urlName,
            name:this.goDetailName,
            row:JSON.stringify(row),
            }
        });
        // window.open(routeData.href, '_blank');
    },
    watchInput(name){
      if(!(/^\d+(\.\d{0,2})?$/.test(this.formLabelAlign[name]))){
        this.formLabelAlign[name] = this.formLabelAlign[name].substr(0,this.formLabelAlign[name].length-1);
      }
    }
  }
}
</script>

<style scoped>
.settlementGroup {
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
.cell .el-button+.el-button{
  margin-right: 10px;
  margin-left: 0px;
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
.el-collapse-item:last-child{
  margin-bottom: 20px;
}

.curAmountForm div.el-form-item__content{
  display: flex;
}
.curAmountForm div.el-form-item__content .el-select{
  margin-right: 20px;
}
.curAmountForm div.el-form-item__content .curAmount{
  width: 200px;
}
.settlementGroup .el-input{
  width: 196px;
}
</style>
