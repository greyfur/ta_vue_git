<template>
  <div class="detailEntry">
    <!-- <div class="goBack" v-show="false"> -->
      <router-link :to="{name:$route.query.tag}" style="color:#333;position:absolute;top:20px;left:70px;z-index:100;">
        <span class="arrows" style="font-weight: 700;">＜</span>
        <span class="word">返回上一级</span>
      </router-link>
    <!-- </div>  -->
    <el-row>
      <el-col :span="11">
        <!-- 签回 -->
        <div class="btn" v-if="$route.query.tag === 'billSignBack'">
          <el-button size="small" @click="onReverse" plain>Reverse</el-button>
          <el-button size="small" @click="mailSend(1)" plain>邮件通知</el-button>
          <el-button size="small" plain @click="submit(6,'签回提交')">流程提交</el-button>
          <el-button size="small" plain @click="submit(7)">标记签回</el-button>
        </div>
        <!-- 录入 -->
        <div class="btn" v-if="$route.query.tag === 'billEntry'">
          <!-- <el-button size="small" :disabled="isHover" plain @click="onSics('录入')">账单回写</el-button> -->
          <el-button size="small" :disabled="isHover" @click="submit(4)" plain>置废</el-button>
          <el-button size="small" :disabled="isHover" @click="submit(1,'录入指派')" plain>任务指派</el-button>
          <el-button :type="isHover?'info':''" size="small" @click="submit(5)" plain>{{isHover?'已悬停':'状态悬停'}}</el-button>
          <el-button @click="dialogFormVisible = true" :disabled="isHover" size="small" plain>条目拆分</el-button>
          <el-button plain :disabled="isHover" size="small" @click="submit(6,'录入提交')">流程提交</el-button>
        </div>
        <!-- 复核 -->
        <div class="btn" v-if="$route.query.tag === 'billCheck'">
          <!-- <el-button size="small" plain @click="onSics('复核')">账单回写</el-button> -->
          <el-button size="small" @click="submit(1,'复核指派')" plain>任务指派</el-button>
          <el-button size="small" @click="submit(2)" plain>复核驳回</el-button>
          <el-button size="small" @click="submit(3)" plain>复核通过</el-button>
        </div>
        <div class="left">
          <div class="searchNew">
            <div class="titleSearch detailSearch" @click="searchFlag1 = !searchFlag1">
              <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>详情</div>
              <p class="info" style="color:#666;">流程编号: 
                <el-tooltip class="item" effect="dark" content="点击复制" placement="top">
                  <span style="color:#000;" id="proNum" @click.stop="copy('proNum')">{{chooseRow.processId}}</span>
                </el-tooltip>
              </p>
            </div>
            <ul class="detail-ul" v-show="searchFlag1">
              <li v-for="(item,i) in listData" :key="i" class="detail-item">
                <span class="detail-name">{{item.a}} : </span><span class="detail-content">{{item.b}}</span>
              </li>
            </ul>
          </div>
          <div class="searchNew" style="border-bottom:none;margin-top:16px;">
            <div class="titleSearch detailSearch" @click="searchFlag2 = !searchFlag2">
              <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>附件列表</div>
              <p v-if="$route.query.tag === 'billEntry'"><el-button size="small" :disabled="isHover" @click="mailSend(2)"><i style="margin-right:8px;" class="iconfont iconGroup75"></i>上传</el-button></p>
            </div>
              <el-table height='367' v-show="searchFlag2" stripe :data="tableData" style="width: 100%;margin-top:10px;" class="document">
                <el-table-column label="文件名">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top">
                      <el-button :disabled="isHover" type="text" @click="docView(scope.row)">{{scope.row.docName}}</el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="createdBy" label="任务来源"></el-table-column>
                <el-table-column label="操作" width="130">
                  <template slot-scope="scope">
                    <el-button :disabled="isHover" v-show="$route.query.tag !== 'billWorkSheet' && $route.query.tag !== 'billProcess'" @click.stop="handleClick(2,scope.row)" type="text" size="small">OCR</el-button>
                    <el-button :disabled="isHover" v-show="$route.query.tag !== 'billWorkSheet' && $route.query.tag !== 'billProcess'" @click.stop="handleClick(1,scope.row)" type="text" size="small">删除</el-button>
                    <el-button :disabled="isHover" @click.stop="handleClick(3,scope.row)" type="text" size="small">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </div>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="right">
          <!-- <p class="detail-word" style="marginTop:-10px;backgroundColor:#EEEEEE;">文档预览</p> -->
          <div class="titleSearch detailSearch">
            <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>文档预览</div>
            <p v-if="$route.query.tag === 'billEntry'"><el-button size="small" :disabled="isHover" @click="onSics('录入')"><i style="margin-right:8px;" class="iconfont iconGroup77"></i>账单回写</el-button></p>
            <p v-if="$route.query.tag === 'billCheck'"><el-button size="small" :disabled="isHover" @click="onSics('复核')"><i style="margin-right:8px;" class="iconfont iconGroup77"></i>账单回写</el-button></p>
          </div>
          <div class="browseDoc">
            <!-- <iframe :src="'/static/pdf/web/viewer.html?file='+path" style="width:100%;height:-webkit-fill-available;" frameborder="0"></iframe> -->
            <iframe src="../../../static/Preview/index.html" id="iframeId" name="ifrmname" ref="mapFrame" style="width:100%;height:100%" frameborder="0"></iframe>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" style="padding:0 16px;">
        <!-- <p class="detail-word">账单信息</p> -->
        <div class="titleSearch detailSearch" style="margin-bottom:10px;" @click="searchFlag3 = !searchFlag3">
          <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>账单信息</div>
          <p><i class="iconfont iconGroup26"></i></p>
        </div>
        <el-table v-show="searchFlag3" :data="SICSData" stripe width="100%" @row-click="handelClick3">
          <el-table-column prop="wsId" label="账单号"></el-table-column>
          <el-table-column prop="wsStatus" label="账单状态">
            <template slot-scope="scope">{{scope.row.wsStatus=='O'?'Open':'Close'}}</template>
          </el-table-column>
          <el-table-column prop="wsTitle" label="账单标题"></el-table-column>
          <el-table-column prop="businessId" label="业务编号"></el-table-column>
          <el-table-column prop="docName" label="附件名称"></el-table-column>
          <el-table-column prop="section" label="section"></el-table-column>
          <el-table-column prop="uwYear" label="业务年度"></el-table-column>
          <el-table-column prop="businessType" label="任务类型"></el-table-column>
          <el-table-column prop="receiptDate" label="收到账单日期" width="120"></el-table-column>
          <el-table-column label="分出公司" width="120">
            <template slot-scope="scope">
              {{scope.row.cedentCode}}-{{scope.row.cedentName}}
            </template>       
          </el-table-column>
          <el-table-column label="经纪公司" width="120">
            <template slot-scope="scope">
              {{scope.row.brokerCode}}-{{scope.row.brokerName}}
            </template>      
          </el-table-column>
          <el-table-column prop="wsType" label="账单类型"></el-table-column>
          <el-table-column prop="wsPeriod" label="账单期"></el-table-column>
          <el-table-column prop="businessOrigin" label="Business Origin" width="120"></el-table-column>
          <el-table-column prop="baseCompany" label="Base Company" width="120"></el-table-column>
          <el-table-column prop="dept" label="经营机构"></el-table-column>
          <el-table-column prop="wsCurrency" label="币制" ></el-table-column>
          <el-table-column prop="wsAmount" label="金额" ></el-table-column>
          <el-table-column prop="createdBy" label="录入人" ></el-table-column>
          <el-table-column prop="createdAt" label="录入时间" ></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button :disabled="isHover" @click.stop="openSics(scope.row)" type="text" size="small">打开SICS</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 弹窗区域 -->
    <el-dialog title="条目拆分" :visible.sync="dialogFormVisible" :close-on-click-modal="modal">
      <el-form label-width="120px">
        <el-form-item label="条目拆分数量">
          <el-input v-model="subProcess" style="width:200px" type="number"></el-input>
          <!-- <el-button type="primary" size="mini" style="margin-left:50px" @click="itemSplit">拆分</el-button> -->
        </el-form-item>
        <el-form-item label="条目拆分理由">
          <el-input type="textarea" :rows="4" style="width:400px" placeholder="请输入内容" v-model="reason"></el-input>
        </el-form-item>
        <!-- <el-form-item label="拆分金额">
          <div class="inputWrap" id="idInputWrap"></div>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="split()">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible2" :close-on-click-modal="modal">
      <el-form label-width="120px">
        <el-form-item label="收件人" v-show="title==='邮件通知'">
          <el-select v-model="mailInfo"  placeholder="请选择">
            <el-option v-for="item in mailOption" :key="item.id" :label="item.contactName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮件标题" v-show="title==='邮件通知'">
          <el-input type="text" placeholder="请输入内容" v-model="mailTitle"></el-input>
        </el-form-item>
        <el-form-item label="内容编辑" v-show="title==='邮件通知'">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="emailContent"></el-input>
        </el-form-item>
        <el-form-item label="附件上传方式" v-show="title==='邮件通知'">
          <el-radio-group v-model="uploadType" @change="OnuploadType">
            <el-radio label="1">本地上传</el-radio>
            <el-radio label="2">从附件列表中选取</el-radio>
          </el-radio-group>
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
        <el-form-item label="选择附件" v-show="title!=='OCR上传'">
          <el-upload
            :disabled='uploadType!=1 && $route.query.tag === "billSignBack"'
            class="upload-demo"
            action
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            :http-request='upload'
            :headers='head'
            :file-list="fileList">
            <el-button size="small" :type="uploadType!=1?'info':'primary'">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="选择附件" v-show="title==='邮件通知'">
          <el-select v-model="chooseDocList" :disabled='uploadType != 2'  placeholder="请选择">
            <el-option v-for="(item,i) in tableData" :key="i" :label="item.docName" :value="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer" v-show="title==='邮件通知' || title==='OCR上传'">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="send">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible3" :close-on-click-modal="modal">
      <el-form :label-position="labelPosition" label-width="140px" :model="formLabelAlign">
        <el-form-item label="用户名">
          <el-input v-model="formLabelAlign.name" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
            <el-date-picker v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="公司代码及名称">
          <el-select v-model="value" placeholder="请输入关键词">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经纪公司代码及名称">
          <el-select v-model="value" placeholder="请输入关键词">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单类型">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单期">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单类型">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国际/国内业务">
          <el-select v-model="value" placeholder="请输入关键词">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="BASE COMPANY">
          <el-select v-model="value" placeholder="请输入关键词">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible3 = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible5" :close-on-click-modal="modal">
      <el-form label-position="right" label-width="140px">
        <el-form-item label="选择驳回原因" v-show="title==='复核驳回'">
          <el-select v-model="opinion"  placeholder="请输入驳回原因">
            <el-option v-for="item in BHoptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入悬停原因" v-show="title==='悬停'">
          <el-input type="textarea" :rows="2" placeholder="请输入原因" v-model.trim="pendingReason"></el-input>
        </el-form-item>
        <el-form-item label="原因填写" v-show="title==='复核驳回'">
          <el-input :disabled="opinion!='其它'" type="textarea" :rows="2" placeholder="请输入原因" v-model="textareaOpinion"></el-input>
        </el-form-item>
        <el-form-item label="选择下一任务处理人" v-show="title==='流程提交' && $route.query.tag !== 'billEntry'">
          <el-select v-model="assignee"  placeholder="请输入关键词">
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指派任务处理人" v-show="title==='任务指派'">
          <el-select v-model="assignee"  placeholder="请输入关键词"> 
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username" :disabled="item.username == $store.state.userName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择下一任务处理人" v-show="title==='流程提交' && $route.query.tag === 'billEntry'">
          <el-select v-model="assignee"  placeholder="请输入关键词"> 
            <el-option v-for="item in TJRoptions" :key="item.userId" :label="item.name" :value="item.username" :disabled="item.username == $store.state.userName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否签回" v-show="title==='流程提交' && $route.query.tag === 'billEntry'">
          <el-radio v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click=" dialogFormVisible5 = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>


<script>
import { Loading } from 'element-ui';
export default {
  name: 'detailEntry',
  data() {
    return {
      searchFlag3:true,
      searchFlag2:true,
      searchFlag1:true,
      modal:false,
      pendingReason:null,
      opinion:'',
      mailInfo:'',
      processId:'',
      mailTitle:'',
      emailContent:'',
      mailOption:[],
      fileList:[],
      fileList2:[],
      path:'',
      uploadType:null,
      isHover:false,
      assignee:'',
      BHoptions:['金额','币制','SECTION','合同号','未决','ENTRYCODE','日期','其它'],
      tableData:[],
      SICSData:[
        {
          processId:'',
          sgNum:'',
          wsStatus:'',
          wsTitle:'',
          businessId:'',
          section:'',
          uwYear:'',
          businessType:'',
          receiptDate:'',
          cedentCode:'',
          cedentName:'',
          brokerCode:'',
          brokerName:'',
          wsType:'',
          wsPeriod:'',
          businessOrigin:'',
          baseCompany:'',
          dept:'',
          wsCurrency:'',
          wsAmount:'',
          createdBy:'',
          createdAt:'',
          modifiedBy:'',
          modifiedAt:'',
          remark:'',
        }
      ],
      listData:[
        {
          a:'流程编号',
          b:'',
          c:'processId'
        },
        {
          a:'任务类型',
          b:'',
          c:'wsBusinessType',
        },
        {
          a:'账期',
          b:'',
          c:'wsPeriod',
        },
        {
          a:'分出公司',
          b:'',
          c:'cedent',
        },
        {
          a:'经纪公司',
          b:'',
          c:'broker',
        },
        {
          a:'流程状态',
          b:'',
          c:'processStatus',
        },
      ],
      YWoptionsObj:{
        'T':'合约账单',
        'F':'临分账单',
        'O':'转分账单',
        'C':'理赔账单',
      },
      textareaOpinion:'',
      value:[],
      docViewRow:{},
      value1:'',
      subProcess:null, // 条目拆分数量
      reason:'',  // 条目拆分理由
      labelPosition:'right',
      dialogFormVisible:false,
      dialogFormVisible2:false,
      dialogFormVisible3:false,
      dialogFormVisible5:false,
      title:'',
      dialogState:'',
      currentPage3: 5,
      currentPage4: 2,
      hide:false,
      radio: null,
      options:[],
      value:0,
      formLabelAlign:{
        name:'',
        type:'',
      },
      ocrRow:null,
      file:[],
      head:{
        'Content-Type': "application/json;charset=UTF-8"
      },
      chooseRow:{},
      TJRoptions:[],
      recognize_service:'',
      mustData:{ 
        pageNumber:1,  // 页数
        pageSize:20,  //页面一次要展示的条数
        total:0, //总条数
      },
      chooseDocList:null,
      subProcessFlag:false,
      billCheckType:null,
    };
  },
  created(){
    sessionStorage.setItem('data',JSON.stringify({}));
  },
  mounted() { 
     // 查询账单详情
     if(this.$route.query.tag !== "billSignBack"){
       this.uploadType = 1;
     }
      this.chooseRow = JSON.parse(this.$route.query.row);
      this.$http.get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`).then(res =>{
        if(res.status === 200) {
          this.tableData = res.data.bscDocumentVOlist;
          this.SICSData = res.data.workSheetVOlist;
          res.data.processStatus === '已悬停'?this.isHover = true:this.isHover = false;
        }
      }) 
      // 获取详情的值
      this.listData.forEach(el=>{
        if(el['c']=='cedent'){ el['b'] = `${this.chooseRow['wsCedentCode']}-${this.chooseRow['wsCedentName']}`; }
        else if(el['c']=='broker'){ el['b'] = `${this.chooseRow['wsBrokerCode']}-${this.chooseRow['wsBrokerName']}`; }
        else if(el['c']=='wsBusinessType' && this.chooseRow['wsBusinessType']){ el['b'] = `${ this.YWoptionsObj[this.chooseRow['wsBusinessType']] }` }
        else{ el['b'] = this.chooseRow[el['c']]; }
      })
  },
  methods: {
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
    handleSelectionChange(val){},
    getName(name) {
      // 获取流程提交指派人
      this.$http.post('api/activiti/getAssigneeName',{roleName:name}).then(res =>{
        if(res.status === 200){ this.TJRoptions = res.data; }
      })
    },
    openSics(row){                                                                                 //  获取当前选中worksheet
      this.$http.post('api/sics/liveDesktop/openWorksheet',{modifiedBy:this.$store.state.userName,worksheetId:row.wsId}).then(res =>{
      }) 
    },
    onReverse(){
      this.$confirm('是否Reverse?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('api/worksheet/wSEntry/reverseWSProcess',{actOperator:this.$store.state.userName,processId:this.chooseRow.processId}).then(res =>{
          console.log(res,'onReverse')
          if(res.status === 200 && res.data.code==0){
            this.$message({type: 'success', message: '成功'});
          } else if(res.data.msg){
            this.$message.error(res.data.msg);
          }
        })
      })
    },
    onSics(tag){
      let url = '';
      if(tag == '录入'){
        url = '/worksheet/wSCheck/enterSicsReturn';
      } else{
        url = '/worksheet/wSCheck/reviewSicsReturn'
      }
      this.$http.post(`api${url}`,
      {actOperator:this.$store.state.userName,
      processId:this.chooseRow.processId,
      docId:this.docViewRow?this.docViewRow.docId:'',
      }).then(res =>{
        if(res.status === 200 && res.data){
          this.SICSData = res.data;
        }
      })
    },
    mailSend(tag) {
      if(tag == 1) {  // 邮件通知
      // this.title = '邮件通知';
      //  this.dialogFormVisible2 = true;
        this.$http.get('api/worksheet/wSEntry/getEmailContacts').then(res =>{
          if(res.status === 200 && res.data.length){
            this.dialogFormVisible2 = true;
            this.title = '邮件通知';
            this.mailOption = res.data;
          } else{ this.$message.error('获取不到发送人列表信息'); }
        })
      } else{   // 上传附件
        this.dialogFormVisible2 = true;
        this.title = '上传附件';
      }
    },
    OnuploadType(){
      if(this.uploadType == 1){
        this.chooseDocList = null;
      } else{
        this.fileList = [];
        this.file = [];
      }
    },
    send(){
      if(this.title == 'OCR上传') {
        this.$http.post('api/anyShare/fileOperation/previewDocument',Object.assign({},this.ocrRow,{processId:this.chooseRow.processId}),{responseType:'blob'}).then(res =>{
          if(res.status == 200){ 
            let resFile = new FormData();
            resFile.append('filePatn',res.data);
            resFile.append('recognize_service',this.recognize_service);
            this.$http.post('ocrApi/PrivatizingOcrTest/ocrDiscern.do',resFile,{headers:{ 'Content-Type': "application/x-www-form-urlencoded" }}).then(res =>{
              console.log(res,'ocr');
              if(res.status === 200 && res.data){
                this.$message({type: 'success', message: '提交成功'});
                this.dialogFormVisible2 = false;
              } else{
                if(res.data.errorMessage){
                  this.$message.error(res.data.errorMessage);
                  this.dialogFormVisible2 = false;
                }
              }
            })
          } 
        })
      } else if(this.title == '邮件通知') {
        
        let info = {}, params = null;
        this.mailOption.forEach(el=>{
          if(el.id == this.mailInfo){
            info = Object.assign({},{emailContent:this.emailContent,mailTitle:this.mailTitle},el)
          }
        })
        // 本地上传
        if(this.file.length) {
          var resFile = new FormData();
          resFile.append('file', this.file[0]);
          for(let k in info){
            resFile.append(k,info[k]);
          }
        } 
        // docList 上传
        if(this.chooseDocList != null) {
          let row = this.tableData[this.chooseDocList];
          this.$http.post('api/anyShare/fileOperation/previewDocument',Object.assign({},row,{processId:this.chooseRow.processId}),{responseType:'blob'}).then(res =>{
            console.log(res);
            if(res.status === 200){
              let resFiles = new FormData();
              resFiles.append('file', res.data);
              for(let k in info){
                resFiles.append(k,info[k]);
              }
              this.$http.post('api/worksheet/wSEntry/sendEmail',resFiles).then(res =>{
                if(res.status === 200 && res.data.code == 0){
                  this.$message({type: 'success', message: '邮件发送成功'});
                  this.dialogFormVisible2 = false;  
                } else if(res.data.code == 1 && res.data.msg){
                  this.$message.error(res.data.msg);
                }
              })
            }
          })
        } 
        if(this.chooseDocList == null){
          this.file.length?params=resFile:params=info;
          this.$http.post('api/worksheet/wSEntry/sendEmail',params).then(res =>{
            if(res.status === 200 && res.data.msg === '操作成功'){
              this.$message({type: 'success', message: '邮件发送成功'});
              this.dialogFormVisible2 = false;  
              this.fileList = [];
              this.file = [];
            }
          })
        }

      } 
    },
    submit(tag,name) {
      this.dialogState = tag;
      this.tagName = name;
      this.assignee = null;
      switch(tag){
          case 1:  // 任务指派  ==== 两种
            this.dialogFormVisible5 = true;
            this.title = '任务指派';
            if(name === '录入指派'){
              this.getName('账单录入');
            } else{
              this.getName('账单复核');
            }
            break;
          case 2:  // 复核驳回  ----- 不需要选择人,但是有弹窗 assign：录入人
            this.opinion = '';
            this.textareaOpinion = '';
            this.title = '复核驳回';
            this.dialogFormVisible5 = true;
            // 不用下拉框
           break;
          case 3:  // 复核通过  ----- 不需要选择人，根据wsSignbackFlag判断是否需要签回，
            // this.title = '复核通过';
            if(this.$route.query.tag === 'billCheck'){ 
              this.$http.post('api/worksheet/wSCheck/getType',{modifiedBy:this.$store.state.userName,processID:this.chooseRow.processId}).then(res =>{
                if(res.status === 200){
                  if(res.data.code ==1){
                    this.$message.error(res.data.msg);
                    return false;
                  } else{
                    let assign = this.$route.query.SIGNBACK == 1?`${this.chooseRow.entryOperator}`:this.$store.state.userName;
                    console.log(this.chooseRow.entryOperator,'entryOperator');
                    this.$confirm('是否复核通过？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.$http.post('api/worksheet/activitiForWorksheet/commonActivitiForWorksheet',
                        {processStatus:'SIGNBACK', 
                        wsSignbackFlag:'1', 
                        processId:this.chooseRow.processId, 
                        procInstId:this.chooseRow.processInstId, 
                        assignee:assign, 
                        type:'SIGNBACK',
                        actOperator:this.chooseRow.curOperator,
                        })
                        .then(res =>{
                          if(res.status === 200 && res.data.errorCode == 1){
                            this.dialogFormVisible = false;
                            this.$router.push({name:this.$route.query.tag});
                          } else if(res.data.errorCode == 0){
                            this.$message({type: 'error', message:res.data.errorMessage }); 
                          }
                        })
                    })
                  }
                }
              })
            }
            
            // if(!this.billCheckType){
            //   this.$message.error('请关闭账单，并同步SICS');
            //   return false;
            // }
            
            break;
          case 4:  // 置废      
            this.$confirm('是否置废？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.post('api/worksheet/activitiForWorksheet/commonActivitiForWorksheet',
              {processId:this.chooseRow.processId, 
              procInstId:this.chooseRow.processInstId, 
              assignee:this.$store.state.userName, 
              type:'INACTIVE',
              actOperator:this.chooseRow.curOperator,
              }).then(res =>{
                if(res.status === 200 && res.data.errorCode == 1){
                  this.dialogFormVisible = false;
                  this.$router.push({name:this.$route.query.tag});
                } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
              }
              })
            })
            break;
          case 5:  // 状态挂起
            if(!this.isHover){
              this.title = '悬停';
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
            } else{  // 恢复
               this.$confirm('是否恢复？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                  this.$http.post('api/worksheet/activitiForWorksheet/commonActivitiForWorksheet',
                  {processId:this.chooseRow.processId, 
                  procInstId:this.chooseRow.processInstId, 
                  assignee:this.chooseRow.curOperator, 
                  type:'RECOVERY',
                  actOperator:this.chooseRow.curOperator,}).then(res =>{
                  if(res.status === 200 && res.data.errorCode == 1){
                    this.isHover = !this.isHover;
                  } else if(res.data.errorCode == 0){
                    this.$message({type: 'error', message:res.data.errorMessage }); 
                  }
                })
              })
            }
            
            break;
          case 6:  // 流程提交 ===== 2种
            if(name === '录入提交'){
              this.getName('账单复核'); 
              this.dialogFormVisible5 = true;
              this.title = '流程提交';
            } else{   //  签回流程提交----到关闭 不需要选择下一人，assign需要录入人
              this.$confirm('是否流程提交？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
              }).then(() => {     //   此处assign 也需要录入人
                this.$http.post('api/worksheet/activitiForWorksheet/commonActivitiForWorksheet',{processId:this.chooseRow.processId, procInstId:this.chooseRow.processInstId, assignee:this.chooseRow.entryOperator,type:'CLOSE',actOperator:this.chooseRow.curOperator,}).then(res =>{
                  if(res.status === 200 && res.data.errorCode == 1){
                    this.dialogFormVisible = false;
                    this.$router.push({name:this.$route.query.tag});
                  }
                })
            })

              
            }
            break;
          case 7:  // 签回
            this.$confirm('是否确认签回？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
              }).then(() => {         //   此处assign 也需要录入人
                this.$http.post('api/worksheet/activitiForWorksheet/commonActivitiForWorksheet',{processId:this.chooseRow.processId, procInstId:this.chooseRow.processInstId, assignee:this.chooseRow.entryOperator, type:'SIGNBACK',actOperator:this.chooseRow.curOperator,}).then(res =>{
                if(res.status === 200 && res.data.errorCode == 1){
                  this.dialogFormVisible = false;
                  this.$router.push({name:this.$route.query.tag}); 
                }
              })
            })
            break;
      }
    },
    confirm(){
      // this.dialogFormVisible = false;
      switch(this.dialogState){
        case 1:    // 任务指派  ==== 两种
          if(!this.assignee){
            this.$message.error('请选择任务指派人');
            return false;
          }
          if(this.tagName === '录入指派'){
            this.$http.post('api/activiti/setAssignee',
            { processId:this.chooseRow.processId, 
              procInstId:this.chooseRow.processInstId, 
              assignee:this.assignee, 
              taskName:'待处理',
              entryOperator:this.assignee,
              actOperator:this.chooseRow.curOperator,
              processInstanceKey:'taProcess01'
            })
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible5 = false;
                this.$router.push({name:this.$route.query.tag});
              } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
              }
            })
          } else{  // 复核指派 -----------------------
            this.$http.post('api/activiti/setAssignee',
            { processId:this.chooseRow.processId, 
              procInstId:this.chooseRow.processInstId, 
              assignee:this.assignee, 
              taskName:'待复核',
              actOperator:this.chooseRow.curOperator,
              processInstanceKey:'taProcess01'
            })
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible5 = false;
                this.$router.push({name:this.$route.query.tag});
              } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
              }
            })

          }
          
          break;
        case 2:    // 复核驳回
          if(!this.opinion){
            this.$message.error('请选择驳回原因');
            return;
          }
          if(this.opinion == '其它' && !this.opinion){
            this.$message.error('请填写驳回原因');
            return;
          }
          this.$http.post('api/worksheet/activitiForWorksheet/commonActivitiForWorksheet',
          {processId:this.chooseRow.processId,
           procInstId:this.chooseRow.processInstId,
           assignee:this.chooseRow.entryOperator,
           opinion:this.opinion == '其它'? this.textareaOpinion : this.opinion,
           actOperator:this.chooseRow.curOperator,
           type:'REJECT'})
          .then(res =>{
            if(res.status === 200 && res.data.errorCode == 1){
              this.dialogFormVisible = false;
              this.$router.push({name:this.$route.query.tag});
            } else if(res.data.errorCode == 0){
              this.$message({type: 'error', message:res.data.errorMessage }); 
            }
          })
          break;
        case 3:  // 复核通过
          break;
        case 4:   // 置废
          break;
        case 5: // 状态挂起
            if(!this.pendingReason){
              this.$message.error('请填写悬停原因');
              return false;
            }
            this.$http.post('api/worksheet/activitiForWorksheet/commonActivitiForWorksheet',
              {processId:this.chooseRow.processId, 
              procInstId:this.chooseRow.processInstId, 
              assignee:this.chooseRow.curOperator, 
              pendingReason:this.pendingReason,
              actOperator:this.chooseRow.curOperator,
              type:'PENDING'}).then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.isHover = !this.isHover;
                this.dialogFormVisible5 = false;
              } else if(res.data.errorMessage){
                this.$message.error(res.data.errorMessage);
              }
            })
          break;
        case 6: // 流程提交 === 两种
          if(!this.assignee){
            this.$message.error('请选择下一任务处理人');
            return false;
          }
          if(this.tagName === '录入提交') {
            if(this.radio == null){ this.$message({type: 'error', message:'请选择是否需要签回'}); return false; }
            this.$http.post('api/worksheet/activitiForWorksheet/commonActivitiForWorksheet',
            {processId:this.chooseRow.processId, 
            procInstId:this.chooseRow.processInstId, 
            assignee:this.assignee, 
            actOperator:this.$store.state.userName,
            wsSignbackFlag:this.radio,
            type:'RECHECK'})
            .then(res =>{
              if(res.status === 200 && res.data.errorCode == 1){
                this.dialogFormVisible = false;
                this.$router.push({name:this.$route.query.tag});
              } else if(res.data.errorCode == 0){
                this.$message({type: 'error', message:res.data.errorMessage }); 
              }
            })
          } else{  // 签回提交
          }
          break;
        case 7: // 签回
           break;
      }
    },
    docView(row) {
      if(row){
        this.docViewRow = row;
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
        this.docViewRow = {};
        document.getElementById('iframeId').contentWindow.postMessage({},'*');
        document.getElementById('iframeId').contentWindow.location.reload(true);
      }
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
    handleClick(tag,row){
      if(tag == 1){ // 删除
        this.$confirm('是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('api/anyShare/fileOperation/deleteFilesForPage',
          {docPath:row.docPath, docName:row.docName, processId:this.chooseRow.processId, actOperator:this.$store.state.userName})
          .then(res =>{
            if(res.status === 200 && res.data.errorCode == 1) {
              this.$http.get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`).then(res =>{
                if(res.status === 200) {
                  this.tableData = res.data.bscDocumentVOlist;
                  this.docView();
                }
              }) 
            } else if(res.data.errorCode == 0 && res.data.errorMessage){
              this.$message.error(res.data.errorMessage);
            }
          })
        })
      } else if(tag == 3){  // 下载
        this.$http.post('api/anyShare/fileOperation/previewDocument',Object.assign({},row,{processId:this.chooseRow.processId}),{responseType:'blob'}).then(res =>{
          if(res.status === 200){
            console.log(res);
            // this.path = res.data;
            this.path = this.getObjectURL(res.data);
            if (res.data) {
              var a = document.createElement('a')
              if (typeof a.download === 'undefined') {
                window.location = this.path
              } else {
                a.href = this.path
                a.download = res.data
                document.body.appendChild(a)
                a.click()
                a.remove()
              }
            } else {
              window.location = this.path
            }
          }
        })
      } else{    // ocr 上传
        this.dialogFormVisible2 = true;
        this.title = 'OCR上传';
        this.ocrRow = row;
      }
      
    },
    handelClick3(row, column, event){
      let data = [
        {a:'ProcessID',c:'processId'},
        {a:'账单号',c:'wsId'},
        {a:'账单状态',c:'wsStatus'},
        {a:'账单标题',c:'wsTitle'},
        {a:'业务编号',c:'businessId'},
        {a:'section',c:'section'},
        {a:'业务年度',c:'uwYear'},
        {a:'任务类型',c:'businessType'},
        {a:'收到账单日期',c:'receiptDate'},
        {a:'分出公司名称',c:'cedentName'},
        {a:'分出公司代码',c:'cedentCode'},
        {a:'经纪公司代码',c:'brokerCode'},
        {a:'经纪公司名称',c:'brokerName'},
        {a:'账单类型',c:'wsType'},
        {a:'账单期',c:'wsPeriod'},
        {a:'Business Origin',c:'businessOrigin'},
        {a:'Base Company',c:'baseCompany'},
        {a:'经营机构',c:'dept'},
        {a:'币制',c:'wsCurrency'},
        {a:'金额',c:'wsAmount'},
        {a:'账单录入的user',c:'createdBy'},
        {a:'账单录入时间',c:'createdAt'},
        {a:'修改时间',c:'modifiedAt'},
        {a:'修改人',c:'modifiedBy'},
        {a:'备注',c:'remark'},
      ]
        let str = '';
        data.forEach(el=>{
          str += `${el['a']}：${row[el['c']]}<br/>`
        })
       this.$alert(str, '详情', {
          dangerouslyUseHTMLString: true,
        });
    },
    beforeAvatarUpload(file){
      this.file.push(file);
    },
    upload(file){
      if(this.title === '邮件通知'){
        return false;
      } 
        let resFile = new FormData();
        resFile.append('file', this.file[0]);
        resFile.append('actOperator',this.$store.state.userName);
        resFile.append('processId', this.chooseRow.processId);
        this.$http.post('api/anyShare/fileOperation/uploadFilesForPage',resFile,{headers:{ 'Content-Type': "application/json;charset=UTF-8" }}).then(res =>{
          this.fileList = [];
          this.file = [];
          if(res.status === 200 && res.data.errorCode == 1){
            this.dialogFormVisible2 = false;
            this.$http.get(`api/worksheet/wSEntry/edit/${this.chooseRow.processId}`).then(res =>{
                if(res.status === 200) {
                  this.tableData = res.data.bscDocumentVOlist;
                }
              }) 
          } else if(res.data.errorCode == '0' && res.data.errorMessage){
            this.$message.error(res.data.errorMessage);
          } else{ this.$message.error('上传失败'); }
        })
    },
    split(){
      let arr = document.querySelectorAll('.itemNum');
      // let subProcessArr = [];
      // arr.forEach(el=>{
      //   let obj = {'rmAmount':el.value};
      //   subProcessArr.push(obj);
      // })
      // if(!subProcessArr.length){
      //   this.$message.error('请填写拆分金额');
      //   return;
      // }
      if(!this.subProcess){
        this.$message.error('请填写拆分数量');
        return;
      }
      if(!this.reason){
        this.$message.error('请填写拆分理由');
        return;
      }
      this.$http.post('api/worksheet/wSEntry/processSplit',{
        processId:this.chooseRow.processId,
        // subProcess:subProcessArr,
        subProcess:+this.subProcess,
        actOperator:this.chooseRow.curOperator,
        reason:this.reason
      }).then(res =>{
        if(res.status == 200 && res.data.code == 0){
          this.$message({message: '拆分成功',type: 'success'});
          this.dialogFormVisible = false;
        } else if(res.data.code == 1 && res.data.msg){
          this.$message.error(res.data.msg);
        }      
      })
    },
    itemSplit() {
      if(!this.subProcessFlag){ this.subProcessFlag = false; return false; }
      let idInputWrap = document.getElementById('idInputWrap');
      let child = document.querySelectorAll('.item');
      if(child.length) { 
        child.forEach(el=>{
          idInputWrap.removeChild(el);
        })
      }
      if(this.subProcess && !isNaN(+this.subProcess) && this.subProcess>0) {
        for(let i = 0; i < this.subProcess; i++) { 
          let item = document.createElement('div');
          item.className = 'item';
          item.innerHTML = `<span>第${i+1}条</span><input type="number" class="itemNum">`; 
          idInputWrap.append(item);
        }
      }
      this.subProcessFlag = false;
    },
  },
  // watch:{
  //   subProcess(n,o){
  //     this.subProcessFlag = n?true:false;
  //   }
  // },
}
</script>

<style scoped>
.detailEntry {
  /* padding:0 30px; */
  width: 100%;
  padding-left: 64px;
  height: -webkit-fill-available;
  /* display: flex; */
}
.btn{
  padding:0 16px;
}
.btn .el-button {
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 10px;
  border: 1px solid #005C8D;
  background-color: #fff;
  color: #005C8D;
}
.btn .el-button.is-plain:focus, .btn .el-button.is-plain:hover {
  background: #f5f5f5;
  border-color: #f5f5f5;
  border: 1px solid #005C8D;
}
.detail-word {
  /* background-color: #ecf5ff; */
  background-color: rgba(244,245,246,1);
  padding: 10px;
  margin-top: 30px;
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
  /* box-shadow:4px 0px 10px 0px rgba(169,169,169,0.5); */
  padding: 20px;
}
.right {
  width: 100%;
  height: 100%;
  /* padding: 20px; */
  background-color: #EEEEEE;
}
.fy2{
  text-align: right;
  margin-top: 20px;
}
.fy1{
  padding-left: 0;
}
.el-collapse{
  border: none;
}
.el-collapse-item {
  padding: 0 20px;
  background-color: #fff;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border-radius: 8px;
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
.detailSearch{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-collapse-item__header {
  border-bottom: none;
}
.document {
  border:1px solid rgba(238,238,238,1);
  /* border-radius:8px; */
}
.itemNum{
  height: 36px;
  border-radius: 4px;
  outline: none;
  border: 1px solid #DCDFE6;
  margin-left: 10px;
  margin-bottom: 10px;
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
.selfRadio .el-radio{
  margin-bottom: 10px;
}
.document[data-v-0ae63f9a]{
  border: none;
}
.smallHand {
  cursor: pointer;
  color:#409EFF;
}
</style>
