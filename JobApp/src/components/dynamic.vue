<template>
  <div>
    <divider>姓名：{{myjs.name}} 一卡通号：{{myjs.jobnumber}}</divider>


    <group>
      <card :header="{title:'动态'}">


        <p  slot="content"  v-for="i in tasklog.list"  class="card-padding">
          <router-link :to="'taskdetail/'+i.taskid">
              {{i.name}}({{i.jobnum}}){{i.meaning}}【{{i.jobname}}】 @{{i.createtime}}
          </router-link>
        </p>

      </card>

    </group>
    <br>
    <card>
      <!--<img slot="header" :src="mysrc" style="width:100%;display:block;">-->
      <div slot="content" class="card-padding">
        <p style="color:#999;font-size:12px;" class="align-right">Posted on October 31, 2017</p>
        <p style="color:#999;font-size:12px;" class="align-right">
          BY Intelligent Industrial Technology Center
          <br/>HL Zhao</p>
      </div>
    </card>
    <!--<divider>{{name}}</divider>-->
    <!--<group>-->
    <!--<x-textarea :max="200" :placeholder="'每日工作计划'"></x-textarea>-->
    <!--</group>-->
    <!--<divider>我的信息</divider>-->
    <!--<span>{{myinfo}}</span>-->
    <!--&lt;!&ndash;<x-img :src="mysrc"></x-img>&ndash;&gt;-->
  </div>
</template>

<script>
  var corpId = "";  // 企业的corpId
  var signature = "";
  var nonceStr = "";
  var timeStamp = "";
  var agentId = "";
  import {Group, Divider, Card, Marquee, MarqueeItem, XImg, Cell, Blur, Badge} from 'vux'

  export default {
    components: {
      Card,
      Divider,

      Group,

      XImg, Marquee, MarqueeItem, Cell, Blur, Badge
    },
    data() {
      return {
        title: '事项管理',
        myinfo: '',
        name: this.getCookie("user"),
        myjs: this.getCookiejson("user"),
        tasklog: [],
        datav: ''
      }
    },
    created() {
      this.fetchdata()

    },
    methods: {
      userinfo() {
        this.$http.post(localStorage.getItem("url") + "/userinfo", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            document.cookie = "user=" + R.bodyText,
              this.myjs = R.body
          })

      },

      gettasklog() {
        this.$http.post(localStorage.getItem("url") + "/task/gettasklog", {
          access_token: this.getCookie("access_token"),pagesize:20,
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {

            this.tasklog = R.body
          })

      },

      toast(msg) {
        DingTalkPC.device.notification.toast({
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
      open(value) {
        this.toast(value)
        var url;
        url = "taskdetail?index=" + value
        window.location.href = url;
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
      getCookiejson(c_name) {
        var c_start
        var c_end
        var ob
        if (document.cookie.length > 0) {
          c_start = document.cookie.indexOf(c_name + "=")
          if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            ob = eval('(' + document.cookie.substring(c_start, c_end) + ')');
            return ob
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
         //   console.log(corpId)
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
                'biz.util.openLink', 'biz.util.open'] //必填，需要使用的jsapi列表
            });

            DingTalkPC.ready(function () {
        //        console.log('DingTalkPC.ready rocks!')


                //校验成功后，使用获取免登授权码接口获取CODE
                DingTalkPC.runtime.permission.requestAuthCode({
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
                        that.gettasklog()
                      })
                  },
                  onFail: function (err) {
                //    console.log('requestAuthCode fail: ' + JSON.stringify(err));
                  }
                });
              }
            );
            DingTalkPC.error(function (err) {
       //       console.log('dd error: ' + JSON.stringify(err));
            });
          }, function (res) {
            // 处理失败的结果
          }
        );
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~vux/src/styles/1px.less';

  .card-demo-flex {
    display: flex;
  }

  .card-demo-content01 {
    padding: 10px 0;
  }

  .card-padding {
    padding: 15px;
  }

  .card-demo-flex > div {
    flex: 1;
    text-align: center;
    font-size: 12px;
  }

  .card-demo-flex span {
    color: #f74c31;
  }

  .align-right {
    text-align: right;
  }

  .center {
    text-align: center;
    padding-top: 20px;
    color: #fff;
    font-size: 18px;
  }

  .center img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid #ececec;
  }
</style>
