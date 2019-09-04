let data = [
  // 详情页
  {
    title:'账单详情',
    path: '/detailEntry',
    name: 'detailEntry',
    components:{
      default:() => import("@/views/bill/detailEntry"),
      asideMenu:() => import("@/views/common/asideMenu"),
      headNav:() => import("@/views/common/headNav"),
    } ,
    // component: () => import("@/views/bill/detailEntry"),
  },
  {
    title:'收款详情',
    path: '/detailCred',
    name: 'detailCred',
    components:{
      default:() => import("@/views/receipt/detailCred"),
      asideMenu:() => import("@/views/common/asideMenu"),
      headNav:() => import("@/views/common/headNav"),
    } ,
    // component: () => import("@/views/receipt/detailCred"), 
  },
  {
    title:'付款详情',
    path: '/detailPay',
    name: 'detailPay',
    components:{
      default:() => import("@/views/pay/detailPay"),
      asideMenu:() => import("@/views/common/asideMenu"),
      headNav:() => import("@/views/common/headNav"),
    } ,
    // component: () => import("@/views/pay/detailPay"), 
  },

  // Tab页-账单
  {
    level:1,
    title:'账单',
    path: '/bill',
    name: 'bill',
    components:{
      default:() => import("@/views/bill/index"),
      asideMenu:() => import("@/views/common/asideMenu"),
      headNav:() => import("@/views/common/headNav"),
    } ,
    redirect:'/sortOperation',
    children:[
      // {
      //   title:'邮件接收',
      //   path: '/mailReceive',
      //   name: 'mailReceive',
      //   component: () => import("@/views/bill/mailReceive"), 
      // },
      {
        title:'分配',
        path: '/sortOperation',
        name: 'sortOperation',
        num: 0,
        component: () => import("@/views/bill/sortOperation"),
      },
      {
        title:'录入',
        path: '/billEntry',
        name: 'billEntry',
        num: 1,
        component: () => import("@/views/bill/billEntry"), 
      },
      {
        title:'复核',
        path: '/billCheck',
        name: 'billCheck',
        num: 2,
        component: () => import("@/views/bill/billCheck"), 
      },
      {
        title:'签回',
        path: '/billSignBack',
        name: 'billSignBack',
        num: 3,
        component: () => import("@/views/bill/billSignBack"), 
      },
    ]
  },
  // Tab页-收款
  {
    level:1,
    title:'收款',
    path: '/receipt',
    name: 'receipt',
    components:{
      default:() => import("@/views/receipt/index"),
      asideMenu:() => import("@/views/common/asideMenu"),
      headNav:() => import("@/views/common/headNav"),
    },
    redirect:'/financialCreat',
    children:[
      {
        title:'创建',
        path: '/financialCreat',
        name: 'financialCreat',
        num: 0,
        component: () => import("@/views/receipt/financialCreat"),
      },
      {
        title:'认领',
        path: '/taskClaim',
        name: 'taskClaim',
        num: 1,
        component: () => import("@/views/receipt/taskClaim"),
      },
      {
        title:'操作',
        path: '/credOperation',
        name: 'credOperation',
        num: 2,
        component: () => import("@/views/receipt/credOperation"),
      },
      {
        title:'复核',
        path: '/credReview',
        name: 'credReview',
        num: 3,
        component: () => import("@/views/receipt/credReview"),
      },
      {
        title:'核销',
        path: '/credVerification',
        name: 'credVerification',
        num: 4,
        component: () => import("@/views/receipt/credVerification"),
      },
      {
        title:'待销',
        path: '/viewInvalidate',
        name: 'viewInvalidate',
        num: 5,
        component: () => import("@/views/receipt/viewInvalidate"),
      },
      { 
        title:'完结',
        path: '/collectiongEnd',
        name: 'collectiongEnd',
        num: 6,
        component: () => import("@/views/receipt/collectiongEnd"),
      },
    ]
  },
   // Tab页-付款
   {
    level:1,
    title:'付款',
    path: '/pay',
    name: 'pay',
    components:{
      default:() => import("@/views/pay/index"),
      asideMenu:() => import("@/views/common/asideMenu"),
      headNav:() => import("@/views/common/headNav"),
    },
    redirect:'/taskCreation',
    children:[
      {
        title:'操作',
        path: '/payOperation',
        name: 'payOperation',
        num: 0,
        component: () => import("@/views/pay/payOperation"),
      },
      {
        title:'审批',
        path: '/payVerification',
        name: 'payVerification',
        num: 1,
        component: () => import("@/views/pay/payVerification"),
      },
      {
        title:'支票',
        path: '/approvalDone',
        name: 'approvalDone',
        num: 2,
        component: () => import("@/views/pay/approvalDone"),
      },
      {
        title:'复核',
        path: '/payReview',
        name: 'payReview',
        num: 3,
        component: () => import("@/views/pay/payReview"),
      },
      {
        title:'核销',
        path: '/payClose',
        name: 'payClose',
        num: 4,
        component: () => import("@/views/pay/payClose"),
      },
      {
        title:'支付',
        path: '/payment',
        name: 'payment',
        num: 6,
        component: () => import("@/views/pay/payment"),
      },
      {
        title:'PARTIAL',
        path: '/partialDone',
        name: 'partialDone',
        num: 7,
        component: () => import("@/views/pay/partialDone"),
      },
      {
        title:'单据',
        path: '/instancyPay',
        name: 'instancyPay',
        num: 9,
        component: () => import("@/views/pay/instancyPay"),
      },
      {
        title:'邮件',
        path: '/emailNotify',
        name: 'emailNotify',
        num: 5,
        component: () => import("@/views/pay/emailNotify"),
      },
      {
        title:'完结',
        path: '/payEnd',
        name: 'payEnd',
        num: 8,
        component: () => import("@/views/pay/payEnd"),
      },
    ]
  },
  // Tab页-综合查询
  {
    level:1,
    title:'综合查询',
    path: '/integratedQuery',
    name: 'integratedQuery',
    components:{
      default:() => import("@/views/integratedQuery/index"),
      asideMenu:() => import("@/views/common/asideMenu"),
      headNav:() => import("@/views/common/headNav"),
    },
    redirect:'/billProcess',
    children:[
      {
        // title:'账单Process',
        title:'账单流程',
        path: '/billProcess',
        name: 'billProcess',
        component: () => import("@/views/integratedQuery/billProcess"),
      },
      {
        // title:'账单workSheet',
        title:'账单',
        path: '/billWorkSheet',
        name: 'billWorkSheet',
        component: () => import("@/views/integratedQuery/billWorkSheet"), 
      },
      {
        title:'支票',
        path: '/remit',
        name: 'remit',
        component: () => import("@/views/integratedQuery/remit"), 
      },
      {
        // title:'SettlementGroup',
        title:'结算清单',
        path: '/settlementGroup',
        name: 'settlementGroup',
        component: () => import("@/views/integratedQuery/settlementGroup"), 
      },
      {
        title:'结算流程',
        path: '/accountProcess',
        name: 'accountProcess',
        component: () => import("@/views/integratedQuery/accountProcess"), 
      },
      {
        title:'结算报表',
        path: '/settlementReport',
        name: 'settlementReport',
        component: () => import("@/views/integratedQuery/settlementReport"), 
      },
    ]
  },
  // Tab页-管理员
  {
    level:1,
    title:'管理员',
    path: '/admin',
    name: 'admin',
    components:{
      default:() => import("@/views/admin/index"),
      asideMenu:() => import("@/views/common/asideMenu"),
      headNav:() => import("@/views/common/headNav"),
    } ,
    // redirect:'/closeAccount',
    children:[
      {
        // title:'关账控制',
        title:'设置',
        path: '/closeAccount',
        name: 'closeAccount',
        component: () => import("@/views/admin/closeAccount"),
      },
      {
        // title:'时间统计',
        // title:'统计',
        // path: '/timeStatistical',
        // name: 'timeStatistical',
        // component: () => import("@/views/admin/timeStatistical"), 
      },
      {
        title:'报表',
        path: '/reportForms',
        name: 'reportForms',
        component: () => import("@/views/admin/reportForms"), 
      },
    ]
  },
]

const routData = {
  root:data
}

export default routData