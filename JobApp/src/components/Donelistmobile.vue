<template>

  <div >

    <divider>{{title}}</divider>
    <divider>姓名：{{myjs.name}} 一卡通号：{{myjs.jobnumber}}</divider>

    <div v-for="(task,index) in alltasks.list">
      <group>
        <cell title='编号'>
          <div>
            <span style="color: green">{{index + 1}}</span>
          </div>
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
        <cell title="任务发出时间">
          <div>
            <span style="color: green">{{task.creattime}}</span>
          </div>
        </cell>
        <cell title="任务状态">
          <div>
            <span style="color: #ffc7f7" v-if="task.stat==9">待检查</span>
            <span style="color: green" v-else-if="task.stat==10">任务检查成功</span>
            <span style="color: red" v-else-if="task.stat==11">任务检查失败</span>
          </div>
        </cell>
        <cell  :link="'mobiletaskdetail/'+task.id">
          <span slot="title" style="color:blue">查看详情</span>
        </cell>

        <!--<flexbox>-->

        <!--<flexbox-item>-->
        <!--<router-link :to="'taskdetail/'+task.id">-->
        <!--<x-button  type="primary" >查看详情</x-button>-->
        <!--</router-link>-->
        <!--</flexbox-item>-->
        <!--<flexbox-item>-->
        <!--<x-button  type="warn" @click.native="giveup(task.id)">未完成（待开发）</x-button>-->
        <!--</flexbox-item>-->
        <!--</flexbox>-->
      </group>
      <!--<x-button type="primary">完成任务</x-button><x-button type="default">放弃任务</x-button>-->

    </div>


  </div>
</template>

<script>
  import {Divider, TimelineItem, XButton, Flexbox, FlexboxItem, Cell, Group} from 'vux'

  export default {
    components: {
      Divider,
      TimelineItem,
      XButton,
      Flexbox, FlexboxItem,
      Cell, Group
    },
    data() {
      return {
        count: 3,
        title: '已办事项',
        undo: '',
        myjs: '',
        alltasks: []
      }
    },
    created() {
      this.fetchdata()
    },
    methods: {

      open(value) {
//        this.toast(value)
        var url;
        url = "taskdetail?index=" + value
        window.location.href = url;
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
        this.$http.post(localStorage.getItem("url") + "/userinfo", {access_token: this.getCookie("access_token")}, {emulateJSON: true}).then(
          function (R) {
            document.cookie = "user=" + R.bodyText,
              this.myjs = R.body,
              this.getalltasksundo()
          })

      },
      getalltasksundo() {
        this.$http.post(localStorage.getItem("url") + "/task/alltaskdo", {
          assigneeid: this.myjs.userid,
          pagenum: '1',
          pagesize: '10'
        }, {emulateJSON: true}).then(
          function (R) {
            this.alltasks = R.body
            //     console.log(JSON.stringify(R.body))
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
            //   console.log(corpId)
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
                //   console.log('dd.ready rocks!')


                //校验成功后，使用获取免登授权码接口获取CODE
                dd.runtime.permission.requestAuthCode({
                  corpId: corpId, //企业id
                  onSuccess: function (info) {
                    //    console.log('authcode' + info.code);
                    that.$http.post(localStorage.getItem("url") + "/login", {
                      code: info.code,
                      corpid: corpId,
                      access_token: that.getCookie("access_token")
                    }, {emulateJSON: true}).then(
                      function (R) {
//                        that.myinfo = JSON.stringify(R)
                        document.cookie = "access_token=" + R.bodyText + "; " + 160;
                        that.userinfo()
                      })
                  },
                  onFail: function (err) {
                    //        console.log('requestAuthCode fail: ' + JSON.stringify(err));
                  }
                });
              }
            );
            dd.error(function (err) {
              //    console.log('dd error: ' + JSON.stringify(err));
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
    /*<x-button plain type="primary" class="custom-primary-red"*/
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
