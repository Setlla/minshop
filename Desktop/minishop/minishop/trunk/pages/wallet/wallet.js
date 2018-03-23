// pages/wallet/wallet.js
var data = require("../../utils/dataModel");
var req = require("../../utils/request");
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: data.wallet,

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
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.userWallet(userInfo.data.data.user.id)
    }).then(data => {
      var money = {
        num: data.data.data
      }
      that.setData({
        money: money
      });
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

  }
})