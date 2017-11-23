<template>
  <div>

    <divider>姓名：{{myjs.name}} 一卡通号：{{myjs.jobnumber}} <button @click="getmarks" style="color: blue"> 积分：{{mymark}}</button></divider>
    <blur :blur-amount=40 :url=url :height="120">
      <p class="center"><img :src=url></p>
    </blur>

    <div>
      <group-title>我的事项</group-title>
      <grid :cols="5">
        <grid-item link="/mobiletodo" class="grid-center">
          任务安排 <span>{{datav.undonum}}</span>
        </grid-item>
        <grid-item link="/mobilemytask" class="grid-center">
          待办事项 <span>{{datav.donum}}</span>
        </grid-item>
        <grid-item link="/mobiledone" class="grid-center">
          已办事项 <!--<span>{{datav.donum}}</span>-->
        </grid-item>
        <grid-item link="/mobilepicktasks" class="grid-center">
          任务大厅 <span>{{datav.tasks}}</span>
        </grid-item>
        <grid-item link="/mobilemarklist" class="grid-center">
          分数 <span>{{datav.marks}}</span>
        </grid-item>

        <grid-item link="/mobileaddtask" class="grid-center">
          新增任务  <!--<span>0</span>-->
        </grid-item>
        <grid-item link="/mobilemyapprove" class="grid-center">
          任务审批 <span>{{datav.applycount}}</span>
        </grid-item>
        <grid-item link="/mobilemyapply" class="grid-center">
          已发任务 <!--<span></span>-->
        </grid-item>
        <grid-item link="/mobilechecktask" class="grid-center">
          检查任务 <span>{{datav.sendcount}}</span>
        </grid-item>
        <grid-item link="/mobilepersoninfo" class="grid-center">
          信息维护 <!--<span>0</span>-->
        </grid-item>

      </grid>
    </div>


    <divider>工作情况</divider>

    <div>
      <card :header="{title:' 个人积分(测试功能，点击积分查看)'}"  v-if="mymarks.length>0">
        <div slot="content">
          <x-table>
            <thead>
            <tr>
              <th>操作类型</th>
              <th>关联任务</th>
              <th>分数变化</th>
              <th>时间</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr  v-for="mark in mymarks">
              <td>{{mark.meaning}}</td>
              <td>{{mark.jobname}}</td>
              <td>{{mark.marks}}</td>
              <td>{{mark.createtime}}</td>
              <td>  <router-link :to="'taskdetail/'+mark.taskid">查看</router-link></td>
            </tr>

            </tbody>
          </x-table>
        </div>

      </card>

    </div>
        <group  >
          <card :header="{title:'今天排名'}" :footer="{title:'查看更多',link:'/mobilemarklist'}">
            <x-table :cell-bordered="false"  slot="content">
              <thead>
              <tr>
                <th></th>
                <th>姓名</th>
                <th>完成数量</th>
                <th>分数</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(img,index) in marks" @click="updateurl(img.avatar)" >
                <td>{{index + 1}}</td>
                <td>{{img.name}}</td>
                <td>{{img.num}}</td>
                <td>{{img.mark}}</td>
                <td>
                  <p class="smallcenter"><img :src=img.avatar></p>
                </td>
              </tr>
              </tbody>
            </x-table>
          </card>
        </group>


        <group >
          <card :header="{title:'动态'}" :footer="{title:'查看更多',link:'/mobiledynamic'}">
            <marquee slot="content" class="card-padding">
              <marquee-item v-for="i in tasklog.list" :key="i.id">
                <router-link :to="'mobiletaskdetail/'+i.taskid">
                  <p style="padding: 15px"> {{i.name}}({{i.jobnum}}){{i.meaning}}【{{i.jobname}}】 @{{i.createtime}}</p>
                </router-link>
              </marquee-item>
            </marquee>
          </card>
        </group>

    <br>
    <card>
      <!--<img slot="header" :src="mysrc" style="width:100%;display:block;">-->
      <div slot="content">
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
  import {
    Flexbox, FlexboxItem,
    Group,
    Divider,
    Card,
    Marquee,
    MarqueeItem,
    XImg,
    Cell,
    Blur,
    Badge,
    Grid,
    GridItem,
    GroupTitle,
    XTable

  } from 'vux'

  export default {
    components: {
      Flexbox, FlexboxItem,
      Card,
      Divider,
      XTable,
      Group,

      XImg, Marquee, MarqueeItem, Cell, Blur, Badge, Grid, GridItem, GroupTitle
    },
    data() {
      return {
        title: '事项管理',
        myinfo: '',
        name: '',
        myjs:'',
        tasklog: [],
        datav: '',
        url:'',
        marks: [],
        mymark: '',
        mymarks: []
      }
    },
    created() {
      dd.util.domainStorage.getItem({
        name:'user' , // 存储信息的key值
        onSuccess : function(info) {
          this.myjs =info.value
          this.url=this.myjs.avatar
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
            this.url=this.myjs.avatar
          })

      },
      success() {
      },
      error() {
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
      gettop3() {
        this.$http.post(localStorage.getItem("url") + "/task/marklisttodaytop3", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {

            this.marks = R.body
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
      getmark() {
        this.$http.post(localStorage.getItem("url") + "/task/getmymarkall", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {

            this.mymark = R.body
          })

      },
      getmarks() {

        this.$http.post(localStorage.getItem("url") + "/task/getdetailmarkbyid", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {


            this.mymarks = R.body
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
      updateurl(url) {
//        this.toast(url)
        this.url = url
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
                console.log('dd.ready rocks!')


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
                        that.gettop3()
                        that.getmark()
                      })
                  },
                  onFail: function (err) {
                    console.log('requestAuthCode fail: ' + JSON.stringify(err));
                  }
                });
              }
            );
            dd.error(function (err) {
              console.log('dd error: ' + JSON.stringify(err));
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

  .card-demo-flex {
    display: flex;
  }

  .card-demo-content01 {
    padding: 10px 0;
  }

  .card-padding {
    padding: 0 0px 170px 0px;
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
    padding-top: 0px;
    color: #fff;
    font-size: 18px;
  }

  .center img {
    width: 110px;
    height: 110px;
    border-radius: 80%;
    border: 4px solid #ececec;
  }

  .smallcenter img {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border: 4px solid #ece678;
  }

  .grid-center {
    display: block;
    text-align: center;
    color: #666;
  }

  .ximg-demo {
    width: 100%;
    height: auto;
  }

  .ximg-error {
    background-color: yellow;
  }

  .ximg-error:after {
    content: '加载失败';
    color: red;
  }
</style>
