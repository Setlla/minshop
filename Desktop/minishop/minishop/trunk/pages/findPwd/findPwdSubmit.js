// pages/findPwd/findPwdSubmit.js
const data = require("../../utils/dataModel");
const req = require("../../utils/request");
const util = require("../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: data.findPwdSubmit,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.data.user.phone = options.phone;
    that.data.user.smsCode = options.smsCode;
    that.setData({
      user: that.data.user
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
  inputChange: function (e) {
    const that = this;
    switch (e.currentTarget.id) {
      case "pwd":
        that.data.pwd.value = e.detail.value;
        that.setData({
          pwd: that.data.pwd
        });
        break;
      case "pwdConfirm":
        that.data.pwdConfirm.value = e.detail.value;
        that.setData({
          pwdConfirm: that.data.pwdConfirm
        });
        break;
      default:
        break;
    }
  },
  //修改密码
  btnTap: function (e) {
    const that = this;
    const desKey = wx.getStorageSync("desKey");
    if (that.data.pwd.value == that.data.pwdConfirm.value) {
      req.send({
        url: req.API.resetPwd,
        header: { "Content-type": "application/x-www-form-urlencoded" },
        method: "post",
        data: {
          "mobile": that.data.user.phone,
          "password": util.encryptByDES(desKey.data.data, that.data.pwd.value),
          "smscode": that.data.user.smsCode
        }
      }).then(data => {
        if (data.data.success) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({
            delta: 2
          })
        }
      });
    }
  }
})