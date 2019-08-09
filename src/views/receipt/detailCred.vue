<template>
  <div class="detailCred">
    <router-link
      :to="{name:$route.query.tag}"
      style="color:#333;position:absolute;top:20px;left:70px;z-index:100;">
      <span class="arrows">＜</span>
      <span class="word">返回上一级</span>
    </router-link>
    <!-- 核销完成 -->
    <div class="btn" v-if="$route.query.tag === 'collectiongEnd'">
      <el-button type="primary" plain @click="getSg">同步状态</el-button>
      <el-button type="primary" plain @click="makeReport">生成核销报告</el-button>
      <el-button type="primary" plain @click="mailSend(2,'附件查看')">附件查看</el-button>
      <el-button type="primary" plain @click="getTaxInfo">增值税信息获取</el-button>
      <!-- <el-button type="primary" plain @click="openReverse">Reversed</el-button> -->
    </div>
    <!-- 操作 -->
    <div class="btn" v-if="$route.query.tag === 'credOperation'">
      <el-button type="primary" :disabled="czState" plain @click="mailSend(1,'上传附件')">上传附件</el-button>
      <el-button type="primary" :disabled="czState" plain @click="mailSend(2,'附件查看')">附件查看</el-button>
      <el-button
        type="primary"
        :disabled="czState"
        plain
        @click="submite(2,'指派','操作','收款录入')"
      >指派</el-button>
      <el-button type="primary" :disabled="czState" plain @click="submite(3,'置废')">置废</el-button>
      <el-button :type="czState?'info':'primary'" @click="gangUp('操作')" plain>{{!czState?'挂起':'悬停'}}</el-button>
      <el-button type="primary" :disabled="czState" plain @click="creatRM('a')">支票创建</el-button>
      <el-button type="primary" :disabled="czState" plain @click="submite(1,'流程提交','收款复核')">流程提交</el-button>
    </div>
    <!-- 复核 -->
    <div class="btn" v-if="$route.query.tag === 'credReview'">
      <el-button type="primary" plain @click="submite(2,'指派','复核','收款复核')">指派</el-button>
      <el-button type="primary" plain @click="getSg">同步状态</el-button>
      <el-button type="primary" plain @click="mailSend(2,'附件查看')">附件查看</el-button>
      <el-button type="primary" plain @click="submite(4,'复核驳回')">复核驳回</el-button>
      <el-button type="primary" plain @click="submite(1,'复核通过','收款录入')">复核通过</el-button>
    </div>
    <!-- 核销 -->
    <div class="btn" v-if="$route.query.tag === 'credVerification' || $route.query.tag === 'viewInvalidate'">
      <el-button type="primary" :disabled="hxState" plain @click="submite(1,'流程提交','收款录入')">流程提交</el-button>
      <el-button type="primary" :disabled="hxState" @click="tbState" plain>同步状态</el-button>
      <el-button type="primary" plain @click="mailSend(2,'附件查看')">附件查看</el-button>
      <el-button type="primary" :disabled="hxState" @click="openBPSICS" plain>打开BpLedger</el-button>
      <el-button
        :type="hxState?'info':'primary'"
        @click="gangUp('核销')"
        plain
      >{{!hxState?'挂起':'暂挂待销'}}</el-button>
    </div>
    <!-- 暂挂 -->
    <!-- <div class="btn" v-if="$route.query.tag === 'viewInvalidate'">
	<el-button type="primary" plain @click="mailSend(2,'附件查看')">附件查看</el-button>
	<el-button type="primary" plain @click="submite(5,'状态恢复')">状态恢复</el-button>
</div>
    -->

    <!-- 详情 -->
    <div :class="searchFlag===true?'searchNew':''" >
      <div class="titleSearch detailSearch" @click="searchFlag1 = !searchFlag1">
        <div>
          <i
            style="margin-right:8px;"
            :class="searchFlag1===false?'el-icon-arrow-down':'el-icon-arrow-up'"
          ></i>详情
        </div>
        <p class="info" style="color:#666;">流程编号:
          <el-tooltip class="item" effect="dark" content="点击复制" placement="top">
            <span style="color:#000;" id="proNum" @click.stop="copy('proNum')">{{row.processId}}</span>
          </el-tooltip>
        </p>
      </div>
      <el-collapse-transition>
        <ul class="detail-ul" v-show="searchFlag1">
          <li v-for="(item,i) in listData" :key="i" class="detail-item">
            <span class="detail-name">{{item.a}} :</span>
            <span class="detail-content">{{item.b}}</span>
          </li>
        </ul>
      </el-collapse-transition>
    </div>
    <el-row>
      <el-col :span="24">
        <div
          class="titleSearch detailSearch"
          style="margin-bottom:10px;"
          @click="searchFlag2 = !searchFlag2">
          <div>
            <i style="margin-right:8px;" :class="searchFlag2===false?'el-icon-arrow-down':'el-icon-arrow-up'"></i>支票信息
          </div>
          <p>
            <el-button size="mini" @click="getSg" v-if="$route.query.tag !== 'credVerification' && $route.query.tag !== 'credReview' && $route.query.tag !== 'collectiongEnd'">
              <i style="margin-right:8px;" class="iconfont iconGroup77"></i>支票回写
            </el-button>
          </p>
        </div>
        <el-collapse-transition>
          <div v-show="searchFlag2">
            <el-table :data="RMData" style="width:100%" border>
              <el-table-column label="支票号" width="150">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.rmId"
                    placement="top-start"
                  >
                    <span class="abbreviate">{{scope.row.rmId}}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="bankCurrency" label="币制" width="60"></el-table-column>
              <el-table-column label="支票金额">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="Number(scope.row.bankAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')"
                    placement="top-start">
                    <span class="abbreviate">{{Number(scope.row.bankAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="chargesCurrency" label="手续费币制" width="100"></el-table-column>
               <el-table-column label="手续费金额" width="100">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="Number(scope.row.chargesAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')"
                    placement="top-start"
                  >
                    <span class="abbreviate">{{Number(scope.row.chargesAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
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
               <el-table-column label="核销状态">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.setlmntInd"
                    placement="top-start"
                  >
                    <span class="abbreviate">{{scope.row.setlmntInd}}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="paymentTypeName" label="支付方式"></el-table-column>
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
              <el-table-column label="支票类型" width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.rmType=='R'?'收款':'付款'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="baseCompany" label="Base Company" width="130"></el-table-column>
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
              <el-table-column width="140" label="结付公司">
                  <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark"  :content="scope.row.rmSettleCompanyName&&scope.row.rmSettleCompanyCode?scope.row.rmSettleCompanyCode+'-'+scope.row.rmSettleCompanyName:''" placement="top-start">
                    <span class="abbreviate" v-if="scope.row.rmSettleCompanyName&&scope.row.rmSettleCompanyCode">{{scope.row.rmSettleCompanyCode}}-{{scope.row.rmSettleCompanyName}}</span>
                    <span class="abbreviate" v-else></span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="businessPartnerRef" label="BP Reference" width="140"></el-table-column>
              <el-table-column prop="businessOrigin" label="Business Origin" width="130"></el-table-column>
              <el-table-column label="操作" width="140" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click.stop="openSICS(scope.row,'rmId')" size="mini">打开SICS</el-button>
                  <el-button type="text" v-if="$route.query.tag === 'credVerification' || $route.query.tag === 'viewInvalidate'" @click.stop="openSICS(scope.row,'rmId','R')" size="mini">Reverse</el-button>
                  <el-button type="text" v-if="$route.query.tag === 'credOperation'" @click.stop="chongXiao(scope.row)" size="mini">冲销</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-transition>
      </el-col>
    </el-row>
    <el-row v-if="$route.query.tag === 'credVerification' || $route.query.tag === 'viewInvalidate' || $route.query.tag === 'collectiongEnd'">
      <el-col :span="24">
        <div
          class="titleSearch detailSearch"
          style="margin-bottom:10px;"
          @click="searchFlag3 = !searchFlag3"
        >
          <div>
            <i
              style="margin-right:8px;"
              :class="searchFlag3===false?'el-icon-arrow-down':'el-icon-arrow-up'"
            ></i>结算清单
          </div>
          <p>
            <i class="iconfont iconGroup26"></i>
          </p>
        </div>
        <el-collapse-transition>
          <el-table v-show="searchFlag3" border :data="SgData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.worksheetDOList" style="width: 100%" border>
                  <el-table-column label="账单号">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.wsId"
                        placement="top-start"
                      >
                        <span class="abbreviate">{{scope.row.wsId}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="wsStatus" label="账单状态" width="100">
                    <!-- <template slot-scope="scope">{{scope.row.wsStatus=='O'?'Open':'Close'}}</template> -->
                  </el-table-column>
                  <el-table-column label="账单标题">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.wsTitle"
                        placement="top-start"
                      >
                        <span class="abbreviate">{{scope.row.wsTitle}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="业务编号">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.businessId"
                        placement="top-start"
                      >
                        <span class="abbreviate">{{scope.row.businessId}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="附件名称">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.docName"
                        placement="top-start"
                      >
                        <span :class="{'smallHand':scope.row.suffix!='eml'}" class="abbreviate" @click="docView(scope.row)">{{scope.row.docName}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="section">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.section"
                        placement="top-start"
                      >
                        <span class="abbreviate">{{scope.row.section}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="uwYear" label="业务年度"></el-table-column>
                  <el-table-column label="任务类型">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.businessType"
                        placement="top-start"
                      >
                        <span class="abbreviate">{{scope.row.businessType}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="receiptDate" label="收到账单日期" width="120"></el-table-column>
                  <el-table-column label="分出公司" width="120">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.cedentCode+'-'+scope.row.cedentName"
                        placement="top-start"
                      >
                        <span class="abbreviate">{{scope.row.cedentCode}}-{{scope.row.cedentName}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="经纪公司" width="120">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.brokerCode+'-'+scope.row.brokerName"
                        placement="top-start"
                      >
                        <span class="abbreviate">{{scope.row.brokerCode}}-{{scope.row.brokerName}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="wsType" label="账单类型"></el-table-column>
                  <el-table-column prop="wsPeriod" label="账单期"></el-table-column>
                  <el-table-column prop="businessOrigin" label="Business Origin" width="130"></el-table-column>
                  <el-table-column prop="baseCompany" label="Base Company" width="130"></el-table-column>
                  <el-table-column prop="dept" label="经营机构"></el-table-column>
                  <el-table-column prop="wsCurrency" label="币制" width="50"></el-table-column>
                  <el-table-column label="金额">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="Number(scope.row.wsAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')"
                        placement="top-start"
                      >
                        <span class="abbreviate">{{Number(scope.row.wsAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="registBy" label="录入人" width="80"></el-table-column>
                  <el-table-column prop="registAt" label="录入时间" width="100"></el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.remark"
                        placement="top-start"
                      >
                        <span class="abbreviate">{{scope.row.remark}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        @click.stop="openSICS(scope.row,'wsId')"
                        size="mini"
                      >打开SICS</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="结算清单编号" width="110">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.sgNum"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.sgNum}}</span>
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
            <el-table-column label="支票号">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.rmId"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.rmId}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="bpCode" label="BP number" width="100"></el-table-column>
            <el-table-column label="BP名称">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.bpName"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.bpName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="baseCompany" label="Base Company" width="130"></el-table-column>
            <el-table-column prop="businessOrigin" label="Business Origin" width="130"></el-table-column>
            <el-table-column prop="sgStatus" label="结算清单状态" width="110"></el-table-column>
            <el-table-column prop="settlementIndicator" label="结算指标"></el-table-column>
            <el-table-column prop="sgCurrency" label="币制"></el-table-column>
            <el-table-column label="结算总额">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="Number(scope.row.settlementAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')"
                  placement="top-start"
                >
                  <span class="abbreviate">{{Number(scope.row.settlementAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="未结算金额" width="100">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="Number(scope.row.unsettlementAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')"
                  placement="top-start"
                >
                  <span class="abbreviate">{{Number(scope.row.unsettlementAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="应收款日期" width="100">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.dueDate"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.dueDate}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="bookingYear" label="账单年份"></el-table-column>
            <el-table-column prop="bookingPeriod" label="账期" width="100"></el-table-column>
            <el-table-column prop="accYear" label="统计年份"></el-table-column>
            <el-table-column prop="accPeriod" label="统计期" width="100"></el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.sgType"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.sgType}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="参考">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.sgReference"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.sgReference}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="createdBy" label="创建人"></el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.createdAt"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.createdAt}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click.stop="openSICS(scope.row,'sgNum')" size="mini">打开SICS</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-transition>
      </el-col>
    </el-row>
    <el-row v-if="$route.query.tag === 'credVerification' || $route.query.tag === 'viewInvalidate' || $route.query.tag === 'collectiongEnd'">
      <el-col :span="24">
        <div
          class="titleSearch detailSearch"
          style="margin-bottom:10px;"
          @click="searchFlag4 = !searchFlag4"
        >
          <div>
            <i
              style="margin-right:8px;"
              :class="searchFlag4===false?'el-icon-arrow-down':'el-icon-arrow-up'"
            ></i>账单信息
          </div>
          <p>
            <i class="iconfont iconGroup26"></i>
          </p>
        </div>
        <el-collapse-transition>
          <el-table v-show="searchFlag4" border :data="WSData" style="width: 100%">
            <el-table-column label="账单号">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.wsId"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.wsId}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="wsStatus" label="账单状态" width="100">
              <!-- <template slot-scope="scope">{{scope.row.wsStatus=='O'?'Open':'Close'}}</template> -->
            </el-table-column>
            <el-table-column label="账单标题">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.wsTitle"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.wsTitle}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="业务编号">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.businessId"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.businessId}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="附件名称">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.docName"
                  placement="top-start"
                >
                  <span class="smallHand abbreviate" @click="docView(scope.row)">{{scope.row.docName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="section">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.section"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.section}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="uwYear" label="业务年度"></el-table-column>
            <el-table-column label="任务类型">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.businessType"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.businessType}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="receiptDate" label="收到账单日期" width="120"></el-table-column>
            <el-table-column label="分出公司" width="120">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.cedentCode+'-'+scope.row.cedentName"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.cedentCode}}-{{scope.row.cedentName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="经纪公司" width="120">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.brokerCode+'-'+scope.row.brokerName"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.brokerCode}}-{{scope.row.brokerName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="wsType" label="账单类型"></el-table-column>
            <el-table-column prop="wsPeriod" label="账单期"></el-table-column>
            <el-table-column prop="businessOrigin" label="Business Origin" width="130"></el-table-column>
            <el-table-column prop="baseCompany" label="Base Company" width="130"></el-table-column>
            <el-table-column prop="dept" label="经营机构"></el-table-column>
            <el-table-column prop="wsCurrency" label="币制" width="50"></el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="Number(scope.row.wsAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')"
                  placement="top-start"
                >
                  <span class="abbreviate">{{Number(scope.row.wsAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="registBy" label="录入人" width="80"></el-table-column>
            <el-table-column prop="registAt" label="录入时间" width="100"></el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.remark"
                  placement="top-start"
                >
                  <span class="abbreviate">{{scope.row.remark}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click.stop="openSICS(scope.row,'wsId')" size="mini">打开SICS</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-transition> 
      </el-col>
    </el-row>
    <!-- 弹窗区域 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible3" :close-on-click-modal="modal">
      <el-form label-width="140px">
        <el-form-item label="选择驳回原因" v-show="title==='复核驳回'">
          <el-select v-model="opinion" placeholder="请输入驳回原因" @change="changeOpinion">
            <el-option v-for="item in BHoptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因填写" v-show="title==='复核驳回'">
          <el-input
            :disabled="opinion!='其它'"
            type="textarea"
            :rows="2"
            placeholder="请输入原因"
            v-model="rebut"
          ></el-input>
        </el-form-item>
        <el-form-item label="输入悬停原因" v-show="title==='悬停'">
          <el-input type="textarea" :rows="2" placeholder="请输入悬停原因" v-model="pendingReason"></el-input>
        </el-form-item>
        <el-form-item label="选择处理人" v-show="putIn=='n'">
          <el-select v-model="assignee" placeholder="请选择">
            <el-option
              v-for="item in TJRoptions"
              :key="item.userId"
              :label="item.name"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="title === '指派'?'选择指派人':'选择处理人'"
          v-show="title === '指派' || putIn=='b'"
        >
          <el-select v-model="assignee" placeholder="请选择">
            <el-option
              v-for="item in TJRoptions"
              :key="item.userId"
              :label="item.name"
              :value="item.username"
              :disabled="item.username == $store.state.userName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="confirm">确定</el-button>
          <el-button size="small" @click="dialogFormVisible3 = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="指派" :visible.sync="dialogFormVisibleFHRWZF" :close-on-click-modal="modal">
      <el-form :label-position="labelPosition" label-width="160px">
        <el-form-item label="选择指派人">
          <el-select v-model="assignee" placeholder="请选择">
            <el-option
              v-for="item in TJRoptions"
              :key="item.userId"
              :label="item.name"
              :value="item.username"
              :disabled="item.username == $store.state.userName || item.username == row.entryOperator"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="confirm">确定</el-button>
          <el-button size="small" @click="dialogFormVisibleFHRWZF = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="modal">
      <el-form
        :label-position="labelPosition"
        label-width="180px"
        :model="formLabelAlign"
        :rules="rules"
        ref="formLabelAlign">
        <el-form-item label="Process ID">
          <el-input v-model.trim="formLabelAlign.processId" disabled style="width:194px"></el-input>
        </el-form-item>
        <el-form-item label="收/付款支票" prop="rmType"> 
          <el-radio-group v-model="formLabelAlign.rmType" @change="bizhichange(1)">
            <el-radio label="R">收款</el-radio>
            <el-radio label="P">付款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支票状态" prop="rmStatusIndex">
          <el-select v-model="formLabelAlign.rmStatusIndex" placeholder="请选择">
            <el-option v-for="(item,i) in rmStatusList" :key="item.n" :label="item.n" :value="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentTypeIndex">
          <el-select v-model="formLabelAlign.paymentTypeIndex" placeholder="请选择">
            <el-option v-for="(item,i) in paymentTypeList" :key="item.n" :label="item.n" :value="i" :disabled="item.d==formLabelAlign.rmType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Base Company" prop="baseCompany">
          <el-select
            v-model="formLabelAlign.baseCompany"
            placeholder="请选择"
            @change="bankCurrencyChange">
            <el-option
              v-for="item in baseCompanyList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Business Origin" prop="businessOrigin">
          <el-select v-model="formLabelAlign.businessOrigin" placeholder="请选择">
            <el-option
              v-for="item in businessOriginList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款人" prop="brokerModel" v-show="formLabelAlign.rmType=='P'">
          <el-select filterable v-model="formLabelAlign.brokerModel" placeholder="请选择" @change="recepitBankList">
            <el-option v-for="(item,index) in brokerListSk" :key="index" :label="item.codecode+' - '+item.codeName" :value="index">
              <span style="float:left">{{ item.codecode }}</span>
              <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款账户" prop="partnerBankAccount" v-show="formLabelAlign.rmType=='P'">
          <el-select v-model="formLabelAlign.partnerBankAccount" placeholder="请选择">
            <el-option v-for="(item,i) in recepitList" :key="i" :label="item.currency+'-'+item.bankName+'-'+item.accountNumber" :value="item.objectId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇款人" prop="brokerModel" v-show="formLabelAlign.rmType=='R'">
          <el-select filterable v-model="formLabelAlign.brokerModel" placeholder="请选择">
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
        <el-form-item label="银行账户" prop="bankAccount1">
          <el-select v-model="formLabelAlign.bankAccount1" placeholder="请选择">
            <el-option
              v-for="(item,i) in BankAccountList"
              :key="i"
              :label="item.currency+'-'+item.bankName+'-'+item.accountNumber"
              :value="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起息日" prop="valueDate">
          <el-date-picker
            value-format="timestamp"
            v-model="formLabelAlign.valueDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="到期日" prop="dueDate">
          <el-date-picker
            value-format="timestamp"
            v-model="formLabelAlign.dueDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="币制/金额" required>
          <el-col :span="10">
            <el-form-item prop="bankCurrency">
              <el-select
                v-model="formLabelAlign.bankCurrency"
                placeholder="请选择"
                class="curAmount"
                @change="bizhichange(0)"
              >
                <el-option
                  v-for="item in rmCurrencyList"
                  :key="item.alpha"
                  :label="item.alpha"
                  :value="item.alpha"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="bankAmount">
              <input
                type="text"
                class="selfInput"
                v-model="formLabelAlign.bankAmount"
                @input="watchInput('bankAmount')"
              >
              <!-- <el-input v-model="formLabelAlign.bankAmount" @input.native="watchInput('bankAmount')" class="curAmount"></el-input> -->
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="手续费币制/手续费金额">
          <el-col :span="10">
            <el-form-item>
              <el-select
                v-model="formLabelAlign.chargesCurrency"
                placeholder="请选择"
                class="curAmount"
              >
                <el-option
                  v-for="item in rmCurrencyList"
                  :key="item.alpha"
                  :label="item.alpha"
                  :value="item.alpha"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <input
                type="text"
                class="selfInput"
                v-model="formLabelAlign.chargesAmount"
                @input="watchInput('chargesAmount')"
              >
              <!-- <el-input v-model="formLabelAlign.chargesAmount" @input.native="watchInput('chargesAmount')" class="curAmount"></el-input> -->
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="creatRM(1,'formLabelAlign')">确定</el-button>
          <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogFormVisible2" :close-on-click-modal="modal">
      <el-form label-width="120px">
        <el-form-item label="选择附件" v-show="title ==='上传附件'">
          <el-upload
            class="upload-demo"
            action=""
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            :http-request="upload"
            :file-list="fileList"
          >
            <el-button plain type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table
        :data="fileData"
        style="width: 100%"
        class="document"
        v-show="title==='附件查看'"
      >
        <el-table-column label="文件名" width="140">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top">
              <span class="smallHand abbreviate" @click="docView(scope.row)">{{scope.row.docName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="160"></el-table-column>
        <el-table-column label="任务来源" width="140">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="nameList[scope.row.createdBy]"
              placement="top"
            >
              <span class="abbreviate">{{nameList[scope.row.createdBy]}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          v-show="$route.query.tag !== 'credVerification' && $route.query.tag !== 'viewInvalidate' && $route.query.tag !== 'collectiongEnd'"
        >
          <template slot-scope="scope">
            <el-button
              v-show="$route.query.tag !== 'credVerification' && $route.query.tag !== 'viewInvalidate' && $route.query.tag !== 'collectiongEnd'"
              @click.stop="detailRemove(scope.row)"
              type="text"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="TaxList"
        style="width: 100%"
        class="document"
        v-show="title==='增值税信息获取'"
      >
        <el-table-column prop="invoiceId" label="增值税号"></el-table-column>
        <el-table-column prop="rmId" label="支票号"></el-table-column>
        <el-table-column prop="sgNum" label="结算清单编号"></el-table-column>
        <el-table-column prop="invoicePurchaser" label="购买方"></el-table-column>
        <el-table-column prop="invoiceSeller" label="销售方"></el-table-column>
        <el-table-column prop="invoiceChecker" label="核实人"></el-table-column>
        <el-table-column label="开票金额">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="Number(scope.row.invoiceAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')"
              placement="top-start"
            >
              <span class="abbreviate">{{Number(scope.row.invoiceAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceDrawer" label="开票人"></el-table-column>
        <el-table-column prop="invoiceDate" label="开票日期"></el-table-column>
        <el-table-column prop="createdBy" label="创建人"></el-table-column>
        <el-table-column prop="createdAt" label="创建日期"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="文档预览" :visible.sync="dialogFormVisibleA" :close-on-click-modal="modal">
      <div class="browseDoc">
        <iframe
          src="../../static/Preview/index.html"
          id="iframeId"
          name="ifrmname"
          style="width:100%;height:-webkit-fill-available;"
          ref="mapFrame"
          frameborder="0"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "detailCred",
  data() {
    return {
      nameList: {},
      recepitList:[],
      searchFlag1: true,
      searchFlag2: true,
      searchFlag3: true,
      searchFlag4: true,
      modal: false,
      tableData: [],
      SICSData: [],
      RMData: [],
      listData: [
        {
          a: "流程编号",
          b: "",
          c: "processId"
        },
        {
          a: "结付公司",
          b: "",
          c: "rmSettleCompanyCode",
          d:'rmSettleCompanyName'
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
          a: "任务来源",
          b: "",
          c: "modifiedBy"
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
          a: "结算人员",
          b: "",
          c: "rmSettleUser"
        }
      ],
      formLabelAlign: {
        rmType:'R',
        partnerBankAccount:null,
        rmStatus: "",
        rmStatusName: "",
        processId: "",
        paymentType: "",
        paymentTypeName: "",
        bankCurrency: "CNY",
        bankAmount: "",
        baseCompany: null,
        bankAccount: "", //objectId
        valueDate: "",
        dueDate: "",
        businessPartnerRef: "",
        businessOrigin: "",
        createdBy: "",
        chargesCurrency: "",
        chargesAmount: "",
        partnerCode: "",
        partnerName: "",
        bankCurrency: "",
        bankAccountName: "",
        bankAccount1: null,
        rmStatusIndex: 0,
        bookingPeriodName: "Month 05",
        bookingPeriodCode: "M05",
        bookingYear: "2019",
        paymentTypeIndex: "Wire",
        brokerModel: null
      },
      TaxList: [],
      xtname: "",
      pendingReason: null,
      rmStatusList: [
        { n: "In Progress", v: "PROG" },
        { n: "In Execution", v: "INEX" }
      ],
      paymentTypeList: [   // 此处的d必须写成反的，反向判断disabled数据
        { n: "Wire", v: "WIRE" , d:''},
        { n: "Void P-Wire", v: "VP_WIRE", d:'P'},
        { n:'Void R-Wire', v:'VR_WIRE', d:'R'}
      ],
      businessOriginList: [
        { a: "DOM", b: "RC_DOMESTIC" },
        { a: "INT", b: "RC_INTL" }
      ],
      brokerList: [],
      brokerListSk:[],
      rmCurrencyList: [],
      assignee: "",
      TJRoptions: [],
      dialogFormVisible3: false,
      dialogFormVisible2: false,
      dialogFormVisible: false,
      dialogFormVisibleA: false,
      dialogFormVisibleFHRWZF: false,
      title: "",
      currentPage3: 5,
      hide: false,
      radio: "1",
      options: [],
      flag: "",
      specialName: "",
      row: {},
      czState: false,
      hxState: false,
      BHoptions: [
        "金额",
        "币制",
        "SECTION",
        "合同号",
        "未决",
        "ENTRYCODE",
        "日期",
        "其它"
      ],
      opinion: "",
      rebut: "",
      baseCompanyList: [],
      mustData: {
        actOperator: "",
        processStatus: "",
        pageNumber: 1, // 页数
        pageSize: 20, //页面一次要展示的条数
        total: 0 //总条数
      },
      labelPosition: "right",
      pageNumber: 1, // 页数
      pageSize: 20, //页面一次要展示的条数
      BankAccountList: [],
      file: [],
      fileList: [],
      fileData: [],
      SgData: [],
      WSData: [],
      rules: {
        rmStatusIndex: [
          { required: true, message: "请选择支票状态", trigger: "blur" }
        ],
        businessOrigin: [
          { required: true, message: "请选择Business Origin", trigger: "blur" }
        ],
        paymentTypeIndex: [
          { required: true, message: "请选择支付方式", trigger: "blur" }
        ],
        baseCompany: [
          { required: true, message: "请选择Base Company", trigger: "blur" }
        ],
        brokerModel: [
          { required: true, message: "请选择汇款人", trigger: "blur" }
        ],
        bankAccount1: [
          { required: true, message: "请选择银行账户", trigger: "blur" }
        ],
        bankCurrency: [
          { required: true, message: "请选择币制", trigger: "blur" }
        ],
        rmType: [
            { required: true, message: '请选支票类型', trigger: 'change' }
          ],
        // partnerBankAccount: [
        //   { required: true, message: "请选择收款账户", trigger: "blur" }
        // ],
        valueDate: [
          {
            type: "date",
            required: true,
            message: "请选择起息日",
            trigger: "blur"
          }
        ],
        dueDate: [
          {
            type: "date",
            required: true,
            message: "请选择到期日",
            trigger: "blur"
          }
        ],
        input: [{ required: true, message: "请输入汇款金额", trigger: "blur" }],
        bankAmount: [{ required: true, message: "请输入金额", trigger: "blur" }]
        // chargesAmount:[
        //   { required: true, message: '请输入手续费金额', trigger: 'blur' }
        // ],
      },
      putIn: false
    };
  },
  created() {
    sessionStorage.setItem("data", JSON.stringify({}));
    this.row = JSON.parse(this.$route.query.row);
    this.mustData.actOperator = this.$store.state.userName;
    this.mustData.processStatus = this.$route.query.row.processStatus;
    // 查询单条数据，根据processId
    let param = {
      curOperator: this.$store.state.userName,
      pageNumber: 1,
      pageSize: 20,
      processId: this.row.processId,
      processType: "收款"
    };
    if (this.$route.query.tag === "credOperation" || this.$route.query.tag === "credVerification") {
      this.$http.post("api/receipt/finaCreat/list", param).then(res => {
        if (res.status == 200) {
          if (this.$route.query.tag === "credOperation" && res.data.rows[0].processStatus == "已悬停") {
            this.czState = true
          } else {
            this.czState = false
          }
          if (this.$route.query.tag === "credVerification" && res.data.rows[0].processStatus == "已悬停") {
            this.hxState = true
          } else {
            this.hxState = false
          }
        }
      });
    }
    this.formLabelAlign.valueDate = new Date().getTime();
    this.formLabelAlign.dueDate = new Date().getTime();
    this.nameList = JSON.parse(sessionStorage.getItem("nameList"));
  }, 
  mounted() {
    setTimeout(() => {
      // 分出人+经济人all
      let fcArr = JSON.parse(sessionStorage.getItem("CedentType"));
      let jArr = JSON.parse(sessionStorage.getItem("BrokerType"));
      this.brokerList = jArr.concat(fcArr);
      // 分出人+经济人part
      let bList = JSON.parse(sessionStorage.getItem('BrokerBankList'));
      let cList = JSON.parse(sessionStorage.getItem('CedentBankList'));
      this.brokerListSk = bList.concat(cList);
      //获取币制
      this.rmCurrencyList = JSON.parse(sessionStorage.getItem("CurrencyList"));
      // 集团产再
      let objbc = JSON.parse(sessionStorage.getItem("baseCompany"));
      this.baseCompanyList = objbc.filter(el => {
        return el.code != "Both";
      }); 
      // 国际国内
      this.businessOriginList = JSON.parse(
        sessionStorage.getItem("businessOrigin")
      );
      if (this.$route.query.tag === "credOperation") {
        // 操作
        // 获取银行账户列表
        this.AllBankAccountList = JSON.parse(sessionStorage.getItem("AllBankAccountList"));
        this.rmWriteBack();
        this.recepitBankList();
      }
    }, 1000);
    if (this.$route.query.tag === "credVerification") {
      this.dataBaseSG();
    } else {
      this.queryRM();
      console.log('是因为页面刷新！！！！！！！！！！！！！！！！！！！！！')
    }
    // 详情
    this.listData.forEach(el => {
      el["b"] = this.row[el["c"]];
      if (el["a"] == "任务来源") {
        el["b"] = this.nameList[this.row[el["c"]]];
      }
      if(el['a']=='结付公司'){ el["b"]=this.row[el['c']] + '-' + this.row[el['d']];}
    });
  },
  methods: {
    chongXiao(row){
      this.$http.post("api/receipt/credOperation/creatWfCheckRemit",{rmId:row.rmId,createdBy:this.$store.state.userName}).then(res => {
          if (res.status == 200 && res.data.errorCode == 1) {
            this.$message({ message:res.data.errorMessage , type: "success" });
            this.queryRM();
          } else if(res.data.errorCode == 0){ 
            this.$message({ type: "error",message: res.data.errorMessage});
           }
      })
    },
    docView(row) {
      if (row) {
        if(row.suffix && row.suffix=='eml'){ return false; }
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
    recepitBankList(){ 
      // this.AllBankAccountList
      if(this.formLabelAlign.brokerModel || this.formLabelAlign.brokerModel==0){
        this.recepitList = this.AllBankAccountList.filter(el=>{ return el.bpCode == this.brokerListSk[this.formLabelAlign.brokerModel]['codecode']});
        if (this.recepitList.length) {
          let arr1 = this.recepitList.filter(el => {
            return el.currency === this.formLabelAlign.bankCurrency;
          });
          if (arr1.length) {
            this.recepitList = arr1;
          } else {
            // setTimeout(() => {
              this.$message.error("选择的币制和收款账户不匹配");
            // }, 100);
            this.recepitList = [];
            this.formLabelAlign.partnerBankAccount = null;
          }
        }
      }
    },
    bizhichange(tag){
      if(tag==0 && this.formLabelAlign.rmType=='R'){   // 收款币制change,只校验银行账户
        this.bankCurrencyChange();
      } else{
        this.recepitBankList();
        this.bankCurrencyChange();
      }
      
    },    
    copy(id) {
      let Url2 = document.getElementById(id).innerText;
      let oInput = document.createElement("input");
      oInput.value = Url2;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.remove();
      this.$message({ message: "复制成功", type: "success" });
    },
    changeOpinion() {
      if (this.opinion != "其它") {
        this.rebut = null;
      }
    },
    openBPSICS() {
      if (!this.row.rmSettleCompanyCode) {
        this.$message({
          type: "error",
          message: "process中rmSettleCompanyCode无值，打不开"
        });
        return false;
      }
      this.$http
        .post("api/sics/liveDesktop/openBpLedger", {
          modifiedBy: this.mustData.actOperator,
          bpId: this.row.rmSettleCompanyCode
        })
        .then(res => {
          console.log(res, "打开SICS");
        });
    },
    openReverse() {
      this.$http
        .post("api/pay/teskClaim/reversePayProcess", {
          actOperator: this.$store.state.userName,
          processId: this.row.processId
        })
        .then(res => {
          console.log(res, "打开SICS");
        });
    },
    openSICS(row, id) {
      if (id == "rmId") {
        this.$http
          .post("api/sics/liveDesktop/openRemittance", {
            modifiedBy: this.$store.state.userName,
            remitId: row.rmId
          })
          .then(res => {
            console.log(res, "打开SICS");
          });
      } else {
        this.$http
          .post("api/sics/liveDesktop/openWorksheet", {
            modifiedBy: this.$store.state.userName,
            worksheetId: row[id]
          })
          .then(res => {
            console.log(res, "打开SICS");
            // if(res.status === 200 && res.data.rows){
            //   this.SICSData = res.data.rows;
            // }
          });
      }
    },
    dataBaseSG() {
      this.$http
        .post("api/sics/basis/getSGAndRemitList", {
          actOperator: this.mustData.actOperator,
          processId: this.row.processId
        })
        .then(res => {
          console.log(res, "dataBaseSG");
          if (res.status === 200) {
            this.RMData = res.data.remitDOlist;
            this.WSData = res.data.workSheetDOlsit;
            // this.SgData = res.data.worksheetsgDOlist;
            let arr5 = res.data.worksheetsgDOlist;
                arr5.forEach(el=>{
                  if(el.docName){
                    let suffix = el.docName.split('.');
                    el['suffix'] = suffix[suffix.length-1];
                  }
                })
                this.SgData = arr5;
            
          }
        });
    },
    makeReport() {
      this.$http
        .post("api/sics/basis/getPairingExelByProcessId", {
          processId: this.row.processId
        })
        .then(res => {
          console.log(res, "makeReport");
          if (res.status === 200 && res.data) {
            this.$message({ message: "生成核销报告成功", type: "success" });
          }
        });
    },
    getTaxInfo() {
      // 增值税信息获取
      this.title = "增值税信息获取";
      this.$http
        .post("api/vat/message/save", { processId: this.row.processId })
        .then(res => {
          console.log(res, "getTaxInfo");
          if (res.status === 200 && res.data) {
            this.TaxList = res.data;
            this.dialogFormVisible2 = true;
          } else {
            this.$message.error("无数据或者后端报错");
          }
        });
    },
    tbState() {
      this.$http
        .post("api/sics/basis/receiptSynchronize", {
          actOperator: this.mustData.actOperator,
          processId: this.row.processId
        })
        .then(res => {
          console.log(res, "getSg");
          if (res.status === 200) {
            this.RMData = res.data.remitDOlist;
            this.WSData = res.data.workSheetDOlsit;
            // this.SgData = res.data.worksheetsgDOlist;
            let arr5 = res.data.worksheetsgDOlist;
              arr5.forEach(el=>{
                if(el.docName){
                  let suffix = el.docName.split('.');
                  el['suffix'] = suffix[suffix.length-1];
                }
              })
              this.SgData = arr5;
            
          }
        });
    },
    getSg() {
      if (this.RMData) {
        let rmIds = "";
        this.RMData.forEach(el => {
          rmIds += `${el.rmId},`;
        });
        this.$http
          .post("api/sics/basis/getPayRemitFromSics", {
            actOperator: this.mustData.actOperator,
            processId: this.row.processId,
            rmIds: rmIds
          })
          .then(res => {
            if (res.status === 200) {
              // this.SgData = res.data.worksheetsgDOlist;
              this.RMData = res.data.remitDOlist;
              this.WSData = res.data.workSheetDOlsit;
              let arr5 = res.data.worksheetsgDOlist;
              if(arr5){
                arr5.forEach(el=>{
                  if(el.docName){
                    let suffix = el.docName.split('.');
                    el['suffix'] = suffix[suffix.length-1];
                  }  
                })
                this.SgData = arr5;
              }
            }
          });
      } else {
        this.$message.error("无账单，无法更新信息");
      }
    },
    rmWriteBack() {
      // 不能写方法循环遍历，只能手写一点点对字段，有坑
      this.formLabelAlign.processId = this.row.processId;
      // 带过来的结付公司 === 汇款人
      // if (this.row.rmSettleCompanyCode) {
      //   this.brokerList.forEach((el, i) => {
      //     if (el.codecode == this.row.rmSettleCompanyCode) {
      //       this.formLabelAlign.brokerModel = i;
      //     }
      //   });
      // }
      console.log(this.row.rmChargesCurrency, "process222");
      this.formLabelAlign.businessPartnerRef = this.row.processId;
      this.formLabelAlign.bankCurrency = this.row.rmCurrency;
      this.formLabelAlign.bankAmount = this.row.rmAmount;
      this.formLabelAlign.chargesCurrency = this.row.rmChargesCurrency;
      this.formLabelAlign.chargesAmount = this.row.rmChargesAmount;
      if (this.row.businessOrigin) {
        let arr = this.businessOriginList.filter(el => {
          return el.name == this.row.businessOrigin;
        });
        if(arr){ this.formLabelAlign.businessOrigin = arr[0]["code"]; }
      }
      if (this.row.baseCompany) {
        let arr = this.baseCompanyList.filter(el => {
          return el.name == this.row.baseCompany;
        });
        if(arr){ this.formLabelAlign.baseCompany = arr[0]["code"]; }
      }
    },
    bankCurrencyChange() {
      //  获取银行账户     bankCurrency 币制
      this.baseCompanyChange();
      this.formLabelAlign.bankAccount1 = null;
      if (this.BankAccountList.length) {
        let arr1 = this.BankAccountList.filter(el => {
          return el.currency === this.formLabelAlign.bankCurrency;
        });
        if (arr1.length) {
          this.BankAccountList = arr1;
        } else {
          setTimeout(() => {
            this.$message.error("选择的币制和银行账户不匹配");
          }, 500);
          this.BankAccountList = [];
        }
      }
    },
    baseCompanyChange() {
      if (this.AllBankAccountList.length) {
        let Glist = [],
          Plist = [];
        this.AllBankAccountList.forEach(el => {
          if (el.bpName === "China Re Group") {
            Glist.push(el);
          }
          if (el.bpName === "China Re P&C") {
            Plist.push(el);
          }
        });
        if (this.formLabelAlign.baseCompany === "BP2") {
          // 集团
          this.BankAccountList = Glist;
        } else if (this.formLabelAlign.baseCompany === "BP1") {
          // 产再
          this.BankAccountList = Plist;
        } else {
          this.$message.error("请选择Base Company");
          this.BankAccountList = this.AllBankAccountList;
        }
      }
    },
    queryRM() {
      this.$http
        .post("api/receipt/credOperation/queryRemit", {
          processId: this.row.processId,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        })
        .then(res => {
          console.log(res, "queryRM");
          if (res.status === 200) {
            this.RMData = res.data.rows;
            // this.formLabelAlign = res.data.rows;
            // 创建编辑啥的不能回显
          }
        });
    },
    watchInput(name) {
      if (!/^\d+(\.\d{0,2})?$/.test(this.formLabelAlign[name])) {
        if (this.formLabelAlign[name]) {
          // this.formLabelAlign[name] = this.formLabelAlign[name].substr(0,this.formLabelAlign[name].length-1);
          this.formLabelAlign[name] = "";
          this.$message.error("请输入数字，支持到小数点后两位");
        }
      }
    },
    creatRM(tag, formName) {
      if (this.formLabelAlign.brokerModel != null) {
        let arrList = [];
        this.formLabelAlign.rmType=='R'?arrList=this.brokerList:arrList=this.brokerListSk ;
        let obj = arrList[this.formLabelAlign.brokerModel];
        this.formLabelAlign.partnerCode = obj.codecode;
        this.formLabelAlign.partnerName = obj.codeName;
      }
      if (tag == 1) {
        // 确定
        let val = this.BankAccountList[this.formLabelAlign.bankAccount1];
        if (val) {
          this.formLabelAlign.bankAccount = val.objectId;
          this.formLabelAlign.bankAccountName = val.bankName;
        }
        let val3 = this.rmStatusList[this.formLabelAlign.rmStatusIndex];
        if (val3) {
          this.formLabelAlign.rmStatus = val3.v;
          this.formLabelAlign.rmStatusName = val3.n;
        }
        let val2 = this.paymentTypeList[this.formLabelAlign.paymentTypeIndex];
        if (val2) {
          this.formLabelAlign.paymentType = val2.v;
          this.formLabelAlign.paymentTypeName = val2.n;
        } else {
          this.formLabelAlign.paymentType = "WIRE";
          this.formLabelAlign.paymentTypeName = "Wire";
        }
        this.formLabelAlign.createdBy = this.$store.state.userName;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$http.post("api/receipt/credOperation/createRemit",Object.assign(this.formLabelAlign,this.mustData)).then(res => {
                this.dialogFormVisible = false;
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.$message({ message: "创建成功", type: "success" });
                  this.queryRM();
                } else if (res.data.errorCode == 0 && res.data.errorMessage) {
                  this.$message.error(res.data.errorMessage);
                }
              });
          }
        });
      } else if (tag == "a") {
        // 创建支票
        // if (!this.row.baseCompany) {
        //   this.$message.error("Base Company无数据，请返回编辑");
        //   return false;
        // }
        this.rmFlag = "a";
        this.rmWriteBack();
        this.dialogFormVisible = true;
        this.bankCurrencyChange();
        this.recepitBankList();
      } else if (tag == "b") {
        // 编辑支票
        this.rmFlag = "b";
        this.dialogFormVisible = true;
      }
    },
    getName(name) {
      // 指派人，下一级提交人
      this.$http
        .post("api/activiti/getAssigneeName", { roleName: name })
        .then(res => {
          if (res.status === 200) {
            this.TJRoptions = res.data;
          }
        });
    },
    gangUp(name) {
      this.pendingReason = null;
      if (name === "操作") {
        if (!this.czState) {
          this.title = "悬停";
          this.dialogFormVisible3 = true;
          this.flag = 13;
          this.xtname = name;
          // this.$confirm('是否状态挂起？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          //   }).then(() => {
          //     this.$http.post('api/receipt/activitiForReceipt/commonActivitiForReceipt'
          //     ,{processId:this.row.processId,
          //     procInstId:this.row.processInstId,
          //     assignee:this.$store.state.userName,
          //     type:'PENDING',
          //     actOperator:this.$store.state.userName})
          //     .then(res =>{
          //       console.log(res,'悬停');
          //     if(res.status === 200 && res.data.errorCode == 1){
          //       this.czState = !this.czState;
          //     } else if(res.data.errorCode == 0){
          //       this.$message({type: 'error', message:res.data.errorMessage });
          //     }
          //   })
          // })
        } else {
          // 恢复
          this.$confirm("是否恢复？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http
              .post("api/receipt/activitiForReceipt/commonActivitiForReceipt", {
                processId: this.row.processId,
                procInstId: this.row.processInstId,
                assignee: this.$store.state.userName,
                type: "RECOVERY",
                actOperator: this.$store.state.userName
              })
              .then(res => {
                console.log(res, "恢复");
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.czState = !this.czState;
                } else if (res.data.errorCode == 0) {
                  this.$message({
                    type: "error",
                    message: res.data.errorMessage
                  });
                }
              });
          });
        }
      } else {
        // 核销
        if (!this.hxState) {
          this.title = "悬停";
          this.dialogFormVisible3 = true;
          this.flag = 13;
          this.xtname = name;
          // this.$confirm('是否状态挂起？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          //   }).then(() => {
          //     this.$http.post('api/receipt/activitiForReceipt/commonActivitiForReceipt'
          //     ,{processId:this.row.processId,
          //     procInstId:this.row.processInstId,
          //     assignee:this.$store.state.userName,
          //     type:'PENDING',hasRecheckFlag:'1',actOperator:this.$store.state.userName})
          //     .then(res =>{
          //       console.log(res,'悬停');
          //     if(res.status === 200 && res.data.errorCode == 1){
          //       this.hxState = !this.hxState;
          //     } else if(res.data.errorCode == 0){
          //       this.$message({type: 'error', message:res.data.errorMessage });
          //     }
          //   })
          // })
        } else {
          // 恢复
          this.$confirm("是否恢复？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http
              .post("api/receipt/activitiForReceipt/commonActivitiForReceipt", {
                processId: this.row.processId,
                procInstId: this.row.processInstId,
                assignee: this.$store.state.userName,
                type: "RECOVERY",
                hasRecheckFlag: "1",
                actOperator: this.$store.state.userName
              })
              .then(res => {
                console.log(res, "恢复");
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.hxState = !this.hxState;
                } else if (res.data.errorCode == 0) {
                  this.$message({
                    type: "error",
                    message: res.data.errorMessage
                  });
                }
              });
          });
        }
      }
    },
    submite(tag, name, specialName, gname) {
      this.flag = tag;
      this.title = name;
      this.assignee = null;
      switch (tag) {
        case 1: // 流程提交、复核通过
          if (this.$route.query.tag === "credOperation") {
            if (!this.row.businessOrigin) {
              this.$message.error("请填写Business Origin");
              return false;
            }
            this.$http.post("api/sics/basis/checkAmount",{processId:this.row.processId}).then(res => {
              if (res.status === 200 && res.data.code == 1) {
                this.getName(specialName);
                this.dialogFormVisible3 = true;
              } else{
                this.$message.error(res.data.msg);
                return false;
              }
            })
          } else if (this.$route.query.tag === "credReview") {
            this.$http.post("api/sics/basis/getReceiptReviewMessage", {
                modifiedBy: this.$store.state.userName,
                processId: this.row.processId
              }).then(res => {
                if (res.status === 200 && res.data.code == 0) {
                  // 7.15 复核通过改为不选人
                  this.$confirm("确认复核通过？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  }).then(() => {
                    this.$http
                      .post(
                        "api/receipt/activitiForReceipt/commonActivitiForReceipt",
                        {
                          processId: this.row.processId,
                          procInstId: this.row.processInstId,
                          assignee: this.row.entryOperator,
                          type: this.$route.query.name,
                          actOperator: this.$store.state.userName
                        }
                      )
                      .then(res => {
                        if (res.status === 200 && res.data.errorCode == 1) {
                          this.dialogFormVisible3 = false;
                          this.$router.push({ name: this.$route.query.tag });
                        } else if (res.data.errorCode == 0) {
                          this.$message({
                            type: "error",
                            message: res.data.errorMessage
                          });
                        }
                      });
                        });
                      } else if (res.data.code == 1 && res.data.msg) {
                        this.$message.error(res.data.msg);
                      }
              });
            } else if (this.$route.query.tag === "credVerification" || this.$route.query.tag === "viewInvalidate") {
              this.$confirm("是否核销通过？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                this.$http
                  .post(
                    "api/receipt/activitiForReceipt/commonActivitiForReceipt",
                    {
                      processId: this.row.processId,
                      procInstId: this.row.processInstId,
                      assignee: this.$store.state.userName,
                      type: this.$route.query.name,
                      actOperator: this.$store.state.userName
                    }
                  )
                  .then(res => {
                    if (res.status === 200 && res.data.errorCode == 1) {
                      if (res.data.errorMessage) {
                        this.$message({
                          type: "warning",
                          message: res.data.errorMessage
                        });
                      }
                      setTimeout(() => {
                        this.$router.push({ name: this.$route.query.tag });
                      }, 1000);
                    } else if (res.data.errorCode == 0) {
                      this.$message({
                        type: "error",
                        message: res.data.errorMessage
                      });
                    }
                  });
              });
            } else {
              this.getName(specialName);
              this.dialogFormVisible3 = true;
            }
          break;
        case 2: // 指派
          this.getName(gname);
          this.specialName = specialName;
          specialName == "复核"
            ? (this.dialogFormVisibleFHRWZF = true)
            : (this.dialogFormVisible3 = true);
          break;
        case 3: // 置废
          this.$confirm("是否置废？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http
              .post("api/receipt/activitiForReceipt/commonActivitiForReceipt", {
                processId: this.row.processId,
                procInstId: this.row.processInstId,
                assignee: this.$store.state.userName,
                type: "INACTIVE",
                actOperator: this.$store.state.userName
              })
              .then(res => {
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.dialogFormVisible3 = false;
                  this.$router.push({ name: this.$route.query.tag });
                } else if (res.data.errorCode == 0) {
                  this.$message({
                    type: "error",
                    message: res.data.errorMessage
                  });
                }
              });
          });
          break;
        case 4: // 复核驳回
          this.dialogFormVisible3 = true;
          break;
        case 5: // 状态恢复
          this.$confirm("是否恢复？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http
              .post("api/receipt/activitiForReceipt/commonActivitiForReceipt", {
                processId: this.row.processId,
                procInstId: this.row.processInstId,
                assignee: this.$store.state.userName,
                type: "RECOVERY",
                hasRecheckFlag: "1",
                actOperator: this.$store.state.userName
              })
              .then(res => {
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.$router.push({ name: this.$route.query.tag });
                } else if (res.data.errorCode == 0) {
                  this.$message({
                    type: "error",
                    message: res.data.errorMessage
                  });
                }
              });
          });
          break;
      }
    },
    confirm() {
      switch (this.flag) {
        case 1: // 流程提交、复核通过
          if (!this.assignee) {
            this.$message.error("请选择任务处理人");
            return false;
          }
          this.$http
            .post("api/receipt/activitiForReceipt/commonActivitiForReceipt", {
              processId: this.row.processId,
              procInstId: this.row.processInstId,
              assignee: this.assignee,
              type: this.$route.query.name,
              actOperator: this.$store.state.userName
            })
            .then(res => {
              if (res.status === 200 && res.data.errorCode == 1) {
                this.dialogFormVisible3 = false;
                this.$router.push({ name: this.$route.query.tag });
              } else if (res.data.errorCode == 0) {
                this.$message({
                  type: "error",
                  message: res.data.errorMessage
                });
              }
            });
          break;
        case 2: // 指派
          if (!this.assignee) {
            this.$message.error("请选择指派人");
            return false;
          }
          if (this.specialName === "操作") {
            this.$http
              .post("api/activiti/setAssignee", {
                processId: this.row.processId,
                procInstId: this.row.processInstId,
                assignee: this.assignee,
                taskName: "待处理",
                actOperator: this.$store.state.userName,
                processInstanceKey: "taProcess02"
              })
              .then(res => {
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.dialogFormVisible3 = false;
                  this.$router.push({ name: this.$route.query.tag });
                } else if (res.data.errorCode == 0) {
                  this.$message({
                    type: "error",
                    message: res.data.errorMessage
                  });
                }
              });
          } else {
            // 复核
            this.$http
              .post("api/activiti/setAssignee", {
                processId: this.row.processId,
                procInstId: this.row.processInstId,
                assignee: this.assignee,
                taskName: "待复核",
                actOperator: this.$store.state.userName,
                processInstanceKey: "taProcess02"
              })
              .then(res => {
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.dialogFormVisible3 = false;
                  this.dialogFormVisibleFHRWZF = false;
                  this.$router.push({ name: this.$route.query.tag });
                } else if (res.data.errorCode == 0) {
                  this.$message({
                    type: "error",
                    message: res.data.errorMessage
                  });
                }
              });
          }
          break;
        case 4: // 复核驳回
          if (!this.opinion) {
            this.$message.error("请选择驳回原因");
            return;
          }
          if (this.opinion == "其它" && !this.opinion) {
            this.$message.error("请填写驳回原因");
            return;
          }
          this.$http
            .post("api/receipt/activitiForReceipt/commonActivitiForReceipt", {
              processId: this.row.processId,
              procInstId: this.row.processInstId,
              assignee: this.row.entryOperator,
              opinion: this.opinion == "其它" ? this.rebut : this.opinion,
              type: "REJECT",
              actOperator: this.$store.state.userName
            })
            .then(res => {
              if (res.status === 200 && res.data.errorCode == 1) {
                this.dialogFormVisible3 = false;
                this.$router.push({ name: this.$route.query.tag });
              } else if (res.data.errorCode == 0) {
                this.$message({
                  type: "error",
                  message: res.data.errorMessage
                });
              }
            });
          break;
        case 13: // 悬停
          if (!this.pendingReason) {
            this.$message.error("请填写悬停原因");
            return false;
          }
          if (this.xtname === "操作") {
            this.$http
              .post("api/receipt/activitiForReceipt/commonActivitiForReceipt", {
                processId: this.row.processId,
                procInstId: this.row.processInstId,
                assignee: this.$store.state.userName,
                pendingReason: this.pendingReason,
                type: "PENDING",
                actOperator: this.$store.state.userName
              })
              .then(res => {
                console.log(res, "悬停");
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.czState = !this.czState;
                  this.dialogFormVisible3 = false;
                } else if (res.data.errorMessage) {
                  this.$message.error(res.data.errorMessage);
                }
              });
          } else {
            this.$http
              .post("api/receipt/activitiForReceipt/commonActivitiForReceipt", {
                processId: this.row.processId,
                procInstId: this.row.processInstId,
                assignee: this.$store.state.userName,
                pendingReason: this.pendingReason,
                type: "PENDING",
                hasRecheckFlag: "1",
                actOperator: this.$store.state.userName
              })
              .then(res => {
                console.log(res, "悬停");
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.hxState = !this.hxState;
                  this.dialogFormVisible3 = false;
                } else if (res.data.errorMessage) {
                  this.$message.error(res.data.errorMessage);
                }
              });
          }
          break;
      }
    },
    handleClick() {},
    handleClick2() {},
    remoteMethod() {},
    beforeAvatarUpload(file) {
      this.file.push(file);
    },
    upload(file) {
      let resFile = new FormData();
      resFile.append("file", this.file[0]);
      resFile.append("actOperator", this.$store.state.userName);
      resFile.append("processId", this.row.processId);
      this.$http
        .post("api/anyShare/fileOperation/uploadFilesForPage", resFile, {
          headers: { "Content-Type": "application/json;charset=UTF-8" }
        })
        .then(res => {
          this.fileList = [];
          this.file = [];
          if (res.status === 200 && res.data.errorCode == 1) {
            this.dialogFormVisible2 = false;
            this.$message({ message: "上传成功", type: "success" });
          } else if (res.data.errorCode && res.data.errorCode == 0) {
            this.$message.error(res.data.errorMessage);
          }
        });
    },
    mailSend(tag, name) {
      this.title = name;
      this.dialogFormVisible2 = true;
      if (tag == 2) {
        //附件查看   1为附件上传
        this.$http
          .post("api/worksheet/sortOperation/listDocument", {
            actOperator: this.$store.state.userName,
            processId: this.row.processId,
            pageNumber: 1,
            pageSize: 100
          })
          .then(res => {
            if (res.status === 200) {
              this.fileData = res.data.rows;
            }
          });
      }
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
            processId: this.row.processId,
            actOperator: this.$store.state.userName
          })
          .then(res => {
            this.mailSend(2, "附件查看");
          });
      });
    }
  },
  watch: {
    title: function(n, o) {
      console.log(n, "nnnnnn");
      if (n === "流程提交" && this.$route.query.tag === "credOperation") {
        this.putIn = "b";
      } else if (n === "流程提交") {
        this.putIn = "n";
      } else if (n === "复核通过") {
        this.putIn = "n";
      } else {
        this.putIn = false;
      }
    }
  }
};
</script>
<style scoped>
.detailCred {
  padding: 20px 30px;
  width: 100%;
  padding-left: 80px;
  padding-bottom: 90px;
}
.credContent {
  width: 100%;
  display: flex;
}
.btn {
  width: 100%;
  position: fixed;
  left: 64px;
  bottom: 0;
  z-index: 999;
  background:#FFFFFF ;
  height: 89px;
  line-height: 89px;
  padding: 0 16px;
  box-shadow:0px 0px 1px 0px rgba(155,155,155,1);
}
.btn .el-button {
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 10px;
  border: 1px solid #005c8d;
  background-color: #fff;
  color: #005c8d;
}
.detail-word {
  background-color: #ecf5ff;
  margin-bottom: 20px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.detail-word .title {
  font-weight: 700;
  font-size: 16px;
}
.browseDoc {
  background-color: #ecf5ff;
  width: 100%;
  height: 600px;
  margin-bottom: 20px;
  margin-top: 20px;
}
.left {
  min-width: 640px;
  margin-right: 20px;
}
.detailCred .right {
  width: 1400px;
  height: 100%;
}
.detail-ul {
  margin-left: 10px;
  padding: 10px 16px;
}
.detail-ul li {
  margin-bottom: 10px;
}
.detail-ul li .detail-content {
  color: #999;
}
.detail-ul li .detail-name {
  white-space: nowrap;
}
ul.detail-ul {
  display: flex;
  flex-wrap: wrap;
  margin-left: 0;
  background-color: #fff;
  margin-top: 10px;
}
li.detail-item {
  display: flex;
  width: 33%;
}
.detailSearch {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn .el-button.is-plain:focus,
.btn .el-button.is-plain:hover {
  background: #f5f5f5;
  border-color: #f5f5f5;
  border: 1px solid #005c8d;
}
.detailCred .el-collapse .el-collapse-item {
  padding: 0 20px;
  background-color: #fff;
  margin-bottom: 20px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.detailCred .el-collapse {
  width: 500px;
  border: none;
}
.fy2 {
  text-align: right;
  margin-top: 20px;
}
.fy1 {
  padding-left: 0;
}
.goBack {
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
  padding-bottom: 10px;
}
.goBack .arrows {
  font-weight: 700;
  color: #2b3e50;
}
.goBack .word {
  font-size: 12px;
  color: #2b3e50;
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
.browseDoc {
  background-color: #ecf5ff;
  width: 100%;
  height: 100%;
}
.selfInput {
  border: 1px solid #dcdfe6;
  width: 196px;
  border-radius: 4px;
  outline: none;
}
.smallHand {
  cursor: pointer;
  color: #409eff;
}
</style>