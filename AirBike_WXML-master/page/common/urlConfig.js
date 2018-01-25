/**
 * url配置文件
 */

//host
var host = "http://192.168.0.111:8080/caodu" //51.37

var config = {

  host,
  

// 8089
  // 获取地图信息位置
  queryOpenIdUrl: 'http://192.168.0.111:8080/caodurz/weixin/approve/code.j',//根据code查询openId
  loginUrl: host +'/portal/main/login.ajson',//根据openId登陆的接口
  registUrl:   host +'/portal/main/regist.ajson',//注册的接口
  logoutUrl:  host +'/portal/main/logout.ajson',//登出的接口
  viewuserinfo: host + '/portal/main/view_user_info.ajson',//查询用户信息
  queryListForLocationUrl:  host +'/portal/main/query_list_for_location.ajson',//查询附近地图的点
  pasturepreorderInsertUrl:   host +'/caodu/mxhl/pasturepreorder/insert.ajson',//牧场的预购信息插入
  grassshopspresaleInsertUrl:  host +'/caodu/mxhl/grassshopspresale/insert.ajson',//草商的预购信息插入
  pasturepreorderListUrl:  host +'/caodu/mxhl/pasturepreorder/list.ajson',//牧场的预购信息插入
  grassshopspresaleListUrl:  host +'/caodu/mxhl/grassshopspresale/list.ajson',//草商的预购信息插入
  grassshopspresaleDeleteUrl: host + '/caodu/mxhl/grassshopspresale/delete.ajson',//草商的预购信息删除
  pasturepreorderDeleteUrl: host + '/caodu/mxhl/pasturepreorder/delete.ajson',//牧场的预购信息删除
  queryUserInfoUrl: host + '/portal/main/view_user_info.ajson',
  truckRouteInsert: host + '/caodu/mxhl/truckroute/insert.ajson',
  truckRouteListUrl: host + '/caodu/mxhl/truckroute/list.ajson',
  truckRouteMazyListUrl: host + '/caodu/mxhl/truckroute/listmazy.ajson',
  truckRouteDeleteUrl: host + '/caodu/mxhl/truckroute/delete.ajson',//货车发布的物流信息
  grassshopsTransportListUrl: host + '/caodu/mxhl/grassshopstransport/list.ajson',//草商发布的物流信息
  grassshopsTransportInsertUrl: host + '/caodu/mxhl/grassshopstransport/insert.ajson',//草商发布的物流信息
  grassshopsTransportDeleteUrl: host + '/caodu/mxhl/grassshopstransport/delete.ajson',//草商发布的物流信息
  truckUpdateLocationUrl: host + '//caodu/mxhl/truck/update_location.ajson',
  grassshopsTransportMazyListUrl: host + '/caodu/mxhl/grassshopstransport/listmazy.ajson',//草商发布的物流
};

module.exports = config
