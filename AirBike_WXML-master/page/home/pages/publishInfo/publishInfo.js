/**
 * 查看用户已经的发布信息
 */
var url = require("/../../../common/urlConfig.js")



Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:'',//用户id
    jobId:'',//用户的jobid
    listItem:'',//数据集合
  },
  onLoad:function(){
    var that=this
    that.data.jobId = getApp().globalData.jobId
    that.data.openId = getApp().globalData.openId
    //判断用户类型 进行不同的请求  这样写死有点low
    if (that.data.jobId =='pasture'){
      wx.request({
        url: url.pasturepreorderListUrl,
        data: { 'entity.pastureId':that.data.openId },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (bb) {
          //得到用户的工作类型，如果有存本地缓存
          var listItem = bb.data.model.entityList
          for (var i = 0; i < listItem.length; i++) {
            listItem[i].type = 'pasture'
          }
          that.setData({
            'listItem': listItem,
          })
        }
      })
    } else if (that.data.jobId =='grass-shops'){
      wx.request({
        url: url.grassshopspresaleListUrl,
        data: { 'entity.pastureId': that.data.openId },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (aa) {
          //得到用户的工作类型，如果有存本地缓存
          var listItem = aa.data.model.entityList
          for (var i = 0; i < listItem.length;i++){
            listItem[i].type ='grass-shops'
          }
          wx.request({
            url: url.grassshopsTransportListUrl,
            data: { 'entity.pastureId': that.data.openId },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (bb) {
              //得到用户的工作类型，如果有存本地缓存
              var entityList = bb.data.model.entityList
              var total = listItem.length
              for (var i = 0, j = entityList.length; i < j; i++) {
                entityList[i].type = 'grass-truck'
                listItem[i + total] = entityList[i]
              }
              that.setData({
                'listItem': listItem,
              })
            }
          })
        }
      })
    } else if (that.data.jobId == 'truck') {
      wx.request({
        url: url.truckRouteListUrl,
        data: { 'entity.truckId': that.data.openId },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (bb) {
          //得到用户的工作类型，如果有存本地缓存
          var listItem = bb.data.model.entityList
          for (var i = 0; i < listItem.length; i++) {
            listItem[i].type = 'truck'
          }
          that.setData({
            'listItem': listItem,
          })
        }
      })
    }
  
  },
  deleteTap:function(e){
    var that=this

    var id=e.target.dataset.id
    var type = e.target.dataset.type
    wx.showModal({
      title: '删除提示',
      content: '如果删除，以后信息不能找回，确认删除点击确认，取消删除点击取消',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          //这是草商的删除
          if (type =='grass-shops'){
            wx.request({
              url: url.grassshopspresaleDeleteUrl,
              data: { 'entity.identifier': id },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: function (bb) {
                //得到用户的工作类型，如果有存本地缓存
                that
                wx.showToast({
                  title: '删除成功',
                })
                wx.request({
                  url: url.grassshopspresaleListUrl,
                  data: { 'entity.pastureId': that.data.openId },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  success: function (aa) {
                    //得到用户的工作类型，如果有存本地缓存
                    var listItem = aa.data.model.entityList
                    for (var i = 0; i < listItem.length; i++) {
                      listItem[i].type = 'grass-shops'
                    }
                    wx.request({
                      url: url.grassshopsTransportListUrl,
                      data: { 'entity.pastureId': that.data.openId },
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      method: "POST",
                      success: function (bb) {
                        //得到用户的工作类型，如果有存本地缓存
                        var entityList = bb.data.model.entityList
                        var total = listItem.length
                        for (var i = 0, j = entityList.length; i < j; i++) {
                          entityList[i].type = 'grass-truck'
                          listItem[i + total] = entityList[i]
                        }
                        that.setData({
                          'listItem': listItem,
                        })
                      }
                    })
                  }
                })
              }
            })
          } else if (type == 'truck'){
            wx.request({
              url: url.truckRouteDeleteUrl,
              data: { 'entity.identifier': id },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: function (bb) {
                //得到用户的工作类型，如果有存本地缓存
                that
                wx.showToast({
                  title: '删除成功',
                })
                wx.request({
                  url: url.truckRouteListUrl,
                  data: { 'entity.truckId': that.data.openId },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  success: function (bb) {
                    var listItem = bb.data.model.entityList
                    for (var i = 0; i < listItem.length; i++) {
                      listItem[i].type = 'truck'
                    }
                    that.setData({
                      'listItem': listItem,
                    })
                  }
                })
              }
            })
          } else if (type == 'grass-truck') {
            wx.request({
              url: url.grassshopsTransportDeleteUrl,
              data: { 'entity.identifier': id },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: function (bb) {
                //得到用户的工作类型，如果有存本地缓存
                that
                wx.showToast({
                  title: '删除成功',
                })
                wx.request({
                  url: url.truckRouteListUrl,
                  data: { 'entity.truckId': that.data.openId },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  success: function (bb) {
                    //得到用户的工作类型，如果有存本地缓存
                    var listItem = bb.data.model.entityList
                    for (var i = 0; i < listItem.length; i++) {
                      listItem[i].type = 'truck'
                    }
                    that.setData({
                      'listItem': listItem,
                    })
                  }
                })
              }
            })
          } else if (type == 'pasture') {
            wx.request({
              url: url.pasturepreorderDeleteUrl,
              data: { 'entity.identifier': id },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: function (bb) {
                //得到用户的工作类型，如果有存本地缓存
                that
                wx.request({
                  url: url.pasturepreorderListUrl,
                  data: { 'entity.pastureId': that.data.openId },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  success: function (bb) {
                    //得到用户的工作类型，如果有存本地缓存
                    var listItem = bb.data.model.entityList
                    for (var i = 0; i < listItem.length; i++) {
                      listItem[i].type = 'pasture'
                    }
                    that.setData({
                      'listItem': listItem,
                    })
                  }
                })
              }
            })
          }
          
        } else {
          //啥也不做
          console.log('用户点击辅助操作')
        }
      }
    });
  }
  
})
