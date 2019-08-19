<template>
  <div class="settlementReport">
    <el-row :gutter="10">
      <el-col :span="10">
        <div style="display:flex;align-items: center;justify-content: space-between;padding: 12px 16px;">
          <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>附件列表</div>
          <p>
            <el-button size="small">
              <el-upload action="" :before-upload="beforeAvatarUpload" :auto-upload="true" :http-request="upload" :file-list="fileList">
                <i style="margin-right:8px;" class="iconfont iconGroup75"></i>上传
              </el-upload>
            </el-button>
          </p>
        </div>
        <el-table height="600" stripe border :header-row-class-name="StableClass" :data="tableData" class="document">
          <el-table-column label="文件名" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.docName" placement="top">
                <span :class="{'smallHand':scope.row.suffix!='eml'}" class="abbreviate" @click="docView(scope.row)">{{scope.row.docName}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="时间" width="160" align="center"></el-table-column>
          <el-table-column label="任务来源" width="100" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="nameList[scope.row.createdBy]" placement="top">
                <span class="abbreviate">{{nameList[scope.row.createdBy]}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <span class="blueColor" style="cursor: pointer;" @click.stop="downLoad(scope.row)">下载</span>
              <!-- <el-dropdown placement="top-start">
                <span class="el-dropdown-link"><i  style="margin-left:8px; width:8px;display:inline-block;transform: scale(0.4)" class="iconfont iconcaozuoliebiao" ></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="14" style="padding-right:20px;">
        <div class="titleSearch detailSearch">
          <div><i style="margin-right:8px;" class="el-icon-arrow-down"></i>文档预览</div>
        </div>
        <div class="browseDoc">
          <iframe src="../../../static/Preview/index.html" id="iframeId" name="ifrmname" ref="mapFrame" style="width:100%;height:100%" frameborder="0"></iframe>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      StableClass: "tableClass",
      tableData:[],
      nameList:{},
      path:null,
      docViewRow:{},
      fileList:[],
      file:[],
    }
  },
  created() {
    sessionStorage.setItem('data',JSON.stringify({}));
    this.nameList = JSON.parse(sessionStorage.getItem("nameList"));
  },
  mounted(){
    this.docView();
    this.getTableData();
  },
  methods:{
    getTableData(){
      this.$http.post(`api/othersDO/bscDocument/list`,{processId:'TAREPORT0001',pageNumber:1,pageSize:1000,}).then(res => {
        if (res.status === 200) {
          let arr = res.data.rows;
          arr.forEach(el=>{
            if(el.docName){
              let suffix = el.docName.split('.');
              el['suffix'] = suffix[suffix.length-1];
            }
          })
          this.tableData = arr;
        }
      });
    },
     docView(row) {
      if (row) {
        if(row.suffix && row.suffix=='eml'){ return false; }
        this.docViewRow = row;
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
        this.docViewRow = {};
        document.getElementById("iframeId").contentWindow.postMessage({}, "*");
        document.getElementById("iframeId").contentWindow.location.reload(true);
      }
    },
    downLoad(row){
      // 下载
      this.$http.post("api/anyShare/fileOperation/downloadDocument",Object.assign({},row,{processId:'TAREPORT0001'}),{ responseType: "blob" })
        .then(res => {
          if (res.status === 200) {
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
     beforeAvatarUpload(file) {
      this.file.push(file);
    },
    upload(file) {
      this.fileList = [];
      let resFile = new FormData();
      resFile.append("file", this.file[0]);
      resFile.append("actOperator", this.$store.state.userName);
      this.$http.post("api/pay/teskClaim/uploadFile", resFile, {headers: { "Content-Type": "application/json;charset=UTF-8" }})
        .then(res => {
          this.fileList = [];
          this.file = [];
          if (res.status === 200 && res.data.code == 0) {
            this.dialogFormVisible2 = false;
            this.$message({ message:'上传成功', type: "success" });
            this.getTableData();
          } else{
            this.$message.error(res.data.errorMessage);
          } 
        });
    },
  }
}
</script>
<style>
.smallHand {
  cursor: pointer;
  color: #409eff;
}
.document[data-v-0ae63f9a] {
  border: none;
  width: 100%;margin-top:10px;
}
.browseDoc {
  background-color: #ecf5ff;
  width: 100%;
  height: 626px;
  border: 1px solid #d4d4d4;
  border-top: none;
}
</style>