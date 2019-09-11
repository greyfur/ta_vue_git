<template>
  <div class="billPrint">
    <div class="area">
      <span>账单号：</span>
      <el-input placeholder="请输入账单号" v-model.trim="inputbox"></el-input>
      <div class="do">操作： <p class="btn" @click="downLoad">生成账单</p></div>
    </div>
  </div>
</template>
<script>
// import billCom from '@/components/billCom.vue'
export default {
  // components:{
  //   billCom
  // },
  data() {
    return {
      inputbox:null,
      path2:null,
    }
  },
  methods:{
    downLoad(){
      this.$http.post("api/",{inputbox:this.inputbox},{responseType: "blob"}).then(res => {
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
      }
  }
}
</script>
<style scoped>
.billPrint{
 width: 100%;
 height: 100%;
}
.area{
  width: 100%;
  height: 50px;
  background: #fafafa;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.area span{
  margin: 0 20px;
}
.do{
  height: 50px;
  display: flex;
  align-content: center;
  line-height: 50px;
  margin-left: 20px;
}
.btn{
  width: 80px;
  height: 30px;
  background: rgb(0, 92, 141);
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  text-align: center;
  line-height: 30px;
}
</style>
