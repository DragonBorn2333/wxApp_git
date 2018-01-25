//index.js
var md5 = require("/../../../../util/MD5.js")
var checkNetWork = require("/../../../../util/CheckNetWork.js")
var disabledToken = require("/../../../../util/disabledToken.js")
var url = require("/../../../common/urlConfig.js")



//获取应用实例
Page({
  //每过五秒，刷新当前位置的附近东西的线程
  refreshTimer:null,
  data: {
    //地图的宽高
    mapHeight: '86%',
    jobId:null,
    mapWidth: '100%',
    mapTop: '0',
    moreShow:true,//显示的是是否加载更duo 
    worningShow:false,// 是否要显示需要完善信息的条幅
    listShow:false,//当前列表是否展开
    mapDataList:null,//地图上展示的数据
    isLogin:false,//是否登录
    moreType: "homePage",//当前点击的是啥
    member_value: ['truck', 'grass-shops', 'pasture', 'homePage'],
    moreListItem:null,//下面列表的数据
    scrollViewHeigth:"50%",
    jobType:'牧场',
    truckRoute:true,
    params:{
      'identitySign': 'truck,grass-shops,pasture'
    },
    //导航栏有哪些数据项
    sections: [
    ],
    //查询附近单车请求参
    //用户当前位置
    point: {
      latitude: 0,
      longitude: 0
    },
    //单车标注物
    markers: [],
    //当前地图的缩放级别
    mapScale: 16,
    //地图上不可移动的控件
    controls:[ ],
    //已登录的地图组件
    
    //没有登录的地图组件
    mapControls:[
      {
        id: 11,
        position: {
          left:10*wx.getStorageSync("kScreenW"),
          top:523*wx.getStorageSync("kScreenH")*0.79,
          width:40*wx.getStorageSync("kScreenW"),
          height:40*wx.getStorageSync("kScreenW")
        },
      iconPath: '../../../../images/imgs_main_location@2x.png',
      clickable: true,
    },
  ],
 
  },

  //个人信息页面跳转
  tapJumpToInfo: function(e){
    console.log("taptaptap");
    wx.navigateTo({
      url: "../../../info/pages/information/information"
    });
  },



  //控件的点击事件
  controltap: function (e) {
    wx.showToast({
      title: 'dianjile',
    })
    var that = this
    var id = e.controlId
    if (id == 11) {
      //定位当前位置
      that.getUserCurrentLocation()
    } else if (id == 14){
      //
      that.setData({
        'truckRoute': true,
      })
      that.moreClick()
    } else if (id == 15) {
      that.setData({
        'truckRoute': false,
      })
      that.moreClick()
    }else if (id == 17) {
      //注册登录 
      that.mapControls= [
        {
          id: 11,
          position: {
            left: 10 * wx.getStorageSync("kScreenW"),
            top: 523 * wx.getStorageSync("kScreenH") * 0.79,
            width: 40 * wx.getStorageSync("kScreenW"),
            height: 40 * wx.getStorageSync("kScreenW")
          },
          iconPath: '../../../../images/imgs_main_location@2x.png',
          clickable: true,
        },
        //地图中心位置按钮
      ],
      that.setData({
        'mapHeight': "79%",
        'controls': that.mapControls,
        'moreShow':'true',
      })
    }
  },
  //更新附近的东西
  getBikeList: function () {
    //检查网络
    var toast=wx.showToast({
      title: '正在加载，请稍后',
    })
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误')
      wx.hideToast()
    }else {
      var that = this
      wx.request({
        url: url.queryListForLocationUrl,
        data: that.data.params,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
        'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that
        
          that.data.mapDataList = res.data.model.mazyList
          that.setData({
            'markers': []
          })
          var listItem=res.data.model.mazyList
          var markers = []
          for (var i = 0; i < listItem.length; i++) {
            var bikeLat = listItem[i].locationX
            var bikeLong = listItem[i].locationY
            var iconPath = ''
            if (listItem[i].jobEntity.identifier == "pasture") {
              
              iconPath = "../../../../images/pasture.png"
            } else if (listItem[i].jobEntity.identifier == "grass-shops"){
              iconPath = "../../../../images/grass-shops.png"
           
            } else if (listItem[i].jobEntity.identifier == "truck") {
              iconPath = "../../../../images/truck.png"

            }
            
            var id = i
            var marker = {
              latitude: bikeLat,
              longitude: bikeLong,
              iconPath: iconPath,
              'data-jobId': listItem[i].jobEntity.identifier,
              'data-openId': listItem[i].entity.identifier,
              id: id,
              width: 30 * wx.getStorageSync("kScreenW"),
              height: 30 * wx.getStorageSync("kScreenW")
            }
            markers.push(marker)
          }
            that.setData({
              'markers': markers
            })
            wx.hideToast()
        },
        fail: function() {
        },
        complete: function() {
          // complete
          console.log("请求complete啊")
          setTimeout(function(){
              wx.hideToast()
          },1000)
        }
      })
    }
  },
  //点击标注点
  markertap: function (e) {
 
  },
  //点击展开更多 ，应该变更地图大小  加载数据  改变地图上图标的位置
  moreClick:function(e){
    var that=this;
    that.setData({
      'moreShow': false,
    })
    that.changeMapControls()
    that.getMoreMessageList()
   
  },
  getMoreMessageList:function(e){
    var that = this
    that.setData({
      'moreListItem':[]
    })
    var toast = wx.showToast({
      title: '正在加载，请稍后',
    })
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误')
      wx.hideToast()
    } else {
    
      var queryUrl=''
      if(that.data.moreType =='pasture'){
        queryUrl = url.pasturepreorderListUrl
      }else if (that.data.moreType == 'grass-shops'){
        queryUrl = url.grassshopspresaleListUrl
      } else if (that.data.moreType == 'truck') {
   
        if(that.data.truckRoute){
          queryUrl = url.truckRouteMazyListUrl
        }else{
          queryUrl = url.grassshopsTransportMazyListUrl
        }
      }
      wx.request({
        url: queryUrl,
        data: that.data.params,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var items =''
         //用来获得一些下拉列表的信息
     
         if (that.data.moreType == "pasture") {
             items = res.data.model.entityList
         } else if (that.data.moreType == "grass-shops") {
             items = res.data.model.entityList
         } else if (that.data.moreType == "truck") {
            if (that.data.truckRoute) {
               items = res.data.model.mazyList
            } else {
               items = res.data.model.mazyList
            }
          }
         for (var i = 0; i < items.length;i++){
           var x=''
           var y=''
           var isntance=''
           if (that.data.moreType =="pasture"){
            x =items[i].receivingCoordinatesX
            y = items[i].receivingCoordinatesY
           } else if (that.data.moreType =="grass-shops"){
             x = items[i].deliveryCoordinatesX
             y = items[i].deliveryCoordinatesY
           } else if (that.data.moreType =="truck"){
             if (that.data.truckRoute) {
               x = items[i].originCoordinatesX
               y = items[i].originCoordinatesY
             } else {
               x = items[i].deliveryCoordinatesX
               y = items[i].deliveryCoordinatesY
             }
           }
           isntance = that.getDisance(x, y, that.data.point.latitude, that.data.point.longitude)
           if (isntance < 1000) {
             items[i].distance = isntance.toFixed(0) + "米";
           } else {
             items[i].distance = (isntance / 1000).toFixed(1) + "千米";
           }
         }
          that.setData({
            'moreListItem': items
          })
        },
        fail: function () {
        },
        complete: function () {
          setTimeout(function () {
            wx.hideToast()
          }, 1000)
        }
      })
    }
  },
  //定位到用户当前位置
  getUserCurrentLocation: function () {
    this.mapCtx.moveToLocation();
    this.setData({
      'mapScale': 16
    })
  },
  failMessage: function() {
    wx.showToast({
              title: '连接服务器失败',
              icon: 'loading',
              duration: 2000,
     })
  },
//页面加载的函数
  onLoad: function () {
    var that = this
    //获取用户的当前位置位置
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
      success: function(res){
        // success
        var latitude = res.latitude
        var longitude = res.longitude
        var point= {
          latitude: latitude,
          longitude: longitude
        };
        that.setData({
          'point': point
        })
      }
    })
    if (getApp().globalData.jobId){
      that.setData({
        'isLogin': true,
        'jobId':getApp().globalData.jobId
      })
    }else{
      that.setData({
        'isLogin':false
      })
    }
    //todo请求后台 验证用户是否曾经注册，如果注册，根据地点和他的类型展示相应的信息
    //todo如果用户没有注册，那么展示所有的信息
    //计算屏幕的高度
    var h = wx.getStorageSync("kScreenH")
    var top = h*0.25*0.7
    var bottom = h*0.25*0.3
    that.setData({
          'bikeRiding.topLineHeight': top,
          'bikeRiding.bottomLineHeight': bottom
    })
  },
  onReady: function (e) {
    var that=this;            
    //通过id获取map,然后创建上下文
    that.mapCtx = wx.createMapContext("myMap"); 
  
  },
    onShow:function(){
      //如果用户注册完了  那么全局变量的jobId已经变了，应该在这里获取一下改变
      var networkStatu = checkNetWork.checkNetWorkStatu()
      var that = this
      //根据用户信息去选中地图  其实就是根据用户信息去选中
      //生成地图上的那些个小图标
      if (getApp().globalData.jobId) {
        if (getApp().globalData.jobId == 'truck'){
          that.data.params['identitySign'] = 'truck'
          that.setData({
            'moreShow':true,
            'moreType': 'truck',
            'listShow':true,
            'sections': [
              {
                section_id: '0',
                active: false,
                name: '物流'
              }
            ],
            'mapHeight': '86%',
          })
        } else if (getApp().globalData.jobId == 'grass-shops'){
          that.data.params['identitySign'] = 'pasture,truck'
          that.setData({
            'moreType': 'homePage',
            'sections': [
              {
                section_id: '3',
                active: true,
                name: '首页'
              },
              {
                section_id: '2',
                active: false,
                name: ' 牧场'
              },
              {
                section_id: '0',
                active: false,
                name: '物流'
              },

            ],
            'mapHeight': '86%',
            'moreShow': false,
          })
        } else if (getApp().globalData.jobId == 'pasture'){
          that.data.params['identitySign'] = 'grass-shops'
          that.setData({
            'moreType': 'grass-shops',
            'mapHeight': '79%',
            'moreShow': true,
            'listShow': true,
            'sections': [
              {
                section_id: '1',
                active: true,
                name: '草商'
              },
            ],
          })

        }
      } else {
        that.setData({
          'moreShow': false,
          'mapHeight': '79%',
          'moreType': 'homePage',
          'sections': [
            {
              section_id: '3',
              active: true,
              name: '首页'
            },
            {
              section_id: '2',
              active: false,
              name: ' 牧场'
            },
            {
              section_id: '1',
              active: false,
              name: '草商'
            },
            {
              section_id: '0',
              active: false,
              name: '物流'
            },

          ],
        })
      }
      var mapControls = that.data.mapControls
      that.setData({
        'controls': mapControls,
      })
      //进行加载列表
      //1 请求列表 等后台好了写
      //请求结束 ，添加地图上的图标
      that.getBikeList()
      //
    },
    onHide:function(){
      // 生命周期函数--监听页面隐藏
      console.log('onHide')
    },
    onUnload:function(){
      // 生命周期函数--监听页面卸载
      console.log('onUnload')
    },
    onPullDownRefresh: function() {
      // 页面相关事件处理函数--监听用户下拉动作
      console.log('onPullDownRefresh')
    },
    onReachBottom: function() {
      // 页面上拉触底事件的处理函数
      console.log('onReachBottom')
    },
    freePubTap:function(e){
      var that=this
      if(that.data.isLogin){
        wx.navigateTo({
          url: "../publish/publish"
        });
      }else {
        wx.showModal({
          title: '发布提示',
          content: '信息不完善，无法发布，请问您要完善个人信息嘛',
          confirmText: "确认",
          cancelText: "取消",
          success: function (res) {
            wx.navigateTo({
              url: "../../../info/pages/information/information"
            });
          },
          failer: function (e) {

          }
        })
      }
      
    },
    searchBlur:function(e){
      this.data.params['nameSign']=e.detail.value
      this.getBikeList()
      if(this.data.moreShow){
        this.getMoreMessageList()
      }
    },
    onSectionClicked: function (e) {
      var that=this
      var sid = e.currentTarget.dataset.sid;
      var sectionData = that.data.sections;
      //刷新选中状态
      for (var i in sectionData) {
        if (sectionData[i]['section_id'] == sid) {
          if (that.data.moreType ==that.data.member_value[sid]){
            return 
          }
          sectionData[i]['active'] = true
        // that.data.queryParam.type = sid// 这边用来更换那啥
          that.setData({
            moreType: that.data.member_value[sid]
          });
          //如果是首页，那么展示更多信息不要
          if (that.data.moreType == "homePage") {
            if (getApp().globalData.jobId) {
              if (getApp().globalData.jobId == 'truck') {
                that.data.params['identitySign'] = 'truck'
              } else if (getApp().globalData.jobId == 'grass-shops') {
                that.data.params['identitySign'] = 'pasture,truck'
              } else if (getApp().globalData.jobId == 'pasture') {
                that.data.params['identitySign'] = 'grass-shops'
              }
            }else{
              that.data.params['identitySign'] = 'truck,grass-shops,pasture,mechanics'
            }
            that.setData({
              moreShow:false,
              worningShow:false,
              listShow:false,
              mapHeight: '86%',
            });
        } else {
          that.setData({
            moreShow: true,
            worningShow: true,
            listShow: true,
            mapHeight: '79%',
          });
          that.data.params['identitySign'] = that.data.member_value[sid]
          that.changeMapControls()
        }
      }else
          sectionData[i]['active'] = false
      }
      that.getBikeList()
      that.setData({
        sections: sectionData
      });
    },
    //点击地图关闭列表
    tapCloseList: function (e) {
      //这里需要一个判断条件，来判断是否需要处理 关闭列表的相关计算

      var that = this;
       if(that.data.moreType!="homePage"){
         if (that.data.moreType== "truck"){
           that.mapControls = [
             {
               id: 11,
               position: {
                 left: 10 * wx.getStorageSync("kScreenW"),
                 top: 523 * wx.getStorageSync("kScreenH") * 0.79,
                 width: 40 * wx.getStorageSync("kScreenW"),
                 height: 40 * wx.getStorageSync("kScreenW")
               },
               iconPath: '../../../../images/imgs_main_location@2x.png',
               clickable: true,
             },
             //地图中心位置按钮
             {
               id: 14,
               position: {
                 left: 142.5 * wx.getStorageSync("kScreenW"),
                 top: 0 * wx.getStorageSync("kScreenH") * 0.79,
                 width: 60 * wx.getStorageSync("kScreenW"),
                 height: 40 * wx.getStorageSync("kScreenW")
               },
               iconPath: '../../../../images/lookcar.png',
               clickable: true,
             },
             {
               id: 15,
               position: {
                 left: 202.5 * wx.getStorageSync("kScreenW"),
                 top: 0 * wx.getStorageSync("kScreenH") * 0.79,
                 width: 60 * wx.getStorageSync("kScreenW"),
                 height: 40 * wx.getStorageSync("kScreenW")
               },
               iconPath: '../../../../images/lookhuo.png',
               clickable: true,
             }
           ]
         }else{
           that.mapControls = [
             {
               id: 11,
               position: {
                 left: 10 * wx.getStorageSync("kScreenW"),
                 top: 523 * wx.getStorageSync("kScreenH") * 0.79,
                 width: 40 * wx.getStorageSync("kScreenW"),
                 height: 40 * wx.getStorageSync("kScreenW")
               },
               iconPath: '../../../../images/imgs_main_location@2x.png',
               clickable: true,
             },
           ]
         }
         
           that.setData({
             'mapHeight': "79%",
             'controls': that.mapControls,
             'moreShow': 'true',
           })
       }


    },
    changeMapControls:function(e){
      //两种情况  第一种小图  第二种大图
      var that=this
      if(that.data.moreShow){//如果
        //如果是货车
        if (that.data.params['identitySign'] == 'truck'){
          that.mapControls = [
            {
              id: 11,
              position: {
                left: 10 * wx.getStorageSync("kScreenW"),
                top: 523 * wx.getStorageSync("kScreenH") * 0.79,
                width: 40 * wx.getStorageSync("kScreenW"),
                height: 40 * wx.getStorageSync("kScreenW")
              },
              iconPath: '../../../../images/imgs_main_location@2x.png',
              clickable: true,
            },

            {
              id: 14,
              position: {
                left: 142.5 * wx.getStorageSync("kScreenW"),
                top: 0 * wx.getStorageSync("kScreenH") * 0.79,
                width: 60 * wx.getStorageSync("kScreenW"),
                height: 40 * wx.getStorageSync("kScreenW")
              },
              iconPath: '../../../../images/lookcar.png',
              clickable: true,
            },
            {
              id: 15,
              position: {
                left: 202.5 * wx.getStorageSync("kScreenW"),
                top: 0 * wx.getStorageSync("kScreenH") * 0.79,
                width: 60 * wx.getStorageSync("kScreenW"),
                height: 40 * wx.getStorageSync("kScreenW")
              },
              iconPath: '../../../../images/lookhuo.png',
              clickable: true,
            },
            //地图中心位置按钮

          ]
        }else {
          that.mapControls = [
            {
              id: 11,
              position: {
                left: 10 * wx.getStorageSync("kScreenW"),
                top: 523 * wx.getStorageSync("kScreenH") * 0.79,
                width: 40 * wx.getStorageSync("kScreenW"),
                height: 40 * wx.getStorageSync("kScreenW")
              },
              iconPath: '../../../../images/imgs_main_location@2x.png',
              clickable: true,
            },
            //地图中心位置按钮

          ]
        }
        
          that.setData({
            'mapHeight': "79%",
            'controls': that.mapControls,
            'moreShow': 'true',
          })
       
      }else{
        if (that.data.params['identitySign'] == 'truck'){
          that.mapControls = [
            {
              id: 11,
              position: {
                left: 10 * wx.getStorageSync("kScreenW"),
                top: 523 * wx.getStorageSync("kScreenH") * 0.25,
                width: 40 * wx.getStorageSync("kScreenW"),
                height: 40 * wx.getStorageSync("kScreenW")
              },
              iconPath: '../../../../images/imgs_main_location@2x.png',
              clickable: true,
            },
            //地图中心位置按钮
            {
              id: 14,
              position: {
                left: 142.5 * wx.getStorageSync("kScreenW"),
                top: 0 * wx.getStorageSync("kScreenH") * 0.79,
                width: 60 * wx.getStorageSync("kScreenW"),
                height: 40 * wx.getStorageSync("kScreenW")
              },
              iconPath: '../../../../images/lookcar.png',
              clickable: true,
            },
            {
              id: 15,
              position: {
                left: 202.5 * wx.getStorageSync("kScreenW"),
                top: 0 * wx.getStorageSync("kScreenH") * 0.79,
                width: 60 * wx.getStorageSync("kScreenW"),
                height: 40 * wx.getStorageSync("kScreenW")
              },
              iconPath: '../../../../images/lookhuo.png',
              clickable: true,
            }
          ]
        }else{
          that.mapControls = [
            {
              id: 11,
              position: {
                left: 10 * wx.getStorageSync("kScreenW"),
                top: 523 * wx.getStorageSync("kScreenH") * 0.25,
                width: 40 * wx.getStorageSync("kScreenW"),
                height: 40 * wx.getStorageSync("kScreenW")
              },
              iconPath: '../../../../images/imgs_main_location@2x.png',
              clickable: true,
            },
            //地图中心位置按钮

          ]
        }
        
        if (getApp().globalData.isLogin ||!that.data.worningShow){
          that.setData({
            'mapHeight': "37%",
            'controls': that.mapControls,
          })
        }else{
          that.setData({
            'mapHeight': "29%",
            'controls': that.mapControls,
          })
        }
      }
    },
    chooseAction:function(e){
      wx.openLocation({
        latitude: e.target.dataset.x,
        longitude: e.target.dataset.y,
        scale:28
      })
    },
    toRad:function(d) {  
      return d * Math.PI / 180;
     },

    getDisance:function(lat1, lng1, lat2, lng2) { 
      var that=this
      var dis = 0;
      var radLat1 = that.toRad(lat1);
      var radLat2 = that.toRad(lat2);
      var deltaLat = radLat1 - radLat2;
      var deltaLng = that.toRad(lng1) - that.toRad(lng2);
      var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
      return dis * 6378137;
    }
})