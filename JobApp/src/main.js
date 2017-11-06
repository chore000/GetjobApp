// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import Home from './components/HelloFromVux'
import Page01 from './components/page01'
import Todolist from './components/Todolist'
import Donelist from './components/Donelist.vue'
import PickTasklist from './components/Picktask.vue'
import Marklist from './components/marklist.vue'
import Taskdetail from './components/taskdetail.vue'
import AddTask from './components/AddTask.vue'
import Myapply from './components/myapply.vue'
import Myapprove from './components/myapprove.vue'
import Dynamic from './components/dynamic.vue'
import taskcondition from './components/showtaskscondition.vue'
import personinfo from './components/Personinfo.vue'
import Tododetail from './components/tododetail.vue'
import MyTask from './components/mytask.vue'
import Checktask from './components/check.vue'
import Checktaskdetail from './components/checkdetail.vue'

import Todolistmobile from './components/Todolistmobile.vue'
import Donelistmobile from './components/Donelistmobile.vue'
import PickTasklistmobile from './components/Picktaskmobile.vue'
import Marklistmobile from './components/marklistmobile.vue'
import Taskdetailmobile from './components/taskdetailmobile.vue'
import AddTaskmobile from './components/AddTaskmobile.vue'
import Myapplymobile from './components/myapplymobile.vue'
import Myapprovemobile from './components/myapprovemobile.vue'
import Dynamicmobile from './components/dynamicmobile.vue'
import taskconditionmobile from './components/showtasksconditionmobile.vue'
import personinfomobile from './components/Personinfomobile.vue'

Vue.use(VueRouter)
import VueResource from 'vue-resource'

Vue.use(VueResource);
require("./lib/dingtalkPC.js")
require("./lib/dingtalk.js")

const routes = [
  {path: '/', component: Home},
  {path: '/mobile', component: Page01},
  {path: '/todo', component: Todolist},
  {path: '/picktasks', component: PickTasklist},
  {path: '/done', component: Donelist},
  {path: '/marklist', component: Marklist},
  {path: '/taskdetail/:id', component: Taskdetail, name: "taskdetail"},
  {path: '/addtask', component: AddTask},
  {path: '/myapply', component: Myapply},
  {path: '/myapprove', component: Myapprove},
  {path: '/dynamic', component: Dynamic},
  {path: '/taskcondition/:id', component: taskcondition},
  {path: '/personinfo', component: personinfo},
  {path: '/tododetail/:id', component: Tododetail},
  {path: '/mytask', component: MyTask},
  {path: '/checktask', component: Checktask},
  {path: '/checktaskdetail/:id', component: Checktaskdetail},

  {path: '/mobiletodo', component: Todolistmobile},
  {path: '/mobilepicktasks', component: PickTasklistmobile},
  {path: '/mobiledone', component: Donelistmobile},
  {path: '/mobilemarklist', component: Marklistmobile},
  {path: '/mobiletaskdetail/:id', component: Taskdetailmobile, name: "taskdetail"},
  {path: '/mobileaddtask', component: AddTaskmobile},
  {path: '/mobilemyapply', component: Myapplymobile},
  {path: '/mobilemyapprove', component: Myapprovemobile},
  {path: '/mobiledynamic', component: Dynamicmobile},
  {path: '/mobiletaskcondition/:id', component: taskconditionmobile},
  {path: '/mobilepersoninfo', component: personinfomobile}
]


const router = new VueRouter({
  routes
})

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
