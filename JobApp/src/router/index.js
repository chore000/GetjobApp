import Vue from 'vue'
import Router from 'vue-router'

const Main = r => require.ensure([], () => r(require('../components/HelloFromVux.vue')), 'Main')
const Todolist = r => require.ensure([], () => r(require('../components/Todolist.vue')), 'Todolist')
const Donelist = r => require.ensure([], () => r(require('../components/Donelist.vue')), 'Donelist')
const PickTasklist = r => require.ensure([], () => r(require('../components/Picktask.vue')), 'PickTasklist')
const Marklist = r => require.ensure([], () => r(require('../components/marklist.vue')), 'Marklist')
const Taskdetail = r => require.ensure([], () => r(require('../components/taskdetail.vue')), 'Taskdetail')
const AddTask = r => require.ensure([], () => r(require('../components/AddTask.vue')), 'AddTask')
const Myapply = r => require.ensure([], () => r(require('../components/myapply.vue')), 'Myapply')
const Myapprove = r => require.ensure([], () => r(require('../components/myapprove.vue')), 'Myapprove')
const Dynamic = r => require.ensure([], () => r(require('../components/dynamic.vue')), 'Dynamic')
const taskcondition = r => require.ensure([], () => r(require('../components/showtaskscondition.vue')), 'taskcondition')
const personinfo = r => require.ensure([], () => r(require('../components/Personinfo.vue')), 'personinfo')
const Tododetail = r => require.ensure([], () => r(require('../components/tododetail.vue')), 'Tododetail')
const MyTask = r => require.ensure([], () => r(require('../components/mytask.vue')), 'MyTask')
const Checktask = r => require.ensure([], () => r(require('../components/check.vue')), 'Checktask')
const Checktaskdetail = r => require.ensure([], () => r(require('../components/checkdetail.vue')), 'Checktaskdetail')

const Mainmobile = r => require.ensure([], () => r(require('../components/page01.vue')), 'Mainmobile')
const Todolistmobile = r => require.ensure([], () => r(require('../components/Todolistmobile.vue')), 'Todolistmobile')
const Donelistmobile = r => require.ensure([], () => r(require('../components/Donelistmobile.vue')), 'Donelistmobile')
const PickTasklistmobile = r => require.ensure([], () => r(require('../components/Picktaskmobile.vue')), 'PickTasklistmobile')
const Marklistmobile = r => require.ensure([], () => r(require('../components/marklistmobile.vue')), 'Marklistmobile')
const Taskdetailmobile = r => require.ensure([], () => r(require('../components/taskdetailmobile.vue')), 'Taskdetailmobile')
const AddTaskmobile = r => require.ensure([], () => r(require('../components/AddTaskmobile.vue')), 'AddTaskmobile')
const Myapplymobile = r => require.ensure([], () => r(require('../components/myapplymobile.vue')), 'Myapplymobile')
const Myapprovemobile = r => require.ensure([], () => r(require('../components/myapprovemobile.vue')), 'Myapprovemobile')
const Dynamicmobile = r => require.ensure([], () => r(require('../components/dynamicmobile.vue')), 'Dynamicmobile')
const taskconditionmobile = r => require.ensure([], () => r(require('../components/showtasksconditionmobile.vue')), 'taskconditionmobile')
const personinfomobile = r => require.ensure([], () => r(require('../components/Personinfomobile.vue')), 'personinfomobile')
const Checktaskmobile = r => require.ensure([], () => r(require('../components/checkmobile.vue')), 'Checktaskmobile')
const Checktaskdetailmobile = r => require.ensure([], () => r(require('../components/checkdetailmobile.vue')), 'Checktaskdetailmobile')
const MyTaskmobile = r => require.ensure([], () => r(require('../components/mytaskmobile.vue')), 'MyTaskmobile')
const Tododetailmobile = r => require.ensure([], () => r(require('../components/tododetailmobile.vue')), 'Tododetailmobile')

Vue.use(Router)

export default new Router({
  routes: [
    // 需要被缓存
    {path: '/', component: Main, meta: {keepAlive: true}},
    {path: '/mobile', component: Mainmobile},
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
    {path: '/mobilepersoninfo', component: personinfomobile},
    {path: '/mobilechecktask', component: Checktaskmobile},
    {path: '/mobilechecktaskdetail/:id', component: Checktaskdetailmobile},
    {path: '/mobilemytask', component: MyTaskmobile},
    {path: '/mobiletododetail/:id', component: Tododetailmobile},
  ]
})
