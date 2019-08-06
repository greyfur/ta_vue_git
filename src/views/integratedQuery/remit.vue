<template>
  <div class="remit">
    <div class="searchNew">
      <div class="titleSearch" @click="searchFlag = !searchFlag">
        <i style="margin-right:8px;" :class="searchFlag===false?'el-icon-arrow-down':'el-icon-arrow-up'"></i>查询
      </div>
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button type="primary" plain @click="handleClick(4)">
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
      <el-button type="primary" plain @click="handleClick(1)" v-show="urlName === 'payOperation'">
        <i class="iconfont iconGroup91"></i>创建
      </el-button>
      <el-button type="primary" plain @click="init(0)">
        <i class="iconfont iconGroup37"></i>刷新
      </el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" height="480">
      <el-table-column label="支票号" width="100">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.rmId" placement="top-start">
            <span class="abbreviate">{{scope.row.rmId}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="流程编号">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.processId"
            placement="top-start"
          >
            <span class="abbreviate">{{scope.row.processId}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="支票状态">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.rmStatusName+'-'+scope.row.rmStatus"
            placement="top-start"
          >
            <span class="abbreviate">{{scope.row.rmStatusName}}-{{scope.row.rmStatus}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="paymentType" label="支付方式"></el-table-column>
      <el-table-column prop="bankCurrency" label="实收/支币制" width="100"></el-table-column>
      <el-table-column prop="chargesCurrency" label="手续费币制" width="100"></el-table-column>
      <el-table-column label="手续费金额" width="100">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.chargesAmount"
            placement="top-start"
          >
            <span class="abbreviate">{{scope.row.chargesAmount}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="baseCompany" label="Base Company" width="120"></el-table-column>
      <el-table-column label="银行账户">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.bankAccountName"
            placement="top-start"
          >
            <span class="abbreviate">{{scope.row.bankAccountName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="valueDate" label="起息日" width="100"></el-table-column>
      <el-table-column prop="dueDate" label="到期日" width="100"></el-table-column>
      <el-table-column prop="partnerCode" label="汇款人代码" width="100"></el-table-column>
      <el-table-column label="汇款人名称" width="100">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.payerName"
            placement="top-start"
          >
            <span class="abbreviate">{{scope.row.payerName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="businessPartnerRef" label="BP Reference信息" width="140"></el-table-column>
      <el-table-column prop="businessOrigin" label="Business Origin" width="130"></el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">更多
              <i style="margin-left:8px;" class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  v-show="pendingFlag || urlName === 'taskCreation' || urlName === 'approvalDone'"
                  @click.stop="handleClick(6,scope.row)"
                  type="text"
                  size="small"
                >编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button @click.stop="handleClick(11,scope.row)" type="text" size="mini">踪迹</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-show="urlName === 'taskCreation'"
                  @click.stop="handleClick(10,scope.row)"
                  type="text"
                  size="small"
                >流程提交</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-show="urlName === 'emailNotify'"
                  @click.stop="handleClick(12,scope.row)"
                  type="text"
                  size="small"
                >流程提交</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-show="urlName === 'emailNotify'"
                  @click.stop="handleClick(15,scope.row)"
                  type="text"
                  size="small"
                >附件查看</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-show="urlName === 'emailNotify'"
                  @click.stop="handleClick(13,scope.row)"
                  type="text"
                  size="small"
                >发送邮件</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-show="urlName === 'emailNotify'"
                  @click.stop="handleClick(20,scope.row)"
                  type="text"
                  size="small"
                >Reverse</el-button>
              </el-dropdown-item>
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
      :total="mustData.total"
    ></el-pagination>
    <el-dialog
      title="文档预览"
      width="fit-content"
      :visible.sync="dialogFormVisibleA"
      :close-on-click-modal="modal"
    >
      <div class="browseDoc" v-show="title!='踪迹'">
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
export default {
  name: "remit",
  props: {
    // urlName页面名称  processStatusCom流程状态  goDetailName详情页tag
    urlName: "",
    processStatusCom: "",
    goDetailName: ""
  },
  data() {
    return {
      searchFlag: false,
      modal: false,
      tableData: [],
      ZDoptions: [],
      businessOriginList: [],
      baseCompanyList: [],
      rmCurrencyList: [],
      currentPage3: 5,
      hide: false,
      labelPosition: "right",
      formLabelAlign: {
        rmSettleCompanyCode: null,
        rmSettleCompanyName: null,
        rmCurrency: null,
        rmReceiptDate: null,
        businessOrigin: null,
        baseCompany: null,
        rmAmount: null,
        modifyBy: null,
        rmWrittenOffNum: null,
        rmOriSettleCompanyName: null,
        rmOriCurrency: null,
        rmOriAmount: null,
        rmChargesCurrency: null,
        rmChargesAmount: null,
        rmSettleUser: null,
        payerBankNumber: null,
        payerBankName: null,
        payerAccountNumber: null,
        payerName: null,
        processStatus: null
      },
      pendingFlag: false,
      TJRoptions: [],
      TJRoptionsA: [],
      track: [],
      assignee: "",
      mustData: {
        actOperator: "",
        processStatus: "",
        pageNumber: 1, // 页数
        pageSize: 20, //页面一次要展示的条数
        total: 0 //总条数
        //   processType:'付款',
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisibleA: false,
      title: "",
      tag: "",
      fileList: [],
      file: [],
      fileData: [],
      listData: [
        {
          a: "流程编号",
          b: "",
          c: "processId"
        },
        {
          a: "结付公司",
          b: "",
          c: "rmSettleCompanyCode"
        },
        {
          a: "汇款人名称",
          b: "",
          c: "payerName"
        },
        {
          a: "币制",
          b: "",
          c: "rmCurrency"
        },
        {
          a: "到账日期",
          b: "",
          c: "rmReceiptDate"
        },
        {
          a: "Business Origin",
          b: "",
          c: "businessOrigin"
        },
        {
          a: "汇款金额",
          b: "",
          c: "rmAmount"
        },
        {
          a: "Base Company",
          b: "",
          c: "baseCompany"
        },
        {
          a: "我司销账编号",
          b: "",
          c: "rmWrittenOffNum"
        },

        {
          a: "原收款公司名称",
          b: "",
          c: "rmOriSettleCompanyName"
        },
        {
          a: "原收款币制",
          b: "",
          c: "rmOriCurrency"
        },
        {
          a: "原收款金额",
          b: "",
          c: "rmOriAmount"
        },
        {
          a: "手续费币制",
          b: "",
          c: "rmChargesCurrency"
        },
        {
          a: "手续费金额",
          b: "",
          c: "rmChargesAmount"
        },
        {
          a: "付款人开户行号",
          b: "",
          c: "payerBankNumber"
        },
        {
          a: "结算人员",
          b: "",
          c: "rmSettleUser"
        },
        {
          a: "付款人开户行名",
          b: "",
          c: "payerBankName"
        },
        {
          a: "付款人账号",
          b: "",
          c: "payerAccountNumber"
        },
        {
          a: "付款人名称",
          b: "",
          c: "payerName"
        },
        {
          a: "创建日期",
          b: "",
          c: "createdAt"
        },
        {
          a: "备注",
          b: "",
          c: "remark"
        }
      ],
      chooseRow: {},
      cedentModel: null,
      cedentList: [],
      picture: "",
      singlePId: "",
      rules: {
        baseCompany: [
          { required: true, message: "请选择Base Company", trigger: "blur" }
        ],
        businessOrigin: [
          { required: true, message: "请选择Business Origin", trigger: "blur" }
        ]
      },
      email: {
        contactName: null,
        emailAddr: null,
        emailContent: null,
        documentList: null
      },
      // baseCompanyrules:{P:'产再',G:'集团'},
      dialogFlag: false,
      processStatusList: []
    };
  },
  created() {
    this.mustData.processStatus = this.processStatusCom;
    if (this.urlName === "payOperation") {
      this.processStatusList = ["待处理", "已悬停"];
    } else if (this.urlName === "payClose") {
      this.processStatusList = ["待核销", "已悬停"];
    }
  },
  mounted() {
    if (this.urlName === "payment") {
      this.mustData.accountCloseFlag = "0";
    } else if (this.urlName === "instancyPay") {
      this.mustData.accountCloseFlag = "1";
    }
    setTimeout(() => {
      // 分出人+经济人
      let fcArr = JSON.parse(sessionStorage.getItem("CedentType"));
      let jArr = JSON.parse(sessionStorage.getItem("BrokerType"));
      this.cedentList = jArr.concat(fcArr);
      // 集团产再
      this.baseCompanyList = JSON.parse(sessionStorage.getItem("baseCompany"));
      // 国际国内
      this.businessOriginList = JSON.parse(
        sessionStorage.getItem("businessOrigin")
      );
    }, 1000);

    this.mustData.actOperator = this.$store.state.userName;
    // this.formLabelAlign.modifiedBy = this.$store.state.userName;

    //获取币制
    this.rmCurrencyList = JSON.parse(sessionStorage.getItem("CurrencyList"));

    this.$http
      .post("api/activiti/getAssigneeName", { roleName: "付款录入" })
      .then(res => {
        if (res.status === 200) {
          this.TJRoptions = res.data;
        }
      });
    this.init();
  },
  methods: {
    init(tag) {
      // 进首页查询
      this.$http
        .post(
          "api/integeratedQuery/Remitlist",
          Object.assign({}, this.mustData, {
            actName: this.$store.state.userName,
            actOperator: this.$store.state.userName
          })
        )
        .then(res => {
          console.log(res, ",,,");
          if (res.status === 200) {
            this.tableData = res.data.rows;
            this.mustData.total = res.data.total;
            if (tag == 0) {
              this.$message({ type: "success", message: "刷新成功" });
            }
          }
        });
    },
    docView(row) {
      if (row) {
        this.dialogFormVisibleA = true;
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
    reset() {
      for (let k in this.formLabelAlign) {
        this.formLabelAlign[k] = null;
      }
      this.cedentModel = null;
    },
    handleClick(tag, row) {
      this.chooseRow = Object.assign({}, row);
      this.tag = tag;
      this.assignee = null;
      switch (tag) {
        case 1: //创建
          this.reset();
          // for(let k in this.formLabelAlign){
          //   this.formLabelAlign[k] = null;
          // }
          // this.cedentModel = null;
          this.title = "创建";
          this.dialogFormVisible = true;
          break;
        case 3: //刷新
          break;
        case 4: //查询
          this.title = "查询";
          // this.dialogFormVisible = true;
          this.confirm();
          break;
        case 6: //编辑
          console.log(this.chooseRow, "row");
          this.formLabelAlign = this.chooseRow;
          if (this.chooseRow.businessOrigin) {
            let arr = this.businessOriginList.filter(el => {
              return el.name == this.chooseRow.businessOrigin;
            });
            this.formLabelAlign.businessOrigin = arr[0]["code"];
          }
          if (this.chooseRow.baseCompany) {
            let arr = this.baseCompanyList.filter(el => {
              return el.name == this.chooseRow.baseCompany;
            });
            this.formLabelAlign.baseCompany = arr[0]["code"];
          }
          // 日期回显
          if (this.chooseRow.rmReceiptDate) {
            this.formLabelAlign.rmReceiptDate = new Date(
              this.chooseRow.rmReceiptDate
            ).valueOf();
          }
          // 结付公司回显
          if (this.chooseRow.rmSettleCompanyCode) {
            this.cedentList.forEach((el, i) => {
              if (el.codecode == this.chooseRow.rmSettleCompanyCode) {
                this.cedentModel = i;
              }
            });
          }

          this.title = "编辑";
          this.dialogFormVisible = true;
          break;
        case 7: //删除
          this.$confirm(`确认删除?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http
              .post(
                "api/pay/teskClaim/remove",
                Object.assign({}, this.chooseRow, this.mustData)
              )
              .then(res => {
                if (res.status === 200 && res.data.code == 0) {
                  this.$message({ type: "success", message: "删除成功!" });
                  this.init();
                }
              });
          });
          break;
        case 8: //上传附件
          this.title = "上传附件";
          this.singlePId = this.chooseRow.processId;
          this.$http
            .post("api/worksheet/sortOperation/listDocument", {
              actOperator: this.$store.state.userName,
              processId: this.chooseRow.processId,
              pageNumber: 1,
              pageSize: 100
            })
            .then(res => {
              if (res.status === 200) {
                this.fileData = res.data.rows;
                this.init();
              }
            });
          this.dialogFormVisible2 = true;
          break;
        case 10: //流程提交
          this.title = "流程提交";
          this.dialogFormVisible2 = true;
          break;
        case 11: //踪迹
          this.title = "踪迹";
          this.dialogFormVisible2 = true;
          this.track = this.chooseRow.bscProcessActionVOlist;
          this.$http
            .post(
              "api/activiti/getProcPicture",
              { procInstId: this.chooseRow.processInstId },
              { responseType: "blob" }
            )
            .then(res => {
              if (res.status === 200) {
                this.picture = window.URL.createObjectURL(res.data);
              }
            });
          break;
        case 12: //流程提交
          this.title = "流程提交";
          this.dialogFormVisible2 = true;
          break;
        case 13: //发送邮件
          this.title = "发送邮件";
          this.dialogFormVisible3 = true;
          break;
        case 15: //附件查看
          this.$http
            .post("api/worksheet/sortOperation/listDocument", {
              actOperator: this.$store.state.userName,
              processId: this.chooseRow.processId,
              pageNumber: 1,
              pageSize: 100
            })
            .then(res => {
              if (res.status === 200 && res.data.rows && res.data.rows.length) {
                this.fileData = res.data.rows;
              }
            });
          this.title = "附件查看";
          this.dialogFormVisible2 = true;
          break;
        case 20: //reverse
          this.$http
            .post("api/activiti/getAssigneeName", { roleName: "管理员" })
            .then(res => {
              if (res.status === 200) {
                this.TJRoptionsA = res.data;
              }
            });
          this.title = "reverse";
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
    confirm(formName) {
      if (this.cedentModel != null) {
        let obj = this.cedentList[this.cedentModel];
        this.formLabelAlign.partnerCode = obj.codecode;
      }
      switch (this.tag) {
        case 1: //创建
          this.$refs[formName].validate(valid => {
            console.log(valid, "valid");
            if (valid) {
              this.$http
                .post(
                  "api/pay/teskClaim/save",
                  Object.assign(
                    {},
                    { actOperator: this.$store.state.userName },
                    this.mustData,
                    this.formLabelAlign
                  )
                )
                .then(res => {
                  if (res.status === 200 && res.data.msg === "操作成功") {
                    this.dialogFormVisible = false;
                    this.init();
                    this.$refs[formName].resetFields();
                  }
                });
            }
          });
          break;
        case 3: //刷新
          break;
        case 4: //查询
          let params = Object.assign({}, this.mustData, this.formLabelAlign, {
            curOperator: this.$store.state.userName
          });
          delete params["actOperator"];
          this.$http
            .post("api/integeratedQuery/Remitlist", params)
            .then(res => {
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
        case 6: //编辑
          this.$refs[formName].validate(valid => {
            console.log(valid, "valid");
            if (valid) {
              console.log(this.formLabelAlign, "this.formLabelAlign");
              this.$http
                .post(
                  "api/pay/teskClaim/update",
                  Object.assign({}, this.mustData, this.formLabelAlign, {
                    actOperator: this.$store.state.userName
                  })
                )
                .then(res => {
                  if (res.status === 200 && res.data.msg === "操作成功") {
                    this.dialogFormVisible = false;
                    this.init();
                    this.$refs[formName].resetFields();
                  }
                });
            }
          });

          break;
        case 7: //删除
          break;
        case 8: //上传附件
          break;
        case 10: //流程提交
          this.$http
            .post("api/pay/activitiForPay/commonActivitiForPay", {
              processId: this.chooseRow.processId,
              procInstId: this.chooseRow.processInstId,
              assignee: this.assignee,
              type: "ACTIVE",
              actOperator: this.$store.state.userName
            })
            .then(res => {
              if (res.status === 200 && res.data.errorCode == 1) {
                this.dialogFormVisible2 = false;
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
          break;
        case 11: //踪迹
          break;
        case 12: //流程提交---emailNotify
          this.$http
            .post("api/receipt/activitiForReceipt/commonActivitiForReceipt", {
              processId: this.chooseRow.processId,
              procInstId: this.chooseRow.processInstId,
              assignee: this.assignee,
              type: "CLOSE",
              actOperator: this.$store.state.userName,
              hasNoticedFlag: this.chooseRow.hasNoticedFlag
            })
            .then(res => {
              if (res.status === 200 && res.data.errorCode == 1) {
                this.dialogFormVisible2 = false;
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
          break;
        case 20: //---
          this.$http
            .post(
              "api/pay/teskClaim/reversePayProcess",
              {
                processId: this.chooseRow.processId,
                assignee: this.assignee,
                actOperator: this.$store.state.userName
              },
              { responseType: "blob" }
            )
            .then(res => {
              console.log(res, "onReverse");
              if (res.status === 200 && res.data.code == 0) {
                this.$message({ type: "success", message: "成功" });
              } else if (res.data.msg) {
                this.$message.error(res.data.msg);
              }
            });
          break;
      }
      // setTimeout(()=>{
      // this.$refs[formName].resetFields();
      // },1000)
    },
    beforeAvatarUpload(file) {
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
      resFile.append("file", this.file[0]);
      resFile.append("actOperator", this.mustData.actOperator);
      resFile.append("processId", this.chooseRow.processId);
      this.$http
        .post(`api/anyShare/fileOperation/uploadFilesForPage`, resFile, {
          headers: { "Content-Type": "application/json;charset=UTF-8" }
        })
        .then(res => {
          if (res.status === 200) {
            if (res.data.errorCode && res.data.errorCode == 1) {
              this.dialogFormVisible2 = false;
              this.handleClick(8, { processId: this.singlePId });
            } else if (res.data.errorCode && res.data.errorCode == 0) {
              this.$message.error(res.data.errorMessage);
            }
            this.file = [];
            this.fileList = [];
          } else {
            this.file = [];
            this.fileList = [];
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
            processId: row.processId,
            actOperator: this.$store.state.userName
          })
          .then(res => {
            this.handleClick(8, { processId: this.singlePId });
          });
      });
    },
    goDetail(row) {
      if (this.urlName === "taskCreation" || this.urlName === "emailNotify") {
        return;
      }
      // let routeData = this.$router.resolve({
      this.$router.push({
        name: "detailPay",
        query: {
          tag: "remit",
          name: this.goDetailName,
          row: JSON.stringify(row)
        }
      });
      // window.open(routeData.href, '_blank');
    },
    watchInput(name) {
      if (!/^\d+(\.\d{0,2})?$/.test(this.formLabelAlign[name])) {
        if (this.formLabelAlign[name]) {
          // this.formLabelAlign[name] = this.formLabelAlign[name].substr(0,this.formLabelAlign[name].length-1);
          this.formLabelAlign[name] = "";
          this.$message.error("请输入数字，支持到小数点后两位");
        }
      }
    }
  }
};
</script>

<style scoped>
.remit {
  padding-right: 30px;
}
.btn {
  margin-bottom: 20px;
}
.el-pagination {
  text-align: right;
  margin-top: 20px;
}
.cell .el-button + .el-button {
  margin-right: 10px;
  margin-left: 0px;
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
.el-collapse-item:last-child {
  margin-bottom: 20px;
}

.curAmountForm div.el-form-item__content {
  display: flex;
}
.curAmountForm div.el-form-item__content .el-select {
  margin-right: 20px;
}
.curAmountForm div.el-form-item__content .curAmount {
  width: 200px;
}
.remit .el-input {
  width: 196px;
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
.selfInput {
  border: 1px solid #dcdfe6;
  width: 196px;
  border-radius: 4px;
  outline: none;
}
.searchNew .el-row .el-input {
  width: 224px;
  height: 32px;
  border-radius: 2px;
}
</style>
