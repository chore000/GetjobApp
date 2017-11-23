<template>

  <div>

    <divider>{{title}}</divider>
    <divider>姓名：{{myjs.name}} 一卡通号：{{myjs.jobnumber}}</divider>
    <div v-transfer-dom>
      <x-dialog :show.sync="show" class="dialog-demo" :dialog-style="{'max-width': '100%', width: '80%'}">

        <div>

          <x-textarea title="检查汇报" :max="500" placeholder="" :show-counter="false" :height="200" :rows="8"
                      :cols="50" v-model="comment"></x-textarea>
          <x-button plain type="primary" @click.native="complete(ctaskid)">确认完成</x-button>
          <div @click="show=false">
            <span class="vux-close"></span>
            <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
          </div>


        </div>

      </x-dialog>
    </div >
    <div v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="5">
      <group  v-for="(task,index) in alltasks.list">
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
        <cell title="任务详情" :link="'/checktaskdetail/'+task.id">
          <span slot="title" style="color:blue">查看详情</span>
        </cell>
       <!-- <flexbox>
          <flexbox-item>
            <x-button type="warn" @click.native="showtask(0,task.id)">任务未完成</x-button>
          </flexbox-item>
          <flexbox-item>
            &lt;!&ndash;<x-button type="primary" @click.native="showtask(1,task.id)">任务详情</x-button>&ndash;&gt;
           <router-link :to="'/checktaskdetail/'+task.id">  <x-button type="primary" >任务详情</x-button></router-link>


          </flexbox-item>

        </flexbox>-->

      </group>
      <load-more :show-loading="loading" :tip="tips" background-color="#fbf9fe"></load-more>
    </div>


  </div>

</template>

<script>
  import {
    Divider,
    XButton,
    Flexbox,
    FlexboxItem,
    Cell,
    Group,
    XDialog,
    XTextarea,LoadMore,
    TransferDomDirective as TransferDom
  } from 'vux'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Divider,
      XButton,
      Flexbox, FlexboxItem,
      Cell, Group, XDialog, XTextarea,LoadMore
    },
    data() {
      return {

        show: false,
        count: 3,
        title: '检查事项',
        undo: '',
        myjs: '',
        alltasks:{list:[]} ,
        pagesize:10,
        pagenum: 1,
        loading: false,
        tips: '加载中',
        allloaded: false,
        comment: '',
        stat: -1,
        ctaskid: ''
      }
    },
    created() {
      this.fetchdata()
    },
    methods: {
      showtask(stat, id) {
        this.stat = stat
        this.ctaskid = id
        this.show = true

      },
      giveup(taskid) {
        var that = this
        var res
        //   console.log("getjob:" + taskid)
        DingTalkPC.device.notification.confirm({
          message: '是否放弃此任务',
          title: "提示",
          buttonLabels: ['放弃', '我再想想'],
          onSuccess: function (result) {
            if (result.buttonIndex == 0) {
              that.$http.post(localStorage.getItem("url") + "/task/giveuptask", {
                taskid: taskid,
                credentials: true
              }, {emulateJSON: true}).then(
                function (R) {
//                document.cookie = "user=" + R.bodyText,
                  res = R.body
                  if (res.stat == 0) {
                    that.toast("取消成功")
                    that.getalltasksundo()
                  } else {
                    that.toast(res.codemsg)
                  }
                  this.getalltasks()
                })
            }
            //onSuccess将在点击button之后回调
            /*
            {
                buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
            }
            */
          },
          onFail: function (err) {
          }
        });


      },
      complete(taskid) {
        var that = this
        var res
        if (that.comment == "") {
          that.toast("请填写内容")
          return false
        }
        that.$http.post(localStorage.getItem("url") + "/task/checktask", {
          taskid: taskid, checkcomment: that.comment, stat: that.stat,
          credentials: true
        }, {emulateJSON: true}).then(
          function (R) {
            res = R.body
            if (res.stat == 0) {
              that.toast("恭喜完成任务")
              that.show = false
              this.getalltasksundo()
//              window.history.go(-1)
            } else {
              that.toast(res.codemsg)
            }
            this.getalltasks()
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
      userinfo() {
        this.$http.post(localStorage.getItem("url") + "/userinfo", {access_token: this.getCookie("access_token")}, {emulateJSON: true}).then(
          function (R) {
            document.cookie = "user=" + R.bodyText,
              this.myjs = R.body,
              this.getalltasksundo()
          })

      },
      getalltasksundo() {
      /*  this.$http.post(localStorage.getItem("url") + "/task/getchecktask", {
          assigneeid: this.myjs.userid,
          pagenum: '1',
          pagesize: '10'
        }, {emulateJSON: true}).then(
          function (R) {
            this.alltasks = R.body
            //   console.log(JSON.stringify(R.body))
          })*/
      },
      loadMore() {
        var that = this
        if(that.allloaded){
          that.tips="数据已全部加载"
          that.loading = false;
          return
        }
        that.loading = true;

        console.log(that.pagenum)
        setTimeout(() => {
          this.$http.post(localStorage.getItem("url") + "/task/getchecktask", {
            pagesize: that.pagesize, pagenum: that.pagenum
          }, {emulateJSON: true}).then(
            function (R) {
              that.pagenum = that.pagenum + 1
              that.allloaded = R.body.lastPage
              that.loading = false;
              console.log(JSON.stringify(R.body.list))
              var res = R.body
              res.list.forEach((task) => {
                var taskdetail = eval("(" + task.taskapply + ")")
                task.taskapply = taskdetail
              })
              that.alltasks.list = that.alltasks.list.concat(res.list)
            })
        }, 500)


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
            //       console.log(corpId)
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
//                console.log('DingTalkPC.ready rocks!')


                //校验成功后，使用获取免登授权码接口获取CODE
                DingTalkPC.runtime.permission.requestAuthCode({
                  corpId: corpId, //企业id
                  onSuccess: function (info) {
                    //           console.log('authcode' + info.code);
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
            DingTalkPC.error(function (err) {
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


</style>
