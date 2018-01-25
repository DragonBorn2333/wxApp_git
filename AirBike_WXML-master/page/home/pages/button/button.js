Page({

data:{
  aa:11,
  ifWX:true,
  ifPhone:true,
  ifShow:false,
  isDisabled:false,
},
wechatLogin:function(e){
  wx.showToast({
    title: '登录中',
    icon: 'loading',
    duration: 5000
  });
  var that=getApp()
  wx.login({
    success: function (res) {
      wx.getUserInfo({
        success: function (userInfo) {
          that.globalData.simpleUserInfo = userInfo.userInfo
          var l = 'http://192.168.0.113:8080/caodurz/weixin/approve/code.j?jscode=' + res.code;
          wx.request({
            url: l, //仅为示例，并非真实的接口地址
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              that.globalData.openId = res.data
              var l = 'http://192.168.0.113:8080/caodu/portal/main/login_j.ajson?vo.entity.identifier=' + that.globalData.openId;
              wx.request({
                url: l, //仅为示例，并非真实的接口地址
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  if (res.data.model.jobEntity) {
                    that.globalData.jobId = res.data.model.jobEntity.identifier
                  } 
                  wx.navigateTo({
                    url: '../index/index'
                  })
                  wx.hideToast();
                 },
                fail: function () {
                  wx.showToast({
                    title: '登录失败',
                  });
                }
               
              })
            },
            fail: function () {
              wx.showToast({
                title: '登录失败',
              });
            }
          
          })
        },
        fail:function(){
          wx.showToast({
            title: '登录失败',
          });
        }
       
      })
    },
  })
},
phoneLogin:function(){
  var that=this
  that.setData({
    "ifWX": false,
    "ifPhone": false,
    "ifShow": true,
    "isDisabled": true,
  })
},
phoneStart:function(e){
  wx.showToast({
    title: '登录中',
    icon: 'loading',
    duration: 5000
  });
},
inputBlur:function(e){

  if (!(/^1[34578]\d{9}$/.test(e.detail.value))) {
    wx.showToast({
      title: '手机号码有误',
    })
    this.setData({
      "isDisabled": true,
    })
  }else{
    this.setData({
      "isDisabled": false,
    })
  }
}
});