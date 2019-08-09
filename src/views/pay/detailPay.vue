<template>
  <div class="detailPay">
    <router-link :to="{name:$route.query.tag}" style="color:#333;position:absolute;top:20px;left:70px;z-index:100;">
      <span class="arrows" style="font-weight: 700;">＜</span>
      <span class="word">返回上一级</span>
    </router-link>
    <el-row>
      <el-col :span="11" style="padding:0 16px;">
        <!-- 核销 --> 
        <div class="btn" v-if="$route.query.tag === 'payClose'">
          <el-button type="primary" :disabled="hxState" @click="openBPSICS" plain>打开BpLedger</el-button>
          <el-button size="small" :disabled="hxState" @click="makeReport" plain>生成核销报告</el-button>
          <el-button size="small" :disabled="hxState" @click="getTaxInfo" plain>增值税信息获取</el-button>
          <!-- <el-button size="small" :disabled="hxState" @click="mailSend(2,'附件查看')" plain>附件查看</el-button> -->
          <el-button size="small" :disabled="hxState" @click="tongbu" plain>同步状态</el-button>
          <el-button size="small" :type="hxState?'info':''" @click="gangUp('核销')" plain>{{!hxState?'挂起':'悬停'}}</el-button>
          <el-button size="small" :disabled="hxState" plain @click="submite(1,'流程提交')">流程提交</el-button>
        </div>
        <!-- 财务支付/紧急付款/partial完结 -->
        <div class="btn" v-if="$route.query.tag === 'payment' || $route.query.tag === 'partialDone' || $route.query.tag === 'instancyPay'">
          <el-button type="primary" v-if="$route.query.tag === 'partialDone'" @click="openBPSICS" plain>打开BpLedger</el-button>
          <!-- <el-button size="small" plain>附件上传</el-button> -->
          <el-button size="small" plain @click="tongbu" v-if="$route.query.tag === 'instancyPay'">同步状态</el-button>
          <!-- <el-button size="small" plain @click="mailSend(2,'附件查看')">附件查看</el-button> -->
          <el-button size="small" plain v-if="$route.query.tag === 'partialDone'">同步状态</el-button>
          <el-button size="small" plain @click="submite(8,'流程提交',$route.query.tag)">流程提交</el-button>
        </div>
        <!-- 操作 -->
        <div class="btn" v-if="$route.query.tag === 'payOperation'">
          <el-button size="small" @click="openSICS">打开SICS</el-button>
          <el-button size="small" plain @click="makeDoc('a')">生成审批文档</el-button>
          <el-button size="small" :disabled="czState" plain @click="submite(3,'置废','操作')">置废</el-button>
          <!-- <el-button size="small" :disabled="czState" @click="mailSend(1,'上传附件')" plain>上传附件</el-button> -->
          <!-- <el-button size="small" :disabled="czState" @click="mailSend(2,'附件查看')" plain>附件查看</el-button> -->
          <el-button size="small" :type="czState?'info':''" @click="gangUp('操作')" plain>{{!czState?'挂起':'悬停'}}</el-button>
          <el-button size="small" :disabled="czState" plain @click="submite(2,'指派','操作')">指派</el-button>
          <el-button size="small" :disabled="czState" plain @click="submite(1,'流程提交',0,'付款一级审批')">流程提交</el-button>
        </div> 
        <!-- 支票 -->
        <div class="btn" v-if="$route.query.tag === 'approvalDone'">
          <el-button size="small" @click="openSICS">打开SICS</el-button>
          <!-- <el-button size="small" plain @click="mailSend(1,'上传附件')">上传附件</el-button> -->
          <!-- <el-button size="small" plain @click="mailSend(2,'附件查看')">附件查看</el-button> -->
          <el-button size="small" plain @click="submite(2,'指派','支票')">指派</el-button>
          <el-button size="small" plain @click="submite(7,'流程提交',0,'审批完成')">流程提交</el-button>
          <el-button size="small" plain @click="onRemitCreat">支票创建</el-button>
          <el-button size="small" plain @click="urgencyPay">紧急付款</el-button>
        </div> 
        <!-- 复核 -->
        <div class="btn" v-if="$route.query.tag === 'payReview'">
          <el-button size="small" plain @click="submite(2,'指派','复核')">指派</el-button>
          <el-button size="small" plain @click="tongbu">同步状态</el-button>
          <el-button size="small" plain @click="submite(4,'复核驳回')">复核驳回</el-button>
          <el-button size="small" plain @click="submite(6,'复核通过')">复核通过</el-button>
        </div>
        <!-- 审批 -->
        <div class="btn approvalDoneBtn" v-if="$route.query.tag === 'payVerification'">
          <div class="btnChild">
            <el-button size="small" plain @click="submite(5,'审批通过')">审批通过</el-button>
            <el-button size="small" plain @click="submite(9,'审批驳回')">审批驳回</el-button>
            <!-- <el-button size="small" plain @click="mailSend(2,'附件查看')">附件查看</el-button> -->
            <el-button size="small" plain @click="submite(2,'指派','审批')">指派</el-button>
          </div>
        </div>

        <!-- step步骤条 -->
        <ul class="step" v-if="$route.query.tag === 'payVerification'">
          <li v-for="(item,index) in strArr" :key="item+index">
            <span class="status" ref="status">{{index+1}}</span>
            <span class="drc">{{item.wait}}</span>
          </li>
        </ul>

        <!-- 详情 -->
        <div :class="searchFlag===true?'searchNew':''" >
          <div class="titleSearch detailSearch" @click="searchFlag1 = !searchFlag1">
            <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>详情</div>
            <p class="info" style="color:#666;">流程编号: 
              <el-tooltip class="item" effect="dark" content="点击复制" placement="top">
                <span style="color:#000;" id="proNum" @click.stop="copy('proNum')">{{row.processId}}</span>
              </el-tooltip>
            </p>
          </div>
          <ul class="detail-ul" v-show="searchFlag1">
            <li v-for="(item,i) in listData" :key="i" class="detail-item">
              <span class="detail-name">{{item.a}} : </span><span class="detail-content">{{item.b}}</span>
            </li>
          </ul>
        </div>
        <div :class="searchFlag===true?'searchNew':''"  style="border-bottom:none;margin-top:16px;">
            <div class="titleSearch detailSearch" @click="searchFlag2 = !searchFlag2">
              <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>附件列表</div>
                <p v-if="$route.query.tag != 'payClose'&&$route.query.tag != 'payReview' && $route.query.tag != 'payReview' && $route.query.tag != 'payVerification'">
                  <el-button size="mini" @click="mailSend(1,'上传附件')"><i style="margin-right:8px;" class="iconfont iconGroup75"></i>上传</el-button>
                </p>            
              </div>
              <el-table :data="fileData" border style="width:100%;min-height:350px;max-height:500px;" class="document">
                <el-table-column label="文件名" width="200">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top">
                      <span :class="{'smallHand':scope.row.suffix!='eml'}" class="abbreviate" @click="docView(scope.row)">{{scope.row.docName}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="时间" width="160"></el-table-column>
                <el-table-column label="任务来源" width="140">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="nameList[scope.row.createdBy]" placement="top">
                      <span class="abbreviate">{{nameList[scope.row.createdBy]}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="操作" v-show="$route.query.tag=='payOperation' || $route.query.tag =='approvalDone' || $route.query.tag=='payReview'">
                  <template slot-scope="scope">
                    <el-button v-show="$route.query.tag=='payOperation' || $route.query.tag =='approvalDone' || $route.query.tag=='payReview'" @click.stop="detailRemove(scope.row)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </div>
      </el-col>
      <el-col :span="13">
        <div class="right">
          <div class="titleSearch detailSearch">
            <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>文档预览</div>
              <el-button size="small">
                <i style="margin-right:8px;" class="iconfont iconGroup26"></i>
                <a href="../../../static/Preview/index.html" target="_blank">全屏</a>
              </el-button>
            <!-- <el-button class="rotate" size="mini" @click="rotateMua">顺时针旋转</el-button>
            <el-button class="rotate" size="mini" @click="rotateMuas">逆时针旋转</el-button> -->
            <!-- <p v-if="$route.query.tag != 'payClose'&&$route.query.tag != 'payReview' && $route.query.tag != 'payReview' && $route.query.tag != 'payVerification'">
              <el-button size="mini" @click="mailSend(1,'上传附件')"><i style="margin-right:8px;" class="iconfont iconGroup75"></i>上传</el-button>
            </p> -->
          </div>
          <div class="browseDoc">
            <!-- <iframe :src="'/static/pdf/web/viewer.html?file='+path" style="width:100%;height:-webkit-fill-available;" frameborder="0"></iframe> -->
            <iframe src="../../../static/Preview/index.html" id="iframeId" name="ifrmname" ref="mapFrame" style="width:100%;height:100%" frameborder="0"></iframe>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 支票信息 -->
    <el-row v-if="$route.query.tag !== 'payOperation' && $route.query.tag !== 'payVerification'" style="padding:0 16px;">
      <el-col :span="24">
        <div class="titleSearch detailSearch" style="margin-bottom:10px;" @click="searchFlag2 = !searchFlag2">
          <div><i style="margin-right:8px;"  :class="searchFlag2===false?'el-icon-arrow-down':'el-icon-arrow-up'"></i>支票信息</div>
          <p v-if="$route.query.tag === 'approvalDone'"><el-button size="mini" @click="getRMSg"><i style="margin-right:8px;" class="iconfont iconGroup77"></i>SICS回写</el-button></p>
        </div>
         <el-collapse-transition>
        <el-table v-show="searchFlag2" :data="RMData" style="width:100%" border>
          <el-table-column label="支票号" width="110">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.rmId" placement="top-start">
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
              <el-tooltip class="item" effect="dark" :content="Number(scope.row.chargesAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')" placement="top-start">
                <span class="abbreviate">{{Number(scope.row.chargesAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="支票状态">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.rmStatusName+'-'+scope.row.rmStatus" placement="top-start">
                <span class="abbreviate">{{scope.row.rmStatusName}}-{{scope.row.rmStatus}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="核销状态">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.setlmntInd" placement="top-start">
                <span class="abbreviate">{{scope.row.setlmntInd}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="paymentType" label="支付方式"></el-table-column>
          <el-table-column label="流程编号">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.processId" placement="top-start">
                <span class="abbreviate">{{scope.row.processId}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="baseCompany" label="Base Company" width="130"></el-table-column>
          <el-table-column label="银行账户">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.bankAccountName" placement="top-start">
                <span class="abbreviate">{{scope.row.bankAccountName}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="支票类型" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.rmType=='R'?'收款':'付款'}}</span>
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
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <el-button @click="onOpenSICS(scope.row,'rmId')" v-if="$route.query.tag === 'payClose' || $route.query.tag === 'payment' || $route.query.tag === 'instancyPay' || $route.query.tag === 'partialDone'" type="text" size="small">Reverse</el-button>
              <el-button @click="onOpenSICS(scope.row,'rmId')"  type="text" size="small">打开SICS</el-button>
              <el-button type="text" v-if="$route.query.tag === 'approvalDone'" @click.stop="chongXiao(scope.row)" size="mini">冲销</el-button>
            </template>
          </el-table-column>
        </el-table>
         </el-collapse-transition>
      </el-col>
    </el-row>
    <!-- 结算清单 -->
    <el-row style="padding:0 16px;">
      <el-col :span="24">
        <div class="titleSearch detailSearch" style="margin-bottom:10px;" @click="searchFlag3 = !searchFlag3">
          <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>结算清单</div>
          <p v-if="$route.query.tag === 'payOperation' || $route.query.tag === 'approvalDone'"><el-button size="mini" @click="getSGSg"><i style="margin-right:8px;" class="iconfont iconGroup77"></i>SICS回写</el-button></p>
        </div>
        <el-table v-show="searchFlag3" :data="SgData" style="width: 100%" border>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.worksheetDOList" style="width: 100%" border>
                <el-table-column label="账单号">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.wsId" placement="top-start">
                      <span class="abbreviate">{{scope.row.wsId}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="wsStatus" label="账单状态" width="100">
                  <!-- <template slot-scope="scope">{{scope.row.wsStatus=='O'?'Open':'Close'}}</template> -->
                </el-table-column>
                <el-table-column label="账单标题">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.wsTitle" placement="top-start">
                      <span class="abbreviate">{{scope.row.wsTitle}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="业务编号">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.businessId" placement="top-start">
                      <span class="abbreviate">{{scope.row.businessId}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="附件名称">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top-start">
                      <span :class="{'smallHand':scope.row.suffix!='eml'}" class="abbreviate" @click="docView(scope.row)">{{scope.row.docName}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="section">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.section" placement="top-start">
                      <span class="abbreviate">{{scope.row.section}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="uwYear" label="业务年度"></el-table-column>
                <el-table-column label="任务类型">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.businessType" placement="top-start">
                      <span class="abbreviate">{{scope.row.businessType}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="receiptDate" label="收到账单日期" width="120"></el-table-column>
                <el-table-column label="分出公司" width="120">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.cedentCode+'-'+scope.row.cedentName" placement="top-start">
                      <span class="abbreviate">{{scope.row.cedentCode}}-{{scope.row.cedentName}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="经纪公司" width="120">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.brokerCode+'-'+scope.row.brokerName" placement="top-start">
                      <span class="abbreviate">{{scope.row.brokerCode}}-{{scope.row.brokerName}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="wsType" label="账单类型"></el-table-column>
                <el-table-column prop="wsPeriod" label="账单期" width="100"></el-table-column>
                <el-table-column prop="businessOrigin" label="Business Origin" width="130"></el-table-column>
                <el-table-column prop="baseCompany" label="Base Company" width="130"></el-table-column>
                <el-table-column prop="dept" label="经营机构"></el-table-column>
                <el-table-column prop="wsCurrency" label="币制" width="50"></el-table-column>
                <el-table-column label="金额">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="Number(scope.row.wsAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')" placement="top-start">
                      <span class="abbreviate">{{Number(scope.row.wsAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="registBy" label="录入人" width="80"></el-table-column>
                <el-table-column prop="registAt" label="录入时间" width="100"></el-table-column>
                <el-table-column label="备注">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top-start">
                      <span class="abbreviate">{{scope.row.remark}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" @click.stop="openSICS(scope.row,'wsId')" size="mini">打开SICS</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="SG号">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.sgNum" placement="top-start">
                <span class="abbreviate">{{scope.row.sgNum}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="流程编号">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.processId" placement="top-start">
                <span class="abbreviate">{{scope.row.processId}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="支票号">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.rmId" placement="top-start">
                <span class="abbreviate">{{scope.row.rmId}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="bpCode" label="BP number" width="100"></el-table-column>
          <el-table-column label="BP名称">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.bpName" placement="top-start">
                <span class="abbreviate">{{scope.row.bpName}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="baseCompany" label="Base Company" width="130"></el-table-column>
          <el-table-column prop="businessOrigin" label="Business Origin" width="130"></el-table-column>
          <el-table-column prop="sgStatus" label="SG状态"></el-table-column>
          <el-table-column prop="settlementIndicator" label="结算指标" width="100"></el-table-column>
          <el-table-column prop="sgCurrency" label="币值"></el-table-column>
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
              <el-tooltip class="item" effect="dark" :content="scope.row.dueDate" placement="top-start">
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
              <el-tooltip class="item" effect="dark" :content="scope.row.sgType" placement="top-start">
                <span class="abbreviate">{{scope.row.sgType}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="参考">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.sgReference" placement="top-start">
                <span class="abbreviate">{{scope.row.sgReference}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="创建人" width="95"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.createdAt" placement="top-start">
                <span class="abbreviate">{{scope.row.createdAt}}</span>
              </el-tooltip>
            </template>
          </el-table-column> 
          <el-table-column  label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click.stop="openSGSICS(scope.row,'sgNum')" size="mini">打开SICS</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 账单信息 -->
    <el-row v-if="$route.query.tag === 'payClose' || $route.query.tag === 'partialDone'">
      <el-col :span="24">
        <div class="titleSearch detailSearch" style="margin-bottom:10px;" @click="searchFlag4 = !searchFlag4">
          <div>
            <i style="margin-right:8px;" :class="searchFlag4===false?'el-icon-arrow-down':'el-icon-arrow-up'"></i>账单信息
          </div>
          <p><i class="iconfont iconGroup26"></i></p>
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
      <el-form label-width="160px">
        <el-form-item label="选择驳回原因" v-show="title==='复核驳回' || title==='审批驳回'">
          <el-select v-model="opinion"  placeholder="请输入驳回原因" @change="changeOpinion">
            <el-option v-for="item in BHoptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因填写" v-show="title==='复核驳回' || title==='审批驳回'">
          <!-- <el-input :disabled="opinion!='其它'" type="textarea" :rows="2" placeholder="请输入原因" v-model="rebut"></el-input> -->
          <el-input type="textarea" :rows="2" placeholder="请输入原因" v-model="rebut"></el-input>
        </el-form-item> 
        <el-form-item label="输入悬停原因" v-show="title==='悬停'">
          <el-input type="textarea" :rows="2" placeholder="请输入悬停原因" v-model="pendingReason"></el-input>
        </el-form-item>
        <!-- <el-form-item label="原因填写" v-show="title==='审批驳回'">
          <el-input type="textarea" :rows="2" placeholder="请输入原因" v-model="rebut"></el-input>
        </el-form-item> -->
        <el-form-item label="选择处理人" v-show="putIn=='n'">
          <el-select v-model="assignee"  placeholder="请选择">
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="title === '指派'?'选择指派人':'选择处理人'" v-show="title === '指派' || putIn=='b'">
          <el-select v-model="assignee"  placeholder="请选择">
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username" :disabled="item.username == $store.state.userName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" plain @click="confirm" style="padding:0 16px;">确定</el-button>
          <el-button size="small" @click="dialogFormVisible3 = false" >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible4" :close-on-click-modal="modal">
      <el-form label-width="120px">
        <el-form-item label="选择附件" v-show="title ==='上传附件'">
          <el-upload
            class="upload-demo"
            action
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            :http-request='upload'
            :file-list="fileList">
            <el-button plain type="primary">上传</el-button>
          </el-upload>
          </el-form-item>
      </el-form>
      <el-table :data="TaxList" border style="width: 100%" class="document" v-show="title==='增值税信息获取'">
        <el-table-column prop="invoiceId" label="增值税号"></el-table-column>
        <el-table-column prop="rmId" label="支票号"></el-table-column>
        <el-table-column prop="sgNum" label="SG号"></el-table-column>
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

    <el-dialog title="指派" :visible.sync="dialogFormVisibleFHRWZF" :close-on-click-modal="modal">
      <el-form :label-position="labelPosition" label-width="160px">
        <el-form-item label="选择指派人">
          <el-select v-model="assignee"  placeholder="请选择">
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username" :disabled="item.username == $store.state.userName || item.username == row.entryOperator"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" plain @click="confirm" style="padding:0 16px;">确定</el-button>
          <el-button size="small" @click="dialogFormVisibleFHRWZF = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="支票创建" :visible.sync="dialogFormVisible" :close-on-click-modal="modal">
      <el-form :label-position="labelPosition" label-width="180px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign">
        <el-form-item label="Process ID">
          <el-input v-model.trim="formLabelAlign.processId" disabled style="width:194px"></el-input>
        </el-form-item>
         <el-form-item label="收/付款支票"> 
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
          <el-select v-model="formLabelAlign.baseCompany" placeholder="请选择" @change="bankCurrencyChange">
            <el-option v-for="item in baseCompanyList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Business Origin" prop="businessOrigin"> 
          <el-select v-model="formLabelAlign.businessOrigin" placeholder="请选择">
            <el-option v-for="item in businessOriginList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇款人" prop="brokerModel" v-show="formLabelAlign.rmType=='R'">
          <el-select filterable v-model="formLabelAlign.brokerModel" placeholder="请选择">
            <el-option
              v-for="(item,index) in brokerListHK"
              :key="index"
              :label="item.codecode+' - '+item.codeName"
              :value="index">
              <span style="float:left">{{ item.codecode }}</span>
              <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款人" prop="brokerModel" v-show="formLabelAlign.rmType=='P'">
          <el-select filterable v-model="formLabelAlign.brokerModel" placeholder="请选择" @change="bizhichange(0)">
            <el-option v-for="(item,index) in brokerList" :key="index" :label="item.codecode+' - '+item.codeName" :value="index">
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
        <el-form-item label="付款账户" prop="bankAccount1">
          <el-select v-model="formLabelAlign.bankAccount1" placeholder="请选择">
            <el-option v-for="(item,i) in BankAccountList" :key="i" :label="item.currency+'-'+item.bankName+'-'+item.accountNumber" :value="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起息日" prop="valueDate">
          <el-date-picker value-format="timestamp" v-model="formLabelAlign.valueDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="到期日" prop="dueDate">
          <el-date-picker value-format="timestamp" v-model="formLabelAlign.dueDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="币制/金额" required>
          <el-col :span="10">
            <el-form-item prop="bankCurrency">
              <el-select v-model="formLabelAlign.bankCurrency" placeholder="请选择" class="curAmount" @change="bizhichange(0)">
                <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="bankAmount">
              <input type="text" class="selfInput" v-model="formLabelAlign.bankAmount" @input="watchInput('bankAmount')">
              <!-- <el-input v-model="formLabelAlign.bankAmount" @input.native="watchInput('bankAmount')" class="curAmount"></el-input> -->
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="手续费币制/手续费金额">
          <el-col :span="10">
            <el-form-item>
              <el-select v-model="formLabelAlign.chargesCurrency" placeholder="请选择" class="curAmount">
                <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
              </el-select>
            </el-form-item>
          </el-col>         
          <el-col :span="10">
            <el-form-item>
              <input type="text" class="selfInput" v-model="formLabelAlign.chargesAmount" @input="watchInput('chargesAmount')">
              <!-- <el-input v-model="formLabelAlign.chargesAmount" @input.native="watchInput('chargesAmount')" class="curAmount"></el-input> -->
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button size="small" plain type="primary" @click="creatRM('formLabelAlign')" style="padding:0 16px;">确定</el-button>
          <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> 

    <el-dialog title="生成审批文档" width="60%" :visible.sync="dialogFormVisible2" :close-on-click-modal="modal">
      <el-form ref="makeDocList" :label-position="labelPosition" label-width="160px" :model="makeDocList">
        <el-form-item label="经纪公司">
          <el-select clearable filterable v-model="makeDocList.rmBrokerName" placeholder="请选择">
            <el-option v-for="(item,index) in brokerListS" :key="index" :label="item.codecode+' - '+item.codeName" :value="item.codeName">
              <span style="float:left">{{ item.codecode }}</span>
              <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分出公司">
          <el-col :span="10">
            <el-select clearable filterable v-model="makeDocListEctype.cedentModel[0]" placeholder="请选择">
              <el-option v-for="(item,index) in cedentList" :key="index" :label="item.codecode+' - '+item.codeName" :value="item.codeName">
                <span style="float:left">{{ item.codecode }}</span>
                <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-select clearable filterable v-model="makeDocListEctype.cedentModel[1]" placeholder="请选择">
              <el-option v-for="(item,index) in cedentList" :key="index" :label="item.codecode+' - '+item.codeName" :value="item.codeName">
                <span style="float:left">{{ item.codecode }}</span>
                <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-select clearable filterable v-model="makeDocListEctype.cedentModel[2]" placeholder="请选择">
              <el-option v-for="(item,index) in cedentList" :key="index" :label="item.codecode+' - '+item.codeName" :value="item.codeName">
                <span style="float:left">{{ item.codecode }}</span>
                <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="受款公司">
          <el-select clearable filterable v-model="makeDocListEctype.shoukuanMode" placeholder="请选择">
            <el-option v-for="(item,index) in bscBankList" :key="index" :label="item.compName" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原币币制/金额" required>
          <el-form-item>
            <el-select style="width:90%;height:40px;line-height:40px;" placeholder="请选择" multiple v-model="makeDocListEctype.yuanType" class="curAmount" @change="selectChange">
              <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="wrapInput" v-for="(item,i) in makeDocNum" :key='i'>
              <span class="bizhi">{{makeDocListEctype.yuanType[i]}}：</span>&nbsp;
              <el-input
                class="singleInput"
                type="number"
                v-model="makeDocListEctype.yuanNum[i]"
                placeholder="请输入金额"
                size="small"
              ></el-input>
              <span class="huilv">&nbsp;汇率：&nbsp;</span>
              <el-input
                class="huilvInput"
                type="number"
                v-model="makeDocListEctype.yuanHuiLv[i]"
                placeholder="请输入汇率"
                size="small"
              ></el-input>
            </div>
          </el-form-item>
        </el-form-item>
        <el-form-item label="折币币制/金额" required>
          <el-col :span="10">
            <el-form-item>
              <el-select v-model="makeDocListEctype.zheType" placeholder="请选择" class="curAmount" @change="zheTypeChange">
                <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-input v-model="makeDocListEctype.zheNum" class="curAmount"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="备注">     
          <el-input type="textarea" :rows="2" v-model="makeDocList.remark"></el-input>
        </el-form-item>
        <el-form-item label="付款简要情况" >
          <el-input type="textarea" :rows="2" v-model="makeDocList.conditions"></el-input>
        </el-form-item>
        <el-form-item label="是否受托" v-show="row.baseCompany==='P'">
          <el-radio-group v-model="makeDocList.authorizeFlag">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button size="small" type="primary" plain @click="makeDoc(2,'makeDocList')" style="padding:0 16px;">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'detailPay',
  data() {
      return {
        WSData: [],
        saveLevel:null,
        partBankAccountList:[],
        brokerListHK:[],
        recepitList:[],
        nameList:{},
        searchFlag1:true,
        searchFlag2:true,
        searchFlag3:true,
        searchFlag4:true,
        searchFlag5:true,
        modal:false,
        tableData:[],
        col:11,
        selsectList:[],
        makeDocNum:0,
        result:null,
        TaxList:[],
        SgData:[],
        RMData:[],
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
            d:'rmSettleCompanyName'
          },
          {
            a:'币制',
            b:'',
            c:'rmCurrency',
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
            a:'流程状态',
            b:'',
            c:'processStatus'
          },
        ],
        currencyRateList:[],
        path:'',
        putIn:null,
        value:[],
        value1:'',
        value9:'',
        value0:'',
        activeName: 'first',
        labelPosition:'right',
        dialogFormVisible3:false,
        dialogFormVisible4:false,
        dialogFormVisible:false,
        dialogFormVisible2:false,
        dialogFormVisibleA:false,
        dialogFormVisibleFHRWZF:false,
        title:'',
        currentPage3: 5,
        currentPage4: 2,
        hide:false,
        radio: '1',
        options:[],
        value:0,
        formLabelAlign:{
          rmType:'P',
          rmStatus:'',
          rmStatusName:'',
          processId:'',
          paymentType:'',
          partnerBankAccount:'',
          paymentTypeName:'',
          bankCurrency:'CNY',
          bankAmount:'',
          baseCompany:'',
          bankAccount:'', //objectId
          valueDate:'',
          dueDate:'',
          businessPartnerRef:'',
          businessOrigin:'',
          createdBy:'',
          brokerModel:null,
          chargesCurrency:'',
          chargesAmount:'',
          partnerCode:'',
          partnerName:'',
          bankCurrency:'',
          bankAccountName:'',
          bankAccount1:null,
          rmStatusIndex:'',
          bookingPeriodName:'',
          bookingPeriodCode:'',
          bookingYear:'',
          paymentTypeIndex:'Wire',
        },
        makeDocList:{
          remark:null,
          conditions:null,
          authorizeFlag:'N',
          rmBrokerName:null,
          rmCedentName:null,
          primitiveAmount:null, // 原币
          convertAmount:null, // 折币
          rmAmount:null,
          rmCurrency:null,
        },
        makeDocListEctype:{
          zheNum:null,
          zheType:null,
          yuanType:[],
          yuanNum:[],
          yuanHuiLv:[],
          cedentModel:[],
          shoukuanMode:null,
        },
        xtname:'',
        pendingReason:null,
        cedentList:[],
        rmStatusList:[{'n':'In Progress','v':'PROG'},{'n':'In Execution','v':'INEX'}],
        paymentTypeList: [ 
          { n: "Wire", v: "WIRE" , d:''},
          { n: "Void P-Wire", v: "VP_WIRE", d:'P'},
          { n:'Void R-Wire', v:'VR_WIRE', d:'R'}
        ],
        baseCompanyList:[],
        businessOriginList:[],
        brokerList:[],
        brokerListS:[],
        BankAccountList:[],
        rmCurrencyList:[],
        czState:false,
        hxState:false,
        TJRoptions:[],
        assignee:'',
        opinion:'',
        BHoptions:['金额','币制','SECTION','合同号','未决','ENTRYCODE','日期','其它'],
        rebut:'',
        accountCloseFlag:'0',
        mustData:{
          actOperator:'',
          processStatus:'',
          pageNumber:1,  // 页数
          pageSize:20,  //页面一次要展示的条数
          total:0, //总条数
        },
        bscBankList:[],
        emnuGetName:{
          '-1':'付款一级审批',
          0:'付款二级审批',
          1:'付款三级审批',
          2:'付款四级审批',
          3:'付款五级审批',
        },
        emnuTaskName:{
          0:'待一级审批',
          1:'待二级审批',
          2:'待三级审批',
          3:'待四级审批',
          4:'待五级审批',
        },
        file:[],
        fileList:[],
        fileData:[],
        strArr:[],
        rules:{
          rmStatusIndex: [
            { required: true, message: '请选择支票状态', trigger: 'blur' }
          ],
          businessOrigin: [
            { required: true, message: '请选择Business Origin', trigger: 'blur' }
          ],
          paymentTypeIndex: [
            { required: true, message: '请选择支付方式', trigger: 'blur' }
          ],
          baseCompany: [
            { required: true, message: '请选择Base Company', trigger: 'blur' }
          ],
          brokerModel: [
            { required: true, message: '请选择汇款人', trigger: 'blur' }
          ],
          bankAccount1: [
            { required: true, message: '请选择银行账户', trigger: 'blur' }
          ],
          bankCurrency: [
            { required: true, message: '请选择币制', trigger: 'blur' }
          ],
          chargesCurrency: [
            { required: true, message: '请选择手续费币制', trigger: 'blur' }
          ],
          valueDate: [
            { type: 'date', required: true, message: '请选择起息日', trigger: 'blur' }
          ],
          dueDate: [
            { type: 'date', required: true, message: '请选择到期日', trigger: 'blur' }
          ],
          input: [
            { required: true, message: '请输入汇款金额', trigger: 'blur' },
          ],
          bankAmount:[
            { required: true, message: '请输入金额', trigger: 'blur' }
          ],
          chargesAmount:[
            { required: true, message: '请输入手续费金额', trigger: 'blur' }
          ],
        },
        AllBankAccountList:[],
        flagJ:null,
        reverseRow:{},
      };
    },
  created(){
    sessionStorage.setItem('data',JSON.stringify({}));
    this.row = JSON.parse(this.$route.query.row);
    console.log(this.row,'row');
    // 查询单条数据，根据processId
    let param = {
      actOperator: this.$store.state.userName,
      pageNumber: 1,
      pageSize: 20,
      processId: this.row.processId,
      processType: "付款",
    }
    if(this.$route.query.tag === 'payOperation' || this.$route.query.tag === 'payClose'){
      this.$http.post('api/pay/teskClaim/list',param).then(res =>{
        if(res.status == 200 ){
          if(this.$route.query.tag === 'payOperation' && res.data.rows[0].processStatus == '已悬停'){
            this.czState = true;
          } else{ this.czState = false; }
          if(this.$route.query.tag === 'payClose' && res.data.rows[0].processStatus == '已悬停'){
            this.hxState = true;
          } else{ this.hxState = false; }
        }
      })
    }
    if(this.$route.query.tag === 'payVerification'){
      this.makeDocEcho();
    }
    this.formLabelAlign.valueDate = new Date().getTime();
    this.formLabelAlign.dueDate = new Date().getTime();
    this.nameList = JSON.parse(sessionStorage.getItem("nameList"));
  },
  mounted(){ 
    console.log(this.row,'this.row');
    this.mustData.actOperator = this.$store.state.userName;
    let strArr = [];
    if(this.$route.query.tag === 'payVerification'){
      this.$http.post("api/pay/activitiForPay/getAllLevel", {processId: this.row.processId})
      .then(res => {
        if (res.data > 0) {
          for (let i = 0; i < res.data; i++) {
            strArr.push({
              wait: `待${i + 1}级审批`
            });
          }
        } else {
          return;
        }
        this.strArr = strArr;
      });
    }
    setTimeout(()=>{
      // 分出人+经济人
      let bList = JSON.parse(sessionStorage.getItem('BrokerBankList'));
      let cList = JSON.parse(sessionStorage.getItem('CedentBankList'));
      this.brokerList = bList.concat(cList);
      let fcArr = JSON.parse(sessionStorage.getItem('CedentType'));
      let jArr = JSON.parse(sessionStorage.getItem('BrokerType'));
      this.brokerListHK = fcArr.concat(jArr);
      this.cedentList = fcArr;
      this.brokerListS = jArr;
      //获取币制
      this.rmCurrencyList = JSON.parse(sessionStorage.getItem('CurrencyList'));
      // 集团产再
      let objbc = JSON.parse(sessionStorage.getItem('baseCompany'));
      this.baseCompanyList = objbc.filter(el=>{ return el.code != 'Both' });
      // 国际国内
      this.businessOriginList = JSON.parse(sessionStorage.getItem('businessOrigin'));

      if(this.$route.query.tag === 'approvalDone'){ 
        // 获取银行账户列表
        this.AllBankAccountList = JSON.parse(sessionStorage.getItem('AllBankAccountList'));
        
      }
    },1000)

    this.mustData.processStatus = this.$route.query.row.processStatus;
    if(this.$route.query.tag === 'payOperation' && this.row.processStatus == '已悬停'){
      this.czState = true;
    }
    if(this.$route.query.tag === 'payClose' && this.row.processStatus == '已悬停'){
      this.hxState = true;
    }
    if(this.$route.query.tag === 'payOperation'){
      this.getCurrencyRateList();
      this.getBscBankInfo();
    }
    this.dataBaseSG();
    this.mailSend(2,'',1);
    this.listData.forEach(el=>{
      // console.log(el['b'],this.row[el['c']],'hyd')
      el['b'] = this.row[el['c']];
      if(el['a']=='任务来源'){ el["b"] = this.nameList[this.row[el["c"]]]; }
      if(el['a']=='结付公司'){ el["b"]=this.row[el['c']] + '-' + this.row[el['d']];}
    })
  },
  updated(){
    if(this.$route.query.tag === 'payVerification'){
      this.nextStep();
    }
  },
  methods: {
    chongXiao(row){
      this.$http.post("api/receipt/credOperation/creatWfCheckRemit",{rmId:row.rmId,createdBy:this.$store.state.userName}).then(res => {
          if (res.status == 200 && res.data.errorCode == 1) {
            this.$message({ message:res.data.errorMessage , type: "success" });
            this.dataBaseSG();
          } else if(res.data.errorCode == 0){ 
            this.$message({ type: "error",message: res.data.errorMessage});
           }
      })
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
    nextStep(){
      let oldStrArrCreInd=0;
      let drcArr = [...document.querySelectorAll(".drc")];
      let statusArr = [...document.querySelectorAll(".status")];
      oldStrArrCreInd = this.row.approvalLevel;
        this.$http
      .post("api/pay/activitiForPay/getAllLevel", {
        processId: this.row.processId
      }).then(res=>{
        this.saveLevel = res.data;
        for(var i=0;i<res.data;i++){
            oldStrArrCreInd--;
            if(drcArr[oldStrArrCreInd]==undefined){
              return
            }else{
              drcArr[oldStrArrCreInd].className = "drc success";
              statusArr[oldStrArrCreInd].className = "status success";
              statusArr[oldStrArrCreInd].innerHTML = "✔";
              drcArr[oldStrArrCreInd].innerHTML = `${oldStrArrCreInd +1}级审批完成`;
            } 
        }
      })
       if(drcArr[this.row.approvalLevel]==undefined){
          return
        }else{
          drcArr[this.row.approvalLevel].className = "drc wait";
          statusArr[this.row.approvalLevel].className = "status pending";
        }
    },
    // rotateMua(){
    //   document.querySelector('.browseDoc').className='browseDoc mua'
    // },
    //  rotateMuas(){
    //   document.querySelector('.browseDoc').className='browseDoc muas'
    // },
    urgencyPay(){
      this.$confirm('是否紧急付款？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
            ,{processId:this.row.processId, 
              procInstId:this.row.processInstId, 
              assignee:this.$store.state.userName, 
              actOperator:this.$store.state.userName,
              accountCloseFlag:'1',
              type:'EMAIL',
              })
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.$router.push({name:this.$route.query.tag}); 
              } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
              }
            })
        
      })
    },
    openSGSICS(row){
      this.$http
        .post("api/pay/activitiForPay/getAllLevel", {
          processId: this.row.processId
        })
        .then(res => {
          let oldStrArrCreInd = this.row.approvalLevel;
          if (this.row.approvalLevel > res.data) {
            this.row.approvalLevel = res.data;
          } else {
            if (oldStrArrCreInd < this.row.approvalLevel + 1) {
              let timer = setInterval(function() {
                oldStrArrCreInd--;
                if (oldStrArrCreInd <= 0) {
                  clearInterval(timer);
                }
                drcArr[oldStrArrCreInd].className = "drc success";
                statusArr[oldStrArrCreInd].className = "status success";
                statusArr[oldStrArrCreInd].innerHTML = "✔";
                drcArr[oldStrArrCreInd].innerHTML = `${oldStrArrCreInd +
                  1}级审批完成`;
              }, 0);
            }
            if (
              drcArr[oldStrArrCreInd].classList.contains("drc success") ===
              false
            ) {
              drcArr[this.row.approvalLevel].className = "drc wait";
              statusArr[this.row.approvalLevel].className = "status pending";
            }
          }
        });
    },
    copy(id){
      let Url2=document.getElementById(id).innerText;
      let oInput = document.createElement('input');
      oInput.value = Url2;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = 'oInput';
      oInput.remove();
      this.$message({message: '复制成功',type: 'success'});
    },
    tongbu(){
      this.getRMSg();
      this.getSGSg();
    },
    getBscBankInfo(){
      this.$http.post('api/othersDO/bscBankInfo/list',{}).then(res =>{
        if(res.status === 200 && res.data.rows){
          this.bscBankList = res.data.rows;
        }
      })
    },
    getCurrencyRateList(){
      this.$http.post('api/sics/basis/getCurrencyRateList').then(res =>{
        if(res.status == 200 && res.data){
          this.currencyRateList = res.data;
        }
      })
    }, 
    filterCurrencyRateList(p,s){ // p为原币币制 s为折币币制
      let obj = this.currencyRateList.filter(el=>{
        return el.primCurrency==p && el.scndryCurrency==s
      })
      return obj.length?obj[0]['rate']:null;
    },
    changeOpinion(){
      if(this.opinion!='其它'){ this.rebut = null; }
    },
    onRemitCreat(){
      // if(!this.row.baseCompany){
      //   this.$message.error('Base Company无数据，请返回编辑');
      //   return false;
      // }
      this.rmWriteBack(); 
      this.dialogFormVisible = true;
      this.bankCurrencyChange();
      this.recepitBankList();
    },
    onOpenSICS(row,id){
      if(id == 'rmId'){
        this.$http.post('api/sics/liveDesktop/openRemittance',{modifiedBy:this.$store.state.userName,remitId:row.rmId}).then(res =>{
          console.log(res,'打开SICS')
        })
      } else{
        this.$http.post('api/sics/liveDesktop/openWorksheet',{modifiedBy:this.$store.state.userName,worksheetId:row[id]}).then(res =>{
          console.log(res,'打开SICS')
          // if(res.status === 200 && res.data.rows){
          //   this.SICSData = res.data.rows;
          // }
        })
      }
      
    },
    openSICS(){  // 打开SICS
      if(!this.row.rmSettleCompanyCode){
        this.$message({type: 'error', message:'process中rmSettleCompanyCode无值，打不开'});
        return false;
      }
      this.$http.post('api/sics/liveDesktop/openBpLedger',{modifiedBy:this.mustData.actOperator,bpId:this.row.rmSettleCompanyCode}).then(res =>{
        console.log(res,'打开SICS');
      })
    },
    dataBaseSG(){
      this.$http.post('api/sics/basis/getSGAndRemitList',{processId:this.row.processId}).then(res =>{
        console.log(res,'dataBaseSG');
        if(res.status === 200){
          this.SgData = res.data.worksheetsgDOlist;
          this.RMData = res.data.remitDOlist;
          this.WSData = res.data.workSheetDOlsit;
        }
      })
    },
    getRMSg(){
      if(this.RMData){
        let rmIds = '';
        this.RMData.forEach(el=>{
          rmIds += `${el.rmId},`
        })
        this.$http.post('api/sics/basis/getPayRemitFromSics',{actOperator:this.mustData.actOperator,rmIds:rmIds,processId:this.row.processId}).then(res =>{
          // console.log(res,'getSg');
          if(res.status === 200){
            // this.SgData = res.data.worksheetsgDOlist;
            this.RMData = res.data.remitDOlist;
            this.WSData = res.data.workSheetDOlsit
          }
        })
      } else{ this.$message.error('无账单，无法更新信息'); }
      
    },
    getSGSg(){
      this.$http.post('api/sics/basis/getWSAndSGfromSics',{actOperator:this.mustData.actOperator,processId:this.row.processId}).then(res =>{
        // console.log(res,'getSg');
        if(res.status === 200){ 
          this.SgData = res.data.worksheetsgDOlist;
          // this.RMData = res.data.remitDOlist;
        }
      })
    },
    getName(name) {
      this.$http.post('api/activiti/getAssigneeName',{roleName:name}).then(res =>{
        if(res.status === 200){
          this.TJRoptions = res.data;
        }
      })
    },
    gangUp(name){
      this.pendingReason = null;
      if(name === '操作'){
        if(!this.czState){
          this.title = '悬停';
          this.dialogFormVisible3 = true;
          this.flag = 13;
          this.xtname = name;
          // this.$confirm('是否状态挂起？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          //   }).then(() => {
          //     this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
          //     ,{processId:this.row.processId, 
          //     procInstId:this.row.processInstId, 
          //     assignee:this.$store.state.userName, 
          //     type:'PENDING',
          //     actOperator:this.$store.state.userName})
          //     .then(res =>{
          //       console.log(res,'悬停');
          //     if(res.status === 200 && res.data.errorCode == 1){
          //       this.czState = !this.czState;
          //     } else if(res.data.errorMessage){
          //       this.$message.error(res.data.errorMessage);
          //     }
          //   })
          // })
        } else{  // 恢复
            this.$confirm('是否恢复？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              this.$http.post('api/pay/activitiForPay/commonActivitiForPay',
              {processId:this.row.processId, 
              procInstId:this.row.processInstId, 
              assignee:this.$store.state.userName, 
              type:'RECOVERY',
              actOperator:this.$store.state.userName})
              .then(res =>{
                console.log(res,'恢复');
              if(res.status === 200 && res.data.errorCode == 1){
                this.czState = !this.czState;
              } else if(res.data.errorMessage){
                this.$message.error(res.data.errorMessage);
              }
            })
          })
        }

      } else{  // 核销
        if(!this.hxState){
          this.title = '悬停';
          this.dialogFormVisible3 = true;
          this.flag = 13;
          this.xtname = name;
          // this.$confirm('是否状态挂起？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          //   }).then(() => {
          //     this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
          //     ,{processId:this.row.processId, 
          //     procInstId:this.row.processInstId, 
          //     assignee:this.$store.state.userName, 
          //     type:'PENDING',
          //     hasRecheckFlag:'1',
          //     actOperator:this.$store.state.userName})
          //     .then(res =>{
          //       console.log(res,'悬停');
          //     if(res.status === 200 && res.data.errorCode == 1){
          //       this.hxState = !this.hxState;
          //     } else if(res.data.errorMessage){
          //       this.$message.error(res.data.errorMessage);
          //     }
          //   })
          // })
        } else{  // 恢复
            this.$confirm('是否恢复？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              this.$http.post('api/pay/activitiForPay/commonActivitiForPay',
              {processId:this.row.processId, 
               procInstId:this.row.processInstId,
               assignee:this.$store.state.userName,
               hasRecheckFlag:'1',
               type:'RECOVERY',hasRecheckFlag:'1',actOperator:this.$store.state.userName})
              .then(res =>{
                console.log(res,'恢复');
              if(res.status === 200 && res.data.errorCode == 1){
                this.hxState = !this.hxState;
              } else if(res.data.errorMessage){
                this.$message.error(res.data.errorMessage);
              }
            })
          })
        }
      }
    },
    acountquery(){   // 开关账查询
      this.$http.get('api/administrator/conifg/acountquery',{}).then(res =>{
        console.log(res,'开关账');
          if(res.status === 200){
            this.accountCloseFlag = res.data.accountCloseFlag;
          }
        })
    },
    submite(tag,name,specialName,getname){
      this.flag = tag;
      this.title = name;
      this.assignee = null;
      switch(tag){
        case 1:   // 流程提交
          if(this.$route.query.tag === 'payOperation'){
            this.$http.post('api/worksheet/sortOperation/listDocument'
            ,{actOperator:this.$store.state.userName,
            processId:this.row.processId,
            pageNumber:1,
            pageSize:100, 
            }).then(res =>{
                if(res.data.rows && res.data.rows.length){
                // this.fileData = res.data.rows;
                let arr5 = res.data.rows;
                arr5.forEach(el=>{
                  if(el.docName){
                    let suffix = el.docName.split('.');
                    el['suffix'] = suffix[suffix.length-1];
                  }
                })
                this.fileData = arr5;
                let arr = this.fileData.filter(el=>{
                  return el.docType == 'S0';
                })
                if(arr.length){ 
                  this.getName(getname);
                  this.dialogFormVisible3 = true;
                 } else{ this.$message.error('请先生成审批文档'); }
              } else{ this.$message.error('请先生成审批文档'); }
            })
          } else if(this.$route.query.tag === 'payClose'){
            this.$http.post('api/sics/basis/getWFMessage',{processId:this.row.processId,actOperator:this.$store.state.userName,hasRecheckFlag:this.row.hasRecheckFlag}).then(res =>{
              if(res.data.code == 1 && res.data.msg){
                this.$message.error(res.data.msg);
                return false;
              } else {
                this.$confirm('是否核销通过？', '提示', {     
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                  }).then(() => {
                    this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
                      ,{processId:this.row.processId, procInstId:this.row.processInstId, assignee:this.$store.state.userName, type:'EMAIL',actOperator:this.$store.state.userName})
                      .then(res =>{
                        if(res.status === 200 && res.data.errorCode == 1){
                          this.dialogFormVisible3 = false;
                          this.$router.push({name:this.$route.query.tag}); 
                          this.assignee = null;
                        } else if(res.data.errorMessage){
                          this.$message.error(res.data.errorMessage);
                        }
                      })
                  })
              }
            })
          } else{
            this.getName('付款录入');
            this.dialogFormVisible3 = true;
          }
          
        break;
        case 2:  // 指派 
          this.specialName = specialName;
          if(this.specialName === '操作') {
            this.getName('付款录入');
          } else if(this.specialName === '支票'){   // 复核
            this.acountquery()
            let str =''; // 此处不能写三元运算
            if(this.accountCloseFlag == 1){
              str = '付款录入';
            } else if(this.accountCloseFlag == 0){
              str = '付款复核';
            }
            this.getName(str);
          } else if(this.specialName === '复核'){
            this.getName('付款复核');
          } else if(this.specialName === '审批'){
            this.getName(this.emnuGetName[this.row.approvalLevel-1]);
          }
          this.specialName === '复核'?this.dialogFormVisibleFHRWZF = true:this.dialogFormVisible3 = true;
        break;
        case 3:  // 置废     支票、操作    assign:auto
          this.$confirm('是否置废？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
            ,{processId:this.row.processId, procInstId:this.row.processInstId, assignee:this.$store.state.userName, type:'INACTIVE',actOperator:this.$store.state.userName})
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible3 = false;
                this.$router.push({name:this.$route.query.tag});
              }
            })
          })  
        break;
        case 4:  // 复核驳回
          this.dialogFormVisible3 = true;
        break;
        case 5:  // 审批通过 --------------
          let param = {
            processId:this.row.processId,
            actOperator:this.$store.state.userName,
            operatorLevel:this.row.approvalLevel+1,
            approvalName:sessionStorage.getItem('userCName')
          }
          this.$http.post('api/docOperation/addSignature',param).then(res =>{
            if(res.data.code == 0){
              this.$http.post('api/pay/activitiForPay/getNextStep',{processId:this.row.processId, approvalLevel:this.row.approvalLevel}).then(res =>{
                if(res.status == 200){
                  if(res.data){
                    // this.getName('付款录入');
                    this.$confirm('是否审批通过', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      confirmButtonClass:'confirmBtn',
                      type: 'warning'
                    }).then(() => {
                      this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
                      ,{processId:this.row.processId, 
                        procInstId:this.row.processInstId, 
                        assignee:this.row.entryOperator, 
                        type:this.$route.query.name,
                        actOperator:this.$store.state.userName,
                        approvalLevel:this.row.approvalLevel,
                        })
                      .then(res =>{
                        if(res.status === 200 && res.data.errorCode == 1){
                          this.dialogFormVisible3 = false;
                          this.$router.push({name:this.$route.query.tag}); 
                          this.assignee = null;
                        } else if(res.data.errorCode == 0){
                          this.$message({type: 'error', message:res.data.errorMessage }); 
                        }
                      })
                    })
                  } else{   
                    this.getName(this.emnuGetName[this.row.approvalLevel]);
                    this.dialogFormVisible3 = true;
                  }
                  
                }
              })
            } else if(res.data.code == 1 && res.data.msg){
              this.$message.error(res.data.msg);
            }
          })
        break;
        case 6:   // 复核通过  -------付款复核通过还缺 是否有支票的校验----7.15日，改为无选择人
          this.$http.post('api/sics/basis/getPayReviewMessage',{processId:this.row.processId}).then(res =>{
            if(res.status === 200 && res.data.code == 0){
              this.$confirm('确认复核通过？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                  this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
                  ,{processId:this.row.processId, procInstId:this.row.processInstId, assignee:this.row.entryOperator, type:this.$route.query.name,actOperator:this.$store.state.userName})
                  .then(res =>{
                    if(res.status === 200 && res.data.errorCode == 1){
                      this.dialogFormVisible3 = false;
                      this.$router.push({name:this.$route.query.tag}); 
                      this.assignee = null;
                    }  else if(res.data.errorCode == 0){
                      this.$message({type: 'error', message:res.data.errorMessage }); 
                    }
                  })
                })
            } else if(res.data.code == 1 && res.data.msg){
              this.$message.error(res.data.msg);
            }

          })
          
          // this.getName('付款录入');
          // this.dialogFormVisible3 = true;
        break;
        case 7:   // 付款支票页面---流程提交=审批完成，在这里查开关账
            if(this.RMData==null || !this.RMData.length){
              this.$message.error('无支票信息，请获取支票信息');
              return false;
            }
          this.acountquery()
          let type = '';
          if(this.accountCloseFlag == '0'){
            type = '付款复核';
          } else if(this.accountCloseFlag == '1'){
            type = '付款录入';
          }
          this.getName(type);
          this.dialogFormVisible3 = true;
        break;
        case 8:   // 财务支付/紧急付款/partial完结------流程提交
          this.getName('付款录入');
          this.specialName2 = specialName;
          this.dialogFormVisible3 = true;
        break;
        case 9:   // 审批驳回
          this.dialogFormVisible3 = true;
        break;
      }
      
    },
    confirm(){
      switch(this.flag) {
        case 1:  // 流程提交
          this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
            ,{processId:this.row.processId, procInstId:this.row.processInstId, assignee:this.assignee, type:this.$route.query.name,actOperator:this.$store.state.userName})
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible3 = false;
                this.$router.push({name:this.$route.query.tag}); 
                this.assignee = null;
              } else if(res.data.errorMessage){
                this.$message.error(res.data.errorMessage);
              }
            })
        break;
        case 2:  // 指派    操作、支票、复核、审批
          if(!this.assignee){
            this.$message.error('请选择指派人');
            return false;
          }
          let params = {processId:this.row.processId, 
                        procInstId:this.row.processInstId, 
                        assignee:this.assignee, 
                        taskName:'',
                        actOperator:this.$store.state.userName,
                        processInstanceKey:'taProcess03'
                      }
          if(this.specialName === '操作') {
            params.taskName = '待处理';
          } else if(this.specialName === '支票'){   // 复核
            params.taskName = '审批完成';
          } else if(this.specialName === '复核'){
             params.taskName = '待复核';
          } else if(this.specialName === '审批'){
             params.taskName = this.emnuTaskName[this.row.approvalLevel];
          }
          this.$http.post('api/activiti/setAssignee',params).then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible3 = false;
                this.dialogFormVisibleFHRWZF = false;
                this.$router.push({name:this.$route.query.tag});
                this.assignee = null;
              } else if(res.data.errorCode == 0 && res.data.errorMessage){
                this.$message.error(res.data.errorMessage);
              }
            })

        break;
        case 3:  // 置废 
          
        break;
        case 4: // 复核驳回 
          if(!this.opinion){
            this.$message.error('请选择驳回原因');
            return;
          }
          if(this.opinion == '其它' && !this.rebut){
            this.$message.error('请填写驳回原因');
            return;
          }
          this.$http.post('api/pay/activitiForPay/commonActivitiForPay',
            {processId:this.row.processId,
            procInstId:this.row.processInstId,
            assignee:this.row.entryOperator,
            opinion:`${this.opinion} ${this.rebut}`,
            type:'REJECT',
            hasRecheckFlag:'1',
            actOperator:this.$store.state.userName})
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible3 = false;
                this.$router.push({name:this.$route.query.tag});
              }
          })
        break;
        case 5:  // 审批通过
          if(!this.assignee){
            this.$message.error('请选择审批人');
            return false;
          }
          this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
            ,{processId:this.row.processId, 
              procInstId:this.row.processInstId, 
              assignee:this.assignee, 
              type:this.$route.query.name,
              actOperator:this.$store.state.userName,
              approvalLevel:this.row.approvalLevel,
              })
            .then(res =>{
              console.log(res)
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible3 = false;
                this.$router.push({name:this.$route.query.tag}); 
                this.assignee = null;
              } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
              }
            })
        break;
        case 6:  // 复核通过
          // if(!this.assignee){
          //   this.$message.error('请选择任务处理人');
          //   return false;
          // }
          // this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
          //   ,{processId:this.row.processId, procInstId:this.row.processInstId, assignee:this.assignee, type:this.$route.query.name,actOperator:this.$store.state.userName})
          //   .then(res =>{
          //     if(res.status === 200 && res.data.errorCode == 1){
          //       this.dialogFormVisible3 = false;
          //       this.$router.push({name:this.$route.query.tag}); 
          //       this.assignee = null;
          //     }  else if(res.data.errorCode == 0){
          //       this.$message({type: 'error', message:res.data.errorMessage }); 
          //     }
          //   })
        break;
        case 7:  // 付款支票--流程提交--审批通过
          let type2 = '';
          if(this.accountCloseFlag == '0'){
            type2 = 'RECHECK';
          } else if(this.accountCloseFlag == '1'){
            type2 = 'EMAIL';
          }
          if(!this.assignee){
            this.$message.error('请选择任务处理人');
            return false;
          }
          this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
            ,{processId:this.row.processId, 
              procInstId:this.row.processInstId, 
              assignee:this.assignee, 
              actOperator:this.$store.state.userName,
              accountCloseFlag:this.accountCloseFlag,
              type:type2,
              hasRecheckFlag:this.row.hasRecheckFlag?this.row.hasRecheckFlag:'0',
              })
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible3 = false;
                this.$router.push({name:this.$route.query.tag}); 
                this.assignee = null;
              } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
              }
            })
        break;
        case 8:  // 流程提交   ------ 财务支付/紧急付款/partial完结
          // if(this.specialName2 === 'payment'){
            let type1 = null;
            if(this.$route.query.tag === 'payClose'){
              if(this.row.accountCloseFlag == '0'){   
                type1 = 'COMPLETE';
              } else if(this.row.accountCloseFlag == '1'){
                type1 = 'CONDITIONALCOMPLETE';
              }
            } else if(this.$route.query.tag === 'partialDone'){
              type1 = 'COMPLETE';
            } else if(this.$route.query.tag === 'payment'){
              if(this.row.accountCloseFlag == '1'){
                type1 = 'CONDITIONALCOMPLETE';
              } else { type1 = 'COMPLETE'; }
            }
          // }
          if(!this.assignee){
            this.$message.error('请选择任务处理人');
            return false;
          }
          this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
            ,{processId:this.row.processId, 
            procInstId:this.row.processInstId, 
            assignee:this.assignee, 
            type:type1,
            actOperator:this.$store.state.userName,
            accountCloseFlag:this.row.accountCloseFlag
            })
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible3 = false;
                this.$router.push({name:this.$route.query.tag}); 
                this.assignee = null;
              } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
              }
            })
        break;
        case 9:   // 审批驳回
          if(!this.opinion){
            this.$message.error('请选择驳回原因');
            return;
          }
          if(this.opinion == '其它' && !this.rebut){
            this.$message.error('请填写驳回原因');
            return;
          }
          this.$http.post('api/pay/activitiForPay/commonActivitiForPay',
            {processId:this.row.processId,
            procInstId:this.row.processInstId,
            assignee:this.row.entryOperator,
            opinion:`${this.opinion} ${this.rebut}`,
            approvalLevel:this.row.approvalLevel,
            type:'REJECT',
            hasRecheckFlag:'0',
            actOperator:this.$store.state.userName})
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible3 = false;
                this.rebut = '';
                this.$router.push({name:this.$route.query.tag});
              } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
              }
          })
        break;
        case 13:  // 悬停
          if(!this.pendingReason){
            this.$message.error('请填写悬停原因');
            return false;
          }
          if(this.xtname === '操作'){
            this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
              ,{processId:this.row.processId, 
              procInstId:this.row.processInstId, 
              assignee:this.$store.state.userName,
              pendingReason:this.pendingReason,
              type:'PENDING',
              actOperator:this.$store.state.userName})
              .then(res =>{
                console.log(res,'悬停');
              if(res.status === 200 && res.data.errorCode == 1){
                this.czState = !this.czState;
                this.dialogFormVisible3 = false;
              } else if(res.data.errorMessage){
                this.$message.error(res.data.errorMessage);
              }
            })
          } else{
            this.$http.post('api/pay/activitiForPay/commonActivitiForPay'
              ,{processId:this.row.processId, 
              procInstId:this.row.processInstId, 
              assignee:this.$store.state.userName, 
              pendingReason:this.pendingReason,
              type:'PENDING',
              hasRecheckFlag:'1',
              actOperator:this.$store.state.userName})
              .then(res =>{
                console.log(res,'悬停');
              if(res.status === 200 && res.data.errorCode == 1){
                this.hxState = !this.hxState;
                this.dialogFormVisible3 = false;
              } else if(res.data.errorMessage){
                this.$message.error(res.data.errorMessage);
              }
            })
          }
        break;
      }
    },
    edit(){
      this.dialogFormVisible3 = true;
    },
    beforeAvatarUpload(file){
      this.file.push(file);
    },
    upload(file){
      let resFile = new FormData();
      resFile.append('file', this.file[0]);
      resFile.append('actOperator',this.$store.state.userName);
      resFile.append('processId', this.row.processId);
      this.$http.post('api/anyShare/fileOperation/uploadFilesForPage',resFile,{headers:{ 'Content-Type': "application/json;charset=UTF-8" }}).then(res =>{
        this.fileList = [];
        this.file = [];
        if(res.status === 200 && res.data.errorCode == 1){
          this.dialogFormVisible4 = false;
          this.$message({message: '上传成功',type: 'success'});
          this.mailSend(2);
        } else if(res.data.errorCode && res.data.errorCode == 0){
            this.$message.error(res.data.errorMessage);
          }
      })
    },
    mailSend(tag,name,init){
      if(tag == 2){  //附件查看   1为附件上传   ----刚进页面和上传后tag=2     // this.docView(this.fileData[0]);
        this.$http.post('api/worksheet/sortOperation/listDocument'
          ,{actOperator:this.$store.state.userName,
          processId:this.row.processId,
          pageNumber:1,
          pageSize:100, 
          }).then(res =>{
            if(res.status === 200){
              // this.fileData = res.data.rows;
              let arr4 = res.data.rows;
                arr4.forEach(el=>{
                  if(el.docName){ 
                    let suffix = el.docName.split('.');
                    el['suffix'] = suffix[suffix.length-1];
                  }
                })
                this.fileData = arr4;
                if(init){
                  let num = this.fileData.findIndex(el => { return el.suffix=='doc' || el.suffix=='DOCX' || el.suffix=='xlsx' || el.suffix=='PDF' || el.suffix=='pdf' || el.suffix=='XLSX'})
                  setTimeout(()=>{ this.docView(this.fileData[num]); },500)
                }
                
                
            }
          })
      } else{
        this.title = name;
        this.dialogFormVisible4 = true;
      }
    },
    watchInput(name){      
      if(!(/^\d+(\.\d{0,2})?$/.test(this.formLabelAlign[name]))){
        if(this.formLabelAlign[name]){
          // this.formLabelAlign[name] = this.formLabelAlign[name].substr(0,this.formLabelAlign[name].length-1);
          this.formLabelAlign[name] = '';
          this.$message.error('请输入数字，支持到小数点后两位');
        }
      }
    },
    detailRemove(row) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { 
        this.$http.post('api/anyShare/fileOperation/deleteFilesForPage',
        {docPath:row.docPath, docName:row.docName, processId:this.row.processId, actOperator:this.$store.state.userName})
        .then(res =>{
          this.mailSend(2,'附件查看');
          this.docView();
        })
      })
    },
    creatRM(formName){
      if(this.formLabelAlign.brokerModel != null){
        let arrList = [];
        this.formLabelAlign.rmType=='R'?arrList=this.brokerListHK:arrList=this.brokerList;
        let obj = arrList[this.formLabelAlign.brokerModel];
        this.formLabelAlign.partnerCode = obj.codecode;
        this.formLabelAlign.partnerName = obj.codeName;
      }
        let val = this.BankAccountList[this.formLabelAlign.bankAccount1];
        let val3 = this.rmStatusList[this.formLabelAlign.rmStatusIndex];
        
        if(val){
          this.formLabelAlign.bankAccount = val.objectId;
          this.formLabelAlign.bankAccountName = val.bankName;
        } 
        if(val3){
          this.formLabelAlign.rmStatus = val3.v;
          this.formLabelAlign.rmStatusName = val3.n;
        }
        let val2 = this.paymentTypeList[this.formLabelAlign.paymentTypeIndex];
        if(val2){
          this.formLabelAlign.paymentType = val2['v'];
          this.formLabelAlign.paymentTypeName = val2['n'];
        } else{
          this.formLabelAlign.paymentType = 'WIRE';
          this.formLabelAlign.paymentTypeName = 'Wire';
        }
       this.formLabelAlign.createdBy = this.$store.state.userName;
       this.$refs[formName].validate((valid) => {
        if(valid) {
          this.$http.post('api/receipt/credOperation/createRemit',Object.assign(this.formLabelAlign,this.mustData)).then(res =>{
            this.dialogFormVisible = false;
            if(res.status === 200 && res.data.errorCode == 1){
              this.$message({message: '创建成功',type: 'success'});
              // this.queryRM();
              this.dataBaseSG();
            } else if(res.data.errorCode == 0 && res.data.errorMessage){
              this.$message.error(res.data.errorMessage);
            }
          })
        }
       })
    },
    remitCreat(row){
      this.$http.post('api/sics/basis/creatPayRemitBySgNum',{sgNum:row.sgNum,actOperator:this.$store.state.userName,processId:this.row.processId}).then(res =>{
        if(res.status === 200 && res.data.code){
          this.$message.error(res.data.msg);
        } else{
          this.SgData = res.data.worksheetsgDOlist;
          this.RMData = res.data.remitDOlist;
          // this.dataBaseSG();
        }
      })
    },
    rmWriteBack(){
      // 不能写方法循环遍历，只能手写一点点对字段，有坑
      this.formLabelAlign.processId = this.row.processId;
      // 带过来的结付公司 === 汇款人
      if(this.row.rmSettleCompanyCode){
        this.brokerList.forEach((el,i)=>{
          if(el.codecode == this.row.rmSettleCompanyCode){
            this.formLabelAlign.brokerModel = i;
          }
        })
        }
      this.formLabelAlign.businessPartnerRef = this.row.processId;
      this.formLabelAlign.bankCurrency = this.row.rmCurrency;
      this.formLabelAlign.bankAmount = this.row.rmAmount;
      this.formLabelAlign.chargesCurrency = this.row.rmChargesCurrency;
      this.formLabelAlign.chargesAmount = this.row.rmChargesAmount;
      if(this.row.businessOrigin){
        let arr = this.businessOriginList.filter(el=>{ return el.name == this.row.businessOrigin })
        this.formLabelAlign.businessOrigin = arr[0]['code'];
      }
      if(this.row.baseCompany){
        let arr = this.baseCompanyList.filter(el=>{ return el.name == this.row.baseCompany })
        this.formLabelAlign.baseCompany = arr[0]['code'];
      }
      
      
    },
     recepitBankList(){ 
       if(this.formLabelAlign.brokerModel || this.formLabelAlign.brokerModel==0){
        this.recepitList = this.AllBankAccountList.filter(el=>{ return el.bpCode == this.brokerList[this.formLabelAlign.brokerModel]['codecode']});
        if (this.recepitList.length) {
          let arr1 = this.recepitList.filter(el => {
            return el.currency === this.formLabelAlign.bankCurrency;
          });
          if (arr1.length) {
            this.recepitList = arr1;
          } else {
              this.$message.error("选择的币制和收款账户不匹配");
            this.recepitList = [];
            this.formLabelAlign.partnerBankAccount = null;
          }
        }
      }
      // if(this.formLabelAlign.brokerModel || this.formLabelAlign.brokerModel==0){
      //   this.recepitList = this.AllBankAccountList.filter(el=>{ return el.bpCode == this.brokerListSk[this.formLabelAlign.brokerModel]['codecode']});
        
      // }
    },
    bizhichange(tag){
      if(tag==0 && this.formLabelAlign.rmType=='R'){   // 收款币制change,只校验银行账户
        this.bankCurrencyChange();
      } else{
        this.recepitBankList();
        this.bankCurrencyChange();
      }
      
    },    
    bankCurrencyChange(){   //  获取银行账户     bankCurrency 币制
      this.baseCompanyChange();
      this.formLabelAlign.bankAccount1 = null;
        if(this.BankAccountList.length){
          let arr1 =  this.BankAccountList.filter(el=>{
            return el.currency === this.formLabelAlign.bankCurrency;
          })
          if(arr1.length){ 
            this.BankAccountList = arr1; 
          } else{ 
            setTimeout(()=>{
              this.$message.error('选择的币制和银行账户不匹配'); 
            },500)
            
            this.BankAccountList = [];
          }
        }
       
    },
    baseCompanyChange(){
      if(this.AllBankAccountList.length){
        let Glist = [], Plist = [];
        this.AllBankAccountList.forEach(el=>{
          if(el.bpName === 'China Re Group'){ Glist.push(el); }
          if(el.bpName === 'China Re P&C'){ Plist.push(el); }
        })
        if(this.row.baseCompany === 'China Re Group'){  // 集团
          this.BankAccountList = Glist;
        } else if(this.row.baseCompany === "China Re P&C"){  // 产再
          this.BankAccountList = Plist;
        } else{
          this.BankAccountList = this.AllBankAccountList;
        }
      }
    },
    getTaxInfo(){  // 增值税信息获取
      this.title = '增值税信息获取';
      this.$http.post('api/vat/message/save',{processId:this.row.processId}).then(res =>{
        console.log(res,'getTaxInfo');
        if(res.status === 200){
          this.TaxList = res.data
          this.dialogFormVisible4 = true;
        } else{ this.$message.error('无数据或者后端报错'); }
      })
    },
    makeReport(){
      this.$http.post('api/sics/basis/getPairingExelByProcessId',{processId:this.row.processId}).then(res =>{
        console.log(res,'makeReport');
        if(res.status === 200 && res.data){
          this.$message({message:'生成核销报告成功',type: 'success'});
        }
      })
    },
    docView(row) {
      if(row){
        if(row.suffix && row.suffix=='eml'){ return false; }
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
      this.dialogFormVisible4 = false;
    },
    getObjectURL(file) {
        let url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        }
        return url;
    },
    selectChange(){
      if(this.makeDocListEctype.yuanType.length){
        this.zheTypeChange();
      } else{ this.makeDocListEctype.zheNum = null; }
    },
    zheTypeChange(){  // 折币币制改变 --- 改总折币金额 --- 改原币制的汇率
      // this.filterCurrencyRateList('CNY','iii')
      // 当原币币制不是CNY或者USD,都要转先转成美元，再转成折币的小币种
      if(this.makeDocListEctype.yuanType.length){
        let allNum = 0;
        this.makeDocListEctype.yuanNum.forEach((el,i)=>{
          // 遍历原币金额。。。
          if(el){
            let curType = this.makeDocListEctype.yuanType[i];
            if(curType!='CNY' && curType!='USD'){ 
              // 先把小汇率转为美元
              let val = this.filterCurrencyRateList('USD',curType);
              if(val){
                let USD = 1/val;
                // 再把美元转为另一个小汇率
                let val2 = this.filterCurrencyRateList('USD',this.makeDocListEctype.zheType);
                if(val2){ 
                  //如果是一个类型 这两个都是两个小数点
                  // if(curType==this.makeDocListEctype.zheType){
                  //    this.makeDocListEctype.yuanHuiLv[i] = Number(val2*USD)>0?Number(val2*USD).toFixed(2):null;
                  // }else{
                  //    this.makeDocListEctype.yuanHuiLv[i] = Number(val2*USD)>0?Number(val2*USD).toFixed(4):null;
                  // }
                  this.makeDocListEctype.yuanHuiLv[i] = Number(val2*USD)>0?Number(val2*USD).toFixed(4):null;
                  if(this.makeDocListEctype.yuanHuiLv[i] != null){
                    allNum += this.makeDocListEctype.yuanNum[i]/Number(1*this.makeDocListEctype.yuanHuiLv[i]);
                  }
                  // console.log(allNum)
                }
              }
            } else{  // 直接转换、、、
              let val3 = Number(this.filterCurrencyRateList(curType,this.makeDocListEctype.zheType))
              this.makeDocListEctype.yuanHuiLv[i] = Number(val3)>0?Number(val3).toFixed(4):null;
              if(this.makeDocListEctype.yuanHuiLv[i] != null){
                console.log(Number(this.makeDocListEctype.yuanNum[i])/Number(1*this.makeDocListEctype.yuanHuiLv[i]))
                allNum += Number(this.makeDocListEctype.yuanNum[i])/Number(1*this.makeDocListEctype.yuanHuiLv[i]);
              }
              // console(allNum,'++hyd')
            }
          }
        }) 
        this.makeDocListEctype.zheNum = allNum>0?Number(allNum).toFixed(2):null;
      }
    },
    makeDoc(tag,name){    // 生成审批文档
      if(tag == 'a'){  // 是操作页面，弹窗，S0,
          this.makeDocListEctype.cedentModel = [];
          this.$http.post('api/pay/teskClaim/list',{
            curOperator:this.$store.state.userName,
            processId:this.row.processId,
            pageNumber:1, 
            pageSize:20,
            processType:'付款',
            processStatus:'待处理'
            }).then(res =>{
            if(res.status === 200 && res.data.rows){
            //   此处填写生成审批文档 回显
            }
          })
       
        this.dialogFormVisible2 = true;
      } else {
        if (tag == 2) {
         if(this.makeDocListEctype.zheNum&&this.makeDocListEctype.yuanType.length>0){
            // 是操作页面,2为点击确定---------------------生成审批文档提交
            if(this.makeDocListEctype.cedentModel[0]==this.makeDocListEctype.cedentModel[1]&&this.makeDocListEctype.cedentModel[0]==this.makeDocListEctype.cedentModel[2]&&this.makeDocListEctype.cedentModel[1]==this.makeDocListEctype.cedentModel[2]){
              this.$message.error('三个分公司不能一样');
              return;
            }
          if (
            this.makeDocListEctype.cedentModel &&
            this.makeDocListEctype.cedentModel.length
          ) {
            this.makeDocList.rmCedentName = this.makeDocListEctype.cedentModel.join(
              "/"
            );
          }
          if(this.makeDocListEctype.shoukuanMode != null){
            this.makeDocList = Object.assign({},this.bscBankList[this.makeDocListEctype.shoukuanMode],this.makeDocList)
          }
          if(this.makeDocListEctype.zheNum){
            this.makeDocList.convertAmount = `${this.makeDocListEctype.zheType} ${this.makeDocListEctype.zheNum}`;
            this.makeDocList.rmAmount = `${this.makeDocListEctype.zheNum}`;
            this.makeDocList.rmCurrency = `${this.makeDocListEctype.zheType}`;
          }
          if(this.makeDocListEctype.yuanType.length){
            let arr = [];
            this.makeDocListEctype.yuanType.forEach((el,i)=>{
              // console.log(Number(this.makeDocListEctype.yuanNum[i]).toFixed(2),'hyd')
              let str = `${el} ${Number(this.makeDocListEctype.yuanNum[i]).toFixed(2)}`;
              arr.push(str);
            })
            this.makeDocList.primitiveAmount = arr.join(';');
          }

          console.log(this.makeDocList,'this.makeDocList');
          let param = Object.assign({},this.makeDocList,{
            processId:this.row.processId,
            actOperator:this.$store.state.userName,
            operatorLevel:0,
            rmSettleUser:sessionStorage.getItem('userCName'),
          })
          this.$http.post('api/docOperation/addSignature',param).then(res =>{
            if(res.data.code == 0){
                this.$http.post('api/worksheet/sortOperation/listDocument'
                  ,{actOperator:this.$store.state.userName,
                  processId:this.row.processId,
                  pageNumber:1,
                  pageSize:100, 
                  }).then(res =>{
                    if(res.status === 200 && res.data.rows && res.data.rows.length){
                      this.docView(res.data.rows[0]); 
                      this.mailSend(2);
                         this.$http.post('api/pay/teskClaim/list',
                         {pageNumber:1,  
                          pageSize:20,  
                          processType:'付款',
                          processId:this.row.processId
                          }
                          ).then(res =>{
                            // res.data.rows[0]
                            if(res.data.rows[0]){
                            this.listData.forEach(el=>{
                              el['b'] = res.data.rows[0][el['c']];
                              if(el['a']=='任务来源'){ el["b"] = this.nameList[this.row[el["c"]]]; }
                            })
                            }
                         })
                    }
                  })
                this.dialogFormVisible2 = false; 
                this.$message({type: 'success',message: '成功!' });
              } else if(res.data.code == 1 && res.data.msg){
                this.$message.error(res.data.msg);
              }
          })
         }else{
            this.$message.error('请输入原币和折币金额');
         }
        } else{   // 是审批页面，
          let param = {
            processId:this.row.processId,
            actOperator:this.$store.state.userName,
            operatorLevel:this.row.approvalLevel+1,
          }
          this.$confirm('确认审批','提示',{
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('api/docOperation/addSignature',param).then(res =>{
              if(res.data.code == 0){
                // this.makeDocEcho();
                this.$message({type: 'success',message: '成功!' });
              } else if(res.data.code == 1 && res.data.msg){
                this.$message.error(res.data.msg);
              }
            })
          })
        }
      }
          
    },
    makeDocEcho(){
      console.log('00000');
       this.$http.post('api/worksheet/sortOperation/listDocument'
        ,{actOperator:this.$store.state.userName,
        processId:this.row.processId,
        pageNumber:1,
        pageSize:100, 
        }).then(res =>{
          if(res.status === 200 && res.data.rows && res.data.rows.length){
            res.data.rows.forEach((el,i)=>{
              if(el.docType.substr(0,1) === 'S'){
                this.docView(res.data.rows[i]); 
              }
            })
            
          }
        })
    },

  },
   watch:{
    title:function(n,o){
      console.log(n,'nnnnnn'); // b可以选自己，n不可以，0开账，1关账，关账支票可选自己
      // title === '流程提交' || title==='审批通过' title === '复核通过'
      if(n === '流程提交' && this.$route.query.tag === 'payOperation'){
        this.putIn = 'b';
      } else if(n === '流程提交' && this.$route.query.tag === 'approvalDone' && this.row.accountCloseFlag=='0'){
        this.putIn = 'b';
      }
      else if(n === '流程提交'){
        this.putIn = 'n';
      } else if(n === '复核通过'){
        this.putIn = 'n';
      } else if(n === '审批通过'){
        this.putIn = 'n';
      } else{ this.putIn = false; }
    },
    // 监听原币币制
    'makeDocListEctype.yuanType':{
      handler:function(n,o){
        let nlength = 0,olength = 0;
        nlength = n?n.length:0;
        olength = o?o.length:0;
        if(nlength>olength){ //加
          this.makeDocNum+=1;
        } else if(nlength<olength){  // 减
          // 要删除掉 删除元素对应索引的金额
          o.forEach((el,i)=>{
            if(n.indexOf(el) == -1){
              this.makeDocListEctype.yuanNum.splice(i,1);
              this.makeDocListEctype.yuanHuiLv.splice(i,1);
              // console.log( this.makeDocListEctype.zheNum,'hyd')
              this.makeDocListEctype.zheNum = this.makeDocListEctype.zheNum
            }
          })
          this.makeDocNum-=1;
        }
      }
    },
    // 监听原币金额
    'makeDocListEctype.yuanNum':{
      handler:function(n,o){
        this.zheTypeChange();
      }
    },
    // 监听汇率
    'makeDocListEctype.yuanHuiLv':{
      handler:function(n,o){
        console.log('huilullllllllll')
        // console.log(this.makeDocListEctype.zheType,'hyd')
        if(this.makeDocListEctype.yuanNum.length){
          let all = 0;
          this.makeDocListEctype.yuanNum.forEach((el,i)=>{
            // this.makeDocListEctype.yuanHuiLv[i]汇率
            // el 是金额
            all += Number(Number(el)/this.makeDocListEctype.yuanHuiLv[i]) ;
          })
          // console.log(all,'--hyd')
          this.makeDocListEctype.zheNum = all>0?Number(all).toFixed(2):null;
        }
        
      }
    },
  }
 
}
</script>

<style scoped>
/* .mua{
 animation:rotateMua linear 0s;
  animation-fill-mode:forwards;
}
.muas{
 animation:rotateMuas linear 0s;
  animation-fill-mode:forwards;
}
@keyframes rotateMua{
  0%{
    transform: rotate(0deg)
  }
  100%{
    transform: rotate(90deg)
  }
}
@keyframes rotateMuas{
  0%{
    transform: rotate(90deg)
  }
  100%{
    transform: rotate(0deg)
  }
} */
.detailPay{
  width: 100%;
  padding-left: 64px;
  padding-bottom: 90px;
}
.credContent {
  width: 100%;
  display: flex;
}
.btn{
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
.btn .el-button{
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 10px;
  border: 1px solid #005C8D;
  background-color: #fff;
  color: #005C8D;
}
.btn .info{
  margin-right: 10px;
  color: #fff;
}
.btn .el-button.is-plain:focus, .btn .el-button.is-plain:hover {
    background: #f5f5f5;
    border-color: #f5f5f5;
    border: 1px solid #005C8D;
    /* color: #2B3E50; */
}
.detail-word {
  background-color: #ecf5ff;
  margin-top: 20px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.detail-word .title{
  font-weight: 700;
  font-size: 16px;
}
.browseDoc {
  background-color: #ecf5ff;
  width: 100%;
  height: 626px;
  border: 1px solid #D4D4D4;
  border-top: none;
}
.left {
  width: 100%;
  padding: 10px;
}
.right {
  width: 100%;
  height:100%;
  background-color: #EEEEEE;
}
.right2 {
  width: 100%;
  height: 100%;
}
.detail-ul{
  margin-left: 10px;
  padding: 10px 16px;
}
.detail-ul li{
  margin-bottom: 10px;
}
.detail-ul li .detail-content{
  color: #999;
}
.detail-ul li .detail-name{
  white-space: nowrap;
}
ul.detail-ul{
  display: flex;
  flex-wrap: wrap;
  margin-left: 0;
  background-color: #fff;
  margin-top: 10px;
}
li.detail-item{
  display: flex;
  width: 50%;
}
.fy2{
  text-align: right;
  margin-top: 20px;
}
.fy1{
  padding-left: 0;
}
.approvalWrap .word {
	font-weight: 700;
	padding: 5px;
  background: lightskyblue;
  border-radius: 8px;
  color: #333;
}
.arrow {
  margin: 2px;
  /* font-size: x-large; */
  color: lightskyblue;
}
.approvalDone, .approvalDoneBtn {
  display: flex;
  align-items: baseline;
  margin-right: 30px;
}
.approvalDoneBtn {
  justify-content: space-between;
}
.approvalWrap:nth-last-child(1) .arrow{
  display: none;
}
.goBack{
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  background-color: #2B3E50;
  color: rgb(255, 208, 75);
  display: flex;
  justify-content: space-between;
}
.selfInput{
  border: 1px solid #DCDFE6;
  width: 196px;
  border-radius: 4px;
  outline: none;
}
.el-col-10 {
  width: 27%;
  margin-right: 10px;
}
.wrapInput{
  height: 37px;
  padding:2px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: #f9f9f9;
  margin-top: 3px;
}
.wrapInput span{
  height: 37px;
}
.wrapInput .huilvInput,.wrapInput .singleInput{
  flex: 1;
  height: 37px;
}
.wrapInput .huilvInput input.el-input__inner,.wrapInput .singleInput  input.el-input__inner{
  border: none;
  height: 37px;
}
/* .wrapInput >.singleInput{
  border: none;
  height: 37px;
  outline: none;
  margin-right: 20px;
}
.wrapInput >.singleInput>.el-input__inner{
  height: 37px !important;
} */
.smallHand {
  cursor: pointer;
  color:#409EFF;
}
.detailSearch{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.step {
  display: flex;
}
.step .drc {
  margin-right: 16px;
  color: rgba(0, 0, 0, 0.45);
}
.step .drc.success {
  color: rgba(0, 0, 0, 0.65);
}
.step .drc.wait {
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
}
.step .status {
  display: inline-block;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  border-radius: 50%;
  color: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 12px;
}
.step .status.pending {
  background: rgba(0, 92, 141, 1);
  color: #fff;
}
.step .status.success {
  border: 1px solid #005c8d;
  color: #005c8d;
}
</style>