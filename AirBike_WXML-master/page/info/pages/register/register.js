var url = require('../../../../page/common/urlConfig.js')
// 腾讯地图第三方插件
var QQMapWX = require('../../../../util/qqmap-wx-jssdk.js')
// 定时器插件
// ## 注意：
// 1、由于内部需要调用到小程序的setData方法，所以我们需要把this传过去。
// 2、此方法会在page中生成一个名为wxTimer，wxTimerSecond和wxTimerList的数据，请保证这些key没有被占用
// 3、请在data中添加一条属性wxTimerList: { },否则将会报错。
var timer = require('../../../../util/wxTimer.js')


Page({
  /**
   * 页面的初始数据
   */
  data: {
    msg_class: "msg-code-none",   //是否显示验证提示 msg-code-none为不显示 msg-code为显示
    wxTimerList: {},              //使用 定时器 需要的初始化
    msg_show_time: "00:00:03",    //验证提示 显示时长

    member_class: ['货车','草商','牧场'],
    member_value: ['truck', 'grass-shops', 'pasture', 'grass-shops', 'mechanics'],
    index: 0,
    member_name:'货车',
    jobId:'',
    openId:'',
    
    isLogin:false,
    status: '车主',
    province: ['蒙', '京', '津', '沪', '渝', '新', '藏', '宁', '桂', '港', '澳', '黑', '吉', '辽', '晋', '翼', '青', '鲁', '豫', '苏', '皖', '浙', '闽', '赣', '湘',' 奥', '琼', '甘', '陕', '黔', '滇', '川',],
    province_index: 0,
    grassType: ['天然草场', '人工草场', '半人工草场', '割草场'],
    grassType_index: 0,
    grassSize: ['0-10亩', '11-50亩', '51-100亩', '101-500亩', '500亩以上',],
    grassSize_index: 0,
    meadowType: ['温带草原牧场', '山地牧场', '绿洲牧场', '高寒牧场',],
    meadowType_index: 0,
    meadowSize: ['0-10亩', '11-50亩', '51-100亩', '101-500亩', '500亩以上',],
    meadowSize_index: 0,
    params:{},

    member_class_name: '', // 会员类别
    member_name:'',//会员姓名 
    phone_name: '',//电话号码
    grass_shop_name: '', //草商名称
    grass_shop_location: '', //草商地址
    pasture_name:'',//牧场名称
    pasture_address:'',//牧场地址
    province_name: '蒙', //车牌号前缀
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that=this
    var jobId = getApp().globalData.jobId
    var openId = getApp().globalData.openId
    var isLogin=jobId?true:false
    that.setData({
      'jobId': jobId ? jobId:'',
      'openId': openId ? openId : '',
      'isLogin': isLogin ? isLogin : '',
    })
    if (isLogin){
      //如果用户登录了，那么查询用户信息，并且赋值
      wx.request({
        url: url.queryUserInfoUrl,
        data: { 'entity.identifier': openId},
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (aa) {
        
          var vo=aa.data.model
          var jobId=vo.jobEntity.identifier
          if (jobId == "grass-shops"){
            that.setData({
              'status': '草商',
              'member_class_name':'草商',
              'member_name': vo.personEntity.personName,
              'grass_shop_name': vo.grassShops.grassShopsName,
              'grass_shop_location': vo.grassShops.positionShortName,
              'phone_name': vo.personEntity.contactNumber ? vo.personEntity.contactNumber:""
            })
          } else if (jobId == "pasture"){
            that.setData({
              'status': '牧场',
              'member_class_name': '牧场',
              'member_name': vo.personEntity.personName,
              'pasture_name': vo.pasture.pastureName,
              'pasture_address': vo.pasture.positionName,
              'phone_name': vo.personEntity.contactNumber ? vo.personEntity.contactNumber : ""
            })
          } else if (jobId == "truck") {
            that.setData({
              'status': '货车',
              'member_class_name': '货车',
              'member_name': vo.personEntity.personName,
              'truck.licensePlate': vo.truck.licensePlate,
              'car_type': vo.truck.truckType,
              'car_length': vo.truck.truckLength,
              'car_weight': vo.truck.loadWeight,
              'pasture_address': vo.truck.newlyPositionName,
              'phone_name': vo.personEntity.contactNumber ? vo.personEntity.contactNumber : ""
            })
          }
        }
      })
    }
  },

  memberTypePickerChange: function (e) {
   
    console.log('picker发送选择改变，携带值为', e.detail.value)

    var that = this;
  
    var status_name = that.data.member_class[e.detail.value]
    if (status_name=='货车'){
      that.data.params['vo.jobEntity.identifier'] = 'truck'
    } else if (status_name == '草商'){
      that.data.params['vo.jobEntity.identifier'] = 'grass-shops'
    } else if (status_name == '牧场') {
      that.data.params['vo.jobEntity.identifier'] = 'pasture'
    }
    
    that.setData({
      member_class_name: status_name,
      status: status_name
    })


  },
  
  provincePickerChange: function(e){
    var that = this;
    that.data.params['provinceName'] = that.data.province[e.detail.value]
    that.setData({
      province_name: that.data.province[e.detail.value]
    })

  },

  grassTypePickerChange: function(e){
    var that = this;
    that.setData({
      grassType_index: e.detail.value,
    })

  },
  formSubmit: function (e) {
    var that = this

    if (checkMsg(that, e)){
      wx.showLoading({
        title: '正在加载',
      })

      var params = that.data.params//参数，参数里面保存的主要是下拉框的
      for (var p in e.detail.value) {//将得到的键值对，赋值给params
        params[p] = e.detail.value[p]
      }
      var code, openId, globalData
      globalData = getApp().globalData
      openId = globalData.openId//d得到openiD
      var userInfo = globalData.userInfo
      //得到用户名和用户性别
      if (userInfo) {
        params['entity.username'] = userInfo.nickName
        params['prsonEntity.sexDictCode'] = userInfo.gender
      } else {
        wx.getUserInfo({
          succcess: function (res) {
            params['entity.username'] = res.nickName
            params['prsonEntity.sexDictCode'] = res.gender
          }
        })
      }

      params['entity.identifier'] = openId

      if (params['vo.jobEntity.identifier'] == 'truck') {
        params['vo.truck.contactsPhone'] = params['personEntity.contactNumber']
      } else if (params['vo.jobEntity.identifier'] == 'pasture') {
        params['vo.pasture.contactsPhone'] = params['personEntity.contactNumber']
      } else if (params['vo.jobEntity.identifier'] == 'grass-shops') {
        params['vo.grassShops.contactsPhone'] = params['personEntity.contactNumber']
      }
      if (params['vo.jobEntity.identifier'] == 'truck') {
        params['truck.licensePlate'] = params['truck.licensePlate'] + params['provinceName']
        var demo = new QQMapWX({
          key: 'YQVBZ-QEBCS-5KTOI-6U6TG-4B6RF-ZJFCI'// 必填
        });
        wx.getLocation({
          success: function (res) {
            demo.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude,
              },
              success: function (aa) {
                params['truck.newlyPositionName'] = aa.result.address
                params['truck.newlyPositionShortName'] = aa.result.address
                params['truck.newlyCoordinatesX'] = res.latitude
                params['truck.newlyCoordinatesY'] = res.longitude
                wx.request({
                  url: url.registUrl,
                  data: params,
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  success: function (res) {
                    // 暂时只考虑了很完美的情况
                    getApp().globalData.jobId = params['vo.jobEntity.identifier']
                    wx.showToast({
                      title: '注册成功',
                      duration: 1000,
                      complete: function (e) {
                        wx.hideLoading()
                        wx.navigateBack({
                          url: "../information/information",
                        })
                      }
                    })
                  }
                })
              },

            });
          },
        })
      } else {
        wx.request({
          url: url.registUrl,
          data: params,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function (res) {
            // 暂时只考虑了很完美的情况
            getApp().globalData.jobId = params['vo.jobEntity.identifier']
            wx.showToast({
              title: '注册完成',
              complete: function () {
                wx.navigateBack({
                  url: "../information/information",
                })
              },
              duration: 2000
            })
          },
          complete: function (e) {
            wx.hideLoading()
          }
        })
      } 
    }


  },
  grassSizePickerChange: function(e){
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
  tapGrassAddress: function(e){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          grass_Add_latitude: res.latitude,
          grass_Add_longitude: res.longitude,
          grass_Add: res.address
        });
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
          pasture_address: res.address
        });
        that.data.params['pasture.positionName'] = res.address;
        that.data.params['pasture.positionShortName'] = res.name;
        that.data.params['pasture.coordinatesX'] = res.latitude;
        that.data.params['pasture.coordinatesY'] = res.longitude;
      }
    });

  },
  //草商选择位置

  tapMeadowShopsAddress:function(){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          grass_shop_location: res.address
        });
        that.data.params['grassShops.positionName'] = res.address;
        that.data.params['grassShops.positionShortName'] = res.name;
        that.data.params['grassShops.coordinatesX'] = res.latitude;
        that.data.params['grassShops.coordinatesY'] = res.longitude;
      }
    });

  },


});

// 验证输入信息
function checkMsg(that, e){
  
  var data = that.data;
  var f_value = e.detail.value;

  if (data.member_class_name.trim() == ""){
    
    return changeMsgCode(that, "请选择会员类别");
  }

  if (f_value['personEntity.personName'].trim() == ""){
    
    return changeMsgCode(that, "请输入会员姓名");
  }

  if (f_value['personEntity.contactNumber'].trim() == "") {

    return changeMsgCode(that, "请输入手机号");
  } 

  //货车验证
  if (data.member_class_name.trim() == "货车"){

    if (f_value['truck.licensePlate'].trim() == "") {
      return changeMsgCode(that, "请输入货车车牌号");
    }

    if (f_value['truck.truckType'].trim() == ""){
      return changeMsgCode(that, "请输入货车类型");
    }

    if (f_value['truck.truckLength'].trim() == "") {
      return changeMsgCode(that, "请输入货车车长");
    }

    if (f_value['truck.loadWeight'].trim() == "") {
      return changeMsgCode(that, "请输入货车载重");
    }
  }

  //草商验证
  if (data.member_class_name.trim() == "草商") {

    if (f_value['grassShops.grassShopsName'].trim() == "") {
      return changeMsgCode(that, "请输入草商名称");
    }

    if (data.grass_shop_location.trim() == "") {
      return changeMsgCode(that, "请选择草商地址");
    }

  }

  //牧场验证
  if (data.member_class_name.trim() == "牧场") {

    if (f_value['pasture.pastureName'].trim() == "") {
      return changeMsgCode(that, "请输入牧场名称");
    }

    if (data.pasture_address.trim() == "") {
      return changeMsgCode(that, "请选择牧场地址");
    }

  }

  return changeMsgCode(that, "true");
}

//更改提示状态  msg为 'true' 的时候 清除提示状态
function changeMsgCode(that,msg){

  if(msg=="true"){
    that.setData({
      msg_code: "",
      msg_class: "msg-code-none"
    });

    return true;
  }else{
    that.setData({
      msg_code: msg,
      msg_class: "msg-code"
    });

    //定时器 msg_show_time 秒 后 清除验证信息
    var wxTimer1 = new timer({
      beginTime: that.data.msg_show_time,
      name: 'wxTimer1',
      complete: function () {
        that.setData({ 
          msg_code: "",
          msg_class: "msg-code-none"
        });
      }
    })
    wxTimer1.start(that);

    return false;
  }
 
}