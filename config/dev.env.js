'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"', 
  // currentIp: '172.16.19.139',  // 139 ip
  // currentIp: '172.16.19.138',  // 138 ip
  // currentIp: 'asc.cpcr.com.cn',  // 投产环境
  currentIp: '172.17.106.38',  // 个人pc ip

  currentPort: 8088, // 个人pc port 139 138 8080
  // currentPort: 80, // 投产环境 port

  loginUrl: 'http://172.25.147.124:2222',  // 测试登录跳转ip  139
  // loginUrl: 'http://172.25.147.146:2222',  // UAT登录跳转ip 138
  // loginUrl: 'http://cas.crudp.chinare.com.cn',  // 投产环境
})
