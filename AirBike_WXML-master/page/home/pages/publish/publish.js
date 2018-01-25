var url = require('../../../../page/common/urlConfig.js')
var sliderWidth = 96; 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    jobId:'null',
    isLogin:null,
    grass_type_index:0,
    deal_type:['发布预售信息','发布找车信息'],
    deal_type_index:null,
    tabs: ["发布预售", "寻找货车"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    grass_type: ['苜蓿草', '燕麦草', '天然青干草', '其他'],
    car_type:['板车','其他'],
    car_type_index:0,
    grass_grade: ['一级', '二级', '三级', '其他'],
    grass_grade_index:0,
    payment_method: ['现金支付', '手机支付', '其他支付'],
    payment_method_index:0,
    time:'111',
    date:'2018-01-03',
    params: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that=this
    var jobId = getApp().globalData.jobId
    var isLogin = getApp().globalData.isLogin
    // vat jobId= getApp().globalData.jobId
    //给赋值
    that.setData({
      'jobId': getApp().globalData.jobId ? getApp().globalData.jobId:'',
      'isLogin': getApp().globalData.isLogin ? getApp().globalData.isLogin:''
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.setData({
      'jobId': getApp().globalData.jobId,
      'isLogin': getApp().globalData.isLogin
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //选项卡切换
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  memberTypePickerChange: function (e) {
    var that = this;
    var status_name = that.data.member_class[e.detail.value]
    that.data.params['vo.jobEntity.identifier'] = that.data.member_value[e.detail.value]
    that.setData({
      index: e.detail.value,
      status: status_name
    })
  },

  grassTypeChange: function (e) {
    //设置params
    var that = this
    var status_name = that.data.grass_type[e.detail.value]
    that.data.params['entity.grassProductId'] = status_name
    that.setData({
      grass_type_index: e.detail.value,
    })
  },
  paymentMethodChange:function(e){

    var that = this
    var status_name = that.data.payment_method[e.detail.value]
    that.data.params['grassShopsPreSaleEntity.payMode'] = status_name
    that.setData({
      payment_method_index: e.detail.value,
    })
  },
  grassGradeChange: function (e) {
    //设置params

    var that = this
    var status_name = that.data.grass_grade[e.detail.value]
    that.data.params['entity.qualityGrade'] = status_name
    that.setData({
      grass_grade_index: e.detail.value,
    })
  },
  bindDateChange: function (e) {
    var that=this
    that.setData({
      date: e.detail.value
    })
    that.data.params['entity.arrivalTime'] = e.detail.value
  },
  grassTypePickerChange: function (e) {
    var that = this;
    that.setData({
      grassType_index: e.detail.value,
    })

  },
  formSubmit: function (e) {
    wx.showLoading({
      title: '正在加载',
    })
    var that = this
    var params = that.data.params//参数，参数里面保存的主要是下拉框的
    for (var p in e.detail.value) {//将得到的键值对，赋值给params
      params[p] = e.detail.value[p]
    }

    if (that.data.jobId == 'grass-shops'){
      //现在还包含
      var openId
      var queryUrl=''
      var anthorParams={}
      if(that.data.activeIndex==1){//说明是寻找货车
        queryUrl = url.grassshopsTransportInsertUrl
        for (var p in params){
          if (p.indexOf('grassShopsTransportEntity')!=-1){
            anthorParams[p.replace('grassShopsTransportEntity', 'entity')] = params[p]
          }
        }
      } else if (that.data.activeIndex == 0) {//说明是发布预售信息
        queryUrl =url.grassshopspresaleInsertUrl
        for (var p in params) {
          if (p.indexOf('grassShopsPreSaleEntity') != -1) {
            anthorParams[p.replace('grassShopsPreSaleEntity', 'entity')] = params[p]
          }
        }
      }
      anthorParams['entity.grassShopsId'] = getApp().globalData.userId
      wx.request({
        url: queryUrl,
        data: anthorParams,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          // 暂时只考虑了很完美的情况
          //登陆完应该更新全局变量的jobId
          wx.hideLoading()
          wx.showToast({
            title: '注册成功',
            duration: 1000,
            complete: function (e) {
              wx.hideLoading()
              wx.navigateBack({
                url: "../../../information/information",
              })
            }
          })
        },
        complete:function(){
          wx.hideLoading()
        }
      })
    } else if (that.data.jobId == 'pasture'){
      var openId
      params['entity.pastureId'] = getApp().globalData.userId
      //暂时考虑用户授权且获得所有信息的情况，
      wx.request({
        url: url.pasturepreorderInsertUrl,
        data: params,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          // 暂时只考虑了很完美的情况
          //登陆完应该更新全局变量的jobId
          wx.showToast({
            title: '注册成功',
            duration: 1000,
            complete: function (e) {
              wx.hideLoading()
              wx.navigateBack({
                url: "../../../information/information",
              })
            }
          })
        },
        complete:function(){
          wx.hideLoading()
        }
      })
    } else if (that.data.jobId == 'truck'){
      var openId
      params['entity.truckId'] = getApp().globalData.userId
      //暂时考虑用户授权且获得所有信息的情况，
      wx.request({
        url: url.truckRouteInsert,
        data: params,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          // 暂时只考虑了很完美的情况
          //登陆完应该更新全局变量的jobId
          wx.showToast({
            title: '注册成功',
            duration: 1000,
            complete: function (e) {
              wx.hideLoading()
              wx.navigateBack({
                url: "../../../information/information",
              })
            }
          })
        },
        complete: function () {
          wx.hideLoading()
        }
      })
    }
    


  },
  grassSizePickerChange: function (e) {
    var that = this;
    that.setData({
      grassSize_index: e.detail.value,
    })

  },

  meadowTypePickerChange: function (e) {
    var that = this;
    that.setData({
      meadowType_index: e.detail.value,
    })

  },

  meadowSizePickerChange: function (e) {
    var that = this;
    that.setData({
      meadowSize_index: e.detail.value,
    })

  },


  //获取草场地址
  tapGrassAddress: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          grass_Add_latitude: res.latitude,
          grass_Add_longitude: res.longitude,
          grass_Add: res.address
        });
        that.data.params['entity.receivingPositionName'] = res.address
        that.data.params['entity.receivingPositionShortName'] = res.name
        that.data.params['entity.receivingCoordinatesX'] = res.latitude
        that.data.params['entity.receivingCoordinatesY'] = res.longitude
      }
    });

  },

  //获取牧场地址
  tapMeadowAddress: function (e) {

    var that = this
    wx.chooseLocation({
      success: function (res) {
      
        console.log(res)
        that.setData({
          meadow_Add_latitude: res.latitude,
          meadow_Add_longitude: res.longitude,
          meadow_Add: res.address
        });
        that.data.params['pasture.positionName'] = res.address;
        that.data.params['pasture.positionShortName'] = res.name;
        that.data.params['pasture.coordinatesX'] = res.latitude;
        that.data.params['pasture.coordinatesY'] = res.longitude;
      }
    });

  },
  //草商选择位置
  tapMeadowShopsAddress: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {

        console.log(res)
        that.setData({
          meadow_Add_latitude: res.latitude,
          meadow_Add_longitude: res.longitude,
          meadow_Add: res.address
        });
        that.data.params['grassShopsPreSaleEntity.deliveryPositionName'] = res.address;
        that.data.params['grassShopsPreSaleEntity.deliveryPositionShortName'] = res.name;
        that.data.params['grassShopsPreSaleEntity.deliveryCoordinatesX'] = res.latitude;
        that.data.params['grassShopsPreSaleEntity.deliveryCoordinatesY'] = res.longitude;
      }
    });

  },

  carStartTap:function(e){
    //起始发车
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          carStartAddress: res.address,
        
        });
        that.data.params['entity.originPositionName'] = res.address
        that.data.params['entity.originPositionShortName'] = res.name
        that.data.params['entity.originCoordinatesX'] = res.latitude
        that.data.params['entity.originCoordinatesY'] = res.longitude


       
      }

    });
  },

  carEndTap: function (e) {
    debugger
    //起始发车
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          carEndAddress: res.address,

        });
        that.data.params['entity.destinationPositionName'] = res.address;
        that.data.params['entity.destinationPositionShortName'] = res.name;
        that.data.params['entity.destinationCoordinatesX'] = res.latitude;
        that.data.params['entity.destinationCoordinatesY'] = res.longitude;
      }
    });
  },

  deliveryPositionTap: function (e) {
    debugger
    //起始发车
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          deliveryPosition: res.address,
        });
        that.data.params['grassShopsTransportEntity.deliveryPositionName'] = res.address;
        that.data.params['grassShopsTransportEntity.deliveryPositionShortName'] = res.name;
        that.data.params['grassShopsTransportEntity.deliveryCoordinatesX'] = res.latitude;
        that.data.params['grassShopsTransportEntity.deliveryCoordinatesY'] = res.longitude;
      }
    });
  },

  receivingPositionTap: function (e) {
    debugger
    //起始发车
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          receivingPositionAddress: res.address,
        });
        that.data.params['grassShopsTransportEntity.receivingPositionName'] = res.address;
        that.data.params['grassShopsTransportEntity.receivingPositionShortName'] = res.name;
        that.data.params['grassShopsTransportEntity.receivingCoordinatesX'] = res.latitude;
        that.data.params['grassShopsTransportEntity.receivingCoordinatesY'] = res.longitude;
      }
    });
  },
  //发货时间
  bindTransportDateChange:function(e){
    var that = this
    that.setData({
      date: e.detail.value
    })
    that.data.params['grassShopsTransportEntity.transportTime'] = e.detail.value
  },

  bindCarDateChange:function(e){
    var that=this
    that.setData({
      date: e.detail.value
    })
    that.data.params['entity.startingTime'] = e.detail.value
  },
  tapSendMsg: function (e) {
    this.setData({
      selected: true,
      // selected1: false,
    });
    countdown(this);
  }


});


function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      // selected1: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}