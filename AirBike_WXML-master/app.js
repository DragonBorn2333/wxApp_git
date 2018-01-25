//app.js
var url=require('page/common/urlConfig.js')
var QQMapWX = require('util/qqmap-wx-jssdk.js')
var qqmapsdk
App({
  globalData:{  
    openId:null,//当前用户的openId
    jobId: null,//得当当前用户在我们系统中是什么角色，草场或者牧场或者其他
    updateLocation:null,
    isLogin:false,
    userInfo: null,//用户的基本信息，名称 头像url
    userId:null,//该id对应的是用户在本地数据库的id
},  
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    //不知道把数据存在本地缓存会有什么问
    var that=this
    wx.getSystemInfo();
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    that.globalData.openId = wx.getStorageSync('openId')//根据本地缓存，依靠这个openId查询用户是否曾经登陆
    that.globalData.jobId = wx.getStorageSync('jobId')//根据本地缓存，得到当前用户是否曾经注册
    that.globalData.userId = wx.getStorageSync('userId')//根据本地缓存，得到当前用户是否曾经注册
    //s设置已经登录
    if (that.globalData.openId && !that.globalData.userId){
      wx.request({
        url: url.viewuserinfo,
        data: { 'entity.identifier': that.globalData.openId },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (bb) {
          if (bb.data.model.grassShops && bb.data.model.grassShops) {
            that.globalData.userId = bb.data.model.grassShops.identifier
          } else if (bb.data.model.pasture && bb.data.model.pasture) {
            that.globalData.userId = bb.data.model.pasture.identifier
          } else if (bb.data.model.truck && bb.data.model.truck) {
            that.globalData.userId = bb.data.model.truck.identifier
          }
          wx.setStorageSync('userId', that.globalData.userId )
        }
      })
    }
    that.globalData.userInfo = wx.getStorageSync('userInfo')
    if (!that.globalData.openId){
      wx.login({
        success: function (res) {
          wx.request({
            url: url.queryOpenIdUrl,
            data: { 'jscode': res.code },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (aa) {
              //得到当前用户的openid
              that.globalData.openId = aa.data
              wx.request({
                url: url.viewuserinfo,
                data: { 'entity.identifier': that.globalData.openId },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                success: function (bb) {
                  //得到用户的工作类型，如果有存本地缓存
                  if (bb.data.model.grassShops && bb.data.model.grassShops){
                    that.globalData.userId = bb.data.model.grassShops.identifier
                  } else if (bb.data.model.pasture && bb.data.model.pasture){
                    that.globalData.userId = bb.data.model.pasture.identifier
                  } else if (bb.data.model.truck && bb.data.model.truck) {
                    that.globalData.userId = bb.data.model.truck.identifier
                  }
                }
              })
              wx.setStorageSync('openId', aa.data)
              //根据当前用户的openId 验证用户是否曾经注册过
              wx.request({
                url: url.loginUrl,
                data: { 'entity.identifier': aa.data },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                success: function (bb) {
                  //得到用户的工作类型，如果有存本地缓存
                  that.globalData.jobId = bb.data.model.jobEntity.identifier
                  if (that.globalData.jobId == 'truck') {
                    clearInterval(that.uploadLocationTimer)
                    that.startLocationUpload()
                  }
                  wx.setStorageSync('jobId', bb.data.model.jobEntity.identifier)
                  if (that.globalData.jobId){
                    that.globalData.isLogin = true
                  }
                }
              })
            }
          })
        }
      })
    } else if (!that.globalData.jobId){
      wx.request({
        url: url.loginUrl,
        data: { 'entity.identifier': that.globalData.openId },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (bb) {
          //得到用户的工作类型，如果有存本地缓存
          that.globalData.jobId = bb.data.model.jobEntity.identifier
          wx.setStorageSync('jobId', bb.data.model.jobEntity.identifier)
          if (that.globalData.jobId == 'truck') {
              clearInterval(that.uploadLocationTimer)
              that.startLocationUpload()
          }
          if (that.globalData.jobId) {
            that.globalData.isLogin = true
          }
        }
      })
    } else if (that.globalData.jobId){
      if (that.globalData.jobId == 'truck') {
        wx.request({
          url: url.loginUrl,
          data: { 'entity.identifier': that.globalData.openId },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function (bb) {
            //得到用户的工作类型，如果有存本地缓存
            that.globalData.jobId = bb.data.model.jobEntity.identifier
            wx.setStorageSync('jobId', bb.data.model.jobEntity.identifier)
            if (that.globalData.jobId == 'truck') {
              clearInterval(that.uploadLocationTimer)
              that.startLocationUpload()
            }
            if (that.globalData.jobId) {
              that.globalData.isLogin = true
            }
          }
        })
        clearInterval(that.uploadLocationTimer)
        that.startLocationUpload()
      }else{
        wx.request({
          url: url.loginUrl,
          data: { 'entity.identifier': that.globalData.openId },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function (bb) {

            //得到用户的工作类型，如果有存本地缓存
            that.globalData.jobId = bb.data.model.jobEntity.identifier
            wx.setStorageSync('jobId', bb.data.model.jobEntity.identifier)
            if (that.globalData.jobId == 'truck') {
              clearInterval(that.uploadLocationTimer)
              that.startLocationUpload()
            }
            if (that.globalData.jobId) {
              that.globalData.isLogin = true
            }
          }
        })
      }
    }
    // 获取用户信息 如果本地没有用户信息，那么请求得到
    if (!that.globalData.userInfo){
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                wx.setStorageSync('userInfo', res.userInfo)
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        },
        fail: function (res) {
        }
      })
    }
    //调用系统API获取设备的信息
    wx.getSystemInfo({
      success: function(res) {
        var kScreenW = res.windowWidth/375
        var kScreenH = res.windowHeight/603
        wx.setStorageSync('kScreenW', kScreenW)
        wx.setStorageSync('kScreenH', kScreenH)
      }
    })
    if (that.globalData.openId && that.globalData.jobId) {
      that.globalData.isLogin = true
    }
    
  },
  startLocationUpload:function(){
    var that=this
    if (that.globalData.jobId && that.globalData.jobId == 'truck' ){
        that.uploadLocationTimer = setInterval(function () {
          //应该是每时每刻进行刷新
          wx.getLocation({
            success: function (res) {
              var demo = new QQMapWX({
                key: 'YQVBZ-QEBCS-5KTOI-6U6TG-4B6RF-ZJFCI'// 必填
              });

              // 调用接口
              demo.reverseGeocoder({
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                success: function (aa) {
             
                  wx.request({
                    url: url.truckUpdateLocationUrl,
                  
                    data: { 
                      'entity.identifier': that.globalData.openId ,
                      'entity.newlyPositionName':aa.result.address,
                      'entity.newlyPositionShortName': aa.result.address,
                      'entity.newlyCoordinatesX': res.latitude,
                      'entity.newlyCoordinatesY': res.longitude
                      },
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    success: function (bb) { 
                    }
                  })
                },
                fail: function (res) {
                },
                complete: function (res) {
                }
              });
            },
          })
        },600000)
      }
    },
})