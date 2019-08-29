'use strict'
const path = require('path')
const cip = require('./dev.env.js')
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      "/api": {
        // target: "http://asc.cpcr.com.cn:9999", //投产
        // target: "http://172.23.10.155:9999", //lm
        target: "http://172.16.19.139:9999", //fwq  
        // target: "http://172.16.19.138:9999", //UAT 
        // target: "http://172.17.106.24:9999", //lzw
        // target: "http://172.17.106.2:9999", //wangtengda
        // target: "http://172.17.106.69:9999", //fanzhiyuan
        // target: "http://172.17.106.129:9999", //ligang

        changOrigin: true, //允许跨域
        pathRewrite: {
          "^/api": "" //请求的时候使用这个api就可以
        }
      },
      "/loginApi": {
        target: `${cip.loginUrl}`, 
        changOrigin: true, //允许跨域
        pathRewrite: {
          "^/loginApi": "" //请求的时候使用这个api就可以
        }
      },
      "/ocrApi": {
        target: "http://172.30.19.200:8080",
        changOrigin: true, //允许跨域
        pathRewrite: {
          "^/ocrApi": "" //请求的时候使用这个api就可以
        }
      },
    },

    // Various Dev Server settings
    // host: 'localhost',
    host: cip.currentIp, // 寄几
    // host: '172.16.19.138', // servers
    port: cip.currentPort, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
