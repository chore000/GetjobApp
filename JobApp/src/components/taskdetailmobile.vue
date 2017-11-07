<template>

  <div class="timeline-demo">
    <divider>姓名：{{myjs.name}} 一卡通号：{{myjs.jobnumber}}</divider>


    <button-tab>
      <button-tab-item @on-item-click="consoleIndex(1)" selected>任务评论</button-tab-item>
      <button-tab-item @on-item-click="consoleIndex(2)">任务事件</button-tab-item>
    </button-tab>

    <group title="任务得分">
      <x-table :cell-bordered="false" style="background-color:#fff;">
        <thead>
        <tr>
          <th>编号</th>
          <th>员工姓名</th>
          <th>任务安排</th>
          <th>分值,合计：{{allmarks}}</th>
          <th>实际获得</th>
          <th>职位</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user,index) in usersinfo">
          <th>{{index + 1}}</th>
          <th>{{user.name}}</th>
          <th>
            {{user.content}}
          </th>
          <th>
            {{user.mark}}
          </th>
          <th>
            {{user.realmark}}
          </th>
          <th v-if="user.isboss">队长</th>

        </tr>
        </tbody>
      </x-table>
    </group>
    <group title="工作汇报" v-if="comments.totalRow>0">
      <div v-for="argu in comments.list">
        <x-textarea v-model="argu.comment" autosize>
        </x-textarea>
      </div>
    </group>
    <group title="检查结果" v-if="checkcomments.totalRow>0">
      <div v-for="argu in checkcomments.list">

        <x-textarea v-model="argu.comment" autosize>
        </x-textarea>
        <p style="text-align: right">检查人：{{argu.name}}</p>
      </div>
    </group>
    <timeline>

      <timeline-item v-for="(i, index) in taskassign.list" :key="index">
        <h5 :class="[i === 0 ? 'recent' : '']">{{i.name}} {{i.meaning}}</h5>
        <p :class="[i === 0 ? 'recent' : '']"> {{i.createtime}}</p>
      </timeline-item>
    </timeline>
    <group title="员工评论">
      <div  style="padding:0 15px;">
        <x-table :cell-bordered="false" style="background-color:#fff;">
          <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(argu,index) in taskargu.list" >
            <td style="text-align:left">{{index+1}}#</td>
            <td style="text-align:left"> {{argu.comment}}</td>
            <td><p style="text-align: right">{{argu.jobnum}}{{argu.name}} {{argu.createtime}}</p></td>

          </tr>
          </tbody>
        </x-table>
      </div>

    </group>

    <group>

      <x-textarea :max="200" :placeholder="'任务评价'" v-model="comment"></x-textarea>
      <x-button type="primary" @click.native="addargu"> 评论</x-button>

    </group>


  </div>
</template>

<script>
  import {
    Timeline,
    TimelineItem,
    XButton,
    Divider,
    XTextarea,
    Group,
    ButtonTab,
    ButtonTabItem,
    XTable,
    XInput
  } from 'vux'

  export default {
    components: {
      Timeline,
      TimelineItem,
      XButton, Divider, XTextarea, Group, ButtonTab, ButtonTabItem, XTable, XInput
    },
    data() {
      return {
        count: 3,
        taskid: this.$route.params.id,
        myjs: '',
        comments: [],
        taskargu: [],
        taskassign: [],
        comment: '',
        usersinfo: [],
        checkcomments: ''
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
      consoleIndex(value) {
        if (value == 2) {
          this.taskargu = []
          this.gettaskassign()

        } else {
          this.taskassign = []
          this.getargu()
        }
      },
      getmarks() {
        var that = this;
        that.$http.post(localStorage.getItem("url") + "/sectask/getmarksdiv", {
          taskid: that.taskid
        }, {emulateJSON: true}).then(
          function (R) {

            that.flag = true;
            that.usersinfo = R.body

          })

      },
      userinfo() {
        this.$http.post(localStorage.getItem("url") + "/userinfo", {
          access_token: this.getCookie("access_token")
        }, {emulateJSON: true}).then(
          function (R) {
            document.cookie = "user=" + R.bodyText,
              this.myjs = R.body
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
      addargu() {
        if (this.comment == "") {
          this.toast("无内容")
          return false
        }
        this.$http.post(localStorage.getItem("url") + "/argu/addargu", {
          access_token: this.getCookie("access_token"), comment: this.comment, taskid: this.taskid
        }, {emulateJSON: true}).then(
          function (R) {
            var res = R.body
            if (res.stat == 0) {
              this.toast("评论成功")
            } else {
              this.toast("评论失败，请联系工业智能技术中心")
            }
            this.comment = ''
            this.consoleIndex(1)

          })
      },
      getargu() {
        this.$http.post(localStorage.getItem("url") + "/argu/showargu", {
          taskid: this.taskid, pagesize: 30,
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            this.taskargu = R.body
          })
      },
      getcomment() {
        this.$http.post(localStorage.getItem("url") + "/argu/showcomment", {
          taskid: this.taskid, pagesize: 30,
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            this.comments = R.body
          })
      },
      getcheckcomment() {
        this.$http.post(localStorage.getItem("url") + "/argu/showcheckcomment", {
          taskid: this.taskid, pagesize: 30,
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            this.checkcomments = R.body
          })
      },
      gettaskassign() {
        this.$http.post(localStorage.getItem("url") + "/assignlog/show", {
          taskid: this.taskid,
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            this.taskassign = R.body
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
            //    console.log(corpId)
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
                //        console.log('dd.ready rocks!')


                //校验成功后，使用获取免登授权码接口获取CODE
                dd.runtime.permission.requestAuthCode({
                  corpId: corpId, //企业id
                  onSuccess: function (info) {
                    //       console.log('authcode' + info.code);
                    that.$http.post(localStorage.getItem("url") + "/login", {
                      code: info.code,
                      corpid: corpId,
                      access_token: that.getCookie("access_token")
                    }, {emulateJSON: true}).then(
                      function (R) {
                        that.myinfo = JSON.stringify(R)
                        document.cookie = "access_token=" + R.bodyText + "; " + 160;
                        that.userinfo()
//                        that.gettaskassign()
                        that.getcomment()
                        that.getcheckcomment()
                        that.getmarks()
                        that.consoleIndex(1)
                      })
                  },
                  onFail: function (err) {
                    //          console.log('requestAuthCode fail: ' + JSON.stringify(err));
                  }
                });
              }
            );
            dd.error(function (err) {
              //     console.log('dd error: ' + JSON.stringify(err));
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
</style>
