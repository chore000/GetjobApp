// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'


import {InfiniteScroll} from 'mint-ui';
// import Vue from 'vue'

Vue.use(InfiniteScroll);
Vue.use(VueRouter)
import VueResource from 'vue-resource'

Vue.use(VueResource);
require("./lib/dingtalkPC.js")
require("./lib/dingtalk.js")

/*const router = new VueRouter({
  routes
})*/

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.http.interceptors.push(function (request, next) {//拦截器
// 跨域携带cookie
  request.credentials = true;
  next()
})

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
