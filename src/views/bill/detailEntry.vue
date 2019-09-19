<template> 
  <div class="detailEntry" :class="changeLayoutflag?'changeLayoutflag':'changeLayoutflags'">
    <!-- <router-link
      :to="{name:$route.query.tag}"
      :class="this.$store.state.flod?'leftBack':'rightBack'">
      <i class="iconfont iconleft-circle-o" style="color:#000;"></i>
    </router-link> -->
    <el-row style="padding-bottom:10px;background:#fff;" :class="changeLayoutflag?'':'changeLayoutflags'">
      <el-col :span="8" :class="changeLayoutflag?'':'changeLayoutflags'">
        <!-- 签回 -->
        <div :class="this.$store.state.flod?'btn':'btns'" v-if="$route.query.tag === 'billSignBack'">
          <el-button size="small" @click="mailSend(1)" plain>邮件通知</el-button>
          <el-button size="small" plain @click="submit(7)">标记签回</el-button>
          <el-button size="small" @click="onSics()">账单回写</el-button>
          <el-button size="small" plain @click="submit(6,'签回提交')">流程结束</el-button>
          <el-button size="small" @click="exportBill">导出账单</el-button>
        </div>
        <!-- 录入 -->
        <div :class="this.$store.state.flod?'btn':'btns'" v-if="$route.query.tag === 'billEntry'">
          <el-button size="small" :disabled="isHover" @click="submit(4)" plain>置废</el-button>
          <el-button size="small" :disabled="isHover" @click="submit(1,'录入指派')" plain>指派</el-button>
          <el-button :type="isHover?'info':''" size="small" @click="submit(5)" plain>{{isHover?'已悬停':'状态悬停'}}</el-button>
          <el-button @click="dialogFormVisible = true" :disabled="isHover" size="small" plain>拆分</el-button>
          <el-button plain :disabled="isHover" size="small" @click="onSics()">账单回写</el-button>
          <el-button plain :disabled="isHover" size="small" @click="exportBill">导出账单</el-button>
          <el-button plain :disabled="isHover" size="small" @click="submit(6,'录入提交')">流程提交</el-button>
          <el-button plain :disabled="isHover" size="small" @click="changeLayout">更改布局</el-button>
          <!-- <el-button plain :disabled="isHover" size="small" @click="catastrophe()">巨灾录入</el-button> -->
          <!-- <el-button plain :disabled="isHover" size="small" @click="onCleanCut()">Clean-Cut</el-button> -->
        </div>
        <!-- 复核 -->
        <div :class="this.$store.state.flod?'btn':'btns'" v-if="$route.query.tag === 'billCheck'">
          <el-button size="small" @click="submit(1,'复核指派')" plain>指派</el-button>
          <el-button size="small" @click="submit(8)" plain>复核驳回</el-button>
          <el-button size="small" @click="submit(3)" plain>复核通过</el-button>
          <el-button size="small" @click="onSics()">账单回写</el-button>
          <el-button size="small" @click="exportBill">导出账单</el-button>
          <el-button plain :disabled="isHover" size="small" @click="changeLayout">更改布局</el-button>
          <!-- <el-button plain :disabled="isHover" size="small" @click="catastrophe()">巨灾录入</el-button> -->
          <!-- <el-button plain :disabled="isHover" size="small" @click="onCleanCut()">Clean-Cut</el-button> -->
        </div>
        <div class="left" style="height:100%;width:98%;">
          <div class="leftTop" style="background:#fff;margin-bottom:10px;padding:0 0 10px 0;">
            <div class="titleSearch detailSearch searchNewss" @click="searchFlag1 = !searchFlag1">
                <div>
                  <i style="margin-right:8px;" class="el-icon-arrow-down"></i>详情
                </div>
                <p class="info" style="color:#666;">流程编号:
                  <el-tooltip class="item" effect="dark" content="点击复制" placement="top">
                    <span
                      style="color:#000;"
                      id="proNum"
                      @click.stop="copy('proNum')"
                    >{{chooseRow.processId}}</span>
                  </el-tooltip>
                </p>
            </div>
            <ul class="detail-ul" v-show="searchFlag1">
                <li v-for="(item,i) in listData" :key="i" class="detail-item">
                  <span class="detail-name">{{item.a}} :</span>
                  <el-tooltip effect="dark" :content="item.b" placement="top">
                    <span
                      class="detail-content abbreviate"
                    >{{item.b}}</span>
                  </el-tooltip>
                </li>
            </ul>
          </div>
          <div :class="searchFlag2===true?'searchNew searchNews':''" style="height:48%;">
            <div class="titleSearch detailSearch" @click.stop="searchFlag2 = !searchFlag2">
              <div>
                <i style="margin-right:8px;" class="el-icon-arrow-down"></i>附件列表
              </div>
              <p v-if="$route.query.tag === 'billEntry'">
                <el-button size="small" :disabled="isHover" @click="mailSend(2)">
                  <i style="margin-right:8px;" class="iconfont iconGroup75"></i>上传
                </el-button>
              </p>
            </div>
              <!-- :header-row-class-name="StableClass" -->
            <el-table
              v-show="searchFlag2"
              border
              height="390px"
              max-height="390px"
              :data="tableData.slice((currentPage-1)*7,currentPage*7)"
              style="width: 100%;"
              class="document">
              <el-table-column label="文件名" align="center" ref="redSpanPar">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">{{scope.row.docName}}<br/>{{scope.row.remark}}</div>
                    <!-- <span :class="{'smallHand':scope.row.suffixFlag}" class="abbreviate" @click="docView(scope.row)" v-if="!scope.row.suffixFlag">{{scope.row.docName}}</span> -->
                    <span :class="scope.row.suffixFlag?'smallHand BlueColor':''" class="abbreviate" @click="docView(scope.row,scope.row.redFlag.index)" ref="redSpan" :data-index="currentPage+'-'+scope.row.redFlag.index"><span :class="scope.row.redFlag.flag?'abbreviateRed':''">{{scope.row.docName}}</span></span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="createdAt" label="时间" width="160"></el-table-column> -->
              <!-- <el-table-column label="任务来源" width="140">
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
              </el-table-column> -->
              <el-table-column label="操作" width="80" align="center">
                <template slot-scope="scope">
                  <el-dropdown placement="top-start">
                    <span class="el-dropdown-link"><i class="iconfont iconcaozuoliebiao"></i></span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <span class="blueColor" v-show="$route.query.tag !== 'billWorkSheet' && $route.query.tag !== 'billProcess' && $route.query.tag !== 'billSignBack' && $route.query.tag !== 'billCheck'"
                        @click.stop="handleClick(2,scope.row)">OCR</span>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <span class="blueColor" v-show="$route.query.tag !== 'billWorkSheet' && $route.query.tag !== 'billProcess' && $route.query.tag !== 'billSignBack' && $route.query.tag !== 'billCheck'"
                        @click.stop="handleClick(1,scope.row)">删除</span>
                      </el-dropdown-item>
                      <el-dropdown-item> 
                        <span class="blueColor" @click.stop="handleClick(3,scope.row)">下载</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              layout="prev, pager, next"
              style="padding:4px 0;margin-top:10px;float:right;"
              :page-size="7"
              :current-page="currentPage"
              @current-change="handleCurrentChange"
              :total="tableData.length">
            </el-pagination>
          </div>
        </div>
      </el-col>
      <!-- padding-bottom:10px; -->
      <el-col :span="16" :class="changeLayoutflag?'':'changeLayoutflags'">
          <ul class="rotuta" style="background:#fff;" v-if="activeName==='first'">
            <a href="../../../static/Preview/index.html" target="_blank"><li><i class="iconfont iconquanping" style="color:#000;font-size:18px;"></i></li></a>
            <li @click="rotateMua"><i class="iconfont iconshunshizhenxuanzhuan" style="color:#000;font-size:18px;"></i></li>
            <li @click="rotateMuas"><i class="iconfont iconnishizhenxuanzhuan" style="color:#000;font-size:18px;"></i></li>
          </ul>
            <div class="rotuta" v-if="activeName==='second'">
              <el-checkbox-group v-model="wsCheckList" @change="onWsCheck" :disabled="isHover" class="rotuta">
                <el-checkbox label="C">Closed</el-checkbox>
                <el-checkbox label="O">Open</el-checkbox>
                <el-checkbox label="I">Inactive</el-checkbox>
              </el-checkbox-group>
            </div>
          <el-tabs v-model="activeName" :class="changeLayoutflag?'':'changeLayoutflags'" style="background:#fff;margin-top:4px;">
            <el-tab-pane
              label="文档预览"
              name="first"
              style="padding-left:10px;"
            >
            <div class="right" :class="changeLayoutflag?'':'changeLayoutflags'">
            <!-- <div class="titleSearch detailSearch" style="background:#fff;">
              <p>
                <el-dropdown placement="top-start">
                  <span class="el-dropdown-link" style="margin-right:20px"><i class="iconfont iconcaozuoliebiao"></i></span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                    <a href="../../../static/Preview/index.html" target="_blank"><span>全屏</span></a>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <span @click="rotateMua">顺时针旋转</span>
                    </el-dropdown-item>
                    <el-dropdown-item> 
                      <span @click="rotateMuas">逆时针旋转</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </p>
            </div> -->
            <div class="browseDoc browseDocs" :class="changeLayoutflag?'':'changeLayoutflags'">
              <iframe src="../../../static/Preview/index.html" id="iframeId" name="ifrmname" ref="mapFrame" style="width:100%;height:100%" frameborder="0"></iframe>
            </div>
            </div>

            <!-- <div class="right" v-html="item.content"></div> -->
              <!-- <div class="titleSearch detailSearch" style="background:#fff;"> -->
              <!-- <i style="margin-right:8px;" class="el-icon-arrow-down"></i> 9.2去掉无用icon -->
              <!-- <div>
                文档预览
              </div>
              <p>
                <el-dropdown placement="top-start">
                  <span class="el-dropdown-link" style="margin-right:20px"><i class="iconfont iconcaozuoliebiao"></i></span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item> -->
                      <!-- <el-button size="mini" :disabled="isHover">
                      <i style="margin-right:8px;font-size:8px;" class="iconfont iconGroup26"></i> -->
                    <!-- <a href="../../../static/Preview/index.html" target="_blank"><span>全屏</span></a> -->
                    <!-- </el-button> -->
                    <!-- </el-dropdown-item>
                    <el-dropdown-item>
                      <span @click="rotateMua">顺时针旋转</span> -->
                      <!-- <el-button class="rotate" size="mini" @click="rotateMua" style="">顺时针旋转</el-button> -->
                    <!-- </el-dropdown-item>
                    <el-dropdown-item> 
                      <span @click="rotateMuas">逆时针旋转</span> -->
                      <!-- <el-button class="rotate" size="mini" @click="rotateMuas">逆时针旋转</el-button> -->
                    <!-- </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </p>
            </div>
            <div class="browseDoc">
              <iframe src="../../../static/Preview/index.html" id="iframeId" name="ifrmname" ref="mapFrame" style="width:100%;height:100%" frameborder="0"></iframe>
            </div> -->
            </el-tab-pane>
            <el-tab-pane
              name="second"
              v-if="changeLayoutflags"
              label="账单信息"
            >
            <el-row >
              <el-col :span="24" style="padding:0 16px;margin-top:10px;height:100%;">
                <div class="titleSearch detailSearch" style="margin-bottom:10px;">
                
                </div>
                <el-table
                  v-show="searchFlag3"
                  :data="SICSData"
                  border
                  width="100%"
                  height="88%"
                  :header-row-class-name="StableClass">
                  <el-table-column type="index" width="50" align="center"></el-table-column>
                  <el-table-column label="账单号" width="160" align="center">
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
                  <el-table-column prop="wsCurrency" label="币制" width="80" align="center"></el-table-column>
                  <el-table-column label="金额" align="right" width="120">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="Number(scope.row.wsAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')"
                        placement="top-start">
                        <span class="abbreviate">{{Number(scope.row.wsAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="业务编号" align="center" width="110">
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
                  <el-table-column label="SECTION" width="110" align="center">
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
                  <el-table-column prop="uwYear" label="业务年度" align="center"></el-table-column>
                  <el-table-column label="NOTE" align="center">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" :content="scope.row.note" placement="top-start">
                        <span class="abbreviate">{{scope.row.note}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="wsPeriod" label="账单期" width="120" align="center"></el-table-column>
                  <el-table-column label="账单标题" align="center">
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
                  <el-table-column prop="wsStatus" label="账单状态" width="100" align="center">
                    <!-- <template slot-scope="scope">{{scope.row.wsStatus=='O'?'Open':'Close'}}</template> -->
                  </el-table-column>
                  <el-table-column prop="registBy" label="录入人" width="130" align="center"></el-table-column>
                  <el-table-column prop="closedBy" label="复核人" width="130" align="center"></el-table-column>
                  <!-- <el-table-column label="驳回原因类型" width="160" align="center">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.rejectType"
                        placement="top-start">
                        <span class="abbreviate">{{scope.row.rejectType}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="修改意见" align="left">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.remark"
                        placement="top-start">
                        <span class="abbreviate">{{scope.row.remark}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column> -->
                  <el-table-column width="180" label="修改意见" align="center">
                    <template slot-scope="scope">
                      <!-- <el-tooltip class="item" effect="dark"  :content="scope.row.rejectType&&scope.row.remark?scope.row.remark+'-'+scope.row.rejectType:''" placement="top-start"> -->
                      <el-tooltip class="item" effect="dark"  :content="scope.row.remark+'-'+scope.row.rejectType" placement="top-start">
                        <span class="abbreviate">{{scope.row.rejectType}}-{{scope.row.remark}}</span>
                        <!-- <span class="abbreviate" v-if="scope.row.rejectType&&scope.row.remark">{{scope.row.rejectType}}-{{scope.row.remark}}</span>
                        <span class="abbreviate" v-else></span> -->
                        <!-- 8.21 v-else有问题  -->
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="附件名称" align="center">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.docName"
                        placement="top-start">
                        <span :class="{'smallHand BlueColor':scope.row.suffixFlag}" class="abbreviate" @click="docView(scope.row)">{{scope.row.docName}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="registAt" label="录入时间" width="160" align="center"></el-table-column>
                  <el-table-column prop="closedAt" label="复核时间" width="160" align="center"></el-table-column>
                  <!-- <el-table-column label="任务类型">
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
                  </el-table-column> -->
                  <!-- <el-table-column prop="receiptDate" label="收到账单日期" width="120"></el-table-column> -->
                  <!-- <el-table-column label="分出公司" width="120">
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
                  </el-table-column> -->
                  <!-- <el-table-column label="经纪公司" width="120">
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
                  </el-table-column> -->
                  <!-- <el-table-column prop="wsType" label="账单类型"></el-table-column> -->
                  <!-- <el-table-column prop="businessOrigin" label="Business Origin" width="130"></el-table-column> -->
                  <!-- <el-table-column prop="baseCompany" label="Base Company" width="120"></el-table-column> -->
                  <!-- <el-table-column prop="dept" label="经营机构"></el-table-column> -->
                  <el-table-column fixed="right" label="操作" width="80" align="center">
                    <template slot-scope="scope">
                      <el-dropdown placement="top-start">
                        <span class="el-dropdown-link"><i class="iconfont iconcaozuoliebiao"></i></span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                            <span class="blueColor" @click.stop="openSics(scope.row)">打开SICS</span>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <span class="blueColor" v-show="$route.query.tag == 'billCheck'" @click.stop="submit(2,'添加意见',scope.row.wsId)">添加意见</span>
                          </el-dropdown-item>
                          <el-dropdown-item> 
                            <span class="blueColor" v-show="scope.row.wsStatus=='Closed' && $route.query.tag !== 'billCheck' && $route.query.tag !== 'billProcess'" @click.stop="reverse(scope.row)">Reverse</span>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            </el-tab-pane>
          </el-tabs> 
      </el-col>
    </el-row>
    <el-row v-if="changeLayoutflag">
      <el-col :span="24" style="padding:0 16px;padding-bottom:100px;margin-top:10px;">
        <div class="titleSearch detailSearch" style="margin-bottom:10px;" @click="searchFlag3 = !searchFlag3">
          <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>账单信息</div>
          <div>
            <el-checkbox-group v-model="wsCheckList" @change="onWsCheck" :disabled="isHover">
              <el-checkbox label="C">Closed</el-checkbox>
              <el-checkbox label="O">Open</el-checkbox>
              <el-checkbox label="I">Inactive</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
          <!-- height="400" 9.17详情的部分列表去掉死高 -->
        <el-table
          v-show="searchFlag3"
          :data="SICSData"
          border
          width="100%"
          :header-row-class-name="StableClass">
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column label="账单号" width="160" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.wsId"
                placement="top-start"
              >
                <span :class="scope.row.wsStatus==='Closed'?'abbreviate abbreviateRed':'abbreviate'">{{scope.row.wsId}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="wsCurrency" label="币制" width="80" align="center"></el-table-column>
          <el-table-column label="金额" align="right" width="120">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="Number(scope.row.wsAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')"
                placement="top-start">
                <span class="abbreviate">{{Number(scope.row.wsAmount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="业务编号" align="center" width="110">
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
          <el-table-column label="SECTION" width="110" align="center">
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
          <el-table-column prop="uwYear" label="业务年度" align="center"></el-table-column>
          <el-table-column label="NOTE" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.note" placement="top-start">
                <span class="abbreviate">{{scope.row.note}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="wsPeriod" label="账单期" width="120" align="center"></el-table-column>
          <el-table-column label="账单标题" align="center">
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
          <el-table-column prop="wsStatus" label="账单状态" width="100" align="center">
            <!-- <template slot-scope="scope">{{scope.row.wsStatus=='O'?'Open':'Close'}}</template> -->
          </el-table-column>
          <el-table-column prop="registBy" label="录入人" width="130" align="center"></el-table-column>
          <el-table-column prop="closedBy" label="复核人" width="130" align="center"></el-table-column>
          <!-- <el-table-column label="驳回原因类型" width="160" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.rejectType"
                placement="top-start">
                <span class="abbreviate">{{scope.row.rejectType}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="修改意见" align="left">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.remark"
                placement="top-start">
                <span class="abbreviate">{{scope.row.remark}}</span>
              </el-tooltip>
            </template>
          </el-table-column> -->
          <el-table-column width="180" label="修改意见" align="center">
            <template slot-scope="scope">
              <!-- <el-tooltip class="item" effect="dark"  :content="scope.row.rejectType&&scope.row.remark?scope.row.remark+'-'+scope.row.rejectType:''" placement="top-start"> -->
              <el-tooltip class="item" effect="dark"  :content="scope.row.remark+'-'+scope.row.rejectType" placement="top-start">
                <span class="abbreviate">{{scope.row.rejectType}}-{{scope.row.remark}}</span>
                <!-- <span class="abbreviate" v-if="scope.row.rejectType&&scope.row.remark">{{scope.row.rejectType}}-{{scope.row.remark}}</span>
                <span class="abbreviate" v-else></span> -->
                <!-- 8.21 v-else有问题  -->
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="附件名称" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.docName"
                placement="top-start">
                <span :class="{'smallHand BlueColor':scope.row.suffixFlag}" class="abbreviate" @click="docView(scope.row)">{{scope.row.docName}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="registAt" label="录入时间" width="160" align="center"></el-table-column>
          <el-table-column prop="closedAt" label="复核时间" width="160" align="center"></el-table-column>
          <!-- <el-table-column label="任务类型">
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
          </el-table-column> -->
          <!-- <el-table-column prop="receiptDate" label="收到账单日期" width="120"></el-table-column> -->
          <!-- <el-table-column label="分出公司" width="120">
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
          </el-table-column> -->
          <!-- <el-table-column label="经纪公司" width="120">
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
          </el-table-column> -->
          <!-- <el-table-column prop="wsType" label="账单类型"></el-table-column> -->
          <!-- <el-table-column prop="businessOrigin" label="Business Origin" width="130"></el-table-column> -->
          <!-- <el-table-column prop="baseCompany" label="Base Company" width="120"></el-table-column> -->
          <!-- <el-table-column prop="dept" label="经营机构"></el-table-column> -->
          <el-table-column fixed="right" label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-dropdown placement="top-start">
                <span class="el-dropdown-link"><i class="iconfont iconcaozuoliebiao"></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span class="blueColor" @click.stop="openSics(scope.row)">打开SICS</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span class="blueColor" v-show="$route.query.tag == 'billCheck'" @click.stop="submit(2,'添加意见',scope.row.wsId)">添加意见</span>
                  </el-dropdown-item>
                  <el-dropdown-item> 
                    <span class="blueColor" v-show="scope.row.wsStatus=='Closed' && $route.query.tag !== 'billCheck' && $route.query.tag !== 'billProcess'" @click.stop="reverse(scope.row)">Reverse</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 弹窗区域 -->
    <el-dialog title="拆分" :visible.sync="dialogFormVisible" :close-on-click-modal="modal" width="782px">
      <el-form label-width="120px">
        <el-form-item label="拆分数量">
          <el-input v-model="subProcess" style="width:200px" type="number"></el-input>
          <!-- <el-button type="primary" size="mini" style="margin-left:50px" @click="itemSplit">拆分</el-button> -->
        </el-form-item>
        <el-form-item label="拆分理由">
          <el-input
            type="textarea"
            :rows="4"
            style="width:400px"
            placeholder="请输入拆分理由"
            v-model="reason"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="拆分金额">
          <div class="inputWrap" id="idInputWrap"></div>
        </el-form-item>-->
        <el-form-item>
          <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" plain @click="split()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogFormVisible2" :close-on-click-modal="modal">
      <el-form label-width="120px">
        <el-form-item label="收件人" v-show="title==='邮件通知'">
          <el-autocomplete style="width:100%" v-model="mailInfo" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="elSelect">
            <i class="el-icon-edit el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }"><span>{{item.contactName}}：{{item.emailAddr}}</span></template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="抄送人" v-show="title==='邮件通知'">
          <el-autocomplete style="width:100%" v-model="ccUser" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="elSelect2">
            <i class="el-icon-edit el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }"><span>{{item.contactName}}：{{item.emailAddr}}</span></template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="邮件标题" v-show="title==='邮件通知'">
          <el-input type="text" placeholder="请输入内容" v-model="mailTitle"></el-input>
        </el-form-item>
        <el-form-item label="内容编辑" v-show="title==='邮件通知'">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="emailContent"></el-input>
        </el-form-item>
        <el-form-item label="附件上传方式" v-show="title==='邮件通知'">
          <el-tabs v-model="uploadType">
            <el-tab-pane label="本地上传" name="1">
              <el-upload
                :disabled="uploadType!=1 && $route.query.tag === 'billSignBack'"
                action=""
                multiple
                :before-upload="beforeAvatarUpload"
                :auto-upload="true"
                :http-request="upload"
                :headers="head"
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
        <el-form-item label="上传附件" v-show="title==='上传附件'">
          <el-upload
            action=""
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            multiple
            :http-request="upload"
            :headers="head"
            :file-list="fileList">
            <el-button plain type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="选择类型" v-show="title==='OCR上传'">
          <el-radio-group v-model="recognize_service" class="selfRadio">
            <el-radio label="zhongzai_renbaozhangdan">人保账单</el-radio>
            <el-radio label="zhongzai_zhongyinzhangdan">中银账单</el-radio>
            <el-radio label="zhongzai_dadifeishui">大地非水</el-radio>
            <el-radio label="zhongzai_huatai">华泰账单</el-radio>
            <el-radio label="zhongzai_dadizhangdan">大地账单</el-radio>
            <el-radio label="zhongzai_dadiweijue">大地未决</el-radio>
            <el-radio label="zhongzai_zhongyinweijue">中银未决</el-radio>
            <el-radio label="zhongzai_yingdataihe">英大泰和</el-radio>
            <el-radio label="zhongzai_dinghe">鼎和账单</el-radio>
            <el-radio label="zhongzai_taibao">太保账单</el-radio>
            <el-radio label="zhongzai_yangguang">阳光账单</el-radio>
            <el-radio label="zhongzai_guoshoucai">国寿财</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="title==='邮件通知' || title==='OCR上传'">
        <el-button size="small" @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button size="small" type="primary" plain @click="send" style="padding:0 16px;">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible3" :close-on-click-modal="modal">
      <el-form :label-position="labelPosition" label-width="140px" :model="formLabelAlign">
        <el-form-item label="用户名">
          <el-input v-model="formLabelAlign.name" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="公司代码及名称">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经纪公司代码及名称">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单类型">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单期">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单类型">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国际/国内业务">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="BASE COMPANY">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button size="small" type="primary" plain @click="dialogFormVisible3 = false" style="padding:0 16px;">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogFormVisible5" :close-on-click-modal="modal" width="782px">
      <el-form label-position="right" label-width="140px">
        <el-form-item label="驳回原因类型" v-show="title==='添加意见'">
          <el-select v-model="opinion" placeholder="请选择" style="width:100%" @change="yijian">
            <el-option v-for="item in BHoptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入悬停原因" v-show="title==='悬停'">
          <el-input type="textarea" :rows="2" placeholder="请输入原因" v-model.trim="pendingReason"></el-input>
        </el-form-item>
        <el-form-item label="添加意见" v-show="title==='添加意见'">
          <el-input
            :disabled="opinion!='其它'"
            type="textarea"
            :rows="4"
            placeholder="请输入原因"
            v-model="textareaOpinion"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择处理人" v-show="title==='流程提交' && $route.query.tag === 'billEntry' && checkRobortUser==1">
          <el-select v-model="assignee" placeholder="请选择">
            <el-option
              v-for="item in TJRoptions"
              :key="item.userId"
              :label="item.name"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指派任务处理人" v-show="title==='指派' && $route.query.tag !== 'billCheck'">
          <el-select v-model="assignee"  placeholder="请选择" v-show="!checkRobortUser"> 
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username" :disabled="item.username == $store.state.userName"></el-option>
          </el-select>
          <el-select v-model="assignee"  placeholder="请选择" v-show="checkRobortUser==1"> 
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username"></el-option>
          </el-select>
        </el-form-item> 
         <!-- 复核指派 -->
        <el-form-item label="指派任务处理人" v-show="title==='指派' && $route.query.tag === 'billCheck'">
          <el-select v-model="assignee"  placeholder="请选择" v-show="!checkRobortUser"> 
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username" :disabled="item.username == $store.state.userName || item.username == chooseRow.entryOperator"></el-option>
          </el-select>
          <el-select v-model="assignee"  placeholder="请选择" v-show="checkRobortUser==1"> 
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择处理人" v-show="title==='流程提交' && $route.query.tag === 'billEntry' && checkRobortUser!=1">
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
        <el-form-item label="是否签回" v-show="title==='流程提交' && $route.query.tag === 'billEntry' && chooseRow.wsBusinessType!='F'">
          <el-radio v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible5 = false">取 消</el-button>
        <el-button size="small" type="primary" plain @click="confirm" style="padding:0 16px;">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="巨灾录入" :visible.sync="dialogFormVisibleCatastrophe" :close-on-click-modal="modal" width="1300px">
      <el-tabs v-model="tabsFlag">
        <el-tab-pane label="NEW CLAIM" name="1">
          <el-form label-width="190px" :model="bigDisaster" ref="bigDisaster" :rules="rules1" :label-position="labelPosition" class="catastrophe">
            <el-form-item prop="businessId" label="Business ID">
              <el-select v-model="bigDisaster.businessId" filterable placeholder="please choose" @change="businessChange('1',bigDisaster.businessId)">
                <el-option v-for="(item,i) in businessList" :key="i" :label="item.indentifier" :value="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="insuredPeriod" label="Insured Period">
              <el-select v-model="bigDisaster.insuredPeriod" filterable placeholder="please choose">
                <el-option v-for="(item,i) in insuredPeriodList" :key="i" :label="item.insrdPeriodStart+'—'+item.insrdPeriodEnd" :value="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="section" label="Section">
              <el-select v-model="bigDisaster.section" filterable placeholder="please choose">
                <el-option v-for="(item,i) in businessList" :key="i" :label="item.section" :value="item.section"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="claimName" label="Claim's Name"><el-input v-model="bigDisaster.claimName" placeholder="please enter"></el-input></el-form-item>
            <el-form-item prop="lossDateStart" label="Date of Loss From"><el-date-picker value-format="timestamp" v-model="bigDisaster.lossDateStart" type="date" placeholder="Please select a date"></el-date-picker></el-form-item>
            <el-form-item prop="lossDateEnd" label="Date of Loss To"><el-date-picker value-format="timestamp" v-model="bigDisaster.lossDateEnd" type="date" placeholder="Please select a date"></el-date-picker></el-form-item>
            <el-form-item prop="plcyStartDate" label="Original Policy Period From"><el-date-picker value-format="timestamp" v-model="bigDisaster.plcyStartDate" type="date" placeholder="Please select a date"></el-date-picker></el-form-item>
            <el-form-item prop="plcyEndDate" label="Original Policy Period To"><el-date-picker value-format="timestamp" v-model="bigDisaster.plcyEndDate" type="date" placeholder="Please select a date"></el-date-picker></el-form-item>
            <el-form-item prop="causeOfLossGroup" label="Claim Cause Of Loss Group">
              <el-select v-model="bigDisaster.causeOfLossGroup" filterable placeholder="please choose" @change="lossGroupChange">
                <el-option v-for="item in [{a:'Accident',b:'ACCIDENT'},{a:'Act of God',b:'ACTOFGOD'}]" :key="item.b" :label="item.a" :value="item.b"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="causeOfLoss" label="Cause Of Loss">
              <el-select v-model="bigDisaster.causeOfLoss" filterable placeholder="please choose">
                <el-option v-for="(item,i) in causeOfLossList" :key="i" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="advisedDate" label="Advise Date"><el-date-picker value-format="timestamp" v-model="bigDisaster.advisedDate" type="date" placeholder="Please select a date"></el-date-picker></el-form-item>
            <el-form-item prop="riskEvnt" label="Claim Risk Event Indicator"><!-- R  E -->
              <el-select v-model="bigDisaster.riskEvnt" filterable placeholder="please choose">
                <el-option v-for="item in [{a:'Risk',b:'R'},{a:'Event',b:'E'}]" :key="item.b" :label="item.a" :value="item.b"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Headline Loss ID">
              <el-select v-model="bigDisaster.headlinelossIndex" filterable placeholder="please choose" @change="headlinelossChange('1',bigDisaster.headlinelossIndex)">
                <el-option v-for="(item,i) in headlinelossList" :key="i" :label="item.lossCode" :value="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Headline Loss Name">
              <el-select v-model="bigDisaster.headlinelossIndex" filterable placeholder="please choose" disabled>
                <el-option v-for="(item,i) in headlinelossList" :key="i" :label="item.lossName" :value="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 100%;text-align: right;padding-right: 50px;">
              <el-button size="small" @click="reset('bigDisaster')">重置</el-button>
              <el-button type="primary" plain @click="catastropheSubmite1('bigDisaster')">提交复核</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="INCURRED CLAIM" name="2">
          <el-form label-width="140px" :model="bigDisaster2" ref="bigDisaster2" :rules="rules2" :inline="true" class="catastrophe">
            <el-form-item label="Claim ID" prop="claimIndex">
              <el-select v-model="bigDisaster2.claimIndex" filterable placeholder="please choose" @change="claimChange(bigDisaster2.claimIndex)">
                <el-option v-for="(item,i) in claimList" :key="i" :label="item.lossNo" :value="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Claim Name" prop="claimIndex">
              <el-select v-model="bigDisaster2.claimIndex" disabled filterable placeholder="please choose">
                <el-option v-for="(item,i) in claimList" :key="i" :label="item.lossName" :value="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Headline Loss ID">
              <el-select v-model="bigDisaster2.headlinelossIndex" filterable placeholder="please choose" @change="headlinelossChange('2',bigDisaster2.headlinelossIndex)">
                <el-option v-for="(item,i) in headlinelossList2" :key="i" :label="item.lossCode" :value="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Headline Loss Name">
              <el-select v-model="bigDisaster2.headlinelossIndex" filterable placeholder="please choose" disabled>
                <el-option v-for="(item,i) in headlinelossList2" :key="i" :label="item.lossName" :value="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Business ID" prop="businessId">
              <el-select v-model="bigDisaster2.businessId" filterable placeholder="please choose" @change="businessChange('2',bigDisaster2.businessId)">
                <el-option v-for="(item,i) in businessList2" :key="i" :label="item.identifier" :value="item.indentifier"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Insured Period" prop="insuredPeriod">
              <el-select v-model="bigDisaster2.insuredPeriod" filterable placeholder="please choose">
                <el-option v-for="(item,i) in businessList2" :key="i" :label="item.insrdPeriodStart+'——'+item.insrdPeriodEnd" :value="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Section" prop="section">
              <el-select v-model="bigDisaster2.section" filterable placeholder="please choose">
                <el-option v-for="(item,i) in businessList2" :key="i" :label="item.sectionName" :value="item.sectionName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="To be booked in B/L">
              <el-select v-model="bigDisaster2.BL" filterable placeholder="please choose">
                <el-option v-for="item in [{a:'NO',b:'0'},{a:'YES',b:'1'}]" :key="item.b" :label="item.a" :value="item.b"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="As Of Date" prop="accAsOfDate"><el-date-picker v-model="bigDisaster2.accAsOfDate" value-format="timestamp" type="date" placeholder="Please select a date"></el-date-picker></el-form-item>
            <el-form-item label="Receive Date"><el-date-picker v-model="bigDisaster2.registTimestamp" value-format="timestamp" type="date" placeholder="Please select a date"></el-date-picker></el-form-item>
            <el-form-item label="BP Reference"><el-input @blur="onCheck('bpRef')" v-model="bigDisaster2.bpRef" placeholder="please enter"></el-input></el-form-item>
            <el-form-item label="Currency" prop="fkCurr">
              <el-select v-model="bigDisaster2.fkCurr" filterable placeholder="please choose">
                <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="To be Paid"><el-input v-model="bigDisaster2.paid" placeholder="please enter"></el-input></el-form-item>
            <el-form-item label="Outstanding"><el-input v-model="bigDisaster2.outStanding" placeholder="please enter"></el-input></el-form-item>
            <el-form-item label="IBNR"><el-input v-model="bigDisaster2.ibnr" placeholder="please enter"></el-input></el-form-item>
            <el-form-item style="width: 100%;text-align: right;padding-right: 50px;">
              <el-button size="small" @click="reset('bigDisaster')">重置</el-button>
              <el-button type="primary" plain @click="catastropheSubmite2('bigDisaster2')">提交复核</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!-- <div slot="footer" v-show="$route.query.tag === 'billEntry'" class="dialog-footer" style="margin-top:10px;">
        <el-button size="small" @click="reset('bigDisaster')">重置</el-button>
        <el-button type="primary" plain @click="catastropheSubmite('bigDisaster','提交复核')">提交复核</el-button>
      </div>
      <div slot="footer" v-show="$route.query.tag === 'billCheck'" class="dialog-footer" style="margin-top:10px;">
        <el-button size="small" @click="catastropheSubmite('驳回')">驳回</el-button>
        <el-button type="primary" plain @click="catastropheSubmite('通过')">通过</el-button>
      </div> -->
    </el-dialog>

    <el-dialog title="Clean-Cut" :visible.sync="dialogFormVisiblecleanCut" :close-on-click-modal="modal" width="1200px">
      <el-form label-width="130px" :label-position="labelPosition" class="catastrophe">
        <el-form-item label="赔案编号"><el-input v-model="cleanCut.refClaimIdentifier" placeholder="请输入"></el-input></el-form-item>
        <el-form-item label="是否转已决">
          <el-radio-group v-model="cleanCut.isPending">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="合同编号">
          <el-select v-model="cleanCut.identifier" filterable placeholder="请选择">
            <el-option v-for="item in bigArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同起期"><el-date-picker v-model="cleanCut.plcyStartDate" value-format="timestamp" type="date" placeholder="选择日期"></el-date-picker></el-form-item>
        <el-form-item label="合同止期"><el-date-picker v-model="cleanCut.plcyEndDate" value-format="timestamp" type="date" placeholder="选择日期"></el-date-picker></el-form-item>
        <el-form-item label="Section">
          <el-select v-model="cleanCut.fkSoc" filterable placeholder="请选择">
            <el-option v-for="item in bigArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="未决赔款转已决" style="width:100%" v-show="cleanCut.isPending==1">
          <el-card style="width: calc(100% - 60px);">
            <el-form-item style="width:100%;dispaly:block;">
              <span>币制 </span>
              <el-select style="height:40px;line-height:40px;width:calc(100% - 50px);" filterable placeholder="请选择" multiple v-model="makeDocListEctype.yuanType" class="curAmount">
                <el-option v-for="item in rmCurrencyList" :key="item.alpha" :label="item.alpha" :value="item.alpha"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width:100%;dispaly:block;">
              <div class="wrapInput" v-for="(item,i) in makeDocNum" :key='i'>
                <span class="bizhi">{{makeDocListEctype.yuanType[i]}} </span>&nbsp;
                <el-input type="number" style="width:calc(100% - 50px);" v-model="makeDocListEctype.yuanNum[i]" placeholder="请输入金额" size="small"></el-input>
              </div>
            </el-form-item>
          </el-card>
        </el-form-item>
      </el-form>
      <div slot="footer" v-show="$route.query.tag === 'billEntry'" class="dialog-footer" style="margin-top:10px;">
        <el-button size="small" @click="reset('cleanCut')">重置</el-button>
        <el-button type="primary" plain @click="cleanCutSubmite('提交复核')">提交复核</el-button>
      </div>
      <div slot="footer" v-show="$route.query.tag === 'billCheck'" class="dialog-footer" style="margin-top:10px;">
        <el-button size="small" @click="cleanCutSubmite('驳回')">驳回</el-button>
        <el-button type="primary" plain @click="cleanCutSubmite('通过')">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { Loading } from "element-ui";
export default {
  name: "detailEntry",
  data() { 
    return {
      ccUser:null,
      cleanCut:{
        refClaimIdentifier:null,
        isPending:1,
        identifier:null,
        plcyStartDate:null,
        plcyEndDate:null,
        fkSoc:null,
      },
      makeDocListEctype:{
        yuanType:[],
        yuanNum:[],
      },
      makeDocNum:0,
      claimInfoDO:{},//这个数据是用来提交的时候，传给后端用bigDisaster2  
      headlinelossList2:[],
      businessList2:[],
      rmCurrencyList:[],
      claimList:[],
      causeOfLossList:[],
      businessList:[],
      insuredPeriodList:[],
      headlinelossList:[],
      bigArr:[],
      bigDisaster:{
        taWorksheetDO:{},
        fkSoc:null,
        headlinelossIndex:null,
        claimName:null,
        refClaimIdentifier:null,
        causeOfLossGroup:null,
        causeOfLossName:null,
        causeOfLoss:null,
        advisedDate:null,
        riskEvnt:null,
        headlinelossCode:null,
        headlinelossName:null,
        plcyStartDate:null,
        plcyEndDate:null,
        lossDateStart:null,
        lossDateEnd:null,
        // 一下为不给后端传的字段
        businessId:null,
        insuredPeriod:null,
        section:null,
      },
      bigDisaster2:{
        fkSoc:null,
        headlinelossIndex:null,
        refClaimIdentifier:null,
        headlinelossCode:null,
        headlinelossName:null,
        accAsOfDate:null,
        registTimestamp:null,
        bpRef:null,
        fkCurr:null,
        paid:null,
        outStanding:null,
        ibnr:null,
        businessId:null,
        insuredPeriod:null,
        section:null,
        claimName:null,
        BL:'0',
        taWorksheetDO:{},
      },
      rules2:{
        // select
        businessId:[{ required: true, message: "please choose Business ID", trigger: "change" }],
        insuredPeriod:[{ required: true, message: "please choose Insured Period", trigger: "change" }],
        section:[{ required: true, message: "please choose Section", trigger: "change" }],
        claimIndex:[{ required: true, message: "please choose Claim ID", trigger: "change" }],
        fkCurr:[{ required: true, message: "please choose Currency", trigger: "change" }],
        // date 
        accAsOfDate:[{ type: 'date', required: true, message: 'please choose As Of Date', trigger: 'change' }],
      },
      rules1:{
        // select
        businessId:[{ required: true, message: "please choose Business ID", trigger: "change" }],
        insuredPeriod:[{ required: true, message: "please choose Insured Period", trigger: "change" }],
        section:[{ required: true, message: "please choose Section", trigger: "change" }],
        causeOfLossGroup:[{ required: true, message: "please choose Claim Cause Of Loss Group", trigger: "change" }],
        causeOfLoss:[{ required: true, message: "please choose Cause Of Loss", trigger: "change" }],
        riskEvnt:[{ required: true, message: "please choose riskEvnt", trigger: "change" }],
        // date 
        lossDateStart:[{ type: 'date', required: true, message: 'please choose Date of Loss From', trigger: 'change' }],
        lossDateEnd:[{ type: 'date', required: true, message: 'please choose Date of Loss To', trigger: 'change' }],
        plcyStartDate:[{ type: 'date', required: true, message: 'please choose Original Policy Period From', trigger: 'change' }],
        plcyEndDate:[{ type: 'date', required: true, message: 'please choose Original Policy Period To', trigger: 'change' }],
        advisedDate:[{ type: 'date', required: true, message: 'please choose Advise Date', trigger: 'change' }],
        // input
        claimName:[{ required: true, message: "please enter Claim's Name", trigger: 'change' }],
      },
      tabsFlag:'2',
      activeName: 'first',
      changeLayoutflag:true,
      changeLayoutflags:false,
      wsCheckList:[],
      maxHeight:null,
      wsId:null,
      checkRobortUser:null,
      nameList:{},
      searchFlag3: true,
      searchFlag2: true,
      searchFlag1: true,
      modal: false,
      pendingReason: null,
      opinion: "",
      mailInfo: "",
      processId: "",
      mailTitle: "",
      emailContent: "",
      mailOption: [],
      fileList: [],
      fileList2: [],
      path: "",
      uploadType: '1',
      isHover: false,
      assignee: "",
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
      tableData: [],
      SICSData: [],
      listData: [
        {
          a: "流程编号",
          b: "",
          c: "processId"
        },
        {
          a: "任务类型",
          b: "",
          c: "wsBusinessType"
        },
        {
          a: "账期",
          b: "",
          c: "wsPeriod"
        },
        {
          a: "分出公司",
          b: "",
          c: "cedent"
        },
        {
          a: "经纪公司",
          b: "",
          c: "broker"
        },
        {
          a: "流程状态",
          b: "",
          c: "processStatus"
        },
        {
          a: "账单收到日期",
          b: "",
          c: "wsReceiptDate"
        },
      ],
      YWoptionsObj: {
        T: "合约账单",
        F: "临分账单",
        O: "转分账单",
        C: "修正账单"
      },
      textareaOpinion: "",
      value: [],
      StableClass: "tableClass",
      docViewRow: {},
      value1: "",
      subProcess: null, // 条目拆分数量
      reason: "", // 条目拆分理由
      labelPosition: "right",
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible5: false,
      dialogFormVisibleCatastrophe: false,
      dialogFormVisiblecleanCut: false,
      title: "",
      dialogState: "",
      currentPage3: 5,
      currentPage4: 2,
      currentPage:1,
      hide: false,
      radio: null,
      options: [],
      value: 0,
      formLabelAlign: {
        name: "",
        type: ""
      },
      ocrRow: null,
      file: [],
      head: {"Content-Type": "application/json;charset=UTF-8"},
      chooseRow: {},
      TJRoptions: [],
      recognize_service: "",
      mustData: {
        pageNumber: 1, // 页数
        pageSize: 20, //页面一次要展示的条数
        total: 0 //总条数
      },
      chooseDocList: [],
      subProcessFlag: false,
      billCheckType: null,
      rotateCount:0,
      rotateCounts:4
    };
  },
  created() {
    sessionStorage.setItem("data", JSON.stringify({}));
    this.nameList = JSON.parse(sessionStorage.getItem("nameList"));
    // 日期判断    Edate
  },
  beforeMount(){ this.copy('proNum',1) },
  mounted(){
    if(this.$route.name === 'detailEntry' || this.$route.name === 'detailCred' || this.$route.name === 'detailPay'){
        this.$store.commit('ChangeFlod',true)
      } else{ this.$store.commit('ChangeFlod',false) }
    this.maxHeight = `${document.body.clientHeight-200}px`;
    // 查询账单详情
    if (this.$route.query.tag !== "billSignBack") {
      this.uploadType = 1;
    }
    this.chooseRow = JSON.parse(this.$route.query.row);
    //获取币制
    this.rmCurrencyList = JSON.parse(sessionStorage.getItem('CurrencyList'));
    // this.$http.get(`api/worksheet/wSEntry/checkRobortUser`,{params:{processId:this.chooseRow.processId}}).then(res => {
    //   this.checkRobortUser = res.data;
    //   // 0 需要屏蔽自己，1不需要
    // })
    this.getBillInfo();

    // 以下调用理赔接口，获取数据
    // this.getClaimInfo();
  },
  methods: {
    getClaimInfo(){
      // currName: "中路交通财险"
      // currNo: "BP50276"
      // fkSoc: "711568A017974EED86D0493215DBECF8"
      // indentifier: "PIPT1183A"
      // objectId: "54896F629420459398D8A221D33EDF59"
      // refName: "Engineering, Liability, Property"
      // section: "Non-Marine QS & Surplus Treaty 2019"
      // socIsLeaf: "N"
      // title: "Zhonglu Non-Marine QS & Surplus Treaty"
      // typeOfBus: "PROPTTY"
      // underwritingYear: 2019

      this.$http.post("api/claim/getBusinessMessage",{}).then(res => {
          if(res.status == 200 && res.data.code==200){
            this.businessList=res.data.data.rows;
          }  
      });
      // 获取赔案列表Claim ID
      this.claimList = [
        {
          currName: "CHINA PACIFIC INS",
          currNo: "BP52950",
          fkSoc: "255741D859394901B9C2797B52401164",
          indentifier: "PIPF31802A",
          lossDate: "2019-07-01 00:00:00",
          lossName: "122112",
          lossNo: "IC201910138222",
          objectId: "84A80D5740144BC0A586371841FD1996",
          refName: "Property",
          section: "Main Section",
          title: "运营 PV 2x612MW Coal Fired Thermal Power Plant at Bangladesh",
          typeOfBus: "PROPFAC",
          underwritingYear: 2022,
        },
        {
          currName: "NNI.",
          currNo: "BP60225",
          fkSoc: "7300208297A9497A9F9916567B57FAFF",
          indentifier: "NIPF847A",
          lossDate: "2019-05-05 00:00:00",
          lossName: "RINGHALS NPS",
          lossNo: "IC201910138343",
          objectId: "365626D6192C4F618AE7DE612FBCECEC",
          refName: "Nuclear",
          section: "NF11182517-RINGHALS NPS",
          title: "RINGHALS NPS",
          typeOfBus: "PROPFAC",
          underwritingYear: 2019,
        },
      ];
      // this.$http.post("api/claim/getClaimId",{}).then(res => {
      //     console.log(res,'getClaimId');
      //     if(res.status == 200 && res.data.code==200){
      //       this.claimList=res.data.data.rows;
      //     }  
      // });
      // getHeadlineId获取巨灾代码
      this.$http.post("api/claim/getHeadlineId",{}).then(res => {
          console.log(res,'getHeadlineId');
          if(res.status == 200 && res.data.code==200){
            this.headlinelossList2=res.data.data.rows;
          }  
      });
     
    },
    claimChange(val){
      if(val!==null && val!==''){
        // 根据claimId 带出InsuredPeriod的值
        let fkSoc = this.claimList[val]['fkSoc'];
        this.bigDisaster2.fkSoc = fkSoc;
        this.bigDisaster2.refClaimIdentifier = this.claimList[val]['lossNo'];
        this.bigDisaster2.claimName = this.claimList[val]['lossName'];
        // 显示赔案编号下关联的合同编号下拉项；显示合同编号相关的合同起期-止期下拉项；显示合同编号下相关的Section下拉项；
        this.$http.get("api/claim/findClaimAndBusinessInfo",{params:{refClaimIdentifier:this.bigDisaster2.refClaimIdentifier}}).then(res => { 
          if(res.status == 200 && res.data.code==200){
            // 获取businessInfo------缺insuredPeriod的信息
            this.businessList2 = res.data.data.businessInfoDO;
            this.claimInfoDO = res.data.data.claimInfoDO; // 这个数据是用来提交的时候，传给后端用
            this.bigDisaster2.businessId=this.businessList2[0]['identifier'];
            this.bigDisaster2.section=this.businessList2[0]['sectionName'];
            // this.insuredPeriodList=res.data.data;          缺insuredPeriod的信息
          }  
        });
      }
    },
    lossGroupChange(){
      if(this.bigDisaster.causeOfLossGroup){
        // 巨灾代码&名称
        this.$http.post("api/claim/findHeadlinelossList",{groupBy:this.bigDisaster.causeOfLossGroup}).then(res => {
          console.log(res,'findHeadlinelossList');
          if(res.status == 200 && res.data.code==200){
            this.headlinelossList=res.data.data.rows;
          }   
        });
        // Cause Of Loss 出险原因 causeOfLossList
        this.$http.post("api/claim/getlistCauseOfLoss",{groupBy:this.bigDisaster.causeOfLossGroup}).then(res => {
          console.log(res,'getlistCauseOfLoss');
            if(res.status == 200 && res.data.code==200){
              this.causeOfLossList=res.data.data.rows;
            }  
        });
        if(this.bigDisaster.causeOfLossGroup=='ACCIDENT'){
          this.bigDisaster.causeOfLossName = 'Accident';
        } else{ this.bigDisaster.causeOfLossName = 'Act of God' }
      }
    },
    headlinelossChange(i,val){
      if(val!==null && val!==''){
        if(i=='1'){
          this.bigDisaster.headlinelossCode = this.headlinelossList[val].lossCode;
          this.bigDisaster.headlinelossName = this.headlinelossList[val].lossName;
        } else{
          this.bigDisaster2.headlinelossCode = this.headlinelossList2[val].lossCode;
          this.bigDisaster2.headlinelossName = this.headlinelossList2[val].lossName;
          // this.$http.get("api/claim/getHeadlineName",{params:{lossCode:this.bigDisaster2.headlinelossCode}}).then(res => {
          //     if(res.status == 200 && res.data.code==200){
          //       // this.businessList=res.data.data.rows;
          //     }  
          // });
        }
      }
    },
    businessChange(tag,val){
      console.log(val,'val');
      if(val!==null && val!==''){
        // 根据businessId 带出InsuredPeriod的值
        let fkSoc = this.businessList[val]['fkSoc'];
        this.bigDisaster.fkSoc = fkSoc;
        this.bigDisaster.refClaimIdentifier = this.businessList[val]['indentifier'];
        this.$http.post("api/claim/getInsuredPeriod",{fkSoc:fkSoc}).then(res => { 
          if(res.status == 200 && res.data.code==200){
            this.bigDisaster.insuredPeriod=0;
            // this.bigDisaster2.insuredPeriod=0;
            this.insuredPeriodList=res.data.data;
          }  
        });
      }
      // if(tag==1){  
      //   // bigDisaster

      // } else{  
      //   // bigDisaster2
      // }
    },
    catastrophe(tag){ 
      if(this.$route.query.tag === 'billEntry'){   // 操作页面
        this.dialogFormVisibleCatastrophe = true;
        this.bigDisaster2.registTimestamp = new Date().getTime();
      } else{  // 

      }
    },
    catastropheSubmite1(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post("api/claim/createClaim",Object.assign({processId:this.chooseRow.processId},this.bigDisaster)).then(res => {
            console.log(res);
            if(res.status == 200 && res.data.code==200){
            //   this.businessList=res.data.data.rows;
            } 
            // else if(res.data.code==500){
            //   this.$message.error(res.data.data.errorMsg);
            // }
          });
        } 
      })
    },
    catastropheSubmite2(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 普通的字符的校验 bpRef
          let str = this.bigDisaster2.bpRef;
          if(str.length){
            let i,n=0;
            for (i = 0;i < str.length;i++){
              if(str.charCodeAt(i)<=256){ n+=2; }else{ n+=1; }
              if(n>20){
                this.$message.error('BP备注信息不能超过20个字符，中文为2个字符');
                return false;
              }
            }
          }
          this.$http.post("api/claim/createWorksheet",Object.assign({processId:this.chooseRow.processId},this.claimInfoDO,this.bigDisaster2)).then(res => {
            console.log(res,'createWorksheet');
            if(res.status == 200 && res.data.code==200){
              // todo
            } else if(res.data.code==500){
              
            }
          });
        } 
      })
    },
    catastropheSubmite(tag){
      switch(tag){    
        case '提交复核': 
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$http.post("api/claim/createClaim",Object.assign({processId:this.chooseRow.processId},this.bigDisaster)).then(res => {
                console.log(res);
                // if(res.status == 200 && res.data.code==200){
                //   this.businessList=res.data.data.rows;
                // }  
              });
            } 
          })
        break;
        case '驳回':

        break;
        case '通过':

        break;
      }
    },
    reset(tag){   
      if(tag=='bigDisaster'){  // 巨灾重置
        if(this.tabsFlag==1){
          for(let k in this.bigDisaster){this.bigDisaster[k]=null;}
          this.bigDisaster.taWorksheetDO = {};
        } else{
          for(let k in this.bigDisaster2){this.bigDisaster2[k]=null;}
        }
      } else{  // cleanCut重置

      }
    },
    onCleanCut(tag){
      if(this.$route.query.tag === 'billEntry'){   // 操作页面
        this.dialogFormVisiblecleanCut = true;
      } else{  // 复核

      }
    },
    cleanCutSubmite(tag){
      switch(tag){
        case '提交复核':
          
        break;
        case '驳回':

        break;
        case '通过':

        break;
      }
    },
    changeLayout(){
      console.log('changeLayout')
      this.changeLayoutflag=!this.changeLayoutflag;
      this.changeLayoutflags=!this.changeLayoutflags;
      if(this.changeLayoutflag){
        this.activeName='first'
      }
      if(this.changeLayoutflags){
        this.activeName='second'
      }
    },
    onWsCheck(){
      // console.log(this.wsCheckList,'wsCheckList');
      this.$http.post("api/worksheet/wSCheck/getWorkSheetList", {processId: this.chooseRow.processId,wsStatus:this.wsCheckList})
        .then(res => {
          if(res.status == 200){
            this.SICSData = res.data;
          }  
        });
    },
    exportBill(){
      // this.$http.post(`api/worksheet/wSEntry/download/`,{processId:this.chooseRow.processId,},{responseType: "blob"})
      this.$http.post("api/worksheet/wSEntry/download",{processId:this.chooseRow.processId},{responseType: "blob"})
        .then(res => {
          console.log(res,'xiazai');
          if (res.status === 200) {
            this.path2 = this.getObjectURL(res.data);
            if (res.data) {
              var a = document.createElement("a");
              if (typeof a.download === "undefined") {
                window.location = this.path2;
              } else {
                a.href = this.path2;
                let formatString = escape(res.headers['content-disposition'].split(';')[1].split('=')[1]);
                a.download =  decodeURI(formatString);
                document.body.appendChild(a);
                a.click();
                a.remove();
              }
            } 
          }
        });
    },
    yijian(){if(this.opinion!='其它'){ this.textareaOpinion=null;}},
    getBillInfo(){
      this.$http.get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`).then(res => {
        if (res.status === 200) {
          this.chooseRow = res.data;
          res.data.processStatus === "已悬停"? (this.isHover = true):(this.isHover = false);
          this.SICSData = res.data.workSheetVOlist;
          console.log(this.SICSData,'this.SICSData');
          // 获取详情的值
      
          this.chooseRow.cedentCodeName=[];
          this.chooseRow.wsCedentCode&&this.chooseRow.wsCedentCode.split(';').map((item,index)=>{
             this.chooseRow.cedentCodeName.push(item&& this.chooseRow.wsCedentName.split(';')[index]?item+'-'+ this.chooseRow.wsCedentName.split(';')[index]+';':item||this.chooseRow.wsCedentName.split(';')[index]);
                return  this.chooseRow.cedentCodeName
          })
        this.chooseRow.cedentCodeName=this.chooseRow.cedentCodeName.join('');
        this.chooseRow.brokerCodeName=[];
          this.chooseRow.wsBrokerCode&&this.chooseRow.wsBrokerCode.split(';').map((item,index)=>{
            console.log(this.chooseRow.wsBrokerName.split(';')[index])
             this.chooseRow.brokerCodeName.push(item!==null&& this.chooseRow.wsBrokerName.split(';')[index]!==null?item+'-'+ this.chooseRow.wsBrokerName.split(';')[index]+';':item||this.chooseRow.wsBrokerName.split(';')[index]);
                return  this.chooseRow.brokerCodeName
          })
        this.chooseRow.brokerCodeName=this.chooseRow.brokerCodeName.join('');
        console.log(this.chooseRow,'this.chooseRow');
          if(this.chooseRow["wsBusinessType"]=='O'){
            this.listData = [...this.listData,
              {
                a: "更正原因",
                b: "",
                c: "correctMailReason"
              },
              {
                a: "收到邮件更正期",
                b: "",
                c: "correctMailDate"
              },
              {
                a: "母合同编号",
                b: "",
                c: "occId"
              }
            ]
          } else if(this.chooseRow["wsBusinessType"]=='C'){
            this.listData = [...this.listData,
              {
                a: "更正原因",
                b: "",
                c: "correctMailReason"
              },
              {
                a: "收到邮件更正期",
                b: "",
                c: "correctMailDate"
              },
              {
                a: "原合同编号",
                b: "",
                c: "parentProcessId"
              }
            ]
          }
          this.listData.forEach(el => {
            if (el["c"] == "cedent") {
              if(this.chooseRow["wsCedentCode"]==undefined){return}
              el["b"] = `${this.chooseRow.cedentCodeName}`;
            } else if (el["c"] == "broker") {
              if(this.chooseRow["wsBrokerCode"]==undefined){return}
              el["b"] = `${this.chooseRow.brokerCodeName}`;
            } else if (
              el["c"] == "wsBusinessType" &&
              this.chooseRow["wsBusinessType"]
            ) {
              el["b"] = `${this.YWoptionsObj[this.chooseRow["wsBusinessType"]]}`;
            } else {
              el["b"] = this.chooseRow[el["c"]];
            }
              // if(el['a']=='任务来源'){ el["b"] = this.nameList[this.chooseRow[el["c"]]]; }
            });
            res.data.bscDocumentVOlist&&res.data.bscDocumentVOlist.map((item,index)=>{
            return item.redFlag={
              flag:false,
              index:index%7
            }
          })
            let arr = res.data.bscDocumentVOlist;
            if(arr===null){return;}
            arr.forEach(el=>{
              if(el.docName){
                let suffix = el.docName.split('.');
                el['suffix'] = suffix[suffix.length-1];
                el['suffixFlag'] = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT','XLS','xls','ppt','PPT','pptx','PPTX'].some(el=>{ return el==suffix[suffix.length-1]; })
              }
            })
          this.tableData = arr;
          let num = this.tableData.findIndex(el => { return el.suffix=='doc' || el.suffix=='DOCX' || el.suffix=='xlsx' || el.suffix=='PDF' || el.suffix=='pdf' || el.suffix=='XLSX'})
          setTimeout(()=>{ this.docView(this.tableData[+num]); },500)
        }
      });
    },
    rotateMua(){
      this.rotateCount++;
       if(this.rotateCount>=5){
         this.rotateCount=1
       }
      switch(this.rotateCount){
        case 1:document.querySelector('.browseDoc').className='browseDoc mua1';break;
        case 2:document.querySelector('.browseDoc').className='browseDoc mua2';break;
        case 3:document.querySelector('.browseDoc').className='browseDoc mua3';break;
        case 4:document.querySelector('.browseDoc').className='browseDoc mua4';break;
      }
    },
    rotateMuas(){
       this.rotateCounts--;
       if(this.rotateCounts<=0){
         this.rotateCounts=4
       }
      switch(this.rotateCounts){
        case 4:document.querySelector('.browseDoc').className='browseDoc muas1';break;
        case 3:document.querySelector('.browseDoc').className='browseDoc muas2';break;
        case 2:document.querySelector('.browseDoc').className='browseDoc muas3';break;
        case 1:document.querySelector('.browseDoc').className='browseDoc muas4';break;
      }
    },
    reverse(row){
      this.$http.post("api/sics/liveDesktop/openBusiness",{businessId:row.businessId,modifiedBy:this.$store.state.userName})
        .then(res => {
        });
    },
    openBPSICS() {
      if (!this.chooseRow.rmSettleCompanyCode) {
        this.$message({
          type: "error",
          message: "process中rmSettleCompanyCode无值，打不开"
        });
        return false;
      }
      this.$http.post("api/sics/liveDesktop/openBpLedger", {modifiedBy: this.$store.state.userName,bpId: this.chooseRow.rmSettleCompanyCode})
        .then(res => {
          if (res.status === 200 &&res.data=="success") {
          this.$message({message:'操作成功',type: 'success'});
          } else{ this.$message({message:'打开失败',type: 'warning'}); }
        });
    },
    addRemark(row){
      this.title = '添加意见';
      this.dialogState = 8;
      this.textareaOpinion = "";
      this.dialogFormVisible5 = true;
      this.remarkRow = row;
    },
    copy(id,tag){
      let Url2 = null;
      if(!tag){Url2=document.getElementById(id).innerText;}
      let oInput = document.createElement('input');
      tag?oInput.value = ' ':oInput.value = Url2;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = 'oInput';
      oInput.remove();
      if(!tag){this.$message({message: '复制成功',type: 'success'});}
    },
    handleSelectionChange(val) {},
    getName(name) {
      // 获取流程提交指派人
      this.$http.post("api/activiti/getAssigneeName", { roleName: name })
        .then(res => {
          if (res.status === 200) {
            this.TJRoptions = res.data;
          }
        });
    },
    openSics(row) {
      //  获取当前选中worksheet
      this.$http.post("api/sics/liveDesktop/openWorksheet", {modifiedBy: this.$store.state.userName,worksheetId: row.wsId})
        .then(res => {
          if (res.status === 200 &&res.data=="success") {
          this.$message({message:'操作成功',type: 'success'});
          } else{ this.$message({message:'打开失败',type: 'warning'}); }
        });
    },
    onSics(tag) {
      let url = "";
      if (this.$route.query.tag === 'billEntry' || this.$route.query.tag === 'billSignBack') {  // 录入、签回===SICS库
        url = "/worksheet/wSCheck/enterSicsReturn";
      } else {  // 复核===当前库
        url = "/worksheet/wSCheck/reviewSicsReturn";
      }
      this.$http.post(`api${url}`, {
        actOperator: this.$store.state.userName,
        processId: this.chooseRow.processId,
        docId: this.docViewRow ? this.docViewRow.docId : ""
      }).then(res => {
        if (res.status === 200 && res.data) {
          this.SICSData = res.data;
          this.getBillInfo();
        }
      });
    },
    mailSend(tag) {  
      if (tag == 1) { // 邮件通知
        // 显示内容模板---------格式不要动，不要空出空格
        if(this.chooseRow.businessOrigin=="International"){ // 国际
this.emailContent=`Dear Sir/Madam:
Attached please find our signed copy of the SOA for your record.  Please note this is an automated delivery email - please do not reply directly.  
Should you have any questions concerning to the attachment,  please feel free to contact the designated technical accountant whose contact info provided as below.
Thanks & Best Regards，

${this.$store.state.userName} (${sessionStorage.getItem('userCName')})
Accounting Service Center
China Property & Casualty Reinsurance Company Limited
On behalf of
China Reinsurance (Group) Corporation
Tel: ${sessionStorage.getItem('mobile')==null?'':sessionStorage.getItem('mobile')} | E-mail: ${sessionStorage.getItem('email')==null?'':sessionStorage.getItem('email')}
Address: China Re Building 1705, No.11 Jinrong Avenue, Xicheng District, Beijing, China, 100033`
        } else{ // 国内
this.emailContent=`敬启者：
附上我方签章版文件，请查收惠存。
本邮件为系统自动发送，请勿直接回复。如有问题，请联系下方落款人。
顺颂商祺！

${this.$store.state.userName} (${sessionStorage.getItem('userCName')})
Accounting Service Center
China Property & Casualty Reinsurance Company Limited
On behalf of
China Reinsurance (Group) Corporation
Tel: ${sessionStorage.getItem('mobile')==null?'':sessionStorage.getItem('mobile')} | E-mail: ${sessionStorage.getItem('email')==null?'':sessionStorage.getItem('email')}
Address: China Re Building 1705, No.11 Jinrong Avenue, Xicheng District, Beijing, China, 100033`
        }
        this.$http.get("api/worksheet/wSEntry/getEmailContacts").then(res => {
          if (res.status === 200) {
            this.dialogFormVisible2 = true;
            this.title = "邮件通知";
            this.mailOption = res.data;
          }
        });
      } else {
        // 上传附件
        this.dialogFormVisible2 = true;
        this.title = "上传附件";
      }
    },
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
    elSelect(item){this.mailInfo = item.emailAddr},
    elSelect2(item){this.ccUser = item.emailAddr},
    send() {
      console.log(this.emailContent,'this.emailContent');
      console.log(this.emailContent.indexOf('\r'));
      // return false;
      if (this.title == "OCR上传") {
        // this.$http.post("api/anyShare/fileOperation/previewDocument",Object.assign({}, this.ocrRow, { processId: this.chooseRow.processId}),{ responseType: "blob" })
        //   .then(res => {
        //     if (res.status == 200) { 
        //       let resFile = new FormData();
              // 旧的
              // resFile.append("filePatn", res.data);
              // resFile.append("recognize_service", this.recognize_service);
              // this.$http.post("ocrApi/PrivatizingOcrTest/ocrDiscern.do", resFile, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
              // 新的
        this.$http.post("api/ocrSystem/requestOCR", {docCloudId:this.ocrRow.docCloudId,actOperator:this.chooseRow.curOperator,recognize_service:this.recognize_service})
          .then(res => {
            if (res.status === 200 && res.data.code == 0) {
              this.$message({ type: "success", message: res.data.msg });
              this.dialogFormVisible2 = false;
            } else {
              if (res.data.msg) {
                this.$message.error(res.data.msg);
                this.dialogFormVisible2 = false;
              }
            }
          });
          //   }
          // });
      } else if (this.title == "邮件通知") {
        let info = {},params = null;
        info = Object.assign({},{
         actOperator:this.$store.state.userName,
         emailAddr:this.mailInfo,
         emailContent: this.emailContent, 
         mailTitle: this.mailTitle,
         processId:this.chooseRow.processId,
         ccUser:this.ccUser,
         });
        // 本地上传
        if (this.file.length) {
          var resFile = new FormData();
          this.file.forEach(el => {resFile.append("file", el);});
          // resFile.append("file", this.file[0]);
          for (let k in info) {resFile.append(k, info[k]);}
        }
            console.log(this.$route.query.num)

        // docList 上传
        if (this.chooseDocList && this.chooseDocList.length) {
          // let row = this.tableData[this.chooseDocList];
          // this.$http.post("api/anyShare/fileOperation/previewDocument",Object.assign({}, row, { processId: this.chooseRow.processId }),{ responseType: "blob" })
          //   .then(res => {
          //     if (res.status === 200) {
          //       let resFiles = new FormData();
          //       resFiles.append("file", res.data);
          //       for (let k in info) { resFiles.append(k, info[k]); }
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
          this.$http.post("api/worksheet/wSEntry/sendEmail", {actOperator:this.$store.state.userName,ccUser:this.ccUser,emailAddr:this.mailInfo,emailContent: this.emailContent, mailTitle: this.mailTitle, docCId:this.chooseDocList}).then(res => {
            if (res.status === 200 && res.data.code == 0) {
              this.$message({type: "success",message: res.data.msg});
              this.dialogFormVisible2 = false;
            } else{
              this.$message({type: "error",message: res.data.msg});
              this.dialogFormVisible2 = false;
            }
          });
        } else{ 
          this.file.length ? (params = resFile) : (params = info);
          this.$http.post("api/worksheet/wSEntry/sendEmail", params).then(res => {
              if (res.status === 200 && res.data.code==0) {
                this.$message({ type: "success", message:res.data.msg});
                this.dialogFormVisible2 = false;
                this.fileList = [];
                this.file = [];
              } else{
                this.$message({type: "error",message: res.data.msg});
                this.dialogFormVisible2 = false;
              }
            });
        }
      }
    },
    submit(tag, name,wsId) {
      this.dialogState = tag;
      this.tagName = name;
      this.assignee = null;
      switch (tag) {
        case 1: // 指派  ==== 两种
          this.$http.get(`api/worksheet/wSEntry/checkRobortUser`,{params:{processId:this.chooseRow.processId}}).then(res => {
            this.checkRobortUser = res.data; // 0 需要屏蔽自己，1不需要
          })
          this.dialogFormVisible5 = true;
          this.title = "指派";
          if (name === "录入指派") {
            this.getName("账单录入");
          } else {
            this.getName("账单复核");
          }
          break;
        case 2: // 添加意见  ----- 不需要选择人,但是有弹窗 assign：录入人
          this.opinion = "";
          this.wsId = wsId;
          this.textareaOpinion = "";
          this.title = "添加意见";
          this.dialogFormVisible5 = true;
          // 不用下拉框
          break;
        case 3: // 复核通过  ----- 不需要选择人，根据wsSignbackFlag判断是否需要签回，
          // this.title = '复核通过';
          if (this.$route.query.tag === "billCheck") {
            this.$http.post("api/worksheet/wSCheck/getType", {
                modifiedBy: this.$store.state.userName,
                processID: this.chooseRow.processId
              })
              .then(res => {
                if (res.status === 200) {
                  if (res.data.code == 1) {
                    this.$message.error(res.data.msg);
                    return false;
                  } else {
                    // 9.10 生产环境有问题，胖虎表示要改前端传参，不按照SIGNBACK来判断assign，改变逻辑，以下注释的为原代码，
                    // let assign =
                    //   this.$route.query.SIGNBACK == 1
                    //     ? `${this.chooseRow.entryOperator}`
                    //     : this.$store.state.userName;

                    // 9.10 以下为改变的代码，全部取entryOperator
                    let assign = this.chooseRow.entryOperator;

                    this.$confirm("是否复核通过？", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {
                      this.$http.post("api/worksheet/activitiForWorksheet/commonActivitiForWorksheet",
                          {
                            processStatus: "SIGNBACK",
                            wsSignbackFlag: "1",
                            processId: this.chooseRow.processId,
                            procInstId: this.chooseRow.processInstId,
                            assignee: assign,
                            type: "SIGNBACK",
                            actOperator: this.$store.state.userName
                          }
                        )
                        .then(res => {
                          if (res.status === 200 && res.data.errorCode == 1) {
                            this.dialogFormVisible = false;
                            this.$router.push({ name: this.$route.query.tag });
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
              });
          }

          // if(!this.billCheckType){
          //   this.$message.error('请关闭账单，并同步SICS');
          //   return false;
          // }

          break;
        case 4: // 置废
          // this.$confirm("是否置废？", "提示", {
          //   confirmButtonText: "确定",
          //   cancelButtonText: "取消",
          //   type: "warning"
          // }).then(() => {
            this.$prompt('请输入置废原因', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9]+/,
              inputErrorMessage: '请输入正确内容'
            }).then(({ value }) => {
            this.$http.post("api/worksheet/activitiForWorksheet/commonActivitiForWorksheet",
                {
                  processId: this.chooseRow.processId,
                  procInstId: this.chooseRow.processInstId,
                  assignee: this.$store.state.userName,
                  type: "INACTIVE",
                  actOperator: this.chooseRow.curOperator,
                  opinion:value,
                }
              )
              .then(res => {
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.dialogFormVisible = false;
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
        case 5: // 状态挂起
          if (!this.isHover) {
            this.title = "悬停";
            this.dialogFormVisible5 = true;
            // this.$confirm('是否状态悬停？', '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            //   }).then(() => {
            //     this.$http.post('api/worksheet/activitiForWorksheet/commonActivitiForWorksheet',
            //     {processId:this.chooseRow.processId,
            //     procInstId:this.chooseRow.processInstId,
            //     assignee:this.chooseRow.curOperator,
            //     actOperator:this.chooseRow.curOperator,
            //     type:'PENDING'}).then(res =>{
            //     if(res.status === 200 && res.data.errorCode == 1){
            //       this.isHover = !this.isHover;
            //     } else if(res.data.errorMessage){
            //       this.$message.error(res.data.errorMessage);
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
                .post(
                  "api/worksheet/activitiForWorksheet/commonActivitiForWorksheet",
                  {
                    processId: this.chooseRow.processId,
                    procInstId: this.chooseRow.processInstId,
                    assignee: this.chooseRow.curOperator,
                    type: "RECOVERY",
                    actOperator: this.chooseRow.curOperator
                  }
                )
                .then(res => {
                  if (res.status === 200 && res.data.errorCode == 1) {
                    this.isHover = !this.isHover;
                  } else if (res.data.errorCode == 0) {
                    this.$message({
                      type: "error",
                      message: res.data.errorMessage
                    });
                  }
                });
            });
          }

          break;
        case 6: // 流程提交 ===== 2种
          this.$http.get(`api/worksheet/wSEntry/checkRobortUser`,{params:{processId:this.chooseRow.processId}}).then(res => {
            this.checkRobortUser = res.data; // 0 需要屏蔽自己，1不需要
          })
          if (name === "录入提交") {
            this.getName("账单复核");
            this.dialogFormVisible5 = true;
            this.title = "流程提交";
            setTimeout(()=>{
              if (this.SICSData == null || !this.SICSData.length) {
                this.$message({ type: "warning", message: "无账单信息" });
              }
            },100)
          } else {
            //  签回流程提交----到关闭 不需要选择下一人，assign需要录入人
            this.$confirm("是否流程结束？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              //   此处assign 也需要录入人
              this.$http
                .post(
                  "api/worksheet/activitiForWorksheet/commonActivitiForWorksheet",
                  {
                    processId: this.chooseRow.processId,
                    procInstId: this.chooseRow.processInstId,
                    assignee: this.chooseRow.entryOperator,
                    type: "CLOSE",
                    actOperator: this.chooseRow.curOperator
                  }
                )
                .then(res => {
                  if (res.status === 200 && res.data.errorCode == 1) {
                    this.dialogFormVisible = false;
                    this.$router.push({ name: this.$route.query.tag });
                  } else{ this.$message({type: "error",message: res.data.errorMessage}); }
                });
            });
          }
          break;
        case 7: // 签回
          this.$confirm("是否确认签回？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {this.$http.post("api/worksheet/wSEntry/update",
                {
                  processId: this.chooseRow.processId,
                  // hasRecheckFlag:'1',
                  wsHasSignback:'1',
                  // procInstId: this.chooseRow.processInstId,
                  // assignee: this.chooseRow.entryOperator,
                  // type: "SIGNBACK",
                  // actOperator: this.chooseRow.curOperator,
                }
              )
              .then(res => {
                if (res.status === 200 && res.data.code == 0) {
                  this.$message({ type: "success", message: res.data.msg});
                  this.dialogFormVisible = false;
                  // 改第二次，胖虎说标记签回之后留在本页面，不跳转
                  // this.$router.push({ name: this.$route.query.tag });
                } else{ this.$message({ type: "error", message: res.data.msg}); }
              });
          });
          break;
          case 8: // 复核驳回
          this.$confirm("是否复核驳回？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http.post("api/worksheet/activitiForWorksheet/commonActivitiForWorksheet",{
              processId: this.chooseRow.processId,
              procInstId: this.chooseRow.processInstId,
              assignee: this.chooseRow.entryOperator,
              actOperator: this.chooseRow.curOperator,
              type: "REJECT"
            }).then(res=>{
              if (res.status === 200 && res.data.errorCode == 1) {
                this.$router.push({ name: this.$route.query.tag });
              } else if (res.data.errorCode == 0) {
                this.$message({ type: "error", message: res.data.errorMessage});
              }
            })
          });
          break;
      }
    },
    confirm() {
      // this.dialogFormVisible = false;
      switch (this.dialogState) {
        case 1: // 指派  ==== 两种
          if (!this.assignee) {
            this.$message.error("请选择指派人");
            return false;
          }
          if (this.tagName === "录入指派") {
            this.$http
              .post("api/activiti/setAssignee", {
                processId: this.chooseRow.processId,
                procInstId: this.chooseRow.processInstId,
                assignee: this.assignee,
                taskName: "待处理",
                entryOperator: this.assignee,
                actOperator: this.chooseRow.curOperator,
                processInstanceKey: "taProcess01"
              })
              .then(res => {
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.dialogFormVisible5 = false;
                  this.$router.push({ name: this.$route.query.tag });
                } else if (res.data.errorCode == 0) {
                  this.$message({
                    type: "error",
                    message: res.data.errorMessage
                  });
                }
              });
          } else {
            // 复核指派 -----------------------
            this.$http
              .post("api/activiti/setAssignee", {
                processId: this.chooseRow.processId,
                procInstId: this.chooseRow.processInstId,
                assignee: this.assignee,
                taskName: "待复核",
                actOperator: this.chooseRow.curOperator,
                processInstanceKey: "taProcess01"
              })
              .then(res => {
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.dialogFormVisible5 = false;
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
        case 2: // 添加意见
          if (!this.opinion) {
            this.$message.error("请选择原因");
            return;
          }
          if (this.opinion == "其它" && !this.opinion) {
            this.$message.error("请填写原因");
            return;
          }
          this.$http.post("api/worksheet/wSCheck/update",{
                wsId:this.wsId,
                // processId: this.chooseRow.processId,
                // procInstId: this.chooseRow.processInstId,
                // assignee: this.chooseRow.entryOperator,
                remark:this.textareaOpinion,
                rejectType:this.opinion,
                // actOperator: this.chooseRow.curOperator,
                // type: "REJECT"
              }
            )
            .then(res => {
              if (res.status === 200 && res.data.code == 0) {
                this.getBillInfo();
                // this.onSics();
                this.dialogFormVisible5 = false;
                this.$message({type: "success",message: res.data.msg});
              } else if (res.data.code == 1) {
                this.$message({type: "error",message: res.data.msg});
              }
            });
          break;
        case 3: // 复核通过
          break;
        case 4: // 置废
          break;
        case 5: // 状态挂起
          if (!this.pendingReason) {
            this.$message.error("请填写悬停原因");
            return false;
          }
          this.$http.post("api/worksheet/activitiForWorksheet/commonActivitiForWorksheet",
              {
                processId: this.chooseRow.processId,
                procInstId: this.chooseRow.processInstId,
                assignee: this.chooseRow.curOperator,
                pendingReason: this.pendingReason,
                actOperator: this.chooseRow.curOperator,
                type: "PENDING"
              }).then(res => {
              if (res.status === 200 && res.data.errorCode == 1) {
                this.isHover = !this.isHover;
                this.dialogFormVisible5 = false;
              } else if (res.data.errorMessage) {
                this.$message.error(res.data.errorMessage);
              }
            });
          break;
        case 6: // 流程提交 === 两种
          if (!this.assignee) {
            this.$message.error("选择处理人");
            return false;
          }
          if (this.tagName === "录入提交") {
            if (this.radio == null && this.chooseRow.wsBusinessType!='F') {
              this.$message({ type: "error", message: "请选择是否需要签回" });
              return false;
            }
            this.$http.post("api/worksheet/activitiForWorksheet/commonActivitiForWorksheet",
                {
                  processId: this.chooseRow.processId,
                  procInstId: this.chooseRow.processInstId,
                  assignee: this.assignee,
                  actOperator: this.$store.state.userName,
                  wsSignbackFlag: this.radio,
                  type: "RECHECK"
                }
              )
              .then(res => {
                if (res.status === 200 && res.data.errorCode == 1) {
                  this.dialogFormVisible = false;
                  this.$router.push({ name: this.$route.query.tag });
                } else if (res.data.errorCode == 0) {
                  this.$message({
                    type: "error",
                    message: res.data.errorMessage
                  });
                }
              });
          } else {
            // 签回提交
          }
          break;
        case 7: // 签回
        break;
        case 8: // 
          if(!this.textareaOpinion){
            this.$message({ type: "error", message: "请添加意见" });
            return false;
          }
          this.$http
          .post("api/worksheet/wSCheck/update", { wsId:this.remarkRow.wsId,remark:this.textareaOpinion })
          .then(res => {
            if (res.status === 200 && res.data.code == '0') {
              this.$message({ type: "success", message: res.data.msg });
              this.textareaOpinion = "";
              this.dialogFormVisible5 = false;
              // this.$http.get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`).then(res => {
              // if (res.status === 200) {
              //     this.SICSData = res.data.workSheetVOlist;
              //   }
              // });
            } else if(res.data.code == '1'){ this.$message({ type: "error", message: res.data.msg }); }
          });
        break;
      }
    },
   docView(row,index) {
      this.$forceUpdate();
      console.log(row)
      if (row) {
        let arrr = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT','XLS','xls','ppt','PPT','pptx','PPTX'];
        this.suffixFlag = arrr.some(el=>{ return el==row.suffix; })
        if(row.suffix && !this.suffixFlag){ return false; }
        this.docViewRow = row;
        row.redFlag.flag=true;
        // this.tableData= this.tableData;
        this.$http.post("api/anyShare/fileOperation/getLogInInfo").then(res => {
          if (res.status == 200) {
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
        this.docViewRow = {};
        document.getElementById("iframeId").contentWindow.postMessage({}, "*");
        document.getElementById("iframeId").contentWindow.location.reload(true);
      }
      // this.getBillInfo();
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
    },
    handleClick(tag, row) {
      if (tag == 1) {
        // 删除
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
                      // this.tableData = res.data.bscDocumentVOlist;
                      let arr = res.data.bscDocumentVOlist;
                      arr.forEach(el=>{
                        if(el.docName){
                          let suffix = el.docName.split('.');
                          el['suffix'] = suffix[suffix.length-1];
                          el['suffixFlag'] = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT','XLS','xls','ppt','PPT','pptx','PPTX'].some(el=>{ return el==suffix[suffix.length-1]; })
                        }
                      })
                      this.tableData = arr;
                      this.docView();
                    }
                  });
              } else if (res.data.errorCode == 0 && res.data.errorMessage) {
                this.$message.error(res.data.errorMessage);
              }
            });
        });
      } else if (tag == 3) {
        // 下载
        this.$http.post("api/anyShare/fileOperation/downloadDocument",Object.assign({}, row, { processId: this.chooseRow.processId }),{ responseType: "blob" })
          .then(res => {
            if (res.status === 200) {
              // this.path = res.data;
              this.path = this.getObjectURL(res.data);
              if (res.data) {
                var a = document.createElement("a");
                if (typeof a.download === "undefined") {
                  window.location = this.path;
                } else {
                  a.href = this.path;
                  a.download = row.docName;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }
              } 
            }
          });
      } else {
        // ocr 上传
        this.dialogFormVisible2 = true;
        this.title = "OCR上传";
        this.ocrRow = row;
      }
    },
    beforeAvatarUpload(file) {
      this.file.push(file);
      clearTimeout(this.setTime);
    },
    reloadTableData(){
      this.$http.get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`).then(res => {
        if (res.status === 200) {
          // this.tableData = res.data.bscDocumentVOlist;
          let arr = res.data.bscDocumentVOlist;
          arr.forEach(el=>{
            if(el.docName){
              let suffix = el.docName.split('.');
              el['suffix'] = suffix[suffix.length-1];
              el['suffixFlag'] = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT','XLS','xls','ppt','PPT','pptx','PPTX'].some(el=>{ return el==suffix[suffix.length-1]; })
            }
          })
          this.tableData = arr;
          this.searchFlag2 = true;
        }
      });
    },
    upload(file) {
      if (this.title === "邮件通知") {
        return false;
      }
      this.setTime = setTimeout(() => {
        let resFile = new FormData();
        this.file.forEach(el => {
          resFile.append("file", el);
        });
        // resFile.append("file", this.file[0]);
        resFile.append("actOperator", this.$store.state.userName);
        resFile.append("processId", this.chooseRow.processId);
        this.$http.post("uploadApi/anyShare/fileOperation/uploadFilesForPageBatch", resFile, {headers: { "Content-Type": "application/json;charset=UTF-8" }})
          .then(res => {
            this.fileList = [];
            this.file = [];
            if (res.status === 200 && res.data.errorCode == 1) {
              this.dialogFormVisible2 = false;
              this.reloadTableData();
            } else if (res.data.errorCode == "0" && res.data.errorMessage) {
              this.$message.error(res.data.errorMessage);
              this.reloadTableData();
            } else {
              this.$message.error("上传失败");
            }
          });
      }, 500);
    },
    split() {
      let arr = document.querySelectorAll(".itemNum");
      // let subProcessArr = [];
      // arr.forEach(el=>{
      //   let obj = {'rmAmount':el.value};
      //   subProcessArr.push(obj);
      // })
      // if(!subProcessArr.length){
      //   this.$message.error('请填写拆分金额');
      //   return;
      // }
      if (!this.subProcess) {
        this.$message.error("请填写拆分数量");
        return;
      }
      if (!this.reason) {
        this.$message.error("请填写拆分理由");
        return;
      }
      this.$http
        .post("api/worksheet/wSEntry/processSplit", {
          processId: this.chooseRow.processId,
          // subProcess:subProcessArr,
          subProcess: +this.subProcess,
          actOperator: this.chooseRow.curOperator,
          reason: this.reason
        })
        .then(res => {
          if (res.status == 200 && res.data.code == 0) {
            this.$message({ message: "拆分成功", type: "success" });
            this.dialogFormVisible = false;
          } else if (res.data.code == 1 && res.data.msg) {
            this.$message.error(res.data.msg);
          }
        });
    },
    itemSplit() {
      if (!this.subProcessFlag) {
        this.subProcessFlag = false;
        return false;
      }
      let idInputWrap = document.getElementById("idInputWrap");
      let child = document.querySelectorAll(".item");
      if (child.length) {
        child.forEach(el => {
          idInputWrap.removeChild(el);
        });
      }
      if (this.subProcess && !isNaN(+this.subProcess) && this.subProcess > 0) {
        for (let i = 0; i < this.subProcess; i++) {
          let item = document.createElement("div");
          item.className = "item";
          item.innerHTML = `<span>第${i +
            1}条</span><input type="number" class="itemNum">`;
          idInputWrap.append(item);
        }
      }
      this.subProcessFlag = false;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    }
  },
  watch:{
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
            }
          })
          this.makeDocNum-=1;
        }
      }
    },
  },
};
</script>

<style scoped>
.catastrophe .el-form-item{
  width: 32%;
  display: inline-block;
}
.catastrophe .el-form-item .el-select{
  width: 220px;
}
.catastrophe .el-form-item .el-input{
  width: 220px;
}
.mua1{
 animation:rotateMua1 linear 0s;
  animation-fill-mode:forwards;
}
.mua2{
 animation:rotateMua2 linear 0s;
  animation-fill-mode:forwards;
}
.mua3{
 animation:rotateMua3 linear 0s;
  animation-fill-mode:forwards;
}
.mua4{
 animation:rotateMua4 linear 0s;
  animation-fill-mode:forwards;
}
.muas1{
 animation:rotateMuas1 linear 0s;
  animation-fill-mode:forwards;
}
.muas2{
 animation:rotateMuas2 linear 0s;
  animation-fill-mode:forwards;
}
.muas3{
 animation:rotateMuas3 linear 0s;
  animation-fill-mode:forwards;
}
.muas4{
 animation:rotateMuas4 linear 0s;
  animation-fill-mode:forwards;
}
@keyframes rotateMua1{
  0%{
    transform: rotate(0deg)
  }
  100%{
    transform: rotate(90deg)
  }
}
@keyframes rotateMua2{
  0%{
    transform: rotate(90deg)
  }
  100%{
    transform: rotate(180deg)
  }
}
@keyframes rotateMua3{
  0%{
    transform: rotate(180deg)
  }
  100%{
    transform: rotate(270deg)
  }
}
@keyframes rotateMua4{
  0%{
    transform: rotate(270deg)
  }
  100%{
    transform: rotate(360deg)
  }
}
@keyframes rotateMuas1{
  0%{
    transform: rotate(-90deg)
  }
  100%{
    transform: rotate(0deg)
  }
}
@keyframes rotateMuas2{
  0%{
    transform: rotate(-180deg)
  }
  100%{
    transform: rotate(-90deg)
  }
}
@keyframes rotateMuas3{
  0%{
    transform: rotate(-270deg)
  }
  100%{
    transform: rotate(-180deg)
  }
}
@keyframes rotateMuas4{
  0%{
    transform: rotate(-360deg)
  }
  100%{
    transform: rotate(-270deg)
  }
}
.detailEntry {
  /* padding:0 30px; */
  width: 100%;
  /* padding-left: 64px; */
  /* height: -webkit-fill-available; */
  padding-bottom: 90px;
  /* display: flex; */
  /* background: #f5f5f5; */
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
  overflow: hidden;
}
.btns {
  width: 100%;
  position: fixed;
  left: 180px;
  bottom: 0;
  z-index: 999;
  background:#FFFFFF ;
  height: 89px;
  line-height: 89px;
  padding: 0 16px;
  overflow: hidden;
  box-shadow:0px 0px 1px 0px rgba(155,155,155,1);
}
.btn .el-button,.btns .el-button {
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 10px;
  border: 1px solid #005c8d;
  background-color: #005c8d;
  color: #fff;
}
.btn .el-button.is-plain:focus,
.btn .el-button.is-plain:hover {
   background-color: #1A6C98;
}
.btns .el-button.is-plain:focus,
.btns .el-button.is-plain:hover {
   background-color: #1A6C98;
}
.detail-name{
  white-space: nowrap;
}
.detail-word {
  /* background-color: #ecf5ff; */
  background-color: rgba(244, 245, 246, 1);
  padding: 10px;
  margin-top: 30px;
}
.right>>>.browseDoc {
  background-color: #ecf5ff;
  width: 100%;
  height: 600px;
  /* 9.4 文档高度*/
  border: 1px solid #d4d4d4;
  border-top: none;
}
.right>>>.browseDocs {
  background-color: #ecf5ff;
  width: 100%;
  height: 100%;
  border: 1px solid #d4d4d4;
  border-top: none;
}
.el-table{
  background: #fff;
}
.left {
  width: 100%;
  /* background: #F5F5F5; */
  /* box-shadow:4px 0px 10px 0px rgba(169,169,169,0.5); */
  /* padding: 20px; */
  /* padding-right: 10px; */
}
.el-tabs__content{
  background: #f5f5f5;
}
.right {
  width: 100%;
  height: 680px;
  /* padding: 20px; */
  /* background-color: #eeeeee; */
  background: #fff;
  /* 8.29 文档背景色*/
  padding-left: 10px;
  box-sizing: border-box;
  /* margin-left: 10px; */
}
.fy2 {
  text-align: right;
  margin-top: 20px;
}
.fy1 {
  padding-left: 0;
}
.el-collapse {
  border: none;
}
.el-collapse-item {
  padding: 0 20px;
  background-color: #fff;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
ul.detail-ul {
  /* height: 300px; */
  height: 150px;
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  margin-top: 10px;
  box-sizing: border-box;
  border:1px solid #eaeaea;
  padding: 20px;
  border-radius: 3px;
}
li.detail-item {
  display: flex;
  width: 48%;
  height: 25px;
  line-height: 25px;
  color: #999;
}
.detail-ul li .detail-content {
  color: #000;
}
.detailSearch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background:#fff;
  border-bottom: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
}
.right >>>.detailSearch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background:#fff;
  border-bottom: 1px solid #eaeaea;
}
.el-collapse-item__header {
  border-bottom: none;
}
/* .document {
  border: 1px solid rgba(238, 238, 238, 1);
  border-radius:8px;
} */
.itemNum {
  height: 36px;
  border-radius: 4px;
  outline: none;
  border: 1px solid #dcdfe6;
  margin-left: 10px;
  margin-bottom: 10px;
}
.goBack {
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  background-color: #2b3e50;
  color: rgb(255, 208, 75);
  display: flex;
  justify-content: space-between;
}
.selfRadio .el-radio {
  margin-bottom: 10px;
}
.document[data-v-0ae63f9a] {
  border: none;
}
.smallHand {
  cursor: pointer;
  color: #409eff;
}
.leftBack{
  position:fixed;top:65px;left:90px;z-index:100;
}
.rightBack{
  position:fixed;top:65px;left:205px;z-index:100;
}
.changeLayoutflag{
  height: 680px;
  position: relative;
}
.changeLayoutflags{
  height: 100%;
  padding-bottom: 0;
  position: relative;
}
.heigh{
  height: 100%;
}
.rotuta{
  position: absolute;
  right:0;
  z-index: 999;
  display: flex;
  height: 36px;
  line-height: 36px;
}
.rotuta li{
  height: 36px;
  width: 36px;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
}

</style>
