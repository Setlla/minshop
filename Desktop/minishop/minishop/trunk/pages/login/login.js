// pages/login/login.js
var data = require("../../utils/dataModel");
var req = require("../../utils/request");
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: data.login,

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
  btnTap: function (e) {
    var that = this;
    var desKey = wx.getStorageSync("desKey");
    wx.showLoading({
      title: '登录中',
    });
    req.send({
      url: req.API.login,
      method: "POST",
      data: {
        "username": that.data.phone.value,
        "password": util.encryptByDES(desKey.data.data,that.data.pwd.value),
      }
    }).then(function (data) {
      if (data.data.success) {
        wx.setStorageSync("userInfo", data);
        wx.navigateBack();
      } else {
        req.errorStatus(data.data.errCode);
      }
      wx.hideLoading();
    });
  },
  btnRightTap: function (e) {
    wx.redirectTo({
      url: "../register/register",
    })
  },
  btnLeftTap: function (e) {
    wx.redirectTo({
      url: "../findPwd/findPwd",
    })
  },
  inputChange: function (e) {
    var that = this;
    switch (e.target.id) {
      case "phone":
        var phone = that.data.phone;
        phone.value = e.detail.value;
        that.setData({
          phone: phone
        });
        break;
      case "pwd":
        var pwd = that.data.pwd;
        pwd.value = e.detail.value;
        that.setData({
          pwd: pwd
        });
        break;
      default:
        break;
    }
  }
})