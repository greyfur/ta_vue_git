<template>
  <div class="billCom">
    <div class="searchNew">
      <div class="titleSearch" @click="searchFlag = !searchFlag">
        <i style="margin-right:8px;" :class="searchFlag===false?'el-icon-arrow-down':'el-icon-arrow-up'"></i>查询
      </div>
      <el-collapse-transition>
      <div v-show="searchFlag">
        <el-row :gutter="10" class="billRow" class-name="transition-box">
          <el-col :span="7">
            <span class="slable">流程编号</span>
            <el-input placeholder="请输入流程编号" v-model.trim="billSearch.processId"></el-input>
          </el-col>
          <el-col :span="7">
            <span class="slable">账单类型</span>
            <el-select clearable v-model="billSearch.wsType" placeholder="请选择账单类型">
              <el-option
                v-for="item in ZDoptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <span class="slable">账期</span>
            <el-input v-model.trim="zq2" placeholder="请输入年份" class="wsPeriod"></el-input>
            <el-select clearable v-model="zq1" placeholder="请选择账期" class="wsPeriod">
              <el-option v-for="item in zqList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" plain @click="handleClick(1)">
              <i class="iconfont iconGroup42"></i>查询
            </el-button>
            <el-button type="primary" plain @click="reset">
              <i class="iconfont iconGroup39"></i>重置
            </el-button>
          </el-col>
        </el-row>
      </div>
      </el-collapse-transition>
    </div>
    <div class="btn">
      <el-button type="primary" v-show="urlName === 'sortOperation'" plain @click="handleClick(0)">
        <i class="iconfont iconGroup91"></i>手工创建
      </el-button>
      <el-button type="primary" plain @click="init(0)">
        <i class="iconfont iconGroup37"></i>刷新
      </el-button>
    </div>
    <el-table :header-row-class-name="StableClass" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="createdAt" label="创建时间" width="100"></el-table-column>
      <el-table-column label="流程编号" width="125">
        <template slot-scope="scope">
          <span
            :class="{'smallHand':urlName !== 'sortOperation'}"
            @click="goDetail(scope.row)"
          >{{scope.row.processId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程名称" width="100">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.processName"
            placement="top-start"
          >
            <span class="abbreviate">{{scope.row.processName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="账单类型" width="80">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.wsType" placement="top-start">
            <span class="abbreviate">{{scope.row.wsType}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" width="80">
        <template slot-scope="scope">{{YWoptionsObj[scope.row.wsBusinessType]}}</template>
      </el-table-column>
      <el-table-column label="账期">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.wsPeriod"
            placement="top-start"
          >
            <span class="abbreviate">{{scope.row.wsPeriod}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="wsReceiptDate" width="120" label="账单收到日期"></el-table-column>
      <el-table-column label="分出公司" width="120">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.wsCedentCode&&scope.row.wsCedentName?scope.row.wsCedentCode+'-'+scope.row.wsCedentName:''"
            placement="top-start"
          >
            <span
              class="abbreviate"
              v-if="scope.row.wsCedentCode&&scope.row.wsCedentName"
            >{{scope.row.wsCedentCode}}-{{scope.row.wsCedentName}}</span>
            <span class="abbreviate" v-else></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="经纪公司" width="120">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.wsBrokerCode&&scope.row.wsBrokerName?scope.row.wsBrokerCode+'-'+scope.row.wsBrokerName:''"
            placement="top-start"
          >
            <span
              class="abbreviate"
              v-if="scope.row.wsBrokerCode&&scope.row.wsBrokerName"
            >{{scope.row.wsBrokerCode}}-{{scope.row.wsBrokerName}}</span>
            <span class="abbreviate" v-else></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Reporting Unit" width="120">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.reportUnit"
            placement="top-start"
          >
            <span class="abbreviate">{{scope.row.reportUnit}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="businessOrigin" label="Business Origin" width="130"></el-table-column>
      <el-table-column prop="baseCompany" label="Base Company" width="120"></el-table-column>
      <el-table-column prop="curOperator" label="任务来源" width="110"></el-table-column>
      <el-table-column prop="processStatus" label="流程状态"></el-table-column>
      <el-table-column label="状态" v-if="urlName === 'billEntry'">
        <template slot-scope="scope" v-show="urlName === 'billEntry'">
          <div style="display: flex;align-items: center;" v-show="urlName === 'billEntry'">
            <span
              :class="scope.row.rejectedFlag == '1'?'statePoint stateRed':'statePoint stateGreen'"
            ></span>
            <span>{{scope.row.rejectedFlag == '1'?'异常':'正常'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-dropdown>
            <span
              v-show="urlName === 'sortOperation' || pendingFlag"
              @click.stop="handleClick(2,scope.row)"
              style="margin-right:8px;cursor: pointer;"
            >编辑</span>
          </el-dropdown>
          <el-dropdown>
            <span
              v-show="urlName === 'sortOperation'"
              @click.stop="handleClick(3,scope.row)"
              style="margin-right:8px;cursor: pointer;"
            >分配</span>
          </el-dropdown>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多
              <i style="margin-left:8px;" class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span
                  v-show="urlName === 'sortOperation'"
                  @click.stop="handleClick(4,scope.row)"
                  class="blueColor"
                >删除</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click.stop="handleClick(5,scope.row)" class="blueColor">踪迹</span>
              </el-dropdown-item>
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
      :total="mustData.total"
    ></el-pagination>
    <!-- 弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="modal">
      <el-form
        label-position="right"
        label-width="140px"
        :model="billSearch"
        :rules="rules"
        ref="billSearch"
      >
        <el-form-item label="流程编号" v-show="title==='查询'">
          <el-input v-model.trim="billSearch.processId" placeholder="请输入流程编号"></el-input>
        </el-form-item>
        <!--   以上只有查询有 --------->
        <el-form-item label="账单类型" v-show="title==='手工创建' || title==='编辑' || title==='查询'">
          <el-select clearable v-model="billSearch.wsType" placeholder="请选择账单类型">
            <el-option
              v-for="item in ZDoptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="Business Origin"
          prop="businessOrigin"
          v-show="title==='手工创建' || title==='编辑'"
        >
          <el-select clearable v-model="billSearch.businessOrigin" placeholder="请选择Business Origin">
            <el-option
              v-for="item in businessOriginList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="Base Company"
          v-show="title==='手工创建' || title==='编辑'"
          prop="baseCompany"
        >
          <el-select clearable v-model="billSearch.baseCompany" placeholder="请选择Base Company">
            <el-option
              v-for="item in baseCompanyList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Reporting Unit" v-show="title==='手工创建' || title==='编辑'">
          <el-select
            clearable
            filterable
            v-model="billSearch.reportUnit"
            placeholder="请选择Reporting Unit"
          >
            <el-option
              v-for="item in ReportUnitList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="账期"
          v-show="title==='手工创建' || title==='编辑' || title==='查询'"
          class="zqForm"
        >
          <el-input v-model.trim="zq2" placeholder="年份" class="wsPeriod" maxlength="4"></el-input>
          <el-select clearable v-model="zq1" placeholder="请选择账期" class="wsPeriod">
            <el-option v-for="item in zqList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程状态" v-show="title === '查询' && urlName === 'billEntry'">
          <el-select clearable v-model="billSearch.processStatus" placeholder="请选择流程状态">
            <el-option v-for="item in ['待处理','已悬停']" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <div v-show="title === '手工创建' || title==='编辑'">
          <el-form-item label="任务类型" prop="wsBusinessType">
            <el-select clearable v-model="billSearch.wsBusinessType" placeholder="请选择任务类型">
              <el-option
                v-for="item in YWoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分出公司">
            <el-select clearable filterable v-model="cedentModel" placeholder="请选择分出公司">
              <el-option
                v-for="(item,index) in cedentList"
                :key="index"
                :label="item.codecode+' - '+item.codeName"
                :value="index"
              >
                <span style="float:left">{{ item.codecode }}</span>
                <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经纪公司">
            <el-select clearable filterable v-model="brokerModel" placeholder="请选择经纪公司">
              <el-option
                v-for="(item,index) in brokerList"
                :key="index"
                :label="item.codecode+' - '+item.codeName"
                :value="index"
              >
                <span style="float:left">{{ item.codecode }}</span>
                <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账单收到日期">
            <el-date-picker
              value-format="timestamp"
              v-model="billSearch.wsReceiptDate"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="附件上传" v-show="title==='编辑'">
          <el-upload
            class="sort-upload"
            action=""
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            :http-request="upload"
            :file-list="fileList"
          >
            <el-button type="primary" plain>上传</el-button>
          </el-upload>
          <el-table stripe :data="fileData" style="width: 100%" class="document">
            <el-table-column label="文件名" width="140">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top">
                  <span
                    class="smallHand abbreviate"
                    @click="docView(scope.row)"
                  >{{scope.row.docName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="时间" width="160"></el-table-column>
            <el-table-column label="任务来源" width="140">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.createdBy"
                  placement="top"
                >
                  <span class="abbreviate">{{scope.row.createdBy}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click.stop="detailRemove(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="选择下一任务处理人" v-show="title==='流程提交'">
          <el-select clearable v-model="assignee" placeholder="请选择">
            <el-option
              v-for="item in TJRoptions"
              :key="item.userId"
              :label="item.name"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-collapse v-show="title=='踪迹'">
        <el-collapse-item title="状态流转图">
          <img :src="picture" style="width:100%" @click="dialogFormVisible1=true">
        </el-collapse-item>
      </el-collapse>
      <el-table :data="track" border="" style="width: 100%" v-show="title==='踪迹'">
        <el-table-column prop="processId" label="流程编号" width="200"></el-table-column>
        <el-table-column prop="actName" label="操作名称"></el-table-column>
        <el-table-column prop="actOperator" label="任务来源" width="85"></el-table-column>
        <el-table-column prop="actTime" label="操作时间"></el-table-column>
        <el-table-column prop="reason" label="操作原因"></el-table-column>
        <el-table-column prop="remark" label="操作备注"></el-table-column>
      </el-table>
      <el-pagination
        small
        v-show="title=='踪迹'"
        layout="prev, pager, next"
        :total="ZJObj.total"
        :page-size="ZJObj.pageSize"
        @current-change="ZJhandleCurrentChange"
        :current-page="ZJObj.pageNumber"
      ></el-pagination>
      <div
        slot="footer"
        class="dialog-footer"
        v-show="title=='手工创建' || title=='查询' || title=='编辑' || title=='流程提交'"
      >
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" plain @click="confirm('billSearch')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="文档预览"
      width="fit-content"
      :visible.sync="dialogFormVisible1"
      :close-on-click-modal="modal"
    >
      <div class="browseDoc" v-show="title!='踪迹'" style="width:600px">
        <iframe
          src="../../static/Preview/index.html"
          id="iframeId"
          name="ifrmname"
          style="width:100%;height:-webkit-fill-available;"
          ref="mapFrame"
          frameborder="0"
        ></iframe>
      </div>
      <div v-show="title=='踪迹'" style="width:1020px;height:100%;">
        <img :src="picture" style="width:100%;height:1005;">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import routData from "@/assets/js/arrRoute.js";
export default {
  name: "billCom",
  props: {
    // urlName页面名称  processStatusCom流程状态  goDetailName详情页tag
    urlName: "",
    processStatusCom: ""
  },
  data() {
    return {
      searchFlag: false,
      tableData: [],
      assignee: "",
      modal: false,
      YWoptions: [
        { value: "T", label: "合约账单" },
        { value: "F", label: "临分账单" },
        { value: "O", label: "转分账单" },
        { value: "C", label: "理赔账单" }
      ],
      tableClass: { "background-color": "#FAFAFA" },
      StableClass: "background-color:#FAFAFA",
      baseCompanyList: [],
      YWoptionsObj: {
        T: "合约账单",
        F: "临分账单",
        O: "转分账单",
        C: "理赔账单"
      },
      zqList: [
        "Variable",
        "10th Of 12",
        "11th Of 12",
        "12th Of 12",
        "1st Of 12",
        "1st Of 2",
        "1st Of 3",
        "1st Of 4",
        "2nd Of 12",
        "2nd Of 2",
        "2nd Of 3",
        "2nd Of 4",
        "3rd Of 12",
        "3rd Of 3",
        "3rd Of 4",
        "4th Of 12",
        "4th Of 4",
        "5th Of 12",
        "6th Of 12",
        "7th Of 12",
        "8th Of 12",
        "9th Of 12",
        "Yearly"
      ],
      options: [],
      ReportUnitList: [],
      TJRoptions: [],
      ZDoptions: [
        //  账单类型
        { value: "AA", label: "Additional Account" },
        { value: "AD", label: "Adjustment" },
        { value: "CCA", label: "Cash Claim Account" },
        { value: "CA", label: "Commission Adjustment" },
        { value: "COMMUTATION", label: "Commutation" },
        { value: "CRA", label: "Correction Account" },
        { value: "FC", label: "Fac Claim " },
        { value: "FP", label: "Fac Premium" },
        { value: "INIA", label: "Initial Account" },
        { value: "IA", label: "Internal Account" },
        { value: "LP", label: "Loss Participation" },
        { value: "NCB", label: "No Claim Bonus" },
        { value: "OCA", label: "Outstanding Cash Advance " },
        { value: "PTF", label: "Portfolio Transfer" },
        { value: "PA", label: "Premium Adjustment" },
        { value: "PC", label: "Profit Commission" },
        { value: "RA", label: "Regular Account" },
        { value: "RCA", label: "Regular Claim Account" },
        { value: "RPA", label: "Regular Premium Account" },
        { value: "RP", label: "Reinstatement Premium" },
        { value: "SA", label: "Supplementary Account" },
        { value: "SCA", label: "Supplementary Claim Account" },
        { value: "SCRA", label: "Supplementary Claim Reserve Account" },
        { value: "SPA", label: "Supplementary Premium Account" },
        { value: "XLMDP", label: "XL MDP" }
      ],
      ZDoptionsObj: {
        AA: "Additional Account",
        AD: "Adjustment",
        CCA: "Cash Claim Account",
        CA: "Commission Adjustment",
        COMMUTATION: "Commutation",
        CRA: "Correction Account",
        FC: "Fac Claim ",
        FP: "Fac Premium",
        INIA: "Initial Account",
        IA: "Internal Account",
        LP: "Loss Participation",
        NCB: "No Claim Bonus",
        OCA: "Outstanding Cash Advance ",
        PTF: "Portfolio Transfer",
        PA: "Premium Adjustment",
        PC: "Profit Commission",
        RA: "Regular Account",
        RCA: "Regular Claim Account",
        RPA: "Regular Premium Account",
        RP: "Reinstatement Premium",
        SA: "Supplementary Account",
        SCA: "Supplementary Claim Account",
        SCRA: "Supplementary Claim Reserve Account",
        SPA: "Supplementary Premium Account",
        XLMDP: "XL MDP"
      },
      businessOriginList: [], // 国际国内
      title: "",
      hide: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      admFlag: false,
      billSearch: {
        processId: null,
        processStatus: null,
        wsType: null,
        wsPeriod: null,
        wsBusinessType: null,
        wsCedentCode: null,
        wsCedentName: null,
        wsBrokerCode: null,
        wsBrokerName: null,
        wsReceiptDate: null,
        businessOrigin: null,
        baseCompany: null,
        reportUnit: null
      },
      mustData: {
        actOperator: null,
        processType: "账单",
        processStatus: "",
        pageNumber: 1, // 页数
        pageSize: 20, //页面一次要展示的条数
        total: 0 //总条数
      },
      fileList: [],
      file: [],
      chooseRow: {},
      dialogState: 0,
      track: [],
      setTime: null,
      fileData: [],
      picture: "",
      cedentList: [],
      brokerList: [],
      brokerModel: null,
      cedentModel: null,
      ZJObj: {
        total: 50,
        pageNumber: 1, // 页数
        pageSize: 10 //页面一次要展示的条数
      },
      ZJprocessId: "",
      zq1: "",
      zq2: "",
      rules: {
        wsBusinessType: [
          { required: true, message: "请选择任务类型", trigger: "blur" }
        ]
      },
      pendingFlag: false
    };
  },
  created() {
    this.mustData.processStatus = this.processStatusCom;
    this.mustData.actOperator = this.$store.state.userName;
    if (this.urlName === "sortOperation" || this.urlName === "billEntry") {
      this.$http.get("api/sics/basis/getReportUnitsForPC").then(res => {
        if (res.status === 200) {
          this.ReportUnitList = res.data;
        }
      });
    }
  },
  mounted() {
    this.$http
      .post("api/activiti/getAssigneeName", { roleName: "账单录入" })
      .then(res => {
        if (res.status === 200) {
          this.TJRoptions = res.data;
        }
      });
    this.init();
    setTimeout(() => {
      // 分出人
      this.cedentList = JSON.parse(sessionStorage.getItem("CedentType"));
      // 经纪人
      this.brokerList = JSON.parse(sessionStorage.getItem("BrokerType"));
      // 账单类型
      this.ZDoptions = JSON.parse(sessionStorage.getItem("wsType"));

      let objbc = JSON.parse(sessionStorage.getItem("baseCompany"));
      this.baseCompanyList = objbc.filter(el => {
        return el.code != "Both";
      });
      // 国际国内
      this.businessOriginList = JSON.parse(
        sessionStorage.getItem("businessOrigin")
      );
      // 判断是否是管理员   66
      let admArr = JSON.parse(sessionStorage.getItem("roleIdList"));
      admArr.indexOf(66) == -1 ? (this.admFlag = false) : (this.admFlag = true);
    }, 1000);
  },
  methods: {
    docView(row) {
      if (row) {
        this.dialogFormVisible1 = true;
        this.$http.post("api/anyShare/fileOperation/getLogInInfo").then(res => {
          if (res.status == 200) {
            console.log(res);
            document.getElementById("iframeId").contentWindow.postMessage(
              {
                tokenId: res.data.tokenId,
                userId: res.data.userId,
                docCloudId: row.docCloudId,
                docName: row.docName,
                ip: res.data.ip,
                acPort: res.data.acPort,
                fsPort: res.data.fsPort
              },
              "*"
            );
            document
              .getElementById("iframeId")
              .contentWindow.location.reload(true);
          }
        });
      } else {
        document.getElementById("iframeId").contentWindow.postMessage({}, "*");
        document.getElementById("iframeId").contentWindow.location.reload(true);
      }
    },
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
      let params = null;
      if (this.urlName == "sortOperation" || this.admFlag) {
        params = Object.assign({}, this.mustData, {
          curOperator: this.$store.state.userName
        });
      } else {
        params = Object.assign({}, this.mustData);
      }
      delete params["actOperator"];
      this.$http.post("api/worksheet/wSEntry/list", params).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.rows;
          this.mustData.total = res.data.total;
          if (res.data && res.data.rows && res.data.rows.length) {
            if (
              res.data.rows[0].processStatus === "待处理" &&
              this.urlName === "billEntry"
            ) {
              this.pendingFlag = true;
            }
          }
          if (tag == 0) {
            if (this.urlName === "sortOperation") {
              this.$http
                .get("api/worksheet/wSEntry/refreshEmail")
                .then(res => {});
            }
            this.$message({ type: "success", message: "刷新成功" });
          }
        }
      });
    },
    confirm(formName) {
      if (this.title === "手工创建" || this.title === "编辑") {
        if (this.zq2 && this.zq1) {
          this.billSearch.wsPeriod = `${this.zq2}-${this.zq1}`;
        }
      }
      if (this.cedentModel != null) {
        let obj = this.cedentList[this.cedentModel];
        this.billSearch.wsCedentCode = obj.codecode;
        this.billSearch.wsCedentName = obj.codeName;
      }
      if (this.brokerModel != null) {
        let obj = this.brokerList[this.brokerModel];
        this.billSearch.wsBrokerCode = obj.codecode;
        this.billSearch.wsBrokerName = obj.codeName;
      }
      switch (this.dialogState) {
        case 0: // 创建
          this.$refs[formName].validate(valid => {
            console.log(valid, "valid");
            if (valid) {
              this.$http
                .post(
                  "api/worksheet/wSEntry/save",
                  Object.assign({}, this.mustData, this.billSearch)
                )
                .then(res => {
                  if (res.status === 200 && res.data.msg === "操作成功") {
                    this.dialogFormVisible = false;
                    this.init();
                  }
                });
            }
          });

          break;
        case 1: // 查询
          let params = null;
          if (this.zq2 && this.zq1) {
            this.billSearch.wsPeriod = `${this.zq2}-${this.zq1}`;
          }
          if (!this.billSearch.processStatus) {
            this.billSearch.processStatus = this.processStatusCom;
          }
          if (this.urlName != "sortOperation" || this.admFlag) {
            params = Object.assign({}, this.mustData, this.billSearch, {
              curOperator: this.$store.state.userName
            });
          } else {
            params = Object.assign({}, this.mustData, this.billSearch);
          }
          delete params["actOperator"];
          this.$http.post("api/worksheet/wSEntry/list", params).then(res => {
            if (res.status === 200) {
              if (!res.data.rows.length) {
                this.$message({ type: "warning", message: "未查询出数据" });
              } else {
                this.tableData = res.data.rows;
                this.mustData.total = res.data.total;
                this.dialogFormVisible = false;
              }
            }
          });
          break;
        case 2: // 编辑
          this.$http
            .post(
              "api/worksheet/wSEntry/update",
              Object.assign({}, this.billSearch, this.mustData, {
                processId: this.chooseRow.processId
              })
            )
            .then(res => {
              if (res.status === 200 && res.data.msg === "操作成功") {
                this.init();
                this.dialogFormVisible = false;
              }
            });
          break;
        case 3: // 分配
          if (!this.assignee) {
            this.$message.error("请选择任务处理人");
            return false;
          }
          this.$http
            .post(
              "api/worksheet/activitiForWorksheet/commonActivitiForWorksheet",
              {
                processId: this.chooseRow.processId,
                procInstId: this.chooseRow.processInstId,
                assignee: this.assignee,
                type: "ACTIVE",
                actOperator: this.$store.state.userName
              }
            )
            .then(res => {
              if (res.status === 200 && res.data.errorCode == 1) {
                this.dialogFormVisible = false;
                this.$message({ type: "success", message: "提交成功!" });
                this.assignee = null;
                this.init();
              } else if (res.data.errorCode == 0) {
                this.$message({
                  type: "error",
                  message: res.data.errorMessage
                });
              }
            });
          // 出弹窗
          break;
        case 5: // 踪迹待定
          this.dialogFormVisible = false;
          break;
      }
    },
    reset() {
      for (let k in this.billSearch) {
        this.billSearch[k] = null;
      }
      this.zq2 = null;
      this.zq1 = null;
      this.brokerModel = null;
      this.cedentModel = null;
    },
    handleClick(tag, row) {
      this.dialogState = tag;
      this.chooseRow = row;
      this.assignee = null;
      console.log(this.tableData, "tableData");
      switch (tag) {
        case 0:
          this.reset();
          // for(let k in this.billSearch){
          //   this.billSearch[k] = null;
          // }
          // this.zq2 = null;
          // this.zq1 = null;
          // this.brokerModel = null;
          // this.cedentModel = null;
          this.dialogFormVisible = true;
          this.title = "手工创建";
          break;
        case 1:
          // this.dialogFormVisible = true;
          this.confirm();
          this.title = "查询";
          break;
        case 2:
          // 账单类型
          if (row.wsType) {
            this.ZDoptions.forEach((el, i) => {
              if (el.name == row.wsType) {
                this.billSearch.wsType = el.code;
              }
            });
          } else {
            this.billSearch.wsType = null;
          }
          // 任务类型
          if (row.wsBusinessType) {
            this.billSearch.wsBusinessType = row.wsBusinessType;
          } else {
            this.billSearch.wsBusinessType = null;
          }
          // 账单收到日期
          if (row.wsReceiptDate) {
            this.billSearch.wsReceiptDate = new Date(
              row.wsReceiptDate
            ).valueOf();
          } else {
            this.billSearch.wsReceiptDate = null;
          }
          //  分出人cedentModel  cedentList
          if (row.wsCedentCode) {
            this.cedentList.forEach((el, i) => {
              if (el.codecode == row.wsCedentCode) {
                this.cedentModel = i;
              }
            });
          } else {
            this.cedentModel = null;
          }
          // 经纪人brokerModel   brokerList
          if (row.wsBrokerCode) {
            this.brokerList.forEach((el, i) => {
              if (el.codecode == row.wsBrokerCode) {
                this.brokerModel = i;
              }
            });
          } else {
            this.brokerModel = null;
          }
          // 账期
          if (row.wsPeriod) {
            let arr = row.wsPeriod.split("-");
            this.zq2 = arr[0];
            this.zq1 = arr[1];
          } else {
            this.zq2 = null;
            this.zq1 = null;
          }
          this.$http
            .get(`api/worksheet/wSEntry/edit/${row.processId}`)
            .then(res => {
              if (res.status === 200) {
                this.fileData = res.data.bscDocumentVOlist;
              }
            });
          this.dialogFormVisible = true;
          this.title = "编辑";
          break;
        case 3: // 流程提交
          this.dialogFormVisible = true;
          this.title = "流程提交";
          // 出弹窗
          break;
        case 4: // 删除
          this.$confirm(`确认删除${row.processId} process?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http
              .post("api/worksheet/wSEntry/remove", {
                processId: row.processId
              })
              .then(res => {
                if (res.status === 200 && res.data.code == 0) {
                  this.$message({ type: "success", message: "删除成功!" });
                  this.init();
                }
              });
          });
          break;
        case 5: // 踪迹待定
          this.title = "踪迹";
          this.ZJprocessId = row.processId;
          this.getZJData(row.processId);
          this.$http
            .post(
              "api/activiti/getProcPicture",
              { procInstId: row.processInstId },
              { responseType: "blob" }
            )
            .then(res => {
              if (res.status === 200) {
                this.picture = window.URL.createObjectURL(res.data);
                console.log(res, "流程图");
              }
            });

          break;
        case 6: // 上传附件
          break;
      }
    },
    getZJData(id) {
      this.$http
        .post(
          "api/othersDO/bscProcessAction/list",
          Object.assign(
            {},
            { processId: id, actOperator: this.$store.state.userName },
            this.ZJObj
          )
        )
        .then(res => {
          console.log(res, "踪迹列表");
          if (res.status === 200) {
            this.track = res.data.rows;
            this.ZJObj.total = res.data.total;
            this.dialogFormVisible = true;
          }
        });
    },
    detailRemove(row) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .post("api/anyShare/fileOperation/deleteFilesForPage", {
            docPath: row.docPath,
            docName: row.docName,
            processId: this.chooseRow.processId,
            actOperator: this.$store.state.userName
          })
          .then(res => {
            if (res.status === 200 && res.data.errorCode == 1) {
              this.$http
                .get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`)
                .then(res => {
                  if (res.status === 200) {
                    this.fileData = res.data.bscDocumentVOlist;
                  }
                });
            }
          });
      });
    },
    refresh() {
      window.location.reload();
    },
    beforeAvatarUpload(file) {
      this.file.push(file);
      clearTimeout(this.setTime);
    },
    upload(file) {
      this.setTime = setTimeout(() => {
        let resFile = new FormData();
        this.file.forEach(el => {
          resFile.append("file", el);
        });
        resFile.append("actOperator", this.$store.state.userName);
        resFile.append("processId", this.chooseRow.processId);
        this.$http
          .post("api/anyShare/fileOperation/uploadFilesForPage", resFile, {
            headers: { "Content-Type": "application/json;charset=UTF-8" }
          })
          .then(res => {
            if (res.status === 200 && res.data.errorCode == 1) {
              this.fileList = [];
              this.file = [];
              this.$http
                .get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`)
                .then(res => {
                  if (res.status === 200) {
                    this.fileData = res.data.bscDocumentVOlist;
                  }
                });
            } else {
              if (res.data.errorMessage) {
                this.$message.error(res.data.errorMessage);
              }
              this.fileList = [];
              this.file = [];
            }
          });
      }, 500);
    },
    goDetail(row) {
      if (this.urlName === "sortOperation") {
        return;
      }
      // let routeData = this.$router.resolve({
      this.$router.push({
        name: "detailEntry",
        query: {
          tag: this.urlName,
          num: row.processId,
          row: JSON.stringify(row),
          SIGNBACK: row.wsSignbackFlag
        }
      });
      // window.open(routeData.href, '_blank');
    }
  }
};
</script>

<style scoped>
.billCom {
  padding-right: 30px;
}
.btn {
  margin-bottom: 20px;
}
.el-pagination {
  text-align: right;
  margin-top: 20px;
}
.el-input .el-input__inner {
  width: 220px;
}
.detail-ul {
  margin-left: 10px;
}
.detail-ul li {
  margin-bottom: 10px;
}
.detail-ul li .detail-content {
  color: #999;
}
.sort-upload {
  margin-bottom: 20px;
}
.el-collapse-item:last-child {
  margin-bottom: 20px;
}
.el-select,
.el-select-dropdown__list {
  width: 194px;
}
.el-radio-group .el-radio {
  margin-bottom: 10px;
}
.zqForm .el-form-item__content {
  display: flex;
  border: 1px solid #dcdfe6;
  width: fit-content;
}
.wsPeriod {
  width: 120px;
}
.billCom .el-input {
  width: 196px;
}

.el-form-item:nth-child(6) .el-input:nth-child(1) {
  width: 70px;
}
.browseDoc {
  background-color: #ecf5ff;
  width: 100%;
  height: 100%;
}
.smallHand {
  cursor: pointer;
  color: #409eff;
}
.titleSearch {
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
  padding: 12px 16px;
}
.searchNew {
  border-bottom: 1px solid #d9d9d9;
}
.searchNew .el-row .el-input {
  width: 224px;
  height: 32px;
  border-radius: 2px;
}
.searchNew .el-row .slable {
  color: #666;
}
.billRow {
  padding: 17px 0;
}
.searchNew .el-col-24 {
  margin-bottom: 12px;
  text-align: right;
}
.tableClass {
  background: #e8e8e8;
  background-color: #e8e8e8;
}
</style>