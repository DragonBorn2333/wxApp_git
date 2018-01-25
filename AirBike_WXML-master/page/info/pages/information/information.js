
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  tapCheckInfo: function(e){
    //通过这个判断当前用户是否有一个类别，有的话就不进去了
    // if (getApp().globalData.jobId){
    //   wx.showToast({
    //     title: '暂时无法修改',
    //   })
    // }else{
    wx.navigateTo({
      url: '../register/register',
    })
    // }
   
  },
  freeRelease:function(){
    wx.navigateTo({
      url: '../../../home/pages/publish/publish',
    })
  },

  tapCheckPublishInfo: function(e){
    wx.navigateTo({
      url: '../../../home/pages/publishInfo/publishInfo',
    })
  }

})