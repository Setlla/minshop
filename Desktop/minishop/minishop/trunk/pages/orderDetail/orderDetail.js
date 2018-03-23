// pages/orderDetail/orderDetail.js
var data = require("../../utils/dataModel");
var req = require("../../utils/request");
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: data.orderDetail,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.ordersDetail(userInfo.data.data.user.id, options.id)
    }).then(data => {
      var statusText = "";
      var orderStatus = that.data.orderStatus;
      var user = {
        name: data.data.data.consignee,
        phone: data.data.data.phone,
        address: data.data.data.address
      }
      var orderList = {
        id: data.data.data.sn,
        shopImg: data.data.data.shopLogoImage,
        shopName: data.data.data.shopName,
        orderStatus: data.data.data.orderStatus,
        pay: data.data.data.amount,
        list: new Array()
      }
      var orderInfo = {
        orderNo: data.data.data.sn,
        startTime: util.formatTime(new Date(data.data.data.createDate)),
        goodsPrice: data.data.data.shopsTotal,
        express: data.data.data.freight,
        discount: data.data.data.discount,
        price: data.data.data.amount
      }

      util.loop(data.data.data.orderItemList, (item, index) => {
        orderList.list.push({
          imgSrc: item.image,
          name: util.strlimit(item.fullName, 32),
          description: "有特效",
          price: item.price,
          spec: item.subName,
          num: item.quantity
        });
      });

      switch (data.data.data.orderStatus) {
        case "20":
          statusText = "待付款";
          break;
        case "30":
          statusText = "待发货";
          break;
        case "40":
          statusText = "已发货";
          break;
        case "50":
          statusText = "已完成";
          break;
        case "70":
          statusText = "已取消";
          break;
        default:
          statusText = "未知";
          break;
      }
      orderStatus.text = statusText;
      that.setData({
        orderStatus: orderStatus,
        user: user,
        orderList: orderList,
        orderInfo: orderInfo
      });
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
                wx.navigateBack();
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
                wx.navigateBack();
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
                wx.navigateBack();
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