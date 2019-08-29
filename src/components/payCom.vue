<template>
  <div class="payCom">
    <div :class="searchFlag===true?'searchNew':''" >
      <div class="titleSearch" @click="searchFlag = !searchFlag"><i style="margin-right:8px;" :class="searchFlag===false?'el-icon-arrow-down':'el-icon-arrow-up'"></i>查询</div>
      <el-collapse-transition> 
      <div v-show="searchFlag">
        <el-row :gutter="10" class="billRow" class-name="transition-box">
          <el-col :span="8">
            <span class="slable">流程编号</span>
            <el-input placeholder="请输入流程编号" v-model.trim="searchList.processId"></el-input>
          </el-col>
          <el-col :span="8">
            <span class="slable">结付公司</span>
              <el-select clearable filterable v-model="searchList.cedentModel" placeholder="请选择结付公司">
                <el-option v-for="(item,index) in cedentList" :key="index" :label="item.codecode+' - '+item.codeName" :value="index">
                  <span style="float:left">{{ item.codecode }}</span>
                  <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="8" v-show="processStatusList.length">
            <span class="slable">流程状态</span>
            <el-select clearable v-model="searchList.processStatus" placeholder="请选择流程状态">
              <el-option v-for="item in processStatusList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="billRow"><el-col :span="24">
          <el-button type="primary" plain @click="handleClick(4)"><i class="iconfont iconGroup42"></i>查询</el-button>
          <el-button type="primary" plain @click="reset"><i class="iconfont iconGroup39"></i>重置</el-button>
        </el-col></el-row>
      </div>
      </el-collapse-transition>
    </div>
    <div class="btn">
      <el-button type="primary" plain @click="handleClick(1)" v-show="urlName === 'payOperation'"><i class="iconfont iconGroup91"></i>创建</el-button>
      <el-button type="primary" plain @click="init(0)" class="borderBtn"><i class="iconfont iconGroup37"></i>刷新</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%" :height="changeClientHight" :header-row-class-name="StableClass">
      <el-table-column v-if="urlName === 'payOperation' || urlName === 'approvalDone'" width="50" align="center">
        <template slot-scope="scope" v-if="urlName === 'payOperation' || urlName === 'approvalDone'">
          <div style="display: flex;align-items: center;justify-content: center;">
            <span :class="scope.row.rejectedFlag == '1'?'statePoint stateRed':'statePoint stateGreen'"></span>
            <!-- <span>{{scope.row.rejectedFlag == '1'?'异常':'正常'}}</span> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="流程编号" width="150" align="center">
        <template slot-scope="scope">
          <span :class="{'smallHand':urlName!=='taskCreation' && urlName!=='emailNotify'}" @click="goDetail(scope.row)">{{scope.row.processId}}</span>
        </template>      
      </el-table-column>
      <el-table-column prop="rmCurrency" label="币制" align="center"></el-table-column>
      <el-table-column label="结付公司" width="120" align="right">
         <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.checkoutPayment" placement="top-start">
            <span class="abbreviate">{{scope.row.checkoutPayment}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="汇款金额" width="120" align="right">
         <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="Number(scope.row.rmAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')"
            placement="top-start">
            <span class="abbreviate">{{Number(scope.row.rmAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="110" label="录入人员" align="center">
        <template slot-scope="scope">
          <span>{{nameList[scope.row.curOperator]}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="urlName==='payReview'||urlName==='payClose'||urlName==='emailNotify'||urlName==='payment'||urlName==='partialDone'" label="复核人员" width="110" align="center">
        <template slot-scope="scope" v-if="urlName==='payReview'||urlName==='payClose'||urlName==='emailNotify'||urlName==='payment'||urlName==='partialDone'">
          <span>{{nameList[scope.row.closedBy]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否紧急" v-if="urlName === 'payment'" align="center">
        <template slot-scope="scope" v-if="urlName === 'payment'">
          <div style="display: flex;align-items: center;justify-content: center;">
            <!-- <span :class="scope.row.accountCloseFlag == '1'?'statePoint stateRed':'statePoint stateGreen'"></span> -->
            <span>{{scope.row.accountCloseFlag == '1'?'紧急':'正常'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="processStatus" label="流程状态" width="160" align="center"></el-table-column>
      <el-table-column prop="businessOrigin" width="160" label="Business Origin" align="center"></el-table-column>
      <el-table-column label="Base Company" width="160" prop="baseCompany" align="center"></el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="160" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-dropdown placement="top-start">
            <span class="el-dropdown-link"><i class="iconfont iconcaozuoliebiao"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span v-show="scope.row.pendingFlag || urlName === 'taskCreation' || urlName === 'approvalDone'" @click.stop="handleClick(6,scope.row)" class="blueColor">编辑</span></el-dropdown-item>
              <el-dropdown-item><span v-show="urlName !== 'payOperation'" @click.stop="handleClick(11,scope.row)" class="blueColor">踪迹</span></el-dropdown-item>
              <el-dropdown-item><span v-show="urlName === 'taskCreation'" @click.stop="handleClick(10,scope.row)" class="blueColor">流程提交</span></el-dropdown-item>
              <el-dropdown-item><span v-show="urlName === 'emailNotify'" @click.stop="handleClick(12,scope.row)" class="blueColor">流程提交</span></el-dropdown-item>
              <el-dropdown-item><span v-show="urlName === 'emailNotify'" @click.stop="handleClick(15,scope.row)" class="blueColor">附件</span></el-dropdown-item>
              <el-dropdown-item><span v-show="urlName === 'emailNotify'" @click.stop="handleClick(13,scope.row)" class="blueColor">邮件通知</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:100%;display:flex;align-items: flex-end;justify-content: space-between;">
      <div></div>
      <div style="display:flex;align-items: flex-end;justify-content: space-between;">
        <div style="padding-bottom: 5px;padding-right: 10px;" v-if="urlName === 'payOperation' || urlName === 'approvalDone'"> 
          <span class='statePoint stateRed'></span><span>异常</span>
          <span class='statePoint stateGreen'></span><span>正常</span>
        </div>
        <el-pagination
          style="width: fit-content;"
          @size-change="handleSizeChange()"
          @current-change="handleCurrentChange"
          :current-page="mustData.pageNumber"
          :page-sizes="[20, 50, 80, 100]"
          :page-size="mustData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="mustData.total">      
        </el-pagination>
      </div>
    </div>
    
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="modal">
      <el-form :label-position="labelPosition" label-width="140px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign" class="SwitchingMode">
        <el-form-item label="结付公司">
          <el-select clearable filterable v-model="cedentModel" placeholder="请选择结付公司">
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
        <el-form-item label="币制" v-show="title==='编辑'">     
          <el-select clearable v-model="formLabelAlign.rmCurrency" placeholder="请选择">
            <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="Business Origin" prop="businessOrigin" v-show="title==='创建' || title==='编辑'"> 
          <el-select clearable v-model="formLabelAlign.businessOrigin" placeholder="请选择Business Origin">
            <el-option v-for="item in businessOriginList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Base Company" v-show="title==='创建' || title==='编辑'" prop="baseCompany">
          <el-select clearable v-model="formLabelAlign.baseCompany" placeholder="请选择Base Company">
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
        <!-- <el-form-item>
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" plain @click="confirm('formLabelAlign')" style="padding:0 16px;">确 定</el-button>
        </el-form-item> -->
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
         <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" plain @click="confirm('formLabelAlign')" style="padding:0 16px;">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible2" :close-on-click-modal="modal" :style="title==='流程提交'?'height:400px':''" width="432" class="SwitchingMode">
      <el-form label-width="140px" v-show="title==='流程提交'">
        <el-form-item label="选择处理人" v-show="title==='流程提交'">
          <el-select filterable v-model="assignee"  placeholder="请选择">
            <el-option v-for="(item,i) in TJRoptionsA" :key="i" :label="item.name" :value="item.username"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-button size="small" @click="dialogFormVisible2 = false">取消</el-button>
          <el-button size="small" type="primary" plain @click="confirm">确定</el-button>
        </el-form-item> -->
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
      <el-table :data="track" border style="width: 100%;height:auto;" v-show="title==='踪迹'" :header-row-class-name="StableClass">
        <el-table-column prop="processId" label="流程编号" width="150" align="center"></el-table-column>
        <el-table-column prop="actName" label="操作名称" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark"  :content="scope.row.actName" placement="top-start">
              <span class="abbreviate">{{scope.row.actName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="任务来源" align="center">
          <template slot-scope="scope">
            <span>{{nameList[scope.row.actOperator]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actTime" label="操作时间" align="center">
           <template slot-scope="scope">
            <el-tooltip class="item" effect="dark"  :content="scope.row.actTime" placement="top-start">
              <span class="abbreviate">{{scope.row.actTime}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="操作原因" align="center">
           <template slot-scope="scope">
            <el-tooltip class="item" effect="dark"  :content="scope.row.reason" placement="top-start">
              <span class="abbreviate">{{scope.row.reason}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作备注" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark"  :content="scope.row.remark" placement="top-start">
              <span class="abbreviate">{{scope.row.remark}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="fileData" height="300" style="width: 100%;height:auto;" border class="document" v-if="title==='上传附件' || title==='附件'" :header-row-class-name="StableClass">
        <el-table-column label="文件名" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top">
              <span :class="{'smallHand':!scope.row.suffixFlag && urlName!='emailNotify'}" class="abbreviate" @click="docView(scope.row)">{{scope.row.docName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="160" align="center"></el-table-column>
        <el-table-column label="任务来源" width="140" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="nameList[scope.row.createdBy]" placement="top">
              <span class="abbreviate">{{nameList[scope.row.createdBy]}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click.stop="detailRemove(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column> -->
      
      <div class="browseDoc" v-if="title=='附件'||title=='编辑'">
        <iframe src="../../static/Preview/index.html" id="iframeId" name="ifrmname" style="width:100%;height:-webkit-fill-available;" ref="mapFrame" frameborder="0"></iframe>
      </div>
      </el-table>
      <div slot="footer" class="dialog-footer" style="margin-top:10px;" v-show="title==='流程提交'">
        <el-button size="small" @click="dialogFormVisible2 = false">取消</el-button>
        <el-button size="small" type="primary" plain @click="confirm">确定</el-button>
      </div>
      

    </el-dialog>
 
    <el-dialog :title="title" :visible.sync="dialogFormVisible3" :close-on-click-modal="modal" class="SwitchingMode">
      <el-form label-width="120px">
        <el-form-item label="收件人" v-show="title==='邮件通知'" style="width:100%">
          <el-autocomplete v-model="mailInfo" style="width:100%" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="elSelect">
            <i class="el-icon-edit el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }"><span>{{item.contactName}}：{{item.emailAddr}}</span></template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="邮件标题" v-show="title==='邮件通知'" style="width:100%">
          <el-input type="text" placeholder="请输入内容" v-model="mailTitle" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="内容编辑" v-show="title==='邮件通知'" style="width:100%">
          <!-- <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="emailContent"></el-input> -->
          <div style="width:100%;height:fit-content" v-html="htmlContent"></div>
        </el-form-item>
        <el-form-item label="附件上传方式" v-show="title==='邮件通知'" style="width:100%">
          <el-tabs v-model="uploadType">
            <el-tab-pane label="本地上传" name="1">
              <el-upload
                :disabled="uploadType!=1 && $route.query.tag === 'billSignBack'"
                class="upload-demo"
                action=""
                multiple
                :before-upload="beforeAvatarUpload"
                :auto-upload="true"
                :http-request="upload"
                :file-list="fileList">
                <el-button plain :type="uploadType!=1?'info':'primary'">上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="附件列表选取" name="2">
              <el-select v-model="chooseDocList" multiple :disabled="uploadType != 2" style="width:100%" placeholder="请选择">
                <el-option v-for="(item,i) in tableData" :key="i" :label="item.docName" :value="item.docCloudId"></el-option>
              </el-select>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="title==='邮件通知'">
        <el-button size="small" @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button size="small" type="primary" plain @click="send()" style="padding:0 16px;">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="文档预览" width="fit-content" :visible.sync="dialogFormVisibleA" :close-on-click-modal="modal">
      <!-- <div class="browseDoc" v-show="title!='踪迹'">
        <iframe src="../../static/Preview/index.html" id="iframeId" name="ifrmname" style="width:100%;height:-webkit-fill-available;" ref="mapFrame" frameborder="0"></iframe>
      </div> -->
      <div v-show="title=='踪迹'" style="width:1020px;height:100%;">
        <img :src="picture" style="width:100%;height:1005;">
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'payCom',
  props:{  // urlName页面名称  processStatusCom流程状态  goDetailName详情页tag
      urlName:'',
      processStatusCom:'',
      goDetailName:'',
    },
  data() {
      return {
        Ename:'',
        Esignature:'',
        Edate:'',
        htmlContent:'',
        suffixFlag:false,
        emailFlag:false,
        chooseDocList:[],
        uploadType:'1',
        emailContent:null,
        mailTitle:null,
        mailInfo:null,
        nameList:{},
        admFlag:false,
        searchFlag:false,
        modal:false,
        changeClientHight:null,
        tableData:[],
        ZDoptions:[
        ],
        mailOption:[],
        businessOriginList:[],
        baseCompanyList:[],
        rmCurrencyList:[],
        currentPage3: 5,
        hide:false,
        labelPosition:'right',
        searchList:{
          processId:null,
          cedentModel:null,
          processStatus:null,
        },
        formLabelAlign:{
          rmSettleCompanyCode:'',
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
        TJRoptionsA:[],
        track:[],
        assignee:'',
        mustData:{
          actOperator:'',
          processStatus:'',
          pageNumber:1,  // 页数
          pageSize:20,  //页面一次要展示的条数
          total:0, //总条数
          processType:'付款',
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
        StableClass:'tableClass',
        chooseRow:{},
        cedentModel:'',
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
        dialogFlag:false,
        processStatusList:[],
      };
    },
  created(){
    sessionStorage.setItem("data", JSON.stringify({}));
  },
  mounted(){
    if(this.urlName=='emailNotify'){
      let D = new Date();
      if(D.getDay()==0){  // 周日
        let day1 = D.setTime(D.getTime()+24*60*60*1000);
        this.Edate = new Date(day1).getFullYear()+"-" + (new Date(day1).getMonth()+1) + "-" + new Date(day1).getDate();
      } else if(D.getDay()==6){  // 周六
        let day2 = D.setTime(D.getTime()+48*60*60*1000);
        this.Edate = new Date(day2).getFullYear()+"-" + (new Date(day2).getMonth()+1) + "-" + new Date(day2).getDate();
      } else{
        this.Edate = D.getFullYear()+"-" + (D.getMonth()+1) + "-" + D.getDate();
      }
    }
    this.nameList = JSON.parse(sessionStorage.getItem("nameList"));
    if(this.urlName === 'payOperation'){
      this.processStatusList = ['待处理','已悬停'];
    } else if(this.urlName === 'payClose'){
      this.processStatusList = ['待核销','已悬停'];
    } else{ this.processStatusList = Array.of(this.processStatusCom); }
    this.mustData.processStatus = this.processStatusCom;
    if(this.$route.name==='payOperation'||this.$route.name==='payVerification'||this.$route.name==='approvalDone'){
      this.changeClientHight=document.body.clientHeight-100-document.querySelector('.el-table').offsetTop;
    }else{
      this.changeClientHight=document.body.clientHeight-100-document.querySelector('.el-table').offsetTop;
    }
    this.changeWindow();
    // if(this.urlName === 'payment') {
    //   this.mustData.accountCloseFlag = '0';
    // } else if(this.urlName === 'instancyPay'){
    //   this.mustData.accountCloseFlag = '1';
    // }
    this.mustData.actOperator = this.$store.state.userName;
    this.formLabelAlign.modifiedBy = this.$store.state.userName;
    setTimeout(()=>{
      // 分出人+经济人
      let fcArr = JSON.parse(sessionStorage.getItem('CedentType'));
      let jArr = JSON.parse(sessionStorage.getItem('BrokerType'));
      let rArr = JSON.parse(sessionStorage.getItem('ReinsurerList'));
      // this.cedentList = jArr.concat(fcArr);
      this.cedentList = [...fcArr,...jArr,...rArr];
      // 集团产再
      let objbc = JSON.parse(sessionStorage.getItem('baseCompany'));
      this.baseCompanyList = objbc.filter(el=>{ return el.code != 'Both' });
      // 国际国内
      this.businessOriginList = JSON.parse(sessionStorage.getItem('businessOrigin'));
      //获取币制
      this.rmCurrencyList = JSON.parse(sessionStorage.getItem('CurrencyList'));
    },500)
    // 判断是否是管理员   66
      let admArr = JSON.parse(sessionStorage.getItem('roleIdList'));
      admArr.some(el=>{return el==66;}) ? (this.admFlag = true) : (this.admFlag = false);
      this.init();
    this.$http.post('api/activiti/getAssigneeName',{roleName:'付款录入'}).then(res =>{
      if(res.status === 200) {
        this.TJRoptions = res.data;
      }
    })
    
  },
  methods: {
    querySearch(queryString, cb) {
      let restaurants = this.mailOption;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.emailAddr.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    elSelect(item){
      this.mailInfo = item.emailAddr
    },
    send(){
      let val = '';
      if(this.chooseRow.businessOrigin=="International"){  // 国际 hyd
          val = `<div>Dear ${document.getElementById('Ename').value},<br/>
          We are pleased to inform that we arranged a settlement of ${document.getElementById('Ename1').value} ${document.getElementById('Ename2').value} with an estimated value date of ${document.getElementById('Ename3').value}.<br/>
          Attached sheet for your transaction reference.<br/>
          If however, you have any queries please let me know.<br/>  
          <span style="margin-left:300px;">${document.getElementById('Esignature').value}</span></div>`
        }else{
          val = `<div>${document.getElementById('Ename').value}老师，您好！<br/>
          我们预计将在${document.getElementById('Ename1').value}支付贵司金额为${document.getElementById('Ename2').value}${document.getElementById('Ename3').value}的款项，详情请见清单。<br/>
          如果有问题，请及时与我们联系。谢谢！<br/>
          <span style="margin-left:300px;">${document.getElementById('Esignature').value}<span></div>   `
        } 
      let info = {},params = null;
      // info = Object.assign({},{emailAddr:this.mailInfo, emailContent: this.emailContent, mailTitle: this.mailTitle });
      info = Object.assign({},{emailAddr:this.mailInfo, emailContent: val, mailTitle: this.mailTitle,processId:this.chooseRow.processId });
      // 本地上传
      if (this.file.length) {
        var resFile = new FormData();
        resFile.append("file", this.file[0]);
        for (let k in info) {
          resFile.append(k, info[k]);
        }
      }
      // docList 上传
      if (this.chooseDocList && this.chooseDocList.length) {
        // let row = this.tableData[this.chooseDocList];
        // this.$http.post("api/anyShare/fileOperation/previewDocument",Object.assign({}, row, { processId: this.chooseRow.processId }),{ responseType: "blob" })
        //   .then(res => {
        //     if (res.status === 200) {
        //       let resFiles = new FormData();
        //       resFiles.append("file", res.data);
        //       for (let k in info) {
        //         resFiles.append(k, info[k]);
        //       }
        //       this.$http.post("api/worksheet/wSEntry/sendEmail", resFiles)
        //         .then(res => {
        //           if (res.status === 200 && res.data.code == 0) {
        //             this.$message({type: "success",message: res.data.msg});
        //             this.dialogFormVisible2 = false;
        //           } else{
        //             this.$message({type: "error",message: res.data.msg});
        //             this.dialogFormVisible2 = false;
        //           }
        //         });
        //     }
        //   });
        this.$http.post("api/worksheet/wSEntry/sendEmail", {emailAddr:this.mailInfo,emailContent: val, mailTitle: this.mailTitle, docCId:this.chooseDocList}).then(res => {
        // this.$http.post("api/worksheet/wSEntry/sendEmail", {emailAddr:this.mailInfo,emailContent: this.emailContent, mailTitle: this.mailTitle, docCId:this.chooseDocList}).then(res => {
          if (res.status === 200 && res.data.code == 0) {
            this.$message({type: "success",message: res.data.msg});
            this.dialogFormVisible3 = false;
          } else{
            this.$message({type: "error",message: res.data.msg});
            this.dialogFormVisible3 = false;
          }
        });
      } else{
        this.file.length ? (params = resFile) : (params = info);
        this.$http.post("api/worksheet/wSEntry/sendEmail", params)
          .then(res => {
            if (res.status === 200 && res.data.code==0) {
              this.$message({ type: "success", message:res.data.msg});
              this.dialogFormVisible3 = false;
              this.fileList = [];
              this.file = [];
            } else{
              this.$message({type: "error",message: res.data.msg});
              this.dialogFormVisible3 = false;
            }
          });
      }
    },
    changeWindow(){
      let that=this;
      document.body.onresize=function(e){
        if(that.$route.name==='payOperation'||that.$route.name==='payVerification'||that.$route.name==='approvalDone'){
            that.changeClientHight=document.body.clientHeight-100-document.querySelector('.el-table').offsetTop;
        }else{
          that.changeClientHight=document.body.clientHeight-100-document.querySelector('.el-table').offsetTop;
        }
        // that.changeClientHight=document.body.clientHeight-178-document.querySelector('.el-table').offsetTop;
      }
    },
    init(tag){
      // 进首页查询
      let params = null;
      if(!this.admFlag){ 
        params = Object.assign({},this.mustData,{curOperator:this.$store.state.userName});
        } else{
        params = Object.assign({},this.mustData);
        }
      delete params['actOperator'];
      this.$http.post('api/pay/teskClaim/list',params).then(res =>{
        if(res.status === 200 ) { 
          // 回显结付公司
          if(res.data.rows&&res.data.rows.length){
            res.data.rows.forEach(el=>{
              let n = null, c = null;let payStr = '';
              if(el.rmSettleCompanyName){n=el.rmSettleCompanyName.split(';')} else{ n = []; }
              if(el.rmSettleCompanyCode){c=el.rmSettleCompanyCode.split(';')} else{ c = []; }
              if( n && n.length && n.length>0){ n.forEach((el,i)=>{ payStr+=`${c[i]}-${el};` })}
              el['checkoutPayment'] = payStr;
            })
          }
          this.mustData.total = res.data.total;
          if(res.data && res.data.rows && res.data.rows.length){
            if(this.urlName === 'payOperation' || this.urlName === 'payClose'){
              res.data.rows.forEach(el=>{
                el.processStatus === '待处理'?el['pendingFlag']=true:el['pendingFlag']=false;
              })
            }
          }
          this.tableData = res.data.rows;
          if(tag == 0){
            this.$message({type: 'success', message: '刷新成功!'}); 
          }
        }
      })
    },
    docView(row) {
      // this.dialogFormVisibleA = true;
      if(row){
        let arrr = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT'];
        this.suffixFlag = arrr.some(el=>{ return el==row.suffix; })
        if(row.suffix && !this.suffixFlag){ return false; }
        this.$http.post('api/anyShare/fileOperation/getLogInInfo').then(res =>{
        if(res.status == 200){
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
      for(let k in this.searchList){
          this.searchList[k] = null;
        }
        this.searchList = null;
    },
    handleClick(tag,row){
      this.chooseRow = Object.assign({},row);
      this.tag = tag;
      this.assignee = null;
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
          this.title = '查询';
          this.confirm();
          break;
        case 6: //编辑
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
                // this.fileData = res.data.rows;
                let arr4 = res.data.rows;
                arr4.forEach(el=>{
                  if(el.docName){
                    let suffix = el.docName.split('.');
                    el['suffix'] = suffix[suffix.length-1];
                    el['suffixFlag'] = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT'].some(el=>{ return el==suffix[suffix.length-1]; })
                  }
                })
                this.fileData = arr4;
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
        case 12: //流程提交  //  8.23 胖虎说邮件流程提交，不用指下一个人，直接只给entryOperator
          // 8.27 胖虎又说流程提交需要选人 邮件通知的 提交,  支付页面的  指派,   角色都传'收款出纳'
          this.$http.post("api/activiti/getAssigneeName", {roleName:'收款出纳'})
            .then(res => {
              if (res.status === 200) {
                this.TJRoptionsA = res.data;
              }
            });
          this.title = '流程提交';
          // this.$confirm('是否流程提交?', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
          //     ,{processId:this.chooseRow.processId, 
          //     procInstId:this.chooseRow.processInstId, 
          //     assignee:this.chooseRow.entryOperator, 
          //     type:'PAYING',
          //     actOperator:this.$store.state.userName,
          //     // hasNoticedFlag:this.chooseRow.hasNoticedFlag
          //     }).then(res =>{
          //     if(res.status === 200 && res.data.errorCode == 1){
          //       this.dialogFormVisible2 = false;
          //       this.$message({type: 'success', message: res.data.errorMessage});  
          //       this.assignee = null;
          //       this.init();
          //     } else if(res.data.errorCode == 0){
          //       this.$message({type: 'error', message:res.data.errorMessage }); 
          //     }
          //   })
          // })
          this.dialogFormVisible2 = true;

        break;
        case 13: //邮件通知 
           if(this.chooseRow.businessOrigin=="International"){  // 国际
            this.htmlContent = `<div>Dear <input class="mailTemplate" type="text" id="Ename"/>,<br/>
            We are pleased to inform that we arranged a settlement of <input class="mailTemplate" type="text" value="${this.chooseRow.rmCurrency}" id="Ename1"/> <input class="mailTemplate" type="text" value="${this.chooseRow.rmAmount}" id="Ename2"/> with an estimated value date of <input class="mailTemplate" type="text" value="${this.Edate}" id="Ename3"/>.<br/>
            Attached sheet for your transaction reference.<br/>
            If however, you have any queries please let me know.<br/>  
            <span style="margin-left:300px;"><input type="text" class="mailTemplate" id="Esignature" placeholder="please enter Personal signature"/></span></div>`
          }else{
            this.htmlContent = `<div><input class="mailTemplate" type="text" id="Ename"/>老师，您好！<br/>
            我们预计将在<input class="mailTemplate" type="text" value="${this.Edate}" id="Ename1"/>支付贵司金额为<input class="mailTemplate" type="text" value="${this.chooseRow.rmCurrency}" id="Ename2"/><input class="mailTemplate" type="text" value="${this.chooseRow.rmAmount}" id="Ename3"/>的款项，详情请见清单。<br/>
            如果有问题，请及时与我们联系。谢谢！<br/>
            <span style="margin-left:300px;"><input type="text" class="mailTemplate" id="Esignature" placeholder="请输入个人签名"/><span></div>   `
          } 
          this.$http.get("api/worksheet/wSEntry/getEmailContacts").then(res => {
          if (res.status === 200 && res.data.length) {
            this.fileData = this.chooseRow.bscDocumentVOlist;
            this.dialogFormVisible3 = true;
            this.title = "邮件通知";
            this.mailOption = res.data;
          } else {
            this.title = "邮件通知";
            this.dialogFormVisible3 = true;
            this.fileData = this.chooseRow.bscDocumentVOlist;
            this.$message.error("获取不到发送人列表信息");
          }
        });
          // this.title = '邮件通知';
          // this.dialogFormVisible3 = true;
        break; 
        case 15: //附件查看改为附件 hyd
          this.$http.post('api/worksheet/sortOperation/listDocument'
            ,{actOperator:this.$store.state.userName,
            processId:this.chooseRow.processId,
            pageNumber:1,
            pageSize:100, 
            }).then(res =>{
              if(res.status === 200 && res.data.rows && res.data.rows.length){
                // this.fileData = res.data.rows;
                let arr5 = res.data.rows;
                  arr5.forEach(el=>{
                    if(el.docName){
                      let suffix = el.docName.split('.');
                      el['suffix'] = suffix[suffix.length-1];
                      el['suffixFlag'] = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT'].some(el=>{ return el==suffix[suffix.length-1]; })
                    }
                  })
                  this.fileData = arr5;
                  if(this.fileData&&this.fileData.length){
                    let num = this.fileData.findIndex(el => { return el.suffix=='doc' || el.suffix=='DOCX' || el.suffix=='xlsx' || el.suffix=='PDF' || el.suffix=='pdf' || el.suffix=='XLSX'})
                    setTimeout(()=>{ this.docView(this.fileData[+num]); },1500)
                  }else{ sessionStorage.setItem('data',JSON.stringify({})); }
              }
            })
            this.title = '附件';
            this.dialogFormVisible2 = true;
        break;
        

      }

    },
    confirm(formName){
      if(this.cedentModel){
        let obj = this.cedentList[this.cedentModel];
        this.formLabelAlign.rmSettleCompanyCode = obj.codecode;
        this.formLabelAlign.rmSettleCompanyName = obj.codeName;
      } else{
        this.formLabelAlign.rmSettleCompanyCode = null;
        this.formLabelAlign.rmSettleCompanyName = null;
      }
      switch(this.tag){
        case 1: //创建
          this.$refs[formName].validate((valid) => {
            if(valid) {
              this.$http.post('api/pay/teskClaim/save',Object.assign({},{actOperator:this.$store.state.userName},this.mustData,this.formLabelAlign)).then(res =>{
              if(res.status === 200 && res.data.code == 0){
                this.dialogFormVisible = false;
                this.init();
                this.$refs[formName].resetFields();
                } else if(res.data.code == 1){
                  this.$message({ type: "error", message:res.data.msg });
                  this.dialogFormVisible = false;
                }
              })
            }
          })
          break;
        case 3: //刷新
        break;
        case 4: //查询
          let fenye = {
            pageNumber:1,  
            pageSize:100,
            processType:'付款',
          }
          let params = null;          
          if(!this.searchList.processStatus){
            if(!this.admFlag){ 
              params = Object.assign({},fenye,this.searchList,{curOperator:this.$store.state.userName,processStatus:this.processStatusList.join(',')});
            } else{
              params = Object.assign({},fenye,this.searchList,{processStatus:this.processStatusList.join(',')});
            }
          } else{
            if(!this.admFlag){ 
              params = Object.assign({},fenye,this.searchList,{curOperator:this.$store.state.userName});
            } else{
              params = Object.assign({},fenye,this.searchList);
            }
          }
          this.$http.post('api/pay/teskClaim/list',params).then(res =>{
            if(res.status === 200){
              if(!res.data.rows.length){
                this.$message({type: 'warning', message: '未查询出数据'}); 
              } else{
                this.mustData.total = res.data.total;
                // 回显结付公司
                res.data.rows.forEach(el=>{
                  let n = null, c = null;let payStr = '';
                  if(el.rmSettleCompanyName){n=el.rmSettleCompanyName.split(';')} else{ n = []; }
                  if(el.rmSettleCompanyCode){c=el.rmSettleCompanyCode.split(';')} else{ c = []; }
                  if( n && n.length && n.length>0){ n.forEach((el,i)=>{ payStr+=`${c[i]}-${el};` })}
                  el['checkoutPayment'] = payStr;
                })
              this.tableData = res.data.rows;
              }
            }
          })
          break;
        case 6: //编辑
            this.$refs[formName].validate((valid) => {
            if(valid) {
              this.$http.post('api/pay/teskClaim/update',Object.assign({},this.mustData,this.formLabelAlign,{actOperator:this.$store.state.userName})).then(res =>{
                // && res.data.msg === '操作成功'
                if(res.status === 200 && res.data.code == 0){
                  this.$message({ type: "success", message: res.data.msg });
                  this.dialogFormVisible = false;
                  this.init();
                  this.$refs[formName].resetFields();
                } else if (res.data.code == 1) {
                  this.$message.error(res.data.msg);
                } else{
                  this.dialogFormVisible = false;
                  this.init();
                  this.$message({ type: "warning", message: res.data.msg });
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
            this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
            ,{processId:this.chooseRow.processId, 
            procInstId:this.chooseRow.processInstId, 
            assignee:this.assignee, 
            type:'PAYING',
            actOperator:this.$store.state.userName,
            })
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible2 = false;
                this.$message({type: 'success', message: res.data.errorMessage});  
                this.assignee = null;
                this.init();
              } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
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
      if (this.title === "邮件通知") {
        return false;
      }
      let resFile = new FormData();
      resFile.append('file', this.file[0]);
      resFile.append('actOperator', this.mustData.actOperator);
      resFile.append('processId', this.chooseRow.processId);
      this.$http.post(`api/anyShare/fileOperation/uploadFilesForPageBatch`,resFile,{headers:{ 'Content-Type': "application/json;charset=UTF-8" }}).then(res =>{
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
.payCom {
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
.payCom .el-input{
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
