// 引入axios
import Axios from 'axios'
import cookie from 'js-cookie' 
import cip from '../../../config/dev.env.js'
import { Loading, Message } from 'element-ui'

let loading;
function startLoading() {
  // 加载Element loading 动画
  loading = Loading.service({
    lock: true,
    text: "Loading...",
    target: document.querySelector(".loading-area") // 设置加载动画区域
  });
}
function endLoading() {
  loading.close();
}

let axios = Axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  // timeout: 5000 // 请求超时时间
})

axios.defaults.timeout = 60000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// http请求拦截器 
axios.interceptors.request.use(config => {
	startLoading();
	return config
}, error => {
	endLoading()
	console.log(error,'requestErr');
	return Promise.reject(error);
})

axios.interceptors.response.use(
response => {
	endLoading();
	return Promise.resolve(response);
},
error => {
	// http失败
	endLoading();
	console.log(error,'responseErr');
	switch (error.response.status) {
		case 403:
			Message.error({message: "token过期，请登录"});
			cookie.remove('jwttokenInfo');
			window.location.href = `http://${cip.loginUrl}:2222/login?service=http://${cip.currentIp}:${cip.currentPort}/indexPage`;
			return Promise.reject(error);
		case 404:
			Message.error({message: "404-不存在的接口"});
			return Promise.reject(error);
		case 500:
			Message.error({message: "500-服务器出错，请稍后重试"});
			return Promise.reject(error);
		case 504:
			Message.error({message: "504-连接不到服务，请稍后重试"});
			return Promise.reject(error);
		default:
			Message.error({message: "未知错误，自行F12查看"});
			return Promise.reject(error);
	}
})
export const $http = axios;
export default {
	install: function (vm) {
		vm.prototype.$http = axios
	}
}
