'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"', 
  // currentIp: '172.16.19.139',  // 139 ip-
  // currentIp: '172.16.19.138',  // 138 ip
  // currentIp: 'asc.cpcr.com.cn',  // 投产环境
  currentIp: '172.17.106.68',  // 个人pc ip

  currentPort: 8080, // 个人pc port 139 138 8080
  // currentPort: 80, // 投产环境 port

  apiUrl: "http://gateway.sit.chinare.com.cn", // 139 网关
  // apiUrl: "http://gateway.uat.chinare.com.cn", // 138 网关
  // apiUrl: "http://gateway.crudp.chinare.com.cn", // 投产 网关

  loginUrl: 'http://172.25.147.124:2222',  // 测试登录跳转ip  139
  // loginUrl: 'http://172.25.147.146:2222',  // UAT登录跳转ip 138
  // loginUrl: 'http://cas.crudp.chinare.com.cn',  // 投产环境

  uploadUrl:'http://172.16.19.139:9999', // 139----旧apiUrl---绕过网关---用于上传文件
  // uploadUrl:'http://172.16.19.138:9999', // 138----旧apiUrl---绕过网关---用于上传文件
  // uploadUrl:'http://asc.cpcr.com.cn:9999', // 投产----旧apiUrl---绕过网关---用于上传文件

  webSocketUrl:'ws://172.16.19.139:9999/websocket/20', // 139
  // webSocketUrl:'ws://172.16.19.138:9999/websocket/20', // 138
  // webSocketUrl:'ws://asc.cpcr.com.cn:9999/websocket/20', // 投产
  
})
