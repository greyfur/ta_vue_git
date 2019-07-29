import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import cookie from 'js-cookie' 
Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    deFineRout:[],
    reLoad:'',
    userName:'',
  },
  mutations:{
    MdeFineRout:(state,data) => {state.deFineRout = data;},
    MreLoad:(state,data) => {state.reLoad = data;},
    MuserName:(state,data) => {state.userName = data;},
  },
  getters:{
    
  },
  actions:{
    AdeFineRout({commit},data){
      commit('MdeFineRout',data);
    },
    AreLoad({commit},data){
      commit('MreLoad',data);
    },
    AuserName({commit},data){
      commit('MuserName',data);
    },
  }
})

export default store
