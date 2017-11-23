<template>

  <div>

    <divider>{{title}}</divider>
    <divider>姓名：{{myjs.name}} 一卡通号：{{myjs.jobnumber}}</divider>
    <x-button @click.native="gettaskcond">任务概况</x-button>
    <x-table v-if="taskscond.length>0">
      <thead>
      <tr>
        <th>区域</th>
        <th>待抢数量</th>
        <th>正在执行</th>
        <!--<th>合计</th>-->

      </tr>
      </thead>
      <tbody>
      <tr v-for="task in taskscond">
        <td>{{task.name}}</td>
        <td @click="getalltasksall(task.area)">{{task.todo}}</td>
        <td @click="getalltaskdoing(task.area)">{{task.doing}}</td>

      </tr>

      </tbody>
    </x-table>
    <!--   <p v-for="mark in mymarks">操作类型{{mark.type}}<br/>分数变化{{mark.marks}}；时间:{{mark.createtime}}
         <router-link :to="'taskdetail/'+mark.taskid">查看</router-link>
       </p>-->

    <group>
      <popup-radio title="默认加载的是可以抢的任务" :options="arealist" readonly v-model="yourarea"
      ></popup-radio>
    </group>
    <div v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="5">
      <group v-for="(task,index) in alltasks.list">
        <cell title='抢单人(点击可直接沟通)'>
          <span @click="callperson(task.assignee)">{{task.jobnum}}{{task.name}}</span>
        </cell>
        <cell title='等级要求'>
          <popup-radio title="" readonly :options="tasklvlvalues" v-model="task.tasklvl"></popup-radio>
        </cell>
        <cell title='工作项目'>
          <div>
            <span style="color: green">{{task.jobname}}</span>
          </div>
        </cell>
        <cell title='工作内容'>
          <div>
            <span style="color: green">{{task.jobcontent}}</span>
          </div>
        </cell>
        <cell title="分数">
          <div>
            <span style="color: green">{{task.mark}}</span>
          </div>
        </cell>
        <cell title="时间节点">
          <div>
            <span style="color: green">{{task.deadline}}</span>
          </div>
        </cell>
        <cell title="任务区域">
          <popup-radio title="" :options="arealist" readonly v-model="task.area"></popup-radio>
        </cell>
        <cell title="职业要求">
        </cell>
        <checklist disabled title="" :options="commonList" v-model="task.type"
        ></checklist>

        <x-button type="primary" @click.native="getjob(task.id)" v-if="mode!=2">抢任务</x-button>

      </group>
      <load-more :show-loading="loading" :tip="tips" background-color="#fbf9fe"></load-more>
    </div>


  </div>
</template>

<script>
  var corpId = "";  // 企业的corpId
  var signature = "";
  var nonceStr = "";
  var timeStamp = "";
  var agentId = "";
  import {Divider, XButton, Cell, Checklist, Group, PopupRadio, XTable, LoadMore} from 'vux'

  export default {
    components: {
      Group,
      Divider,
      XButton,
      Cell, Checklist, PopupRadio, XTable, LoadMore
    },
    data() {
      return {
        count: 3,
        title: '任务大厅',
        undo: '',
        myjs: '',
        alltasks: [],
        tasktypelist: [],
        commonList: [],
        arealist: [],
        yourarea: '',
        taskscond: [],
        mode: 1,
        type: 'todo',
        pagenum: 1,
        loading: false,
        tips: '加载中',
        allloaded: false
      }
    },
    created() {
      this.fetchdata()
    },
    methods: {
      choosearea() {
//        this.getalltasksall(this.yourarea)
      },
      gettaskarea() {
        this.$http.post(localStorage.getItem("url") + "/tasktype/gettaskArea", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            this.arealist = R.body
          })

      },

      gettasktype() {
        this.$http.post(localStorage.getItem("url") + "/tasktype/gettasktype", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            this.commonList = R.body
          })

      },
      gettaskcond() {
        this.$http.post(localStorage.getItem("url") + "/task/alltaskcondition", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            this.taskscond = R.body
          })

      },
      userinfo() {
        this.$http.post(localStorage.getItem("url") + "/userinfo", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            document.cookie = "user=" + R.bodyText,
              this.myjs = R.body,
              this.getalltasks()
          })

      },
      getlvlname() {
        this.$http.post(localStorage.getItem("url") + "/tasktype/getlvlname", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            this.tasklvlvalues = R.body
            console.log(R.body)
          })

      },
      callperson(assi) {
        DingTalkPC.biz.util.open({
          name: 'profile',//页面名称
          params: {
            id: assi,// String 必选 用户工号
            corpId: corpId //String 必选 企业id
          },//传参
          onSuccess: function () {
            /**/
          },
          onFail: function (err) {
          }
        });
      },
      toast(msg) {
        DingTalkPC.device.notification.toast({
          type: "information", //toast的类型 alert, success, error, warning, information, confirm
          text: msg, //提示信息
          duration: 3, //显示持续时间，单位秒，最短2秒，最长5秒
          delay: 0, //延迟显示，单位秒，默认0, 最大限制为10
          onSuccess: function (result) {
          },
          onFail: function (err) {
          }
        })
      },
      getjob(taskid) {
        var that = this
        var res
        //     console.log("getjob:" + taskid)
        DingTalkPC.device.notification.confirm({
          message: '是否抢此任务，抢任务会暂扣积分作为保证分，完成后返还',
          title: "提示",
          buttonLabels: ['必须的', '放弃'],
          onSuccess: function (result) {
            if (result.buttonIndex == 0) {
              that.$http.post(localStorage.getItem("url") + "/task/assigntask", {
                taskid: taskid,
                credentials: true
              }, {emulateJSON: true}).then(
                function (R) {
//                document.cookie = "user=" + R.bodyText,
                  res = R.body
                  if (res.stat == 0) {
                    that.toast("抢单成功")
                  } else {
                    that.toast(res.codemsg)
                  }
                  this.getalltasks()
                })
            }

          },
          onFail: function (err) {
          }
        });


      },
      getalltasksall(area) {
        this.tips = '加载中'
        this.allloaded = false
        this.mode = 1
        this.yourarea = area
        this.pagenum=1
        this.$http.post(localStorage.getItem("url") + "/task/picktasks", {
          assigneeid: this.myjs.userid, area: this.yourarea,
          pagenum: '1',
          pagesize: '10'
        }, {emulateJSON: true}).then(
          function (R) {
//           var tasks = R.body
            var res = R.body
            res.list.forEach((task) => {
              var type = eval("(" + task.type + ")")
              task.type = type
            })
            this.alltasks = res
          })
      },
      getalltaskdoing(area) {
        var that = this
        that.tips = '加载中'
        that.allloaded = false
        that.mode = 2
        that.pagenum=1
        that.yourarea = area
        that.$http.post(localStorage.getItem("url") + "/task/taskdoingbyarea", {
          assigneeid: this.myjs.userid, area: this.yourarea,
          pagenum: '1',
          pagesize: '10'
        }, {emulateJSON: true}).then(
          function (R) {
//           var tasks = R.body
            var res = R.body
            res.list.forEach((task) => {
              var type = eval("(" + task.type + ")")
              task.type = type
            })
            that.alltasks = res
            console.log('mdoe：' + that.mode)
          })
      },

      loadMore() {
        var that = this
        if (that.allloaded) {
          that.tips = "数据已全部加载"
          that.loading = false;
          return
        }
        that.loading = true;
        if (that.mode == 1) {
          that.$http.post(localStorage.getItem("url") + "/task/picktasks", {
            assigneeid: that.myjs.userid, area: that.yourarea,
            pagenum: that.pagenum + 1,
            pagesize: '10'
          }, {emulateJSON: true}).then(
            function (R) {
//           var tasks = R.body
              that.pagenum = that.pagenum + 1
              var res = R.body
              res.list.forEach((task) => {
                var type = eval("(" + task.type + ")")
                task.type = type
              })
              that.allloaded = R.body.lastPage
              that.loading = false;
              that.alltasks.list = that.alltasks.list.concat(res.list)
            })
        }
        else (that.mode == 2)
        {
          that.$http.post(localStorage.getItem("url") + "/task/taskdoingbyarea", {
            assigneeid: that.myjs.userid, area: that.yourarea,
            pagenum: that.pagenum + 1,
            pagesize: '10'
          }, {emulateJSON: true}).then(
            function (R) {
//           var tasks = R.body
              that.pagenum = that.pagenum + 1
              var res = R.body
              res.list.forEach((task) => {
                var type = eval("(" + task.type + ")")
                task.type = type
              })
              that.allloaded = R.body.lastPage
              that.loading = false;
              that.alltasks.list = that.alltasks.list.concat(res.list)
              console.log('mdoe：' + that.mode)
            })

        }
        console.log(that.pagenum)
        /*      setTimeout(() => {
                that.$http.post(localStorage.getItem("url") + "/task/gettasklog", {
                  pagesize: 20, pagenum: that.pagenum
                }, {emulateJSON: true}).then(
                  function (R) {
                    that.pagenum = that.pagenum + 1
                    that.allloaded = R.body.lastPage
                    that.loading = false;
                    console.log(JSON.stringify(R.body.list))
                    that.tasklog.list = that.tasklog.list.concat(R.body.list)
                  })
              }, 500)*/


      },

      getalltasks() {
        this.$http.post(localStorage.getItem("url") + "/task/picktasksmy", {
          assigneeid: this.myjs.userid, area: this.yourarea,
          pagenum: '1',
          pagesize: '15'
        }, {emulateJSON: true}).then(
          function (R) {
//           var tasks = R.body
            var res = R.body
            res.list.forEach((task) => {
              var type = eval("(" + task.type + ")")
              task.type = type
            })
            this.alltasks = res
          })
      },
      getCookie(c_name) {
        var c_start
        var c_end
        if (document.cookie.length > 0) {
          c_start = document.cookie.indexOf(c_name + "=")
          if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return (document.cookie.substring(c_start, c_end))
          }
        }
        return ""
      },
      fetchdata() {
        var that = this;

        that.$http.get(localStorage.getItem("url") + "/getconfig").then(
          function (res) {
            // 处理成功的结果
            var result = eval("(" + res.bodyText + ")")
            signature = result.signature;
            nonceStr = result.nonceStr;
            timeStamp = result.timeStamp;
            agentId = result.agentid;
            corpId = result.corpId;
            //     console.log(corpId)
            DingTalkPC.config({
              agentId: agentId,
              corpId: corpId,
              timeStamp: timeStamp,
              nonceStr: nonceStr,
              signature: signature,
              jsApiList: [
                'runtime.info',
                'biz.contact.choose',
                'device.notification.confirm',
                'device.notification.alert',
                'device.notification.prompt',
                'biz.ding.post',
                'biz.util.openLink'] //必填，需要使用的jsapi列表
            });

            DingTalkPC.ready(function () {
                //          console.log('DingTalkPC.ready rocks!')


                //校验成功后，使用获取免登授权码接口获取CODE
                DingTalkPC.runtime.permission.requestAuthCode({
                  corpId: corpId, //企业id
                  onSuccess: function (info) {
                    //               console.log('authcode' + info.code);
                    that.$http.post(localStorage.getItem("url") + "/login", {
                      code: info.code,
                      corpid: corpId,
                      access_token: that.getCookie("access_token")
                    }, {emulateJSON: true}).then(
                      function (R) {
//                        that.myinfo = JSON.stringify(R)
                        document.cookie = "access_token=" + R.bodyText + "; " + 160;
                        that.userinfo()
                        that.gettasktype()
                        that.gettaskarea()
                        that.getlvlname()
                      })
                  },
                  onFail: function (err) {
                    //          console.log('requestAuthCode fail: ' + JSON.stringify(err));
                  }
                });
              }
            );
            DingTalkPC.error(function (err) {
              //      console.log('dd error: ' + JSON.stringify(err));
            });
          }, function (res) {
            // 处理失败的结果
          }
        );
      }
    }

  }
</script>

<style lang="less">
  .timeline-demo {
    p {
      color: #888;
      font-size: 0.8rem;
    }
    h4 {
      color: #666;
      font-weight: normal;
    }
    .recent {
      color: rgb(4, 190, 2)
    }
  }

  .custom-primary-red {
    border-radius: 99px !important;
    border-color: #CE3C39 !important;
    color: #CE3C39 !important;
    &:active {
      border-color: rgba(206, 60, 57, 0.6) !important;
      color: rgba(206, 60, 57, 0.6) !important;
      background-color: transparent;
    }
  }
</style>
