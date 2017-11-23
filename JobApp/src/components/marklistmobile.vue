<template>

  <div>


    <divider>姓名：{{myjs.name}} 一卡通号：{{myjs.jobnumber}}</divider>
    <button-tab>
      <button-tab-item selected @click.native="getalltasksundo">今天</button-tab-item>
      <button-tab-item @click.native="getalltasksmonth">本月</button-tab-item>
      <button-tab-item @click.native="getalltasksall">总计</button-tab-item>
    </button-tab>

    <br>
    <blur :blur-amount=40 :url=alltasks[0].avatar>
      <p class="center"><img :src=alltasks[0].avatar></p>
    </blur>


    <x-table :cell-bordered="false" style="background-color:#fff;">
      <thead>
      <tr>
        <th>卡号</th>
        <th>姓名</th>
        <th>完成数量</th>

        <th>分数</th>
        <th>排名</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(task,index) in alltasks"  v-if="task.mark>0">
        <td>{{task.jobnum}}</td>
        <td>{{task.name}}</td>
        <td>{{task.num}}</td>
        <td>{{task.mark}}</td>
        <td>{{index + 1}}</td>
      </tr>
      </tbody>
    </x-table>


  </div>
</template>

<script>
  import {ButtonTab, ButtonTabItem, Divider, XTable, Group, Blur} from 'vux'

  export default {
    components: {
      ButtonTab, ButtonTabItem, Divider,
      XTable, Group, Blur
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
      this.init()
      this.fetchdata()
    },
    methods: {

      init() {
        var user
   //     console.log(user)
        dd.util.domainStorage.getItem({
          name:'user' , // 存储信息的key值
          onSuccess : function(info) {
            user =eval("("+ info.value+")")
          },
          onFail : function(err) {
            alert(JSON.stringify(err));
          }
        });
        this.alltasks.push(user)
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
            document.cookie = "user=" + R.bodyText
            this.myjs = R.body
            this.alltasks.push(this.myjs)
            this.getalltasksundo()


          })

      },
      getalltasksundo() {
        this.$http.post(localStorage.getItem("url") + "/task/marklisttoday", {
          assigneeid: this.myjs.userid,
          pagenum: '1',
          pagesize: '10'
        }, {emulateJSON: true}).then(
          function (R) {
            var tasks = R.body
            if (tasks.length > 0) {
              this.alltasks = R.body
         //     console.log(JSON.stringify(R.body))
            } else {
              this.alltasks = []
              this.alltasks.push(this.myjs)
            }
          })
      },
      getalltasksmonth() {
        this.$http.post(localStorage.getItem("url") + "/task/marklistmonth", {
          assigneeid: this.myjs.userid,
          pagenum: '1',
          pagesize: '10'
        }, {emulateJSON: true}).then(
          function (R) {
            var tasks = R.body
            if (tasks.length > 0) {
              this.alltasks = R.body
        //      console.log(JSON.stringify(R.body))
            } else {
              this.alltasks = []
              this.alltasks.push(this.myjs)
            }
          })
      },
      getalltasksall() {
        this.$http.post(localStorage.getItem("url") + "/task/marklist", {
          assigneeid: this.myjs.userid,
          pagenum: '1',
          pagesize: '10'
        }, {emulateJSON: true}).then(
          function (R) {
            var tasks = R.body
            if (tasks.length > 0) {
              this.alltasks = R.body
      //        console.log(JSON.stringify(R.body))
            } else {
              this.alltasks = []
              this.alltasks.push(this.myjs)
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
//                        that.myinfo = JSON.stringify(R)
                        document.cookie = "access_token=" + R.bodyText + "; " + 160;
                        that.userinfo()
                      })
                  },
                  onFail: function (err) {
           //         console.log('requestAuthCode fail: ' + JSON.stringify(err));
                  }
                });
              }
            );
            dd.error(function (err) {
           //   console.log('dd error: ' + JSON.stringify(err));
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

