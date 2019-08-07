<template>
  <div class="accountProcess">
    <div class="searchNew">
      <div class="titleSearch" @click="searchFlag = !searchFlag"><i style="margin-right:8px;" :class="searchFlag===false?'el-icon-arrow-down':'el-icon-arrow-up'"></i>查询</div>
       <el-collapse-transition>
      <div v-show="searchFlag">
        <el-row :gutter="10" class="billRow" class-name="transition-box">
          <el-col :span="8">
            <span class="slable">流程编号</span>
            <el-input placeholder="请输入流程编号" v-model.trim="formLabelAlign.processId"></el-input>
          </el-col>
          <el-col :span="8">
            <span class="slable">结付公司</span>
              <el-select clearable filterable v-model="cedentModel" placeholder="请选择">
                <el-option v-for="(item,index) in cedentList" :key="index" :label="item.codecode+' - '+item.codeName" :value="index">
                  <span style="float:left">{{ item.codecode }}</span>
                  <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="8">
            <span class="slable">流程状态</span>
            <el-select clearable v-model="formLabelAlign.processStatus" placeholder="请选择">
              <el-option v-for="item in ['已创建','待处理','已删除','已悬停','已置废','已完结','待邮件通知','待补录','待支付','待核销','待复核','待一级审批','待二级审批','待三级审批','待四级审批','待五级审批','审批完成']" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="billRow">
          <el-col :span="8">
            <span class="slable">汇款人名称</span>
            <el-input v-model="formLabelAlign.rmSettleCompanyName"></el-input>
          </el-col>
          <el-col :span="8">
            <span class="slable">到账日期</span>
              <el-date-picker value-format="timestamp" v-model="formLabelAlign.rmReceiptDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-col>
        </el-row>
        <el-row><el-col :span="24">
          <el-button type="primary" plain @click="handleClick(4)"><i class="iconfont iconGroup42"></i>查询</el-button>
          <el-button type="primary" plain @click="reset"><i class="iconfont iconGroup39"></i>重置</el-button>
        </el-col></el-row>
      </div>
       </el-collapse-transition>
    </div>
    <div class="btn">
      <el-button type="primary" plain @click="handleClick(1)" v-show="urlName === 'payOperation'"><i class="iconfont iconGroup91"></i>创建</el-button>
      <el-button type="primary" plain @click="init(0)"><i class="iconfont iconGroup37"></i>刷新</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" height="480" border :header-row-class-name="StableClass">
      <el-table-column label="流程编号" width="145">
        <template slot-scope="scope">
          <span :class="{'smallHand':urlName!=='taskCreation' && urlName!=='emailNotify'}" @click="goDetail(scope.row)">{{scope.row.processId}}</span>
        </template>      
      </el-table-column>
      <el-table-column label="结付公司" width="140">
       <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.rmSettleCompanyName" placement="top-start">
            <span class="abbreviate">{{scope.row.rmSettleCompanyName}}</span>
          </el-tooltip>
        </template>>
      </el-table-column>
      <el-table-column prop="rmCurrency" label="币制"></el-table-column>
      <el-table-column prop="businessOrigin" label="Business Origin"></el-table-column>
      <el-table-column label="Base Company" prop="baseCompany">
      </el-table-column>
      <el-table-column prop="rmAmount" label="汇款金额" width="130">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.rmAmount"
            placement="top-start"
          >
            <span class="abbreviate">{{scope.row.rmAmount}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="任务来源" width="130">
        <template slot-scope="scope">
          <span>{{nameList[scope.row.curOperator]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="processStatus" label="流程状态"></el-table-column>
      <!-- <el-table-column prop="rmChargesCurrency" width="100" label="手续费币制"></el-table-column> -->
      <!-- <el-table-column prop="rmChargesAmount" width="100" label="手续费金额"></el-table-column> -->
      <!-- <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">更多<i style="margin-left:8px;" class="el-icon-arrow-down"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button v-show="pendingFlag || urlName === 'taskCreation' || urlName === 'approvalDone'" @click.stop="handleClick(6,scope.row)" type="text" size="small">编辑</el-button></el-dropdown-item>
              <el-dropdown-item><el-button @click.stop="handleClick(11,scope.row)" type="text" size="mini">踪迹</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-show="urlName === 'taskCreation'" @click.stop="handleClick(10,scope.row)" type="text" size="small">流程提交</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-show="urlName === 'emailNotify'" @click.stop="handleClick(12,scope.row)" type="text" size="small">流程提交</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-show="urlName === 'emailNotify'" @click.stop="handleClick(15,scope.row)" type="text" size="small">附件查看</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-show="urlName === 'emailNotify'" @click.stop="handleClick(13,scope.row)" type="text" size="small">发送邮件</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-show="urlName === 'emailNotify'" @click.stop="handleClick(20,scope.row)" type="text" size="small">Reverse</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
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
        <el-form-item label="结付公司">
          <el-select clearable filterable v-model="cedentModel" placeholder="请选择">
            <el-option v-for="(item,index) in cedentList" :key="index" :label="item.codecode+' - '+item.codeName" :value="index">
              <span style="float:left">{{ item.codecode }}</span>
              <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="汇款人名称">
          <el-input v-model="formLabelAlign.rmSettleCompanyName"></el-input>
        </el-form-item>
        <el-form-item label="到账日期"> 
            <el-date-picker value-format="timestamp" v-model="formLabelAlign.rmReceiptDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="汇款金额" v-show="title==='编辑' || title==='创建'">
          <input type="text" class="selfInput" v-model="formLabelAlign.rmAmount" @input="watchInput('rmAmount')">
        </el-form-item>
        <el-form-item label="币制" v-show="title==='创建' || title==='编辑'">     
          <el-select clearable v-model="formLabelAlign.rmCurrency" placeholder="请选择">
            <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="Business Origin" prop="businessOrigin" v-show="title==='创建' || title==='编辑'"> 
          <el-select clearable v-model="formLabelAlign.businessOrigin" placeholder="请选择">
            <el-option v-for="item in businessOriginList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Base Company" v-show="title==='创建' || title==='编辑'" prop="baseCompany">
          <el-select clearable v-model="formLabelAlign.baseCompany" placeholder="请选择">
            <el-option v-for="item in baseCompanyList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="我司销账编号" v-show="title==='编辑' || title==='创建'">
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
          <input type="text" class="selfInput" v-model="formLabelAlign.rmOriAmount" @input="watchInput('rmOriAmount')">
        </el-form-item>
        <el-form-item label="手续费币制/手续费金额" class="curAmountForm" v-show="title==='编辑' || title==='创建'">
          <el-select clearable v-model="formLabelAlign.rmChargesCurrency" placeholder="请选择" class="curAmount">
            <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
          </el-select>
          <input type="text" class="selfInput" v-model="formLabelAlign.rmChargesAmount" @input="watchInput('rmChargesAmount')">
        </el-form-item> -->
        <el-form-item label="Process ID" v-show="title==='查询'">
          <el-input v-model.trim="formLabelAlign.processId"></el-input>
        </el-form-item>
        <el-form-item label="流程状态" v-show="title === '查询'">
          <el-select clearable v-model="formLabelAlign.processStatus" placeholder="请选择">
            <el-option v-for="item in processStatusList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm('formLabelAlign')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible2" :close-on-click-modal="modal">
      <el-form label-width="140px" v-show="title==='流程提交' || title==='reverse'">
        <el-form-item label="选择处理人'"  v-show="title==='流程提交'">
          <el-select v-model="assignee"  placeholder="请选择">
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择管理员">
          <el-select v-model="assignee"  placeholder="请选择" v-show="title==='reverse'">
            <el-option v-for="item in TJRoptionsA" :key="item.userId" :label="item.name" :value="item.username"></el-option>
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
          <img :src="picture" style="width:100%" @click="dialogFormVisibleA=true">
        </el-collapse-item>
      </el-collapse>
      <el-table :data="track" border style="width: 100%" v-show="title==='踪迹'" :header-row-class-name="StableClass">
        <el-table-column prop="processId" label="流程编号" width="140"></el-table-column>
        <el-table-column prop="actName" label="操作名称"></el-table-column>
        <el-table-column label="任务来源">
          <template slot-scope="scope">
            <span>{{nameList[scope.row.actOperator]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actTime" label="操作时间"></el-table-column>
        <el-table-column prop="reason" label="操作原因"></el-table-column>
        <el-table-column prop="remark" label="操作备注"></el-table-column>
      </el-table>
      <el-table stripe border :header-row-class-name="StableClass" :data="fileData" style="width: 100%" class="document" v-show="title==='上传附件' || title==='附件查看'">
        <el-table-column label="文件名">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top">
              <span class="smallHand" @click="docView(scope.row)">{{scope.row.docName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间"></el-table-column>
        <el-table-column label="任务来源">
           <template slot-scope="scope">
            <span>{{nameList[scope.row.createdBy]}}</span>
          </template>
        </el-table-column>
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

    <el-dialog title="文档预览" width="fit-content" :visible.sync="dialogFormVisibleA" :close-on-click-modal="modal">
      <div class="browseDoc" v-show="title!='踪迹'">
        <iframe src="../../static/Preview/index.html" id="iframeId" name="ifrmname" style="width:100%;height:-webkit-fill-available;" ref="mapFrame" frameborder="0"></iframe>
      </div>
      <div v-show="title=='踪迹'" style="width:1020px;height:100%;">
        <img :src="picture" style="width:100%;height:1005;">
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'accountProcess',
  props:{  // urlName页面名称  processStatusCom流程状态  goDetailName详情页tag
      urlName:'',
      processStatusCom:'',
      goDetailName:'',
    },
  data() {
      return {
        nameList:{},
        searchFlag:false,
        modal:false,
        tableData:[],
        ZDoptions:[
        ],
        businessOriginList:[],
        baseCompanyList:[],
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
        TJRoptionsA:[],
        track:[],
        assignee:'',
        mustData:{
          actOperator:'',
          processStatus:'',
          pageNumber:1,  // 页数
          pageSize:20,  //页面一次要展示的条数
          total:0, //总条数
          processType:['付款','收款']
        },
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        dialogFormVisibleA: false,
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
            a:'结付公司',
            b:'',
            c:'rmSettleCompanyCode',
          },
          {
            a:'汇款人名称',
            b:'',
            c:'payerName',
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
            a:'任务来源',
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
        StableClass:'tableClass',
        rules:{
          baseCompany: [
            { required: true, message: '请选择Base Company', trigger: 'blur' }
          ],
          businessOrigin: [
            { required: true, message: '请选择Business Origin', trigger: 'blur' }
          ],
        },
        email:{
          contactName:null,
          emailAddr:null,
          emailContent:null,
          documentList:null,
        },
        // baseCompanyrules:{P:'产再',G:'集团'},
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
    this.nameList = JSON.parse(sessionStorage.getItem("nameList"));
  },
  mounted(){
    if(this.urlName === 'payment') {
      this.mustData.accountCloseFlag = '0';
    } else if(this.urlName === 'instancyPay'){
      this.mustData.accountCloseFlag = '1';
    }
    setTimeout(()=>{
      // 分出人+经济人
      let fcArr = JSON.parse(sessionStorage.getItem('CedentType'));
      let jArr = JSON.parse(sessionStorage.getItem('BrokerType'));
      this.cedentList = jArr.concat(fcArr);
      // 集团产再
      this.baseCompanyList = JSON.parse(sessionStorage.getItem('baseCompany'));
      // 国际国内
      this.businessOriginList = JSON.parse(sessionStorage.getItem('businessOrigin'));
    },1000)
     
    this.mustData.actOperator = this.$store.state.userName;
    //this.formLabelAlign.modifiedBy = this.$store.state.userName;

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
      let params = Object.assign({},this.mustData)
      delete params['actOperator'];
      this.$http.post('api/integeratedQuery/ProcessMessagelist',params).then(res =>{
        if(res.status === 200 ) {
          this.tableData = res.data.rows;
          this.mustData.total = res.data.total;
          if(res.data && res.data.rows && res.data.rows.length){
            if(res.data.rows[0].processStatus === '待处理' && this.urlName === 'payOperation'){
              this.pendingFlag = true;
            }
          }
          if(tag == 0){
            this.$message({type: 'success', message: '刷新成功!'}); 
          }
        }
      })
    },
    docView(row) {
      if(row){
        this.dialogFormVisibleA = true;
        this.$http.post('api/anyShare/fileOperation/getLogInInfo').then(res =>{
        if(res.status == 200){
          console.log(res);
          document.getElementById('iframeId').contentWindow.postMessage({
            tokenId:res.data.tokenId,
            userId:res.data.userId,
            docCloudId:row.docCloudId,
            docName:row.docName,
            ip:res.data.ip,
            acPort:res.data.acPort,
            fsPort:res.data.fsPort,
          },'*');
          document.getElementById('iframeId').contentWindow.location.reload(true);
        }
      })
      } else{
        document.getElementById('iframeId').contentWindow.postMessage({},'*');
        document.getElementById('iframeId').contentWindow.location.reload(true);
      }
    },
    reset(){
      for(let k in this.formLabelAlign){
          this.formLabelAlign[k] = null;
        }
        this.cedentModel = null;
    },
    handleClick(tag,row){
      this.chooseRow = Object.assign({},row);
      this.tag = tag;
      this.assignee = null;
      switch(tag){
        case 1: //创建
          this.reset();
          // for(let k in this.formLabelAlign){
          //   this.formLabelAlign[k] = null;
          // }
          // this.cedentModel = null;
          this.title = '创建';
          this.dialogFormVisible = true;
          break;
        case 3: //刷新

          break;
        case 4: //查询
          this.title = '查询';
          // this.dialogFormVisible = true;
          this.confirm();
          break;
        case 6: //编辑
          console.log(this.chooseRow,'row');
          this.formLabelAlign = this.chooseRow;
          if(this.chooseRow.businessOrigin){
            let arr = this.businessOriginList.filter(el=>{ return el.name == this.chooseRow.businessOrigin })
            this.formLabelAlign.businessOrigin = arr[0]['code'];
          }
          if(this.chooseRow.baseCompany){
            let arr = this.baseCompanyList.filter(el=>{ return el.name == this.chooseRow.baseCompany })
            this.formLabelAlign.baseCompany = arr[0]['code'];
          }
          // 日期回显
          if(this.chooseRow.rmReceiptDate){
            this.formLabelAlign.rmReceiptDate = new Date(this.chooseRow.rmReceiptDate).valueOf();
          }
          // 结付公司回显
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
            processId:this.chooseRow.processId,
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
        case 20: //reverse
          this.$http.post('api/activiti/getAssigneeName',{roleName:'管理员'}).then(res =>{
              if(res.status === 200){
                this.TJRoptionsA = res.data;
              }
            }) 
          this.title = 'reverse';
          this.dialogFormVisible2 = true;
          // this.$confirm('是否Reverse?', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   this.$http.post('api/pay/teskClaim/reversePayProcess',{processId:this.chooseRow.processId,actOperator:this.$store.state.userName},{responseType:'blob'}).then(res =>{
          //     console.log(res,'onReverse')
          //     if(res.status === 200 && res.data.code==0){
          //       this.$message({type: 'success', message: '成功'});
          //     } else if(res.data.msg){
          //       this.$message.error(res.data.msg);
          //     }
          //   })
          // })
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
                this.$refs[formName].resetFields();
                }
              })
            }
          })
          break;
        case 3: //刷新
 
          break;
        case 4: //查询
        if(!this.formLabelAlign.processStatus){ this.formLabelAlign.processStatus = this.processStatusCom; }
          let params = Object.assign({},this.mustData,this.formLabelAlign);
         // let params = Object.assign({},this.mustData,this.formLabelAlign,{curOperator:this.$store.state.userName});
          delete params['actOperator'];
          this.$http.post('api/integeratedQuery/ProcessMessagelist',params).then(res =>{
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
        case 6: //编辑
           this.$refs[formName].validate((valid) => {
            console.log(valid,'valid');
            if(valid) {
              console.log(this.formLabelAlign,'this.formLabelAlign');
              this.$http.post('api/pay/teskClaim/update',Object.assign({},this.mustData,this.formLabelAlign,{actOperator:this.$store.state.userName})).then(res =>{
                if(res.status === 200 && res.data.msg === '操作成功'){
                  this.dialogFormVisible = false;
                  this.init();
                  this.$refs[formName].resetFields();
                }
              })
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
              this.assignee = null;
              this.init();
            } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
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
                this.assignee = null;
                this.init();
              } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
              }
            })
          break;
          case 20:  //---
            this.$http.post('api/pay/teskClaim/reversePayProcess',{processId:this.chooseRow.processId,assignee:this.assignee,actOperator:this.$store.state.userName},{responseType:'blob'}).then(res =>{
              console.log(res,'onReverse')
              if(res.status === 200 && res.data.code==0){
                this.$message({type: 'success', message: '成功'});
              } else if(res.data.msg){
                this.$message.error(res.data.msg);
              }
            })
          break;
      }
      // setTimeout(()=>{
        // this.$refs[formName].resetFields();
      // },1000)
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
            tag: 'accountProcess',
            name:this.goDetailName,
            row:JSON.stringify(row),
            }
        });
        // window.open(routeData.href, '_blank');
    },
    watchInput(name){      
      if(!(/^\d+(\.\d{0,2})?$/.test(this.formLabelAlign[name]))){
        if(this.formLabelAlign[name]){
          // this.formLabelAlign[name] = this.formLabelAlign[name].substr(0,this.formLabelAlign[name].length-1);
          this.formLabelAlign[name] = '';
          this.$message.error('请输入数字，支持到小数点后两位');
        }
      }
    }
  }
}
</script>

<style scoped>
.accountProcess {
  padding-right: 30px;
}
.btn {
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
.accountProcess .el-input{
  width: 196px;
}
.browseDoc {
  background-color: #ecf5ff;
  width: 100%;
  height: 100%;
}
.smallHand {
  cursor: pointer;
  color:#409EFF;
}
.selfInput{
  border: 1px solid #DCDFE6;
  width: 196px;
  border-radius: 4px;
  outline: none;
}
.searchNew .el-row .el-input{
  width: 224px;
  height: 32px;
  border-radius: 2px;
}
</style>
