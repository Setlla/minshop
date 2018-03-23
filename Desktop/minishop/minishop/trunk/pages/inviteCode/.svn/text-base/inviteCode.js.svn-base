// pages/inviteCode/inviteCode.js
var data = require("../../utils/dataModel");
var req = require("../../utils/request");
var util = require("../../utils/util");

Page({

  /**
   * 页面的初始数据
   */
  data: data.inviteCode,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    req.send({
      url: req.API.userDetail(userInfo.data.data.user.id)
    }).then(data=>{
      var inviteCode= {
        text: data.data.data.inviteCode
      }
      that.setData({
        inviteCode: inviteCode
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
  copyCode: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  }
})