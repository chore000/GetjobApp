<template>

  <div>

    <divider>{{title}}</divider>
    <divider>姓名：{{myjs.name}} 一卡通号：{{myjs.jobnumber}}</divider>
    <!--<cell title="新增员工">-->
    <div v-transfer-dom>
      <x-dialog v-model="show" class="dialog-demo" :dialog-style="{'max-width': '100%', width: '80%'}">

        <x-textarea title="" :max="500" placeholder="任务汇报，如有分数变动需求请在此提出" :show-counter="false" :height="200" :rows="8"
                    :cols="50" v-model="comment"></x-textarea>
        <x-button plain type="primary" @click.native="complete(taskid)">确认完成</x-button>
        <div @click="show=false">
          <span class="vux-close"></span>
          <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
        </div>

      </x-dialog>
    </div>
    <group>
      <cell title='任务名称'>
        <div>
          <span class="green">{{taskdetail.jobname}}</span>
        </div>
      </cell>
      <cell title='任务内容'>
        <div>
          <span class="green">{{taskdetail.jobcontent}}</span>
        </div>
      </cell>
      <cell title='任务分数'>
        <div>
          <span class="green">{{taskdetail.mark}}</span>
        </div>
      </cell>
      <cell title='任务等级'>
        <div>
          <span class="green">{{taskdetail.tasklvl}}</span>
        </div>
      </cell>
      <cell title='接收时间'>
        <div>
          <span class="green">{{taskdetail.createtime}}</span>
        </div>
      </cell>
      <cell title='时间节点'>
        <div>
          <span class="green">{{taskdetail.deadline}}</span>
        </div>
      </cell>

      <cell title='发起人'>
        <div>
          <span class="green">{{taskdetail.cname}}</span>
        </div>
      </cell>

    </group>

    <br/>
    <div style="text-align: right">
      <x-icon type="ios-plus-empty" size="30" @click="chooseadmin"></x-icon>

    </div>
    <x-table :cell-bordered="false" style="background-color:#fff;">
      <thead>
      <tr>
        <th>编号</th>
        <th>员工姓名</th>
        <th>任务安排</th>
        <th>分值,合计：{{allmarks}}</th>
        <th v-if="taskdetail.assignee==myjs.userid">操作</th>

      </tr>
      </thead>
      <tbody>
      <tr v-for="(user,index) in usersinfo">
        <th>{{index + 1}}</th>
        <th>{{user.name}}</th>
        <th>
          <x-input v-model="user.content" placeholder="任务安排情况"></x-input>
        </th>
        <th>
          <inline-x-number :min="1" button-style="round" v-model="user.mark"></inline-x-number>
        </th>
        <th v-if="taskdetail.assignee==myjs.userid">
          <x-button mini type="warn" @click.native="deluser(index)" v-if="!user.isboss">删除</x-button>
        </th>
      </tr>
      </tbody>
    </x-table>
    <br/>
    <br/>
    <flexbox v-if="taskdetail.assignee==myjs.userid">

      <flexbox-item v-if="flag">
        <x-button type="warn" @click.native="submit">重新调整人员</x-button>
      </flexbox-item>
      <flexbox-item v-if="flag">
        <x-button type="primary" @click.native="showtask">任务完成</x-button>
      </flexbox-item>
      <flexbox-item v-else>
        <x-button type="primary" @click.native="submit">人员确认</x-button>
      </flexbox-item>

    </flexbox>
  </div>

</template>

<script>
  var corpId = "";  // 企业的corpId
  var signature = "";
  var nonceStr = "";
  var timeStamp = "";
  var agentId = "";
  import {
    XTable,
    Divider,
    XButton,
    Flexbox,
    FlexboxItem,
    Cell,
    Group,
    XDialog,
    XTextarea,
    InlineXNumber,
    XInput,
    TransferDomDirective as TransferDom
  } from 'vux'

  export default {
    directives: {
      TransferDom
    },
    components: {

      XTable,
      Divider,
      XButton,
      Flexbox, FlexboxItem, InlineXNumber,
      Cell, Group, XDialog, XTextarea,
      XInput,
    },
    data() {
      return {
        title: '任务部署',
        myjs: '',
        comment: '',
        user: {name: '', userid: '', mark: 1, content: '', isboss: false},
        usersinfo: [],
        taskid: this.$route.params.id,
        taskdetail: '',
        flag: false,
        show: false,
        comment: ''
      }
    },
    created() {
      this.fetchdata()

    },
    computed: {
      allmarks: function () {
        var sum = 0
        this.usersinfo.forEach((user) => sum += user.mark
        )
        return sum
      }
    },
    methods: {
      deluser(index) {
        this.usersinfo.splice(index, 1)
      },
      showtask() {
        this.show = true
      },
      getdetail() {

        this.$http.post(localStorage.getItem("url") + "/task/gettaskdetailbytaskid", {
          taskid: this.taskid
        }, {emulateJSON: true}).then(
          function (R) {
            this.taskdetail = R.body
          })

      },
      complete(taskid) {
        var that = this
        var res
        if (that.comment == "") {
          that.toast("请填写内容")
          return false
        }
        that.$http.post(localStorage.getItem("url") + "/task/completetask", {
          taskid: taskid, comment: that.comment,
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            res = R.body
            if (res.stat == 0) {
              that.toast("恭喜完成任务")
              that.show = false
              window.history.go(-1)
//              that.getalltasksundo()
            } else {
              that.toast(res.codemsg)
            }
            this.getalltasks()
          })

      },
      getmarks() {
        var that = this;
        that.$http.post(localStorage.getItem("url") + "/sectask/getmarksdiv", {
          taskid: that.taskid
        }, {emulateJSON: true}).then(
          function (R) {
            if (R.body.length == 0) {
              that.flag = false
              that.user.userid = that.myjs.userid
              that.user.name = that.myjs.name
              that.user.isboss = true
              that.usersinfo.push(that.user)

              that.user = {userid: '', name: '', mark: 1, content: '', isboss: false}
            }
            else {
              that.flag = true;
              that.usersinfo = R.body
            }
          })

      },
      chooseadmin() {
        var that = this
        //    console.log("chooseadmin")

        dd.biz.contact.choose({
          multiple: true, //是否多选： true多选 false单选； 默认true
          users: [], //默认选中的用户列表，员工userid；成功回调中应包含该信息
          corpId: corpId, //企业id
          max: 10, //人数限制，当multiple为true才生效，可选范围1-1500
          onSuccess: function (data) {
            for (var i = 0; i < data.length; i++) {
              console.log(data)
              that.user.name = data[i].name

              that.user.userid = data[i].emplId
              that.usersinfo.push(that.user)
              that.user = {userid: '', name: '', mark: 1, content: '', isboss: false}
            }
          },
          onFail: function (err) {
//            that.assigneecase = false
          }
        })

      },
      submit() {
//        this.toast(JSON.stringify(this.usersinfo))

        var that = this;
        if (that.allmarks != that.taskdetail.mark) {
          that.toast("分数分配异常，请确认")
          return false;
        }
        that.$http.post(localStorage.getItem("url") + "/sectask/addsectask", {
          taskinfo: JSON.stringify(that.usersinfo),
          taskid: this.taskid
        }, {emulateJSON: true}).then(
          function (R) {
            if (R.bodyText == "true") {
              that.toast("分配成功")
            } else {
              that.toast("分配失败")
            }
            that.getmarks()
          })
      },
      toast(msg) {
        dd.device.notification.toast({
          type: "information", //toast的类型 alert, success, error, warning, information, confirm
          text: msg, //提示信息
          duration: 3, //显示持续时间，单位秒，最短2秒，最长5秒
          delay: 0, //延迟显示，单位秒，默认0, 最大限制为10
          onSuccess: function (result) {
            /*{}*/
          },
          onFail: function (err) {
          }
        })
      },
      userinfo() {
        var that = this;
        that.$http.post(localStorage.getItem("url") + "/userinfo", {access_token: this.getCookie("access_token")}, {emulateJSON: true}).then(
          function (R) {
            document.cookie = "user=" + R.bodyText,
              that.myjs = R.body
//              this.getalltasksundo()
            that.getmarks()

          })

      }, /*
      getalltasksundo() {
        this.$http.post(localStorage.getItem("url") + "/task/alltaskundo", {
          assigneeid: this.myjs.userid,
          pagenum: '1',
          pagesize: '10'
        }, {emulateJSON: true}).then(
          function (R) {
            this.alltasks = R.body
            //   console.log(JSON.stringify(R.body))
          })
      },*/
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
            //       console.log(corpId)
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
//                console.log('dd.ready rocks!')


                //校验成功后，使用获取免登授权码接口获取CODE
                dd.runtime.permission.requestAuthCode({
                  corpId: corpId, //企业id
                  onSuccess: function (info) {
                    //           console.log('authcode' + info.code);
                    that.$http.post(localStorage.getItem("url") + "/login", {
                      code: info.code,
                      corpid: corpId,
                      access_token: that.getCookie("access_token")
                    }, {emulateJSON: true}).then(
                      function (R) {
//                      that.myinfo = JSON.stringify(R)
                        document.cookie = "access_token=" + R.bodyText + "; " + 160;
                        that.userinfo()
                        that.getdetail()

                      })
                  },
                  onFail: function (err) {
                    //         console.log('requestAuthCode fail: ' + JSON.stringify(err));
                  }
                });
              }
            );
            dd.error(function (err) {
              //           console.log('dd error: ' + JSON.stringify(err));
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
  @import '~vux/src/styles/close';

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

  .dialog-demo {
    .weui-dialog {
      border-radius: 8px;
      padding-bottom: 8px;
    }
    .dialog-title {
      line-height: 30px;
      color: #666;
    }
    .img-box {
      height: 350px;
      overflow: hidden;
    }
    .vux-close {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }

  .center {
    text-align: center;
    padding-top: 20px;
    color: #fff;
    font-size: 18px;
  }

  .green {
    color: green;
  }

  .align-middle {
    text-align: center;
  }
</style>
