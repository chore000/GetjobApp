<template>

  <div>
    <!--<remote-js src="http://g.alicdn.com/dingding/open-develop/1.6.9/dingtalk.js"></remote-js>-->
    <!--<divider>姓名：{{myjs.name}} 一卡通号：{{myjs.jobnumber}}</divider>-->
    <blur :blur-amount=40 :url=myjs.avatar>
      <p class="center"><img :src=myjs.avatar></p>
    </blur>
    <card :header="{title:'我的事项'}">

      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-l vux-1px-r">
          <router-link to="/mobiletodo">

            待办事项 <span>{{datav.undonum}}</span>
          </router-link>
        </div>
        <div class="vux-1px-r">
          <router-link to="/mobiledone">
            已办事项 <span>{{datav.donum}}</span>
          </router-link>
        </div>
        <div class="vux-1px-r">
          <router-link to="/mobilepicktasks">

            任务大厅 <span>{{datav.tasks}}</span>
          </router-link>
        </div>
        <div>
          <router-link to="/mobilemarklist">


            今日分数 <span>{{datav.marks}}</span>
          </router-link>
        </div>
      </div>
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-l vux-1px-r">
          <router-link to="/mobileaddtask">
            新增任务  <span>0</span>
          </router-link>
        </div>
        <div class="vux-1px-r">
          <router-link to="/mobilemyapprove">
            任务审批 <span>{{datav.applycount}}</span>
          </router-link>
        </div>
        <div class="vux-1px-r">
          <router-link to="/mobilemyapply">
            已发任务 <span>{{datav.sendcount}}</span>
          </router-link>
        </div>
        <div class="vux-1px-r">
          <!--<router-link :to="callperson()">-->
          <!--<a @click="callperson()"> 异常反馈 <span>X</span></a>-->
          <!--</router-link>-->
          <router-link to="/mobilepersoninfo">
            信息维护 <span>0</span>
          </router-link>
        </div>
      </div>
    </card>


    <br>
    <divider>工作情况</divider>

    <group>
      <card :header="{title:'动态'}" :footer="{title:'查看更多',link:'/mobiledynamic'}">
        <div slot="content">

          <marquee class="mcenter">
            <marquee-item v-for="i in tasklog.list" :key="i.id">
              <router-link :to="'mobiletaskdetail/'+i.taskid">
               &nbsp;&nbsp; {{i.name}}({{i.jobnum}}){{i.meaning}}【{{i.jobname}}】@{{i.createtime}}
              </router-link>
            </marquee-item>
          </marquee>
        </div>

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
      XImg, Marquee, MarqueeItem, Cell, Blur, Badge,
      'remote-js': {
        render(createElement) {
          return createElement('script', {attrs: {type: 'text/javascript', src: this.src}});
        },
        props: {
          src: {type: String, required: true},
        },
      }
    },
    data() {
      return {
        title: '事项管理',
        myinfo: '',
        name: '',
        myjs: '',
        tasklog: [],
        datav: ''
      }
    },
    created() {
      dd.util.domainStorage.getItem({
        name:'user' , // 存储信息的key值
        onSuccess : function(info) {
          this.myjs =info.value
        },
        onFail : function(err) {
          alert(JSON.stringify(err));
        }
      });
      this.fetchdata()

    },
    methods: {
      userinfo() {
        this.$http.post(localStorage.getItem("url") + '/userinfo', {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
//            document.cookie = "user=" + R.bodyText,
              dd.util.domainStorage.setItem({
                name:'user' , // 存储信息的key值
                value:R.bodyText, // 存储信息的Value值
                onSuccess : function(info) {
//                  alert(JSON.stringify(info));
                },
                onFail : function(err) {
                  alert(JSON.stringify(err));
                }
              });

              this.myjs = R.body
          })

      },
      callperson() {
        dd.biz.util.open({
          name: 'profile',//页面名称
          params: {
            id: '01054537689281',// String 必选 用户工号
            corpId: corpId //String 必选 企业id
          },//传参
          onSuccess: function () {
            /**/
          },
          onFail: function (err) {
          }
        });
      },

      gettasklog() {
        this.$http.post(localStorage.getItem("url") + "/task/gettasklog", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {

            this.tasklog = R.body
          })

      },
      getdatav() {
        this.$http.post(localStorage.getItem("url") + "/task/indexdatav", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {

            this.datav = R.body
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
        return null
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
            try {
              ob = eval('(' + document.cookie.substring(c_start, c_end) + ')');
            }
            catch (e) {
              alert(e)
            }
            return ob
          }
        }
        return null
      },

      fetchdata() {
//        localStorage.setItem("url", "http://10.3.12.75:9001")
        localStorage.setItem("url", "http://222.134.52.36:8000")
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
            console.log(agentId)
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
                'biz.util.openLink', 'biz.util.open'] //必填，需要使用的jsapi列表
            });

            dd.ready(function () {
//                alert('dd.ready rocks!')


                //校验成功后，使用获取免登授权码接口获取CODE
                dd.runtime.permission.requestAuthCode({
                  corpId: corpId, //企业id
                  onSuccess: function (info) {
                    console.log('authcode:' + info.code);
                    that.$http.post(localStorage.getItem("url") + "/login", {
                      code: info.code,
                      corpid: corpId,
                      credentials: true,
                      access_token: that.getCookie("access_token")
                    }, {emulateJSON: true}).then(
                      function (R) {
                        that.myinfo = JSON.stringify(R)
                        document.cookie = "access_token=" + R.bodyText + "; " + 160;
                        that.userinfo()
                        that.gettasklog()
                        that.getdatav()
                      })
                  },
                  onFail: function (err) {
                    console.log('requestAuthCode fail: ' + JSON.stringify(err));
                  }
                });
              }
            );
            dd.error(function (err) {
              alert('dd error: ' + JSON.stringify(err));
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
    padding: 14px 0;
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
  .mcenter {
    padding: 0px 20px 60px 0px;
    text-align: left;

    font-size: 14px;
  }
  .center img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid #ececec;
  }

  .align-middle {
    text-align: center;
  }
</style>
