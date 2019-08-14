<template>
  <div class="mailReceive">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="待分配" name="first"></el-tab-pane>
    <el-tab-pane label="已完成" name="second"></el-tab-pane>
  </el-tabs>
  <!-- <div class="search">
    <div class="searchLeft">
      <p class="title">发件公司筛选:</p>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="发件公司 A"></el-checkbox>
        <el-checkbox label="发件公司 B"></el-checkbox>
        <el-checkbox label="发件公司 C"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="searchtight">
      <el-button type="text">查询</el-button>
    </div>
  </div> -->
  <div class="creatProcess" v-show="activeName=='first'">
    <el-button type="primary" size="mini">创建Process</el-button>
    <el-button type="primary" size="mini">关联Process</el-button>
    <el-button type="primary" size="mini">不需处理</el-button>
  </div>
  <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column v-if="activeName=='first'" type="selection" width="55"></el-table-column>
    <el-table-column prop="a" label="任务名称"></el-table-column>
    <el-table-column prop="b" label="公司"></el-table-column>
    <el-table-column prop="c" label="账单类型"></el-table-column>
    <el-table-column label="标签">
       <template slot-scope="scope">
        <el-tag v-for="(el,i) in scope.row.d" :key="i" :type="el === 'CNY' ? 'primary' : 'success'" disable-transitions>{{el}}</el-tag>
        <!-- <el-tag type="success" disable-transitions>标签</el-tag> -->
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <span class="blueColor">查看附件</span>
          <span class="blueColor">编辑</span>
        </template>
      </el-table-column>
  </el-table>
  <el-pagination small layout="prev, pager, next" :total="50"></el-pagination>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first',
        tableData:[
          {
            a:'HGIC_MCQSS Treaty_2019Q1 SOAs (China Re P&C, Shanghai)',
            b:'太平再保险',
            c:'Adjustment',
            d:['1Q2019','Marine','CNY']
          },
          {
            a:'Generali China_PA XL_3rd MDP_GCBJ invoice (633400-MA_CPCR)',
            b:'Guy Carpenter & Company, Limited',
            c:'',
            d:['3rd','MDP','treaty','CNY']
          },
          {
            a:'合约2018Q4结算清单',
            b:'中国大地财产保险股份有限公司',
            c:'Adjustment',
            d:['2018','12M','水险','超赔']
          },
        ],
        checkList:[],
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeName);
        // console.log(tab, event);
      },
      handleSelectionChange(){

      },
    }
  };
</script>
<style scoped>
.mailReceive {
  padding-right: 30px;
}
.search{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: aliceblue;
  margin-bottom: 20px;
  border-radius: 8px;
}
.search .searchLeft{
  display: flex;
}
.search .searchLeft .title{
  margin-right: 20px;
}
.creatProcess{
  text-align: right;
  margin-bottom: 10px;
}
.el-pagination{
  text-align: right;
  margin-top: 10px;
}
.el-tag--success{
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>

