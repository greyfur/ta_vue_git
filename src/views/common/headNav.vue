<template>
     <div class="headNav">
        <img src="@/assets/img/navLeft@2x.png" style="width:197px;" alt="error">
        <div class="logOut">
            <span style="color:#999;">
                <i class="el-icon-user-solid" style="color:#FFFFFF;"></i><span style="color:#FFFFFF;margin-right:4px;">{{UName}}</span>
            </span>
            <span class="logOutWord" @click="logOut" style="color:#fff;">
                <i class="el-icon-switch-button" style="margin-right:4px;color:#fff;"></i>退出
            </span>
        </div>
        <!-- <span class="word" v-show="!fold">
        <span style="font-size:15px;display: inline-block;transform: scale(.9);width:80px;">中再产险</span>
        <span class="enWord">CHINA RE P&C</span>
        </span>
        <span class="line" v-show="!fold"></span>
        <span class="word" v-show="!fold" style="margin-left:-15px;">
        <span style="font-size:15px;display: inline-block;transform: scale(.9);width:90px;">账单结算管理</span>
        <span class="enWord">Accounts/Settlement</span>
        </span> -->
    </div>
</template>
<script>
import cip from '../../../config/dev.env.js'
import cookie from 'js-cookie' 
import {computeNavbar} from '@/assets/js/util.js'
import {computeName} from '@/assets/js/util.js'
export default {
    data(){
        return {
            fold:true,
            UName:'',
        }
    },
    created(){
        this.UName = sessionStorage.getItem('userCName')
    },
    methods:{
        logOut() {
        sessionStorage.removeItem('resMenuList');
        sessionStorage.removeItem('roleIdList');
        cookie.remove('jwttoken');
        cookie.remove('jwttokenInfo');
        window.location.href = `http://${cip.loginUrl}:2222/logout?service=http://${cip.currentIp}:${cip.currentPort}/indexPage`;
      }
    }
}
</script>
<style scoped>
    .headNav{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
    }
    .headNav>img{
        display: flex;
        flex-shrink: 0;
    }
    .logOut{
        color: #fff;
        font-size: 14px;
        width: 100%;
        height: 64px;
        text-align: right;
        padding-right: 30px;
        line-height: 64px;
    }
    .logOutWord {
        margin-left: 20px;
        color:#1A6C98;
        cursor: pointer;
        font-weight: 700;
    }
</style>
