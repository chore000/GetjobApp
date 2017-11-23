<template>

  <div>

    <divider>{{title}}</divider>
    <divider>姓名：{{myjs.name}} 一卡通号：{{myjs.jobnumber}} </divider>
    <x-button @click.native="gettaskcond">任务概况</x-button>
    <card :header="{title:'任务详情'}" v-if="taskscond.length>0">
      <div slot="content">
        <x-table>
          <thead>
          <tr>
            <th>区域</th>
            <th>待抢数量</th>
            <th>正在执行</th>
            <!--<th>合计</th>-->
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="task in taskscond">
            <td>{{task.name}}</td>
            <td>{{task.todo}}</td>
            <td>{{task.doing}}</td>
            <td>
              <a @click="yourarea=task.area"><x-icon type="ios-search" size="30"></x-icon></a>
            </td>
          </tr>

          </tbody>
        </x-table>
        <!--   <p v-for="mark in mymarks">操作类型{{mark.type}}<br/>分数变化{{mark.marks}}；时间:{{mark.createtime}}
             <router-link :to="'taskdetail/'+mark.taskid">查看</router-link>
           </p>-->

      </div>

    </card>
    <group>
      <popup-radio title="查看所有任务（默认加载的是可以抢的任务）" :options="arealist" v-model="yourarea" @on-change="choosearea"></popup-radio>
    </group>
    <div v-for="(task,index) in alltasks.list">
      <group>
        <cell title='等级要求'>
          <popup-radio title="" readonly :options="tasklvlvalues" v-model="task.tasklvl"></popup-radio>          <!--<div>-->
            <!--<span style="color: green">{{task.tasklvl}}</span>-->
          <!--</div>-->
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

        <x-button type="primary" @click.native="getjob(task.id)">抢任务</x-button>

      </group>
    </div>


  </div>
</template>


<script>
  import {Divider, XButton, Cell, Checklist, Group, PopupRadio, XTable} from 'vux'

  export default {
    components: {
      Group,
      Divider,
      XButton,
      Cell, Checklist, PopupRadio, XTable
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
        taskscond:''
      }
    },
    created() {
      this.fetchdata()
    },
    methods: {
      choosearea() {
        this.getalltasksall()
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
      toast(msg) {
        dd.device.notification.toast({
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
        dd.device.notification.confirm({
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
      getalltasksall() {
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
        var corpId = "";  // 企业的corpId
        var signature = "";
        var nonceStr = "";
        var timeStamp = "";
        var agentId = "";
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
            dd.config({
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

            dd.ready(function () {
                //          console.log('dd.ready rocks!')


                //校验成功后，使用获取免登授权码接口获取CODE
                dd.runtime.permission.requestAuthCode({
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
            dd.error(function (err) {
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
