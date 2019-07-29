let data = [
  // 详情页
  {
    title:'账单详情',
    path: '/detailEntry',
    name: 'detailEntry',
    components:{
      default:() => import("@/views/bill/detailEntry"),
      head:() => import("@/views/common/headNav"),
    } ,
    // component: () => import("@/views/bill/detailEntry"),
  },
  {
    title:'收款详情',
    path: '/detailCred',
    name: 'detailCred',
    components:{
      default:() => import("@/views/receipt/detailCred"),
      head:() => import("@/views/common/headNav"),
    } ,
    // component: () => import("@/views/receipt/detailCred"), 
  },
  {
    title:'付款详情',
    path: '/detailPay',
    name: 'detailPay',
    components:{
      default:() => import("@/views/pay/detailPay"),
      head:() => import("@/views/common/headNav"),
    } ,
    // component: () => import("@/views/pay/detailPay"), 
  },

  // Tab页-账单
  {
    level:1,
    title:'账单管理',
    path: '/bill',
    name: 'bill',
    components:{
      default:() => import("@/views/bill/index"),
      head:() => import("@/views/common/headNav"),
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
        title:'分拣操作',
        path: '/sortOperation',
        name: 'sortOperation',
        component: () => import("@/views/bill/sortOperation"),
      },
      {
        title:'账单录入',
        path: '/billEntry',
        name: 'billEntry',
        component: () => import("@/views/bill/billEntry"), 
      },
      {
        title:'账单复核',
        path: '/billCheck',
        name: 'billCheck',
        component: () => import("@/views/bill/billCheck"), 
      },
      {
        title:'账单签回',
        path: '/billSignBack',
        name: 'billSignBack',
        component: () => import("@/views/bill/billSignBack"), 
      },
    ]
  },
  // Tab页-收款
  {
    level:1,
    title:'结算收款',
    path: '/receipt',
    name: 'receipt',
    components:{
      default:() => import("@/views/receipt/index"),
      head:() => import("@/views/common/headNav"),
    },
    redirect:'/financialCreat',
    children:[
      {
        title:'财务创建',
        path: '/financialCreat',
        name: 'financialCreat',
        component: () => import("@/views/receipt/financialCreat"),
      },
      {
        title:'任务认领',
        path: '/taskClaim',
        name: 'taskClaim',
        component: () => import("@/views/receipt/taskClaim"),
      },
      {
        title:'收款操作',
        path: '/credOperation',
        name: 'credOperation',
        component: () => import("@/views/receipt/credOperation"),
      },
      {
        title:'收款复核',
        path: '/credReview',
        name: 'credReview',
        component: () => import("@/views/receipt/credReview"),
      },
      {
        title:'收款核销',
        path: '/credVerification',
        name: 'credVerification',
        component: () => import("@/views/receipt/credVerification"),
      },
      {
        title:'暂挂待销',
        path: '/viewInvalidate',
        name: 'viewInvalidate',
        component: () => import("@/views/receipt/viewInvalidate"),
      },
      { 
        title:'收款完结',
        path: '/collectiongEnd',
        name: 'collectiongEnd',
        component: () => import("@/views/receipt/collectiongEnd"),
      },
    ]
  },
   // Tab页-付款
   {
    level:1,
    title:'结算付款',
    path: '/pay',
    name: 'pay',
    components:{
      default:() => import("@/views/pay/index"),
      head:() => import("@/views/common/headNav"),
    },
    redirect:'/taskCreation',
    children:[
      // {
      //   title:'任务创建',
      //   path: '/taskCreation',
      //   name: 'taskCreation',
      //   component: () => import("@/views/pay/taskCreation"),
      // },
      {
        title:'付款操作',
        path: '/payOperation',
        name: 'payOperation',
        component: () => import("@/views/pay/payOperation"),
      },
      {
        title:'付款审批',
        path: '/payVerification',
        name: 'payVerification',
        component: () => import("@/views/pay/payVerification"),
      },
      {
        title:'付款支票',
        path: '/approvalDone',
        name: 'approvalDone',
        component: () => import("@/views/pay/approvalDone"),
      },
      {
        title:'付款复核',
        path: '/payReview',
        name: 'payReview',
        component: () => import("@/views/pay/payReview"),
      },
      {
        title:'付款核销',
        path: '/payClose',
        name: 'payClose',
        component: () => import("@/views/pay/payClose"),
      },
      {
        title:'财务支付',
        path: '/payment',
        name: 'payment',
        component: () => import("@/views/pay/payment"),
      },
      {
        title:'partial完结',
        path: '/partialDone',
        name: 'partialDone',
        component: () => import("@/views/pay/partialDone"),
      },
      {
        title:'紧急付款',
        path: '/instancyPay',
        name: 'instancyPay',
        component: () => import("@/views/pay/instancyPay"),
      },
      {
        title:'邮件通知',
        path: '/emailNotify',
        name: 'emailNotify',
        component: () => import("@/views/pay/emailNotify"),
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
      head:() => import("@/views/common/headNav"),
    },
    redirect:'/billProcess',
    children:[
      {
        title:'账单Process',
        path: '/billProcess',
        name: 'billProcess',
        component: () => import("@/views/integratedQuery/billProcess"),
      },
      {
        title:'账单workSheet',
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
        title:'SettlementGroup',
        path: '/settlementGroup',
        name: 'settlementGroup',
        component: () => import("@/views/integratedQuery/settlementGroup"), 
      },
      {
        title:'结算Process',
        path: '/accountProcess',
        name: 'accountProcess',
        component: () => import("@/views/integratedQuery/accountProcess"), 
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
      head:() => import("@/views/common/headNav"),
    } ,
    // redirect:'/closeAccount',
    children:[
      {
        title:'关账控制',
        path: '/closeAccount',
        name: 'closeAccount',
        component: () => import("@/views/admin/closeAccount"),
      },
      {
        title:'时间统计',
        path: '/timeStatistical',
        name: 'timeStatistical',
        component: () => import("@/views/admin/timeStatistical"), 
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