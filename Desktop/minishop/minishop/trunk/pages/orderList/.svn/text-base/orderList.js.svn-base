// pages/orderList/orderList.js
const data = require("../../utils/dataModel");
const req = require("../../utils/request");
const util = require("../../utils/util");
const pageNum = ((num) => {
  return (rest) => {
    if (rest != undefined) {
      num = 0;
    } else {
      num++;
    }
    return num
  }
})(1);
Page({

  /**
   * 页面的初始数据
   */
  data: data.orderList,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    const userInfo = wx.getStorageSync("userInfo");
    const that = this;
    req.send({
      url: req.API.orders(userInfo.data.data.user.id) + "?pageNum=1&pageSize=5" + menuType(that)
    }).then(function (data) {
      req.errorStatus(data.statusCode);
      getOrderList(data, that);
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
    const userInfo = wx.getStorageSync("userInfo");
    const that = this;
    req.send({
      url: req.API.orders(userInfo.data.data.user.id) + "?pageNum=1&pageSize=5" + menuType(that)
    }).then(function (data) {
      getOrderList(data, that);
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const userInfo = wx.getStorageSync("userInfo");
    const that = this;
    req.send({
      url: req.API.orders(userInfo.data.data.user.id) + "?pageNum=" + pageNum() + "&pageSize=5" + menuType(that)
    }).then(function (data) {
      getOrderList(data, that, that.data.orderList);
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //订单详情
  orderDetailTap: function (e) {
    wx.navigateTo({
      url: "../orderDetail/orderDetail?id=" + e.currentTarget.dataset.id,
    });
  },
  //列表类型
  orderListTap: function (e) {
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    const reqUrl = ((reqUrl) => {
      switch (e.currentTarget.dataset.status) {
        case "20":
          reqUrl += "&orderStatus=20";
          break;
        case "30":
          reqUrl += "&orderStatus=30";
          break;
        case "40":
          reqUrl += "&orderStatus=40";
          break;
        case "50":
          reqUrl += "&orderStatus=50";
          break;
        default:
          break;
      }
      util.loop(that.data.orderMenu.list, (item, index) => {
        if (e.currentTarget.dataset.status == item.status) {
          item.select = "on";
        } else {
          item.select = "off";
        }
      });
      that.setData({
        orderMenu: that.data.orderMenu
      });
      return reqUrl;
    })(req.API.orders(userInfo.data.data.user.id) + "?pageNum=1&pageSize=5");

    req.send({
      url: reqUrl
    }).then(function (data) {
      req.errorStatus(data.statusCode);
      getOrderList(data, that);
    });
  },
  //列表功能按钮
  orderBtnTap: function (e) {
    const that = this;
    const userInfo = wx.getStorageSync("userInfo");
    switch (e.currentTarget.dataset.status) {
      case "pay":
        wx.showModal({
          content: "确认支付?",
          success: data => {
            if (data.confirm) {
              wx.showLoading({
                title: "请稍候",
              });
              req.wxPay({
                userId: userInfo.data.data.user.id,
                orderId: e.currentTarget.dataset.id,
                pirce: e.currentTarget.dataset.price
              });
              wx.hideLoading();
            }
          }
        });
        break;
      case "express":
        wx.navigateTo({
          url: "../express/express?orderId=" + e.currentTarget.dataset.id,
        });
        break;
      case "confirm":
        wx.showModal({
          content: "是否确认收货?",
          success: data => {
            if (data.confirm) {
              wx.showLoading({
                title: "请稍候",
              });
              req.send({
                url: req.API.deliverConfirm(userInfo.data.data.user.id, e.currentTarget.dataset.id),
                method: "post"
              }).then(data => {
                return req.send({
                  url: req.API.orders(userInfo.data.data.user.id) + "?pageNum=1&pageSize=5"
                })
              }).then(function (data) {
                getOrderList(data, that);
                wx.hideLoading();
              });
            }
          }
        });
        break;
      case "remark":
        break;
      case "cancel":
        wx.showModal({
          content: "是否取消订单?",
          success: data => {
            if (data.confirm) {
              wx.showLoading({
                title: "请稍候",
              });
              req.send({
                url: req.API.orderCancel(userInfo.data.data.user.id, e.currentTarget.dataset.id),
                method: "post"
              }).then(data => {
                return req.send({
                  url: req.API.orders(userInfo.data.data.user.id) + "?pageNum=1&pageSize=5"
                })
              }).then(function (data) {
                getOrderList(data, that);
                wx.hideLoading();
              });;
            }
          }
        });
        break;
      case "delete":
        wx.showModal({
          content: "是否删除订单?",
          success: data => {
            if (data.confirm) {
              wx.showLoading({
                title: "请稍候",
              });
              req.send({
                url: req.API.ordersDetail(userInfo.data.data.user.id, e.currentTarget.dataset.id),
                method: "delete"
              }).then(data => {
                return req.send({
                  url: req.API.orders(userInfo.data.data.user.id) + "?pageNum=1&pageSize=5"
                })
              }).then(function (data) {
                getOrderList(data, that);
                wx.hideLoading();
              });;
            }
          }
        });
        break;
      default:
        wx.hideLoading();
        break;
    }
  }
})

//获取订单列表
function getOrderList(data, that, list) {
  const orderList = ((orderList = { list: new Array() }) => {
    util.loop(data.data.data, function (item, index) {
      orderList.list.push({
        id: item.sn,
        shopImg: item.shopLogoImage,
        shopName: item.shopName,
        orderStatus: item.orderStatus,
        orderStatusText: ((orderStatus) => {
          switch (orderStatus) {
            case "20":
              return "待付款";
              break;
            case "30":
              return "待发货";
              break;
            case "40":
              return "已发货";
              break;
            case "50":
              return "已完成";
              break;
            case "70":
              return "已取消";
              break;
            default:
              return "未知";
              break;
          }
        })(item.orderStatus),
        pay: item.amount,
        list: ((list) => {
          util.loop(item.orderItemList, function (jitem, jindex) {
            list.push({
              id: jitem.skuId,
              imgSrc: jitem.image,
              name: util.strlimit(jitem.fullName, 32),
              description: jitem.subName,
              price: jitem.price,
              spec: "",
              num: jitem.quantity
            });
          });
          return list;
        })(new Array())
      });
    });
    return orderList;
  })(list);

  that.setData({
    orderList: orderList
  });
}

//菜单状态
function menuType(that) {
  const getUrl = ((url) => {
    return (setUrl) => {
      if (setUrl != undefined) {
        url = setUrl;
      }
      return url;
    }
  })("");

  util.loop(that.data.orderMenu.list, (item, index) => {
    if (item.select == "on") {
      getUrl(item.status);
      return false;
    }
  });
  if (getUrl() != "0") {
    return "&orderStatus=" + getUrl();
  } else {
    return "";
  }
}