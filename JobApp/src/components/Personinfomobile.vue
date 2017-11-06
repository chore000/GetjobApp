<template>
  <div>
    <group title="个人信息维护" label-width="4.5em" label-margin-right="2em" label-align="right">

      <x-input title="姓名" disabled v-model="myjs.name"></x-input>

      <x-input title="一卡通号" disabled v-model="myjs.jobnumber"></x-input>
      <!--   <datetime v-model="reqtime" format="YYYY-MM-DD HH:mm" :minute-list="['00', '15', '30', '45']"
                   title="时间节点"></datetime>-->
      <!--<x-number title="任务分数" v-model="taskmark" button-style="round" :min="1" :max="50"></x-number>-->
      <!--<x-number title="任务数量" v-model="taskcount" button-style="round" :min="1" :max="50"></x-number>-->
      <x-number title="技能等级" v-model="tasklvl" button-style="round" :min="1" :max="50"></x-number>
    </group>
    <group title="职业选择">
      <radio required :options="commonList" v-model="tasktype"
      ></radio>
    </group>
    <!-- <group>
       <x-switch title="任务指定（选填）" v-model="assigneecase" @click.native="chooseperson"></x-switch>
       <div v-for="(i,index) in assignee">
         <x-input title="人员名单" v-model="i.name" disabled></x-input>
       </div>
     </group>
     <group>
       <x-switch title="任务审核" v-model="isadmin" @click.native="chooseadmin"></x-switch>

       <x-input title="审核人员" v-model="admin.name" disabled></x-input>

     </group>-->
    <br>
    <br>
    <x-button type="primary" @click.native="submit">提交</x-button>
    <br>
  </div>
</template>

<script>
  var corpId = "";  // 企业的corpId
  var signature = "";
  var nonceStr = "";
  var timeStamp = "";
  var agentId = "";
  import {
    GroupTitle,
    Group,
    XInput,
    Radio,
    XNumber,
    XSwitch, XButton
  } from 'vux'

  export default {
    components: {
      GroupTitle,
      Group,
      XInput,
      Radio,
      XNumber,
      XSwitch, XButton
    },
    data() {
      return {
        myinfo: '',
        tasklvl: 1,
        tasktype: '',
        commonList: [],
        myjs: ''


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
      getusertype() {
        var that = this;
        that.$http.post(localStorage.getItem("url") + "/usertype/getusertype", {
          access_token: that.getCookie("access_token"),
          type: that.tasktype,
          lvl: that.tasklvl
        }, {emulateJSON: true}).then(
          function (R) {

            that.tasklvl = R.body.level;
            that.tasktype = R.body.type


//               console.log(JSON.stringify(R.body))
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
      submit() {
        var that = this;
        dd.device.notification.confirm({
          message: "数据只能提交一次，如需修改请发起流程，请慎重选择",
          title: "提示",
          buttonLabels: ['确定提交', '我再看看'],
          onSuccess: function (result) {
            if (result.buttonIndex == 0) {
              that.$http.post(localStorage.getItem("url") + "/usertype/updateusertype", {
                access_token: that.getCookie("access_token"),
                type: that.tasktype,
                lvl: that.tasklvl
              }, {emulateJSON: true}).then(
                function (R) {

                  that.tasklvl = R.body.level,
                    that.tasktype = R.body.type,
                    that.toast("已提交，但只有第一次生效，如需修改请发起流程")


//               console.log(JSON.stringify(R.body))
                })
            }
          },
          onFail: function (err) {
          }
        });

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
                    //     console.log('authcode' + info.code);
                    that.$http.post(localStorage.getItem("url") + "/login", {
                      code: info.code,
                      corpid: corpId,
                      access_token: that.getCookie("access_token")
                    }, {emulateJSON: true}).then(
                      function (R) {
                        that.myinfo = JSON.stringify(R)
                        document.cookie = "access_token=" + R.bodyText + "; " + 160;
                        that.userinfo()
                        that.gettasktype()
                        that.getusertype()

                      })
                  },
                  onFail: function (err) {
                    //    console.log('requestAuthCode fail: ' + JSON.stringify(err));
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

<style scoped lang="less">
  @import '~vux/src/styles/1px.less';

  .card-demo-flex {
    display: flex;
  }

  .card-demo-content01 {
    padding: 10px 0;
  }

  .card-padding {
    padding: 50px;
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
