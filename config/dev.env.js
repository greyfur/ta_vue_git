'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // currentIp: '172.16.19.139',  // 个人pc ip
  currentIp: '172.17.106.38',  // 个人pc ip
  currentPort: 8088, // 个人pc port
  loginUrl: '172.25.147.124',  // 测试登录跳转ip
  // loginUrl: '172.25.147.146',  // UAT登录跳转ip
})
