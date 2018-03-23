// const basePath = "https://www.asts.shop/api/";
// const basePath = "http://192.168.1.91:19500/";
const basePath = "http://192.168.1.97:19500/";

const util = require("./util");
const promise = require('./es6-promise.min');

const API = {
  desKey: basePath + "desKey", //加密公钥
  products: basePath + "products", //商品列表
  productDetail: pid => basePath + "products/" + pid, //商品详情
  sendSmsCode: basePath + "smsCode/send", //获取短信
  smsCodeValidate: basePath + "smsCode/verify", //验证短信
  register: basePath + "register", //注册
  login: basePath + "auth", //登录
  resetPwd: basePath + "resetPassword", //重置密码
  resetPayPwd: basePath + "resetPaypassword", //重置支付密码
  refreshToken: basePath + "refresh", //刷新token
  editNick: userId => basePath + "users/" + userId + "/changeNickname", //修改昵称
  uploadImg: userId => basePath + "users/" + userId + "/changeAvatar", //上传头像
  receiver: (userId, receiverId) => {
    if (receiverId == undefined) {
      return basePath + "users/" + userId + "/receivers";
    } else {
      return basePath + "users/" + userId + "/receivers/" + receiverId;
    }
  }, //收货地址（增删改查）
  receiverDefault: (userId, receiverId) => basePath + "users/" + userId + "/receivers/" + receiverId + "/setDefault", //设置默认收货地址
  orders: (userId) => basePath + "users/" + userId + "/orders", //订单
  ordersDetail: (userId, orderId) => basePath + "users/" + userId + "/orders/" + orderId, //订单详情、删除订单
  orderPay: basePath + "wxpay/pay", //订单支付
  deliverConfirm: (userId, orderId) => basePath + "users/" + userId + "/orders/" + orderId + "/receipt", //确认收货
  orderCancel: (userId, orderId) => basePath + "users/" + userId + "/orders/" + orderId + "/cancel", //取消订单
  orderExpressPackage: (userId, orderId) => basePath + "users/" + userId + "/orders/" + orderId + "/queryUnboxing", //查询订单包裹
  orderExpress: basePath + "express", //查询物流详情
  areas: basePath + "areas", //省市区
  ads: basePath + "banner/index", //首页轮播
  category: basePath + "productCategorys", //分类列表
  categoryDetail: categorysId => basePath + "productCategorys/" + categorysId + "/products", //分类商品
  subject: basePath + "productSubjects", //专题列表
  subjectDetail: subjectId => basePath + "productSubjects/" + subjectId + "/products", //获取专题详情
  express: basePath + "express/query", //查询物流信息
  orderCoupon: basePath + "carts/myCouponList", //查询可用优惠券
  deliver: basePath + "freigths", //配送方式
  freight: basePath + "freigths/calcFreight", //运费
  bindCode: userId => basePath + "users/" + userId + "/bindCode", //绑定邀请码
  favoritesList: userId => basePath + "users/" + userId + "/favorites",//收藏夹列表
  favorites: (userId, pid) => basePath + "/users/" + userId + "/favorites/" + pid,//添加收藏。取消收藏
  favoritesValidate: (userId, pid) => basePath + "/users/" + userId + "/favorites/" + pid + "/isExistsFavorite",//验证是否收藏
  userPrivilege: userId => basePath + "users/" + userId + "/coupons", //获取用户优惠券
  userWallet: userId => basePath + "users/" + userId + "/wallets/balance", //钱包余额
  walletDetail: userId => basePath + "users/" + userId + "/wallets", //钱包明细
  userDetail: userId => basePath + "users/" + userId //获取用户详情
}

//发送请求(传入请求对象)
function send(req) {
  const userInfo = wx.getStorageSync("userInfo");
  const desKey = wx.getStorageSync("desKey");
  if (req.header == undefined) {
    req.header = {
      "content-type": "application/json"
    }
  }
  if (userInfo != "") {
    req.header.Authorization = userInfo.data.data.token;
    req.header.checkCode = util.encryptByDES(desKey.data.data, util.getCheckCode(userInfo.data.data.checkIndex, userInfo.data.data.user.id));
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: req.url,
      data: req.data == undefined ? "" : req.data,
      header: req.header,
      method: req.method == undefined ? "GET" : req.method,
      success: data => {
        resolve(data);
      },
      fail: data => {
        wx.hideLoading();
        reject(data);
        reqError(data);
      }
    })
  });
}

//错误处理
function reqError(e) {
  wx.hideLoading();
  const err = e;
  const logList = (() => {
    if (wx.getStorageSync("error") != "") {
      return wx.getStorageSync("error");
    } else {
      return new Array();
    }
  })();
  logList.push({
    date: util.formatTime(new Date()),
    error: err
  });
  wx.setStorageSync("error", logList);
}

//异常处理
function errorStatus(statusCode) {
  wx.hideLoading();
  switch (statusCode) {
    case 401:
      wx.showModal({
        content: "您的账号已在别处登录,请您重新登录",
        showCancel: false,
        success: data => {
          wx.removeStorageSync("userInfo");
          wx.navigateTo({
            url: "../login/login",
          })
        }
      });
      break;
    case "password_error":
      wx.showModal({
        content: "密码错误，请重新输入",
        showCancel: false,
        success: data => { }
      });
      break;
    case "no_login":
      wx.showModal({
        content: "请先登录",
        showCancel: false,
        success: data => {
          wx.navigateTo({
            url: "../login/login",
          })
        }
      });
      break;
    case "not_support_area":
      wx.showModal({
        content: "不支持该区域配送",
        showCancel: false,
        success: data => { }
      });
      break;
    case "delivery_method_error":
      wx.showModal({
        content: "配送方式错误",
        showCancel: false,
        success: data => { }
      });
      break;
    case "product_not_market":
      wx.showModal({
        content: "商品已下架",
        showCancel: false,
        success: data => { }
      });
      break;
    case "product_understock":
      wx.showModal({
        content: "商品库存不足",
        showCancel: false,
        success: data => { }
      });
      break;
    case "coupon_id_error":
      wx.showModal({
        content: "优惠券已经使用",
        showCancel: false,
        success: data => { }
      });
      break;
    case "not_exist":
      wx.showModal({
        content: "账号不存在",
        showCancel: false,
        success: data => { }
      });
      break;
    case "unknown_error":
      wx.showModal({
        content: "未知错误",
        showCancel: false,
        success: data => { }
      });
      break;
    case "already_register":
      wx.showModal({
        content: "该手机已注册",
        showCancel: false,
        success: data => { }
      });
      break;
    case "smscode_error":
      wx.showModal({
        content: "验证码错误",
        showCancel: false,
        success: data => { }
      });
      break;
    case "smscode_expire":
      wx.showModal({
        content: "验证码已过期",
        showCancel: false,
        success: data => { }
      });
      break;
    case "area_not_exists":
      wx.showModal({
        content: "请选择地址",
        showCancel: false,
        success: data => { }
      });
      break;
    case "many_times":
      wx.showModal({
        content: "发送短信次数过多",
        showCancel: false,
        success: data => { }
      });
      break;
    case "mciro_forbid":
      wx.showModal({
        content: "该手机号码是原爱善天使分销商账号，请移步到爱善天使App找回密码",
        showCancel: false,
        success: data => {
          wx.redirectTo({
            url: "../index/index",
          })
        }
      });
      break;
    case "bind_self":
      wx.showModal({
        content: "不能绑定自己",
        showCancel: false,
        success: data => { }
      });
      break;
    case "invite_code_not_exist":
      wx.showModal({
        content: "邀请码不存在",
        showCancel: false,
        success: data => { }
      });
      break;
    case "already_bind":
      wx.showModal({
        content: "邀请码已经绑定",
        showCancel: false,
        success: data => { }
      });
      break;
    case "mutual_bind":
      wx.showModal({
        content: "不能相互绑定",
        showCancel: false,
        success: data => { }
      });
      break;
    default:
      break;
  }
}

//微信支付
function wxPay(payParam) {
  wx.login({
    success: res => {
      const code = res.code;
      wx.request({
        url: API.orderPay + "?userId=" + payParam.userId + "&sn=" + payParam.orderId + "&amount=" + payParam.pirce + "&code=" + code + "&miniapp=true",
        success: data => {
          const dataObj = data.data.data;
          wx.requestPayment({
            'timeStamp': dataObj.timeStamp,
            'nonceStr': dataObj.nonce_str,
            'package': dataObj.package,
            'signType': dataObj.signType,
            'paySign': dataObj.sign,
            'success': payParam.success,
            'fail': reqError
          });
        },
        fail: reqError
      });
    }
  })
}

module.exports = {
  API: API,
  send: send,
  wxPay: wxPay,
  errorStatus: errorStatus
}