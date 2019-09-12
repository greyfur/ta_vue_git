<template>
  <div class="billCom">
    <div :class="searchFlag===true?'searchNew':''" >
      <div class="titleSearch" @click="searchFlag = !searchFlag" style="margin-bottom:10px;">
        <i style="margin-right:8px;" :class="searchFlag===false?'el-icon-arrow-down':'el-icon-arrow-up'"></i>查询
      </div>
      <el-collapse-transition>
        <div v-show="searchFlag" class-name="transition-box">
          <el-row :gutter="10" class="billRow" >
            <el-col :span="8">
              <span class="slable">流程编号 &nbsp;&nbsp;</span>
              <el-input placeholder="请输入流程编号" v-model.trim="querySearch.processId"></el-input>
            </el-col>
            <el-col :span="8">
              <span class="slable">流程名称 &nbsp;&nbsp;</span>
              <el-input placeholder="请输入流程名称" v-model.trim="querySearch.processName"></el-input>
            </el-col>
            <el-col :span="8" v-if="urlName!=='billCheck'&&urlName!=='billSignBack'">
              <span class="slable">流程状态 &nbsp;&nbsp;</span>
              <el-select clearable v-model="querySearch.processStatus" placeholder="请选择流程状态">
                <el-option v-for="item in ['待处理','已悬停']" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8" v-if="urlName!=='sortOperation'&&urlName!=='billEntry'">
              <span class="slable">收到日期 &nbsp;&nbsp;</span>
              <el-date-picker
                value-format="timestamp"
                v-model="querySearch.wsReceiptDate"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="billRow">
            <el-col :span="8">
              <span class="slable">任务类型 &nbsp;&nbsp;</span>
              <el-select clearable v-model="querySearch.wsBusinessType" placeholder="请选择流程状态"  @change="onWsBusinessType">
                <el-option v-for="item in YWoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
             <el-col :span="8">
              <span class="slable">账单类型 &nbsp;&nbsp;</span>
              <el-select clearable v-model="querySearch.wsType" placeholder="请选择账单类型">
                <el-option
                  v-for="item in ZDoptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="zq1Parent">
              <span class="slable">账期 &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;</span>
              <input class="wsDate" style="width:224px;height:40px;border-radius:5px;outline:none;border:1px solid #DCDFE6;" placeholder="请选择账期" v-model="querySearch.wsPeriod" @click.stop="zq1FlagFn()" />
              <div class="zq1" v-show="zq1Flag">
                <p class="zqTitle">
                  <span style="color:#ccc;transform: scale(.6);" @click.stop="countYear('-')"><i class="iconfont iconGroup33"></i></span>
                  <span style="color:#000;">{{zq1Year}}</span>
                  <span style="color:#ccc;transform: scale(.6);" @click.stop="countYear('+')"><i class="iconfont iconGroup11"></i></span>
                </p>
                <ul class="zq" id="zq">
                  <li v-for="(item,index) in zqList" :key="item" :class="zq1Day===index?'active':''" @click="chooseDay(item,index,1)">{{item}}</li>
                </ul>
              </div>
            </el-col>
          </el-row>
           <el-row :gutter="10" class="billRow Futop"> 
            <el-col :span="8" v-if="urlName!=='sortOperation'">
              <span class="slable">录入人 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <!-- <el-input placeholder="请输入录入人查询" v-model.trim="billSearch.registBy"></el-input> -->
              <el-select clearable filterable v-model="querySearch.registBy" placeholder="请选择录入人">
              <el-option v-for="(item,index) in nameList" :key="item" :value="index" :label="item">
                <span style="float:left">{{item}}</span>
                <span style="float:right;color: #8492a6; font-size: 13px">{{index}}</span>
              </el-option>
            </el-select>
            </el-col>
            <el-col :span="8" v-if="urlName!=='sortOperation'">
              <span class="slable">复核人 &nbsp;&nbsp; &nbsp;&nbsp;</span>
              <el-select clearable v-model="querySearch.closedBy" placeholder="请选择复核人">
                <el-option v-for="(item,index) in nameList" :key="index" :label="item" :value="index"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <span class="slable">分出公司 &nbsp;&nbsp;</span>
              <el-select clearable filterable v-model="querySearch.cedentModel" placeholder="请选择分出公司">
                <el-option
                  v-for="(item,index) in cedentList"
                  :key="index"
                  :label="item.codecode+' - '+item.codeName"
                  :value="index">
                  <span style="float:left">{{ item.codecode }}</span>
                  <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" v-if="urlName==='sortOperation'">
              <span class="slable">经纪公司 &nbsp;&nbsp;</span>
              <el-select clearable filterable v-model="querySearch.brokerModel" placeholder="请选择经纪公司">
                <el-option
                  v-for="(item,index) in brokerList"
                  :key="index"
                  :label="item.codecode+' - '+item.codeName"
                  :value="index">
                  <span style="float:left">{{ item.codecode }}</span>
                  <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" v-if="urlName==='sortOperation'">
              <span class="slable">收到日期 &nbsp;&nbsp;</span>
              <el-date-picker
                value-format="timestamp"
                v-model="querySearch.wsReceiptDate"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="billRow"> 
            <!-- v-show="urlName === 'billEntry'" -->
             <!-- v-show="urlName === 'billCheck'" -->
            <el-col :span="8" v-if="urlName!=='sortOperation'">
              <span class="slable">经纪公司 &nbsp;&nbsp;</span>
              <el-select clearable filterable v-model="querySearch.brokerModel" placeholder="请选择经纪公司">
                <el-option
                  v-for="(item,index) in brokerList"
                  :key="index"
                  :label="item.codecode+' - '+item.codeName"
                  :value="index">
                  <span style="float:left">{{ item.codecode }}</span>
                  <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
                </el-option>
              </el-select>
            </el-col>
           <el-col :span="8" v-if="urlName==='billEntry'">
              <span class="slable">收到日期 &nbsp;&nbsp;</span>
              <el-date-picker
                value-format="timestamp"
                v-model="querySearch.wsReceiptDate"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-col>
            <el-col :span="8" v-if="urlName === 'billSignBack'">
              <span class="slable">是否需签回</span>
              <el-select clearable v-model="querySearch.wsSignbackFlag" placeholder="请选择">
                <el-option v-for="(v,k) of {'是':'1','否':'0'}" :key="v" :label="k" :value="v"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8" v-if="urlName === 'billSignBack'">
              <span class="slable">是否已签回</span>
              <el-select clearable v-model="querySearch.wsHasSignback" placeholder="请选择">
                <el-option v-for="(v,k) of {'是':'1','否':'0'}" :key="v" :label="k" :value="v"></el-option>
              </el-select>
            </el-col>
            <!-- 9.9 UAT原话：所有查询筛选条件移除“账单状态” -->
            <!-- <el-col :span="8">
              <span class="slable">账单状态 &nbsp;&nbsp;</span>
              <el-select clearable v-model="querySearch.wsStatus" placeholder="请选择">
                <el-option v-for="(v,k) of {'Inactive':'2','Open':'1','Closed':'0'}" :key="v" :label="k" :value="v"></el-option>
              </el-select>
            </el-col> -->
          </el-row>
 
           <el-row :gutter="10">
            <el-col :span="24">
              <el-button type="primary" plain @click="handleClick(1)" style="text-align:center;">
                <i class="iconfont iconGroup42" style="margin:0"></i>
              </el-button>
              <el-button type="primary" plain @click="reset" class="borderBtn">
                <i class="iconfont iconGroup39" style="margin:0"></i>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </div>
    <div class="btn">
      <el-button type="primary" v-show="urlName === 'sortOperation'" plain @click="handleClick(0)">
        <i class="iconfont iconGroup91" style="font-size:12px;"></i>手工创建
      </el-button>
      <el-button type="primary" plain @click="init" class="borderBtn">
        <i class="iconfont iconGroup37" style="font-size:12px;"></i>刷新
      </el-button>
      <el-button type="primary" plain @click="init2" class="borderBtn" v-show="urlName === 'sortOperation'">
        <i class="iconfont iconGroup37" style="font-size:12px;"></i>刷新邮件
      </el-button>
    </div>
    <el-table :header-row-class-name="StableClass" :height="changeClientHight" :data="tableData" border style="width: 100%;text-align:center;margin:0 auto;">  
      <el-table-column v-if="urlName === 'billEntry'" width="50" align="center">
        <template slot-scope="scope" v-if="urlName === 'billEntry'">
          <div style="display: flex;align-items: center;justify-content: center;">
            <span :class="scope.row.rejectedFlag == '1'?'statePoint stateRed':'statePoint stateGreen'"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="流程编号" width="170" align="center">
        <template slot-scope="scope">
          <span :class="{'smallHand':urlName !== 'sortOperation'}" @click="goDetail(scope.row)">{{scope.row.processId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程名称" width="400" align="left">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.processName"
            placement="top-start">
            <span class="abbreviate">{{scope.row.processName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="分出公司" width="120" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="(scope.row.wsCedentCode&&scope.row.wsCedentCode!='null')&&(scope.row.wsCedentName&&scope.row.wsCedentName!='null')?scope.row.wsCedentCode+'-'+scope.row.wsCedentName:''"
            placement="top-start">
            <span class="abbreviate" v-if="(scope.row.wsCedentCode&&scope.row.wsCedentCode!='null')&&(scope.row.wsCedentName&&scope.row.wsCedentName!='null')">{{scope.row.wsCedentCode}}-{{scope.row.wsCedentName}}</span>
            <span class="abbreviate" v-if="!scope.row.wsCedentCode&&!scope.row.wsCedentName"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="经纪公司" width="120" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="(scope.row.wsBrokerCode&&scope.row.wsBrokerCode!='null')&&(scope.row.wsBrokerName&&scope.row.wsBrokerName!='null')?scope.row.wsBrokerCode+'-'+scope.row.wsBrokerName:''"
            placement="top-start">
            <span
              class="abbreviate"
              v-if="(scope.row.wsBrokerCode&&scope.row.wsBrokerCode!='null')&&(scope.row.wsBrokerName&&scope.row.wsBrokerName!='null')"
            >{{scope.row.wsBrokerCode}}-{{scope.row.wsBrokerName}}</span>
            <span class="abbreviate" v-if="!scope.row.wsBrokerCode&&!scope.row.wsBrokerName"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="账单类型" width="260" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.wsType" placement="top-start">
            <span class="abbreviate">{{scope.row.wsType}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" width="80" align="center">
        <template slot-scope="scope">{{YWoptionsObj[scope.row.wsBusinessType]}}</template>
      </el-table-column>
      <el-table-column label="账期" align="center" width="130">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.wsPeriod"
            placement="top-start">
            <span class="abbreviate">{{scope.row.wsPeriod}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="urlName=='billSignBack'" label="是否需签回" width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.wsSignbackFlag=="1"?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="urlName=='billSignBack'" label="是否已签回" width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.wsHasSignback=="1"?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="wsReceiptDate" width="120" label="账单收到日期" align="center"></el-table-column>
      <el-table-column label="Reporting Unit" width="120" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.reportUnit"
            placement="top-start">
            <span class="abbreviate">{{scope.row.reportUnit}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="businessOrigin" label="Business Origin" width="130" align="center"></el-table-column>
      <el-table-column prop="baseCompany" label="Base Company" width="140" align="center"></el-table-column>
      <el-table-column :label="urlName==='sortOperation'?'任务来源':'录入人员'" width="110" align="center">
        <template slot-scope="scope">
          <span  v-if="urlName==='sortOperation'">{{nameList[scope.row.curOperator]}}</span>
          <span v-if="urlName!=='sortOperation'">{{nameList[scope.row.registBy]}}</span>
        </template>
      </el-table-column>
       <el-table-column v-if="urlName==='billCheck'||urlName==='billSignBack'||urlName==='billEntry'" label="复核人员" width="110" align="center">
        <template slot-scope="scope">
          <span>{{nameList[scope.row.closedBy]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="processStatus" v-if="urlName!='billSignBack'" label="流程状态" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-dropdown placement="top-start">
            <span class="el-dropdown-link">
              <!-- <i style="margin-left:8px;" class="el-icon-arrow-down"></i> -->
              <i class="iconfont iconcaozuoliebiao"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span v-show="scope.row.pendingFlag || urlName === 'sortOperation'" @click.stop="handleClick(2,scope.row)" class="blueColor">编辑</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span
                  v-show="urlName === 'sortOperation'"
                  @click.stop="splits(scope.row.processId)"
                  class="blueColor"
                >拆分</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span
                  v-show="urlName === 'sortOperation'"
                  @click.stop="handleClick(3,scope.row)"
                  class="blueColor"
                >分配</span>
              </el-dropdown-item>
                <el-dropdown-item>
                  <span
                    v-show="urlName === 'sortOperation'"
                    @click.stop="handleClick(4,scope.row)"
                    class="blueColor"
                  >删除</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span  v-show="urlName !== 'sortOperation'" @click.stop="handleClick(5,scope.row)" class="blueColor">踪迹</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="160" align="center"></el-table-column>
    </el-table>
    <div style="width:100%;display:flex;align-items: flex-end;justify-content: space-between;">
      <div></div>
      <div style="display:flex;align-items: flex-end;justify-content: space-between;">
        <div style="padding-bottom: 5px;padding-right: 10px;" v-if="urlName === 'billEntry'"> 
          <span class='statePoint stateRed'></span><span>异常</span>
          <span class='statePoint stateGreen'></span><span>正常</span>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="mustData.pageNumber"
          :page-sizes="[20, 50, 80, 100]"
          :page-size="mustData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="mustData.total"
        ></el-pagination>
      </div>
    </div> 
    <!-- 弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="modal" :width="title==='流程提交'?'432px':'1160px'">
      <el-form label-position="right" label-width="120px" :model="billSearch" :rules="rules" ref="billSearch" class="SwitchingMode">
        <el-form-item label="流程编号" v-show="title==='查询'">
          <el-input v-model.trim="billSearch.processId" placeholder="请输入流程编号"></el-input>
        </el-form-item>
        <el-form-item label="流程名称" v-show="title==='手工创建' || title==='编辑' || title==='查询'" class="zqForm">
          <el-input v-model.trim="billSearch.processName" placeholder="请输入流程名称"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="wsBusinessType" v-show="title==='手工创建' || title==='编辑'">
          <el-select :disabled='RWFlag' clearable v-model="billSearch.wsBusinessType" placeholder="请选择任务类型" @change="onWsBusinessType">
            <el-option v-for="item in YWoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单类型" v-show="title==='手工创建' || title==='编辑' || title==='查询'">
          <el-select clearable v-model="billSearch.wsType" placeholder="请选择账单类型">
            <el-option v-for="item in ZDoptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Business Origin" prop="businessOrigin" v-show="title==='手工创建' || title==='编辑'">
          <el-select clearable v-model="billSearch.businessOrigin" placeholder="请选择Business Origin">
            <el-option
              v-for="item in businessOriginList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Base Company" v-show="title==='手工创建' || title==='编辑'" prop="baseCompany">
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
            placeholder="请选择Reporting Unit">
            <el-option
              v-for="item in ReportUnitList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账期" v-show="title==='手工创建' || title==='编辑' || title==='查询'" class="zqForm">
          <input class="wsDate" style="width:196px;height:40px;border-radius:5px;outline:none;border:1px solid #DCDFE6;" placeholder="请选择账期" v-model="billSearch.wsPeriod" @click.stop="zq1FlagFn()" />
              <div class="zq1" v-show="zq1Flag">
                <p class="zqTitle">
                  <span style="color:#ccc;transform: scale(.6);" @click.stop="countYear('-')"><i class="iconfont iconGroup33"></i></span>
                  <span style="color:#000;">{{zq1Year}}</span>
                  <span style="color:#ccc;transform: scale(.6);" @click.stop="countYear('+')"><i class="iconfont iconGroup11"></i></span>
                </p>
                <ul class="zq" id="zq">
                  <li v-for="(item,index) in zqList" :key="item" :class="zq1Day===index?'active':''" @click="chooseDay(item,index)">{{item}}</li>
                </ul>
              </div>
        </el-form-item>
        <el-form-item label="流程状态" v-show="title === '查询' && urlName === 'billEntry'">
          <el-select clearable v-model="billSearch.processStatus" placeholder="请选择流程状态">
            <el-option v-for="item in ['待处理','已悬停']" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分出公司" :prop="billSearch.wsBusinessType=='C'?'':'cedentModel'" v-show="title === '手工创建' || title==='编辑'">
          <el-select clearable filterable v-model="billSearch.cedentModel" placeholder="请选择分出公司">
            <el-option
              v-for="(item,index) in cedentList"
              :key="index"
              :label="item.codecode+' - '+item.codeName"
              :value="index">
              <span style="float:left">{{ item.codecode }}</span>
              <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经纪公司" :prop="billSearch.wsBusinessType!='O'&&billSearch.wsBusinessType!='C'?'brokerModel':''" v-show="title === '手工创建' || title==='编辑'">
          <el-select clearable filterable v-model="billSearch.brokerModel" placeholder="请选择经纪公司">
            <el-option v-for="(item,index) in brokerList" :key="index" :label="item.codecode+' - '+item.codeName" :value="index">
              <span style="float:left">{{ item.codecode }}</span>
              <span style="float:right;color: #8492a6; font-size: 13px">{{ item.codeName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单收到日期" :prop="billSearch.wsBusinessType=='C'?'':'wsReceiptDate'" v-show="title === '手工创建' || title==='编辑'">
          <el-date-picker value-format="timestamp" v-model="billSearch.wsReceiptDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否为历史账单" v-show="title!=='流程提交'&&title!=='踪迹'&&billSearch.wsBusinessType=='C'">
          <el-checkbox v-model="historicalBill">是</el-checkbox>
        </el-form-item>
        <el-form-item label="原流程编号" :prop="!historicalBill&&title==='编辑'&& billSearch.wsBusinessType=='C'?'parentProcessId':''" v-show="title!=='流程提交'&&title!=='踪迹'&&billSearch.wsBusinessType=='C'&&!historicalBill">
          <el-input v-model.trim="billSearch.parentProcessId" placeholder="请输入原流程编号"></el-input>
        </el-form-item>
        <el-form-item label="收到邮件更正期" v-show="title!=='流程提交'&&title!=='踪迹'&&billSearch.wsBusinessType=='C'">
          <el-date-picker value-format="timestamp" v-model="billSearch.correctMailDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="更正原因" :prop="title==='编辑'&&billSearch.wsBusinessType=='C'?'correctMailReason':''" v-show="title!=='流程提交'&&title!=='踪迹'&&billSearch.wsBusinessType=='C'&&billSearch.wsBusinessType">
          <el-input v-model.trim="billSearch.correctMailReason" placeholder="请输入更正原因"></el-input>
        </el-form-item>
        <el-form-item label="母合同编号" :prop="billSearch.wsBusinessType=='O'?'occId':''" v-show="title!=='流程提交'&&title!=='踪迹'&&billSearch.wsBusinessType=='O'">
          <el-input v-model.trim="billSearch.occId" placeholder="请输入母合同编号"></el-input>
        </el-form-item>
        <el-form-item label="附件上传" v-show="title==='编辑'">
          <el-upload
            class="sort-upload"
            action=""
            multiple
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            :http-request="upload"
            :file-list="fileList">
            <el-button type="primary" plain>上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="选择处理人" v-show="title==='流程提交'">
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
      <el-table :data="fileData" style="width: 100%;margin-bottom:42px;" :header-row-class-name="StableClass" class="document" border v-show="title=='编辑'">
        <el-table-column label="文件名" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top">
              <span :class="{'smallHand':scope.row.suffixFlag}" class="abbreviate" @click="docView(scope.row)">{{scope.row.docName}}</span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="160" align="center"></el-table-column>
        <el-table-column label="录入人员" width="140" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="nameList[scope.row.createdBy]" placement="top">
              <span class="abbreviate">{{nameList[scope.row.createdBy]}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <span class="blueColor" @click.stop="detailRemove(scope.row)">删除</span>
            <!-- <el-button @click.stop="detailRemove(scope.row)" type="text" size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="track" border style="width: 100%;height:auto;" v-show="title==='踪迹'" :header-row-class-name="StableClass">
        <el-table-column prop="processId" label="流程编号" width="230" align="center"></el-table-column>
        <el-table-column prop="actName" label="操作名称" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark"  :content="scope.row.actName" placement="top-start">
              <span class="abbreviate">{{scope.row.actName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="录入人员" width="85" align="center">
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
        <el-table-column prop="remark" label="操作备注" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark"  :content="scope.row.remark" placement="top-start">
              <span class="abbreviate">{{scope.row.remark}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
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
        style="margin-top:10px;"
        v-show="title=='手工创建' || title=='查询' || title=='编辑' || title=='流程提交'"
      >
        <el-button size="small" @click="dialogFormVisible = false" style="margin-right:5px;">取 消</el-button>
        <el-button size="small" type="primary" plain @click="confirm('billSearch')" style="padding:0 16px;">确 定</el-button>
      </div>
      <div class="browseDoc" v-show="title=='编辑'" style="width:100%;height:400px">
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
    <el-dialog
      title="文档预览"
      width="fit-content"
      :visible.sync="dialogFormVisible1"
      :close-on-click-modal="modal">
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
    <!-- 拆分 -->
    <el-dialog title="拆分" :visible.sync="dialogFormVisible3" :close-on-click-modal="modal" width="432px">
      <el-form label-width="120px" :rules="rules">
        <el-form-item label="拆分数量" required>
          <el-input v-model="subProcess" style="width:200px" type="number" ></el-input>
          <!-- <el-button type="primary" size="mini" style="margin-left:50px" @click="itemSplit">拆分</el-button> -->
        </el-form-item>
        <el-form-item label="拆分理由" required>
          <el-input
            type="textarea"
            :rows="4"
            style="width:200px"
            placeholder="请输入拆分理由"
            v-model="reason"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="拆分金额">
          <div class="inputWrap" id="idInputWrap"></div>
        </el-form-item>-->
        <!-- <el-form-item>
          <el-button size="small" @click="dialogFormVisible3 = false">取消</el-button>
          <el-button type="primary" plain @click="split()">确定</el-button>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:10px;">
        <el-button size="small" @click="dialogFormVisible3 = false">取消</el-button>
        <el-button type="primary" plain @click="split()">确定</el-button>
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
      historicalBill:false,
      dRProcessId:null,
      suffixFlag:false,
      RWFlag:false,
      nameList:{},
      searchFlag: false,
      subProcess: null, // 条目拆分数量
      reason: "", // 条目拆分理由
      subProcessFlag: false,
      tableData: [],
      assignee: "",
      modal: false,
      changeClientHight:null,
      YWoptions: [
        { value: "T", label: "合约账单" },
        { value: "F", label: "临分账单" },
        { value: "O", label: "转分账单" },
        { value: "C", label: "修正账单" }
      ],
      StableClass: "tableClass",
      baseCompanyList: [],
      YWoptionsObj: {
        T: "合约账单",
        F: "临分账单",
        O: "转分账单",
        C: "修正账单"
      },
      zq1Flag:false,
      zq1Day:'',
      zq1Year:new Date().getFullYear(),
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
      ZDoptions:[],
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
      dialogFormVisible3:false,
      splitId:'',
      admFlag: false,
      querySearch:{
        closedBy:null,
        processName:null,
        wsBusinessType:null,
        wsPeriod:null,
        processId:null,
        wsType:null,
        processStatus:null,
        registBy:null,
        wsSignbackFlag:null,
        cedentModel:null,
        brokerModel:null,
        wsReceiptDate:null,
        wsStatus:null,
        wsSignbackFlag:null,
        wsHasSignback:null,
        wsCedentCode:null,
        wsCedentName:null,
        wsBrokerCode:null,
        wsBrokerName:null,
        rmReceiptDate:null,
      },
      billSearch: {
        brokerModel: '',
        occId:'',
        correctMailDate:'',
        correctMailReason:'',
        parentProcessId:null,
        cedentModel: '',
        hasRecheckFlag:null,
        processId: '',
        processStatus: '',
        processName:'',
        wsType: '',
        wsPeriod: '',
        wsBusinessType: '',
        wsStatus:'',
        wsCedentCode: '',
        wsCedentName: '',
        wsBrokerCode: '',
        wsBrokerName: '',
        wsReceiptDate: '',
        businessOrigin: '',
        baseCompany: '',
        reportUnit: '',
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
      setTime: '',
      fileData: [],
      picture: "",
      cedentList: [],
      brokerList: [],
      cedentModel: '',
      ZJObj: {
        total: 50,
        pageNumber: 1, // 页数
        pageSize: 10 //页面一次要展示的条数
      },
      ZJprocessId: "",
      zq1: "",
      zq2: "",
      rules: {
        wsBusinessType: [{ required: true, message: "请选择任务类型", trigger: "blur" }],
        subProcess: [{ required: true, message: '请输入拆分数量', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入拆分理由', trigger: 'blur' }],
        cedentModel:[{ required: true, message: "请选择分出公司", trigger: "blur" }],
        wsReceiptDate:[{ type: 'date', required: true, message: '请选择账单收到期', trigger: 'blur' }],
        brokerModel:[{ required: true, message: "请选择经纪公司", trigger: "blur" }],
        correctMailDate:[{ type: 'date', required: true, message: '请选择收到邮件更正期', trigger: 'blur' }],
        occId: [{ required: true, message: '请输入母合同编号', trigger: 'blur' }],
        parentProcessId: [{ required: true, message: '请输入原流程编号', trigger: 'blur' }],
        correctMailReason: [{ required: true, message: '请输入更正原因', trigger: 'blur' }],
      },
    };
  },
  created() {
    sessionStorage.setItem("data", JSON.stringify({}));
  },
  mounted() {
    window.onclick=()=>{
      this.zq1Flag=false;
    }
    this.mustData.actOperator = this.$store.state.userName;
    if (this.urlName === "sortOperation" || this.urlName === "billEntry") {
      this.$http.get("api/sics/basis/getReportUnitsForPC").then(res => {
        if (res.status === 200) {
          this.ReportUnitList = res.data;
        }
      });
    }
    this.nameList = JSON.parse(sessionStorage.getItem("nameList"));
    this.mustData.processStatus = this.processStatusCom;
    if(this.$route.name==='sortOperation'||this.$route.name==='billEntry'){
      this.changeClientHight=document.body.clientHeight-100-document.querySelector('.el-table').offsetTop;
    }else{
      this.changeClientHight=document.body.clientHeight-100-document.querySelector('.el-table').offsetTop;
    }
    this.changeWindow();
    this.$http.post("api/activiti/getAssigneeName", { roleName: "账单录入" })
      .then(res => {
        if (res.status === 200) {
          this.TJRoptions = res.data;
        } 
      });
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
      this.brokerList.unshift({codeName: "无",codeType: null,codecode: "无"});
    }, 1000);
    // 判断是否是管理员   66
      let admArr = JSON.parse(sessionStorage.getItem("roleIdList"));
      admArr.some(el=>{return el==66;}) ? (this.admFlag = true) : (this.admFlag = false);
      this.init();
  },
  methods: {
    onWsBusinessType(){
      if(this.billSearch.wsBusinessType!='C'){
        this.billSearch.parentProcessId = null;
        this.billSearch.correctMailReason = null;
        this.billSearch.correctMailDate = null;
      }
      if(this.billSearch.wsBusinessType!='O'){
        this.billSearch.occId = null;
      }
    },
    countYear(str){
      if(str==='-'){
        this.zq1Year--;
      }else if(str==='+'){
        this.zq1Year++;
      }
    },
    chooseDay(day,index,tag){
      if(tag){
        this.querySearch.wsPeriod=this.zq1Year+'-'+day;
      } else{ this.billSearch.wsPeriod=this.zq1Year+'-'+day; }
      
      this.zq1Day=index
      this.zq1Flag=false;
    },
    zq1FlagFn(){
      this.zq1Flag=!this.zq1Flag
    },
    splits(processId){
      this.dialogFormVisible3=true;
      this.splitId=processId;
    },
    split() {
      let arr = document.querySelectorAll(".itemNum");
      if (!this.subProcess) {
        this.$message.error("请填写拆分数量");
        return;
      }else if (this.subProcess==='1'){
        this.$message.error("拆分数量不能小于1");
        return;
      }
      if (!this.reason) {
        this.$message.error("请填写拆分理由");
        return;
      }
      let that=this;
      this.$http.post("api/worksheet/wSEntry/processSplit", {
          processId: that.splitId,
          // subProcess:subProcessArr,
          subProcess: +this.subProcess,
          actOperator: this.mustData.actOperator,
          reason: this.reason
        })
        .then(res => {
          console.log(res)
          if (res.status == 200 && res.data.code == 0) {
            this.$message({ message: "拆分成功", type: "success" });
            this.dialogFormVisible3 = false;
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
    changeWindow(){
      let that=this;
      document.body.onresize=function(e){
          if(that.$route.name==='sortOperation'||that.$route.name==='billEntry'){
             that.changeClientHight=document.body.clientHeight-100-document.querySelector('.el-table').offsetTop;
          }else{
            that.changeClientHight=document.body.clientHeight-100-document.querySelector('.el-table').offsetTop;
          }
          // that.changeClientHight=document.body.clientHeight-178-document.querySelector('.el-table').offsetTop;
      }
    },
    docView(row) {
      // this.dialogFormVisible1 = true;
        if (row) {
        this.dRProcessId = row.processId;
        let arrr = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT','XLS','xls','ppt','PPT','pptx','PPTX'];
        this.suffixFlag = arrr.some(el=>{ return el==row.suffix; })
        if(row.suffix && !this.suffixFlag){ return false; }
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
            document.getElementById("iframeId").contentWindow.location.reload(true);
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
    init2(){
      if (this.urlName === "sortOperation") {
        this.$http.get("api/worksheet/wSEntry/refreshEmail").then(res => {
            this.$message({ type: "success", message: res.data.msg });
            this.init();
          });
      } else{
        this.$message({ type: "success", message: "刷新成功" }); 
      }
    },
    init() {
      // 进首页查询
      let params = null;
      if (this.urlName == "sortOperation" || this.admFlag) {
        params = Object.assign({}, this.mustData);
      } else {
         params = Object.assign({}, this.mustData, {
          curOperator: this.$store.state.userName
        });
      }
      delete params["actOperator"];
      this.$http.post("api/worksheet/wSEntry/list", params).then(res => {
        if (res.status === 200) {
          this.mustData.total = res.data.total;
          if (res.data && res.data.rows && res.data.rows.length) {
            if(this.urlName === 'billEntry' && res.data.rows && res.data.rows.length){
              res.data.rows.forEach(el=>{
                el.processStatus === '待处理'?el['pendingFlag']=true:el['pendingFlag']=false;
              })
            }
          this.tableData = res.data.rows;
          console.log(this.tableData)
          }
        }
      });
    },
    confirm(formName) {
      if (this.billSearch.cedentModel !== null && this.billSearch.cedentModel !== '') {
        console.log(this.billSearch.cedentModel,'this.billSearch.cedentModel-------赋值');
        let obj = this.cedentList[this.billSearch.cedentModel];
        this.billSearch.wsCedentCode = obj.codecode;
        this.billSearch.wsCedentName = obj.codeName;
      } else{
        console.log(this.billSearch.cedentModel,'this.billSearch.cedentModel-------无值');
        this.billSearch.wsCedentCode = '';
        this.billSearch.wsCedentName = '';
      }
      if (this.billSearch.brokerModel != null && this.billSearch.brokerModel != '') {
        let obj = this.brokerList[this.billSearch.brokerModel];
        // this.brokerList.unshift({codeName: "无",codeType: null,codecode: "无"});
        if(obj.codeType == null){
          this.billSearch.wsBrokerCode = null;
          this.billSearch.wsBrokerName = null;
        } else{
          this.billSearch.wsBrokerCode = obj.codecode;
          this.billSearch.wsBrokerName = obj.codeName;
        }
      } else{
        this.billSearch.wsBrokerCode = '';
        this.billSearch.wsBrokerName = '';
      }
      switch (this.dialogState) {
        case 0: // 创建
          this.$refs[formName].validate(valid => {
            if (valid) {
              if(this.billSearch.wsBusinessType=='C' && !this.billSearch.parentProcessId && !this.historicalBill){
                this.$message({ type: "error", message: '请输入原流程编号' });
                return false;
              }
              if(this.historicalBill){
                this.billSearch['parentProcessId']=null;
              }
              this.$http.post("api/worksheet/wSEntry/save",Object.assign({}, this.mustData, this.billSearch))
                .then(res => {
                  if (res.status === 200 && res.data.code == 0) {
                    this.$message({ type: "success", message:res.data.msg });
                    this.dialogFormVisible = false;
                    this.init();
                  } else if(res.data.code == 1){
                    this.$message({ type: "error", message:res.data.msg });
                    this.dialogFormVisible = false;
                  }
                });
            }
          });

          break;
        case 1: // 查询hyd   //querySearch
          if (this.querySearch.cedentModel != null) {
              let obja = this.cedentList[this.querySearch.cedentModel];
              this.querySearch.wsCedentCode = obja.codecode;
              this.querySearch.wsCedentName = obja.codeName;
            } else{
              this.querySearch.wsCedentCode = null;
              this.querySearch.wsCedentName = null;
            }
            if (this.querySearch.brokerModel != null) {
              let objb = this.brokerList[this.querySearch.brokerModel];
              this.querySearch.wsBrokerCode = objb.codecode;
              this.querySearch.wsBrokerName = objb.codeName;
            } else{
              this.querySearch.wsBrokerCode = null;
              this.querySearch.wsBrokerName = null;
            }
          let params = null;
          if (this.zq2 && this.zq1) {
            this.querySearch.wsPeriod = `${this.zq2}-${this.zq1}`;
          }
          if (!this.querySearch.processStatus) {
            if (this.urlName == "sortOperation" || this.admFlag) {
              params = Object.assign({}, this.mustData,this.querySearch,{processStatus:this.processStatusCom});
            }else {
              params = Object.assign({}, this.mustData,this.querySearch, {curOperator: this.$store.state.userName,processStatus:this.processStatusCom});
            }
          } else{
            if (this.urlName == "sortOperation" || this.admFlag) {
              params = Object.assign({}, this.mustData,this.querySearch,);
            }else {
              params = Object.assign({}, this.mustData,this.querySearch, {curOperator: this.$store.state.userName});
            }
          }
          delete params["actOperator"];
          this.$http.post("api/worksheet/wSEntry/list", params).then(res => {
            if (res.status === 200) {
              console.log(res)
              if (!res.data.rows.length) {
                this.$message({ type: "warning", message: "未查询出数据" });
              } else {
                if(this.urlName === 'billEntry' && res.data.rows && res.data.rows.length){
                    res.data.rows.forEach(el=>{
                      el.processStatus === '待处理'?el['pendingFlag']=true:el['pendingFlag']=false;
                    })
                  }
                this.tableData = res.data.rows;
                console.log(this.tableData)
                this.mustData.total = res.data.total;
                this.dialogFormVisible = false;
              }
            }
          });
          break;
        case 2: // 编辑
          this.$refs[formName].validate(valid => {
            if (valid) {
              if(this.billSearch.wsBusinessType=='C' && !this.billSearch.parentProcessId && !this.historicalBill){
                this.$message({ type: "error", message: '请输入原流程编号' });
                return false;
              }
              if(this.billSearch.wsBusinessType=='C' && !this.billSearch.correctMailDate){
                this.$message({ type: "error", message: '请输入收到邮件更正期' });
                return false;
              }
              if(this.billSearch.wsBusinessType=='C' && !this.billSearch.correctMailReason){
                this.$message({ type: "error", message: '请输入更正原因' });
                return false;
              }
              let params1 = Object.assign({},this.billSearch, this.mustData, {processId: this.chooseRow.processId})
              delete params1["processStatus"];
              
               for(let k in params1){
                 if(!params1[k] && params1[k]!=0){
                   params1[k] = '';
                 }
               }
               if(this.historicalBill){
                params1['parentProcessId']=null;
              }
                params1['hasRecheckFlag']=null;
                this.$http.post("api/worksheet/wSEntry/update",params1)
                  .then(res => {
                    if (res.status === 200 && res.data.code == 0) {
                      this.$message({ type: "success", message: res.data.msg });
                      this.init();
                      this.dialogFormVisible = false;
                    } else if(res.data.code == 1){
                      this.$message({ type: "error", message: res.data.msg });
                    } else{
                      this.init();
                      this.dialogFormVisible = false;
                      this.$message({ type: "warning", message: res.data.msg });
                    }
                  });
            }
          })
        
          break;
        case 3: // 分配
          if (!this.assignee) {
            this.$message.error("请选择任务处理人");
            return false;
          }
          this.$http.post("api/worksheet/activitiForWorksheet/commonActivitiForWorksheet",
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
                this.assignee = '';
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
      for (let k in this.querySearch) {
        this.querySearch[k] = null;
      }
      this.zq2 = null;
      this.zq1 = null;
    },
    handleClick(tag, row) {
      this.dialogState = tag;
      this.chooseRow = row;
      this.RWFlag = false;
      this.assignee = '';
      switch (tag) {
        case 0:
          // this.reset();
          for(let k in this.billSearch){
            this.billSearch[k] = null;
          }
          this.zq2 = null;
          this.zq1 = null;
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
          for(let k in this.billSearch){
            this.billSearch[k] = row[k];
          }
          this.RWFlag = row.processId.indexOf('RV')>0;
          this.fileData = [];
          this.billSearch.wsPeriod=row.wsPeriod;
            if (row.wsType) {
              this.ZDoptions.forEach((el, i) => {
                if (el.name == row.wsType) {
                  this.billSearch.wsType = el.code;
                }
              });
            } else {
              this.billSearch.wsType = '';
            }
          // 任务类型
          if (row.wsBusinessType) {
            this.billSearch.wsBusinessType = row.wsBusinessType;
          } else {
            this.billSearch.wsBusinessType = '';
          }
          // 账单收到日期
          if (row.wsReceiptDate) {
            this.billSearch.wsReceiptDate = new Date(row.wsReceiptDate).valueOf();
          } else {
            this.billSearch.wsReceiptDate = '';
          }
          // 收到邮件更正期
          if (row.correctMailDate) {
            this.billSearch.correctMailDate = new Date(row.correctMailDate).valueOf();
          } else {
            this.billSearch.correctMailDate = '';
          }
          //  分出人cedentModel  cedentList
          if (row.wsCedentCode) {
            this.cedentList.forEach((el, i) => {
              if (el.codecode == row.wsCedentCode) {
                this.billSearch.cedentModel = i;
              }
            });
          } else {
            this.billSearch.cedentModel = '';
          }
          // 经纪人brokerModel   brokerList
          if (row.wsBrokerCode) {
            this.brokerList.forEach((el, i) => {
              if (el.codecode == row.wsBrokerCode) {
                this.billSearch.brokerModel = i;
              }
            });
          } else {
            this.billSearch.brokerModel = '';
          }
          // Business Origin
         if(row.businessOrigin){
            this.businessOriginList.forEach((el, i) => {
              if (el.name == row.businessOrigin) {
                this.billSearch.businessOrigin = el.code;
              }
            });
          } else{ this.billSearch.businessOrigin = ''; }

          // Base Company
         if(row.baseCompany){
            this.baseCompanyList.forEach((el, i) => {
              if (el.name == row.baseCompany) {
                this.billSearch.baseCompany = el.code;
              }
            });
          } else{ this.billSearch.baseCompany = ''; }

          // Reporting Unit
         if(row.reportUnit){
            this.ReportUnitList.forEach((el, i) => {
              if (el.name == row.reportUnit) {
                this.billSearch.reportUnit = el.code;
              }
            });
          } else{ this.billSearch.reportUnit = ''; }

        // 流程名称
         if(row.processName){
            this.billSearch.processName = row.processName;
          }
          // 账期
          if (row.wsPeriod) {
            let arr = row.wsPeriod.split("-");
            this.zq2 = arr[0];
            this.zq1 = arr[1];
          } else {
            this.zq2 = '';
            this.zq1 = '';
          }
          this.$http.get(`api/worksheet/wSEntry/edit/${row.processId}`,{}).then(res => {
            if (res.status === 200) {
              // this.fileData = res.data.bscDocumentVOlist;
              let arr3 = res.data.bscDocumentVOlist;
              if(arr3===null)return;
              arr3.forEach(el=>{
                if(el.docName){
                  let suffix = el.docName.split('.');
                  el['suffix'] = suffix[suffix.length-1];
                  el['suffixFlag'] = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT','XLS','xls','ppt','PPT','pptx','PPTX'].some(el=>{ return el==suffix[suffix.length-1]; })
                }
              })
              this.fileData = arr3;
              if(this.fileData&&this.fileData.length){
                let num = this.fileData.findIndex(el => { return el.suffix=='doc' || el.suffix=='DOCX' || el.suffix=='xlsx' || el.suffix=='PDF' || el.suffix=='pdf' || el.suffix=='XLSX'})
                setTimeout(()=>{ this.docView(this.fileData[+num]); },1500)
              }else{ sessionStorage.setItem('data',JSON.stringify({})); }
            }
          });
          if(this.RWFlag){ this.billSearch.wsBusinessType='C'; } // 8.26 有RW的账单----任务类型硬核变成 修正账单
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
              }
            });

          break;
        case 6: // 上传附件
          break;
        case 7://  拆分
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
        this.$http.post("api/anyShare/fileOperation/deleteFilesForPage", {
            docPath: row.docPath,
            docName: row.docName,
            processId: this.chooseRow.processId,
            actOperator: this.$store.state.userName
          }).then(res => {
            if (res.status === 200 && res.data.errorCode == 1) {
              this.$http.get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`)
                .then(res => {
                  if (res.status === 200) {
                    // this.fileData = res.data.bscDocumentVOlist;
                    if(res.data.bscDocumentVOlist){
                      let arr4 = res.data.bscDocumentVOlist;
                      arr4.forEach(el=>{
                        if(el.docName){
                          let suffix = el.docName.split('.');
                          el['suffix'] = suffix[suffix.length-1];
                          el['suffixFlag'] = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT','XLS','xls','ppt','PPT','pptx','PPTX'].some(el=>{ return el==suffix[suffix.length-1]; })
                        }
                      })
                      this.fileData = arr4;
                    } else{ this.fileData =[]; }
                    
                  }
                });
                if(this.dRProcessId == row.processId){ 
                  this.docView();
                  sessionStorage.setItem('data',JSON.stringify({}));
                }
            }
          });
      });
    },
    refresh() {
      window.location.reload();
    },
    reloadTableData(){
      this.$http.get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`)
        .then(res => {
          if (res.status == 200) {
            // this.fileData = res.data.bscDocumentVOlist;
            let arr2 = res.data.bscDocumentVOlist;
            arr2.forEach(el=>{
              if(el.docName){
                let suffix = el.docName.split('.');
                el['suffix'] = suffix[suffix.length-1];
                el['suffixFlag'] = ['doc','DOC','docx','DOCX','pdf','PDF','xlsx','XLSX','txt','TXT','XLS','xls','ppt','PPT','pptx','PPTX'].some(el=>{ return el==suffix[suffix.length-1]; })
              }
            })
            this.fileData = arr2;
          }
        });
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
        this.$http.post("uploadApi/anyShare/fileOperation/uploadFilesForPageBatch", resFile, {  headers: { "Content-Type": "application/json;charset=UTF-8" }})
          .then(res => {
            if (res.status === 200 && res.data.errorCode == 1) {
              this.fileList = [];
              this.file = [];
              this.reloadTableData();
            } else {
              if (res.data.errorMessage) {
                this.$message.error(res.data.errorMessage);
                this.reloadTableData();
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
    },
  }
};
</script>

<style scoped>
  .billCom {
    padding-right: 30px;
  }
  .btn {
    margin-bottom: 8px;
    margin-top: 16px;
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
  .el-form-item:nth-child(8) .el-input:nth-child(1) {
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
    border-bottom: 1px solid #eaeaea;
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
  .zq1Parent{
    position: relative;
  }
  .zq1{
    width:280px;
    height:288px;
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.15);
    border-radius:4px;
    margin-top: 20px;
    position: absolute;
    left: 20px;
    top: 24px;
    z-index: 999;
  }
  .zq{
      width: 280px;
      height: 256px;
      overflow-y: auto;
      background: #FFFFFF;
      display: flex;
      flex-wrap: wrap;
      padding-left: 10px;
      box-sizing: border-box;
  }
  .zq li{
      width: 30%;
      text-align: center;
      cursor: pointer;
      margin: 5px 3px;
      font-size: 14px;
      border-radius: 2px;
      padding: 0 2px;
      box-sizing: border-box;
  }
  .zq li.active{
    background: #409eff;
    color: #fff;
  }
  .zqTitle{
    width: 280px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    flex-shrink: 0;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0,0,0,0.09);
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 5px;
  }
  .wsDate::-webkit-input-placeholder{
    color: #ccc;
  }
  .Futop{
    margin-top: -8px;
  }
</style>