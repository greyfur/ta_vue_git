<template>
  <div class="receiptCom">
    <div class="searchNew">
      <div class="titleSearch" @click="searchFlag = !searchFlag"><i style="margin-right:8px;" class="el-icon-arrow-down"></i>查询</div>
      <div v-show="searchFlag">
        <el-row :gutter="10" class="billRow">
        <el-col :span="8">
          <span class="slable">process Id</span>
          <el-input placeholder="请输入process Id" suffix-icon="el-icon-date" v-model.trim="formLabelAlign.processId"></el-input>
        </el-col>
        <el-col :span="8">
          <span class="slable">结付公司代码</span>
            <el-select clearable filterable v-model="cedentModel" placeholder="请选择">
              <el-option v-for="(item,index) in cedentList" :key="index" :label="item.codecode+' - '+item.codeName" :value="index">
                <span style="float:left">{{ item.codecode }}</span>
                <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
              </el-option>
            </el-select>
        </el-col>
        <el-col :span="8">
          <span class="slable">汇款人名称</span>
          <el-input placeholder="请输入汇款人名称" suffix-icon="el-icon-date" v-model.trim="formLabelAlign.rmSettleCompanyName"></el-input>
        </el-col>
        </el-row>
        <el-row :gutter="10" class="billRow">
          <el-col :span="8">
            <span class="slable">汇款到账日期</span>
            <el-date-picker value-format="timestamp" v-model="formLabelAlign.rmReceiptDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-col>
          <el-col :span="8" v-show="processStatusList.length">
            <span class="slable">流程状态</span>
            <el-select clearable v-model="formLabelAlign.processStatus" placeholder="请选择">
              <el-option v-for="item in processStatusList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row><el-col :span="24">
          <el-button type="primary" plain @click="handleClick(4)"><i class="iconfont iconGroup42"></i>查询</el-button>
          <el-button type="primary" plain @click="reset"><i class="iconfont iconGroup39"></i>重置</el-button>
        </el-col></el-row>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" plain @click="handleClick(1)" v-show="urlName === 'financialCreat'"><i class="iconfont iconGroup91"></i>创建</el-button>
      <el-button type="primary" plain @click="handleClick(2)" v-show="urlName === 'financialCreat'"><i class="iconfont iconGroup91"></i>批量创建</el-button>
      <el-button type="primary" plain @click="handleClick(13)" v-show="urlName === 'taskClaim'"><i class="iconfont iconpaperclip"></i>任务认领</el-button>
      <el-button type="primary" plain @click="init(0)"><i class="iconfont iconGroup37"></i>刷新</el-button>
      <!-- <el-button type="primary" plain @click="handleClick(4)">查询</el-button> -->
    </div>
    <el-table v-show="urlName=='taskClaim'" :data="tableData" ref="multipleTable" tooltip-effect="dark" stripe style="width: 100%" @selection-change="handleSelectionChange" @row-click="goDetail">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="processId" label="ProcessID" width="120"></el-table-column>
      <el-table-column prop="rmSettleCompanyCode" width="110" label="结付公司代码"></el-table-column>
      <el-table-column width="120" label="汇款人名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.rmSettleCompanyName" placement="top">
            <span class="abbreviate">{{scope.row.rmSettleCompanyName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="rmCurrency" width="55" label="币制"></el-table-column>
      <el-table-column prop="rmReceiptDate" width="120" label="汇款到账日期"></el-table-column>
      <el-table-column prop="businessOrigin" width="120" label="Business Origin"></el-table-column>
      <el-table-column label="Base Company" prop="baseCompany" width="120"></el-table-column>
      <el-table-column label="汇款金额">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.rmAmount" placement="top-start">
            <span class="abbreviate">{{scope.row.rmAmount}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="processStatus" width="95" label="流程状态"></el-table-column>
      <el-table-column prop="curOperator" label="操作员"></el-table-column>
      <el-table-column prop="rmOriSettleCompanyName" width="150" label="原收款公司名称"></el-table-column>
      <el-table-column fixed="right" label="操作" width="170">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">更多<i style="margin-left:8px;" class="el-icon-arrow-down"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button @click.stop="handleClick(5,scope.row)" type="text" size="small">详情</el-button></el-dropdown-item>
              <el-dropdown-item><el-button @click.stop="handleClick(12,scope.row)" type="text" size="small">附件查看</el-button></el-dropdown-item>
              <el-dropdown-item><el-button @click.stop="handleClick(11,scope.row)" type="text" size="small">踪迹</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-show="urlName!='taskClaim'" :data="tableData" stripe style="width: 100%">
      <el-table-column label="流程编号" width="120">
        <template slot-scope="scope">
          <span :class="{'smallHand':urlName!=='financialCreat' && urlName!=='taskClaim'}" @click="goDetail(scope.row)">{{scope.row.processId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rmSettleCompanyCode" width="110" label="结付公司代码"></el-table-column>
      <el-table-column width="120" label="汇款人名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.rmSettleCompanyName" placement="top-start">
            <span class="abbreviate">{{scope.row.rmSettleCompanyName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="rmCurrency" width="55" label="币制"></el-table-column>
      <el-table-column prop="rmReceiptDate" width="120" label="汇款到账日期"></el-table-column>
      <el-table-column prop="businessOrigin" width="120" label="Business Origin"></el-table-column>
      <el-table-column label="Base Company" width="120" prop="baseCompany"></el-table-column>
      <el-table-column label="汇款金额">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.rmAmount" placement="top-start">
            <span class="abbreviate">{{scope.row.rmAmount}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="processStatus" width="95" label="流程状态"></el-table-column>
      <el-table-column prop="curOperator" label="操作员"></el-table-column>
      <el-table-column width="150" label="原收款公司名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.rmOriSettleCompanyName" placement="top-start">
            <span class="abbreviate">{{scope.row.rmOriSettleCompanyName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">更多<i style="margin-left:8px;" class="el-icon-arrow-down"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button @click.stop="handleClick(5,scope.row)" type="text" size="small">详情</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-show="pendingFlag || urlName === 'financialCreat'" @click.stop="handleClick(6,scope.row)" type="text" size="small">编辑</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-show="urlName === 'financialCreat'" @click.stop="handleClick(7,scope.row)" type="text" size="small">删除</el-button></el-dropdown-item>
              <el-dropdown-item><el-button @click.stop="handleClick(11,scope.row)" type="text" size="small">踪迹</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-show="urlName === 'financialCreat'" @click.stop="handleClick(10,scope.row)" type="text" size="small">流程提交</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        <el-form-item label="汇款金额" v-show="title==='编辑' || title==='创建'">
          <input type="text" class="selfInput" v-model="formLabelAlign.rmAmount" @input="watchInput('rmAmount')">
        </el-form-item>
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
        </el-form-item> -->
        <el-form-item clearable label="币制" v-show="title==='创建' || title==='编辑'">     
          <el-select clearable v-model="formLabelAlign.rmCurrency" placeholder="请选择">
            <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="结算人员" v-show="title==='编辑' || title==='创建'">
          <el-input v-model="formLabelAlign.rmSettleUser"></el-input>
        </el-form-item> -->
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
        <!-- <el-form-item label="原收款公司币制/原收款公司金额" class="curAmountForm" v-show="title==='编辑' || title==='创建'">
          <el-select clearable v-model="formLabelAlign.rmOriCurrency" placeholder="请选择" class="curAmount">
            <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
          </el-select>
          <input type="text" class="selfInput" v-model="formLabelAlign.rmOriAmount" @input="watchInput('rmOriAmount')">
        </el-form-item> -->
        <!-- <el-form-item label="手续费币制/手续费金额" class="curAmountForm" v-show="title==='编辑' || title==='创建'">
          <el-select clearable v-model="formLabelAlign.rmChargesCurrency" placeholder="请选择" class="curAmount">
            <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
          </el-select>
          <input type="text" class="selfInput" v-model="formLabelAlign.rmChargesAmount" @input="watchInput('rmChargesAmount')">
        </el-form-item> -->
        <!-- <el-form-item label="Process ID" v-show="title==='查询'">
          <el-input v-model.trim="formLabelAlign.processId"></el-input>
        </el-form-item>
        <el-form-item label="流程状态" v-show="title === '查询'">
          <el-select clearable v-model="formLabelAlign.processStatus" placeholder="请选择">
            <el-option v-for="item in processStatusList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="上传附件" v-show="title === '编辑'">
          <el-upload
            v-show="title==='编辑'"
            class="upload-demo"
            action
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            :http-request='upload'
            :file-list="fileList">
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
          <el-table stripe :data="fileData" style="width: 100%" class="document" v-show="title==='编辑'">
            <el-table-column label="文件名">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top">
                  <span class="smallHand" @click="docView(scope.row)">{{scope.row.docName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="时间"></el-table-column>
            <el-table-column prop="createdBy" label="任务来源"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click.stop="detailRemove(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm('formLabelAlign')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogFormVisible2" :close-on-click-modal="modal">
      <el-form label-width="140px" v-show="title==='流程提交'">
        <el-form-item label="选择下一任务处理人">
          <el-select clearable v-model="assignee"  placeholder="请输入关键词">
            <el-option v-for="item in TJRoptions" :key="item.value" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button @click="dialogFormVisible2 = false">取消</el-button>
        </el-form-item>
      </el-form>
        <!-- 上传附件/批量创建 -->
        <el-upload
          v-show="title==='批量创建'"
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
      <el-table stripe :data="fileData" style="width: 100%" class="document" v-show="title==='附件查看'">
        <el-table-column label="文件名">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top">
              <span class="smallHand" @click="docView(scope.row)">{{scope.row.docName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间"></el-table-column>
        <el-table-column prop="createdBy" label="任务来源"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click.stop="detailRemove(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  name: 'receiptCom',
  props:{  // urlName页面名称  processStatusCom流程状态  goDetailName详情页tag
      urlName:'',
      processStatusCom:'',
      goDetailName:'',
    },
  data() {
      return {
        searchFlag:false,
        modal:false,
        tableData:[],
        ZDoptions:[
        ],
        baseCompanyList:[],
        businessOriginList:[],
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
        TJRoptions:[],
        track:[],
        assignee:'',
        mustData:{
          actOperator:'',
          processStatus:'已创建',
          pageNumber:1,  // 页数
          pageSize:20,  //页面一次要展示的条数
          total:0, //总条数
          processType:'收款',
        },
        dialogFormVisible: false,
        dialogFormVisible2: false,
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
        },
        baseCompanyrules:{P:'产再',G:'集团'},
        dialogFlag:false,
        processStatusList:[],
        pendingFlag:false,
        taskClaimFlag:false,
        multipleSelection:[],
      };
    },
  created(){
    if(this.urlName=='taskClaim'){ this.taskClaimFlag = true; }
    this.mustData.processStatus = this.processStatusCom;
    if(this.urlName === 'credOperation'){
      this.processStatusList = ['待处理','已悬停'];
    } else if(this.urlName === 'credVerification'){
      this.processStatusList = ['待核销','已悬停'];
    } else if(this.urlName === 'collectiongEnd'){
      this.processStatusList = ['已完结','REVERSED'];
    }
  },
  mounted(){
    this.mustData.actOperator = this.$store.state.userName;
    this.formLabelAlign.modifiedBy = this.$store.state.userName;
    this.init();
    setTimeout(()=>{
      // 分出人+经济人
      let fcArr = JSON.parse(sessionStorage.getItem('CedentType'));
      let jArr = JSON.parse(sessionStorage.getItem('BrokerType'));
      this.cedentList = jArr.concat(fcArr);
      //获取币制
      this.rmCurrencyList = JSON.parse(sessionStorage.getItem('CurrencyList'));
      // 集团产再
      this.baseCompanyList = JSON.parse(sessionStorage.getItem('baseCompany'));
      // 国际国内
      this.businessOriginList = JSON.parse(sessionStorage.getItem('businessOrigin'));
    },1000)
  },
  methods: {
    init(tag){
      // 进首页查询
      let param = Object.assign({},this.mustData,{curOperator:this.$store.state.userName})
      delete param.actOperator;
      if(this.urlName === 'taskClaim'){ delete param.curOperator; }
      this.$http.post('api/receipt/finaCreat/list',param).then(res =>{
        if(res.status === 200 ){
          this.tableData = res.data.rows;
          this.mustData.total = res.data.total;
          if(res.data && res.data.rows && res.data.rows.length){
            if(res.data.rows[0].processStatus === '待处理' && this.urlName === 'credOperation'){
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
      this.singlePId = this.chooseRow.processId;
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
        case 2: //批量创建
          this.title = '批量创建';
          this.dialogFormVisible2 = true;
          break;
        case 3: //刷新

          break;
        case 4: //查询
          this.title = '查询';
          this.confirm();
          // this.dialogFormVisible = true;
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
          } else{ this.formLabelAlign.rmReceiptDate = ''; }
          // 结付公司代码回显
          if(this.chooseRow.rmSettleCompanyCode){
            this.cedentList.forEach((el,i)=>{
              if(el.codecode == this.chooseRow.rmSettleCompanyCode){
                this.cedentModel = i;
              }
            })
           } else{ this.cedentModel = null; }

           this.$http.post('api/worksheet/sortOperation/listDocument'
          ,{actOperator:this.$store.state.userName,
            processId:this.chooseRow.processId,
            pageNumber:1,
            pageSize:100,}).then(res =>{
              if(res.status === 200){
                this.fileData = res.data.rows;
                this.title = '编辑';
                this.dialogFormVisible = true;
              }
            })

          
          break;
        case 7: //删除
          this.$confirm(`确认删除?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('api/receipt/finaCreat/remove',Object.assign({},this.chooseRow,this.mustData)).then(res =>{
            // this.$http.post('api/receipt/finaCreat/remove',{processId:row.processId,modifiedBy:this.$store.state.userName}).then(res =>{
              if(res.status === 200 && res.data.code == 0){
                  this.$message({type: 'success', message: '删除成功!'});  
                  this.init();             
              } else if(res.data.code == 1 && res.data.msg){
                this.$message.error(res.data.msg);
              }
            })
          })
          break;
        case 8: //上传附件
          // this.title = '上传附件';
          
          // this.dialogFormVisible2 = true;
          break;
        case 10: //流程提交
          this.$confirm('是否流程提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('api/receipt/activitiForReceipt/commonActivitiForReceipt'
            ,{processId:this.chooseRow.processId,
             procInstId:this.chooseRow.processInstId,
              assignee:this.$store.state.userName,
              type:'WAITING',
              actOperator:this.$store.state.userName})
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible2 = false;
                this.$message({type: 'success', message: '提交成功!'});  
                this.init();
              } else if(res.data.errorCode == 0 && res.data.errorMessage){
                this.$message.error(res.data.errorMessage);
              }
            })
          })  
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
        case 12: //附件查看
          this.title = '附件查看';
          this.$http.post('api/worksheet/sortOperation/listDocument'
          ,{
            // actOperator:this.$store.state.userName,
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
        case 13: // 任务认领
          let url = '', obj = null;
          if(this.multipleSelection.length && this.multipleSelection.length == 1){ // 一个用原来的接口
            url = 'api/receipt/activitiForReceipt/commonActivitiForReceipt';
            obj = { processId:this.multipleSelection[0].processId, procInstId:this.multipleSelection[0].processInstId, }
          } else if(this.multipleSelection.length && this.multipleSelection.length > 1){ 
            url = 'api/receipt/activitiForReceipt/commonActivitiForReceiptForActive';
            let str = '';
            this.multipleSelection.forEach(el=>{ str += `${el.processId},` })
            str=str.substr(0,str.length-1);
            obj = { processId:str }
          } else{ this.$message.error('请选择process'); return false; }

          this.$confirm('是否任务认领？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post(url,Object.assign({},obj,{assignee:this.$store.state.userName,type:'ACTIVE',actOperator:this.$store.state.userName}))
            .then(res =>{
              if(this.multipleSelection.length == 1 && res.data.errorCode == 1){
                this.dialogFormVisible2 = false;
                this.$message({type: 'success', message:'提交成功'});  
                this.init();
              } else{
                if(res.status === 200 && res.data.errorMessage){
                  this.dialogFormVisible2 = false;
                  this.$message({type: 'warning', message: res.data.errorMessage });  
                  this.init();
                }
              }
            })
          })  
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
              this.$http.post('api/receipt/finaCreat/save',Object.assign({},this.mustData,this.formLabelAlign,{actOperator:this.$store.state.userName,modifiedBy:this.$store.state.userName})).then(res =>{
              if(res.status === 200 && res.data.msg === '操作成功'){
                this.dialogFormVisible = false;
                this.init();
                } else if(res.data.code == 1){
                  this.$message.error(res.data.msg);
                }
              })
            }
            this.$refs[formName].resetFields();
          })
          break;
        case 2: //批量创建

          break;
        case 3: //刷新

          break;
        case 4: //查询
        if(!this.formLabelAlign.processStatus){ this.formLabelAlign.processStatus = this.processStatusCom; }
          let param = Object.assign({},this.mustData,this.formLabelAlign,{curOperator:this.$store.state.userName})
          delete param.actOperator;
          this.$http.post('api/receipt/finaCreat/list',param).then(res =>{
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
        case 5: //详情

          break;
        case 6: //编辑
          this.$http.post('api/receipt/finaCreat/update',Object.assign({},this.mustData,this.formLabelAlign,{actOperator:this.$store.state.userName})).then(res =>{
            if(res.status === 200 && res.data.msg === '操作成功'){
              this.dialogFormVisible = false;
              this.init();
            } else if(res.data.msg){
                this.$message.error(res.data.msg);
            }
            this.$refs[formName].resetFields();
          })
          break;
        case 7: //删除
          break;
        case 8: //上传附件
          break;
        case 10: //流程提交
          break;
        case 11: //踪迹
          break;
      }
      // this.$refs[formName].resetFields();
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
      let url = this.title=='批量创建'?'/receipt/finaCreat/uploadCreate':'/anyShare/fileOperation/uploadFilesForPage';
      let people = this.title=='批量创建'?'modifiedBy':'actOperator'
      let resFile = new FormData();
      resFile.append('file', this.file[0]);
      resFile.append(people, this.mustData.actOperator);
      if(this.title != '批量创建'){
        resFile.append('processId', this.chooseRow.processId);
      }
      this.$http.post(`api${url}`,resFile,{headers:{ 'Content-Type': "application/json;charset=UTF-8" }}).then(res =>{
        if(res.status === 200){
          if(this.title=='批量创建'){
            if(res.data.code == 0){
              this.dialogFormVisible2 = false;
              this.$message({message: '上传成功',type: 'success'});
              this.init();
            } else if(res.data.msg){
              this.$message.error(res.data.msg);
            }
              this.file = [];
              this.fileList = [];
          } else{  // 上传附件
            if(res.data.errorCode == 1){
              this.dialogFormVisible2 = false;
              this.$http.post('api/worksheet/sortOperation/listDocument'
              ,{actOperator:this.$store.state.userName,
                processId:this.chooseRow.processId,
                pageNumber:1,
                pageSize:100,}).then(res =>{
                  if(res.status === 200){
                    this.fileData = res.data.rows;
                  }
                })
              } else if(res.data.errorMessage){
                this.$message.error(res.data.errorMessage);
              }
              this.file = [];
              this.fileList = [];
          }
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
          if(res.data.errorCode == 1){
            this.handleClick(12,{processId:this.singlePId})
          }
        })
      })
    },
    goDetail(row){
      if(this.urlName === 'financialCreat' || this.urlName === 'taskClaim'){
        return;
      }
      // let routeData = this.$router.resolve({
      this.$router.push({
          name: 'detailCred',
          query: {
            tag: this.urlName,
            name:this.goDetailName,
            row:JSON.stringify(row),
            }
        });
        // window.open(routeData.href, '_blank');
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
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
.receiptCom {
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
.receiptCom .el-input{
  width: 196px;
}
.browseDoc {
  background-color: #ecf5ff;
  width: 600px;
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
