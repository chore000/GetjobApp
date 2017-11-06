<template>
  <div>
    <group label-width="4.5em" label-margin-right="2em" label-align="right">

      <x-input title="任务名称" v-model="taskname"></x-input>

      <x-textarea title="任务内容" placeholder="请填写详细信息" :show-counter="false" :rows="3" v-model="taskcontent"></x-textarea>
      <datetime v-model="reqtime" format="YYYY-MM-DD HH:mm" :minute-list="['00', '15', '30', '45']"
                title="时间节点"></datetime>
      <datetime v-model="publishtime" format="YYYY-MM-DD HH:mm" :minute-list="['00', '15', '30', '45']"
                title="任务发布时间"></datetime>
      <x-number title="任务分数" v-model="taskmark" button-style="round" :min="1" :max="50"></x-number>
      <x-number title="任务数量" v-model="taskcount" button-style="round" :min="1" :max="50"></x-number>
      <x-number title="等级要求" v-model="tasklvl" button-style="round" :min="1" :max="50"></x-number>
      <popup-radio title="区域选择" :options="arealist" v-model="taskarea"></popup-radio>
    </group>
    <group>
      <checklist title="职业要求" required :options="commonList" v-model="tasktypelist"
      ></checklist>
    </group>
    <group>
      <x-switch title="任务指定（选填）" v-model="assigneecase" @click.native="chooseperson"></x-switch>
      <div v-for="(i,index) in assignee">
        <x-input title="人员名单" v-model="i.name" disabled></x-input>
      </div>
    </group>
    <group>
      <cell title="任务审批" v-model="admin.name" @click.native="chooseadmin" is-link></cell>

      <!--<x-input title="审批人员" v-model="admin.name" disabled></x-input>-->

      <cell title="任务完成核实" v-model="checker.name" @click.native="choosecheck" is-link></cell>

      <!--<x-input title="检查人员" v-model="admin.name" disabled></x-input>-->

    </group>
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
    Cell,
    XInput,
    Selector,
    PopupPicker,
    Datetime,
    XNumber,
    ChinaAddressData,
    XAddress,
    XTextarea,
    XSwitch, Checklist, XButton, PopupRadio
  } from 'vux'

  export default {
    components: {
      GroupTitle,
      Group,
      Cell,
      XInput,
      Selector,
      PopupPicker,
      Datetime,
      XNumber,
      ChinaAddressData,
      XAddress,
      XTextarea,
      XSwitch, Checklist, XButton, PopupRadio
    },
    data() {
      return {
        myinfo: '',
        taskname: '',
        taskcontent: '',
        reqtime: '',
        taskmark: 1,
        taskcount: 1,
        tasklvl: 1,
        tasktypelist: [],
        assigneecase: false,
        taskarea: '',
        assignee: '',
        admin: '',
        checker: '',
        isadmin: false,
        commonList: [],
        arealist: [],
        publishtime:'',
        postinfo: {
          taskname: '',
          taskcontent: '',
          reqtime: '',
          taskmark: 1,
          taskcount: 1,
          tasklvl: 1,
          tasktypelist: [],
          assigneecase: '',
          assignee: '',
          taskarea: '',
          admin: '',
          publishtime:''
        }

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
      gettasktype() {
        this.$http.post(localStorage.getItem("url") + "/tasktype/gettasktype", {
          access_token: this.getCookie("access_token"),
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            this.commonList = R.body
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
      chooseadmin() {
        var that = this
        //    console.log("chooseadmin")

        DingTalkPC.biz.contact.choose({
          multiple: false, //是否多选： true多选 false单选； 默认true
          users: [], //默认选中的用户列表，员工userid；成功回调中应包含该信息
          corpId: corpId, //企业id
          max: 10, //人数限制，当multiple为true才生效，可选范围1-1500
          onSuccess: function (data) {

            that.admin = data[0]
            that.postinfo.admin = data[0].emplId
            that.isadmin = true
            /* data结构
              [{
                "name": "张三", //姓名
                "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
                "emplId": '0573', //员工userid
               },
               ...
              ]
            */
          },
          onFail: function (err) {
            that.assigneecase = false
          }
        })

      },
      choosecheck() {
        var that = this
        //    console.log("chooseadmin")

        DingTalkPC.biz.contact.choose({
          multiple: false, //是否多选： true多选 false单选； 默认true
          users: [], //默认选中的用户列表，员工userid；成功回调中应包含该信息
          corpId: corpId, //企业id
          max: 10, //人数限制，当multiple为true才生效，可选范围1-1500
          onSuccess: function (data) {

            that.checker = data[0]
            that.postinfo.checker = data[0].emplId
//            that.isadmin = true
            /* data结构
              [{
                "name": "张三", //姓名
                "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
                "emplId": '0573', //员工userid
               },
               ...
              ]
            */
          },
          onFail: function (err) {
//            that.assigneecase = false
          }
        })

      },
      chooseperson() {
        var that = this
        //   console.log("chooseperson")
        if (that.assigneecase)
          DingTalkPC.biz.contact.choose({
            multiple: false, //是否多选： true多选 false单选； 默认true
            users: [], //默认选中的用户列表，员工userid；成功回调中应包含该信息
            corpId: corpId, //企业id
            max: 10, //人数限制，当multiple为true才生效，可选范围1-1500
            onSuccess: function (data) {

              that.assignee = data
              that.postinfo.assignee = data[0].emplId
              /* data结构
                [{
                  "name": "张三", //姓名
                  "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
                  "emplId": '0573', //员工userid
                 },
                 ...
                ]
              */
            },
            onFail: function (err) {
              that.assigneecase = false
            }
          })
        else {
          //    console.log("back")
          that.assigneecase = false
          that.assignee = []
          this.postinfo.assignee = ''
        }
      },
      submit() {

        if (this.taskname == '') {
          this.toast("请填写任务名称")
          return false;
        }
        if (this.taskcontent == '') {
          this.toast("请填写任务内容")
          return false;
        }
        if (this.reqtime == '') {
          this.toast("请选择时间节点")
          return false;
        }
        if (this.taskmark == '') {
          this.toast("请选择任务分数")
          return false;
        }
        if (this.taskcount == '') {
          this.toast("请选择任务数量")
          return false;
        }
        if (this.tasklvl == '') {
          this.toast("请选择等级")
          return false;
        }
        if (this.tasktypelist.length == 0) {
          this.toast("请选择职业")
          return false;
        }
        if (this.admin == '') {
          this.toast("请选择任务审批人")
          return false;
        }
        if (this.checker == '') {
          this.toast("请选择任务任务核查人")
          return false;
        }
        if (this.taskarea == '') {
          this.toast("请选择区域")
          return false;
        }
        this.postinfo.taskcontent = this.taskcontent
        this.postinfo.taskname = this.taskname
        this.postinfo.reqtime = this.reqtime
        this.postinfo.taskmark = this.taskmark
        this.postinfo.taskcount = this.taskcount
        this.postinfo.tasklvl = this.tasklvl
        this.postinfo.tasktypelist = this.tasktypelist
        this.postinfo.assigneecase = this.assigneecase
        this.postinfo.taskarea=this.taskarea
        this.postinfo.publishtime=this.publishtime
        //    console.log(JSON.stringify(this.postinfo))
//        this.toast(JSON.stringify(this.postinfo))
//        return false
        /* this.$http.post(localStorage.getItem("url") + "/taskapply", {
           access_token: this.getCookie("access_token"),taskapply:JSON.stringify(this.postinfo),
           credentials: true
         }).then(
           function (R) {
             console.log(R.bodyText)
           })*/
        var stat = -1;
        if (this.assigneecase) {
          stat = -2;
        }
        this.$http.post(localStorage.getItem("url") + "/taskapply/taskapply", {
          access_token: this.getCookie("access_token"),
          taskapply: JSON.stringify(this.postinfo),
          stat: stat,
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            if (R) {
              this.toast("提交成功")
              this.taskname = '',
                this.taskcontent = '',
                this.reqtime = '',
                this.taskmark = 1,
                this.taskcount = 1,
                this.tasklvl = 1,
                this.tasktypelist = [],
                this.assigneecase = false,
                this.assignee = '',
                this.admin = '',
                this.isadmin = false,
                this.taskarea='',
                this.checker=''
            }
            //   console.log(JSON.stringify(R.body))
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
                'biz.util.openLink'] //必填，需要使用的jsapi列表
            });

            DingTalkPC.ready(function () {
                //   console.log('DingTalkPC.ready rocks!')


                //校验成功后，使用获取免登授权码接口获取CODE
                DingTalkPC.runtime.permission.requestAuthCode({
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
                        that.gettaskarea()
                      })
                  },
                  onFail: function (err) {
                    //    console.log('requestAuthCode fail: ' + JSON.stringify(err));
                  }
                });
              }
            );
            DingTalkPC.error(function (err) {
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
